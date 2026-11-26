import { S, adopt, get, log, spend, spendE, have, addRes } from '../core/state.js';
import { rng } from '../core/rng.js';
import { GRAVE_NAMES } from './texts.js';
import { CROW_ORDERS } from './crow.js';
import { sellPrice } from './market.js';
import { ITEMS } from './items.js';
import { OCCS_PAIRS, TRAIT_PAIRS, WISHES } from './stories.js';
import { NAMES_M } from './texts.js';
import { checkThresholds } from './rep.js';

// newDay — переход дня (ревизия 34: контракт {ok, victory}, поле toasts снято —
// за всю жизнь проекта ни разу не наполнялось; все сообщения идут через log()).
// morningEvent — дословно из монолита 5.4 (Math.random -> rng, window._thief -> thief).
export function newDay() {
  S.day++;
  S.rain = false;
  S.corpses.forEach(c => c.days++);
  const bad = S.corpses.filter(c => c.days > 2);
  if (bad.length) {
    const pen = bad.length;
    S.rep = Math.max(0, S.rep - pen);
    log('Тела в морге просрочены: репутация −' + pen + '. Ворон посмотрел строго.', 'event');
  }
  if (rng.next() < 0.6) {
    // ревизия 30: честная треугольная — сумма двух вызовов rng (0..2), звёзды 1..5,
    // выброс за кламп исключён по построению. Распределение: 1★ 3.1% / 2★ 25% / 3★ 43.8% / 4★ 25% / 5★ 3.1%.
    const r2 = rng.next() + rng.next();
    const st = 1 + Math.round(r2 * 2);
    const cap = S.techs.logistics ? 2 : 1;
    if (S.corpses.length < cap) {
      // ревизия 24: тело прибывает с историей (имя, занятие, черта, воля, родные)
      // ревизия 27: имя и пол — ОДНИМ вызовом rng (индекс в общем пуле 80).
      // На историю по-прежнему ровно 5 вызовов rng — дрейф цен живых сейвов не сдвигается.
      const idx = Math.floor(rng.next() * GRAVE_NAMES.length);
      const sex = idx < NAMES_M.length ? 'm' : 'f';
      const nm = GRAVE_NAMES[idx];
      const story = {
        name: nm,
        sex,
        occ: OCCS_PAIRS[Math.floor(rng.next() * OCCS_PAIRS.length)][sex === 'f' ? 1 : 0],
        trait: TRAIT_PAIRS[Math.floor(rng.next() * TRAIT_PAIRS.length)][sex === 'f' ? 1 : 0],
        wish: WISHES[Math.floor(rng.next() * WISHES.length)].id,
        family: rng.next() < 0.4 ? 1 : 0
      };
      S.corpses.push({ stars: st, days: 0, extracted: 0, parts: { skull: true, brain: true, blood: true, fat: true, bones: true, flesh: true }, ...story });
      log('Ночью привезли постояльца: ' + nm + ' (' + '★'.repeat(st) + '). ' + story.occ + ', ' + story.trait + '. Повозка скрылась в тумане.', 'event');
    }
  }
  S.marketPrev = { ...S.market };
  S.market = {
    candle: 12 + (rng.next() * 4 - 2),
    wax: 7 + (rng.next() * 2 - 1),
    fertilizer: 10 + (rng.next() * 3 - 1.5),
    ink: 14 + (rng.next() * 4 - 2),
    skull: 30 + (rng.next() * 8 - 4),
    brain: 20 + (rng.next() * 6 - 3),
    flesh: 4 + (rng.next() - 0.5),
    stone: 8 + (rng.next() * 2 - 1),
    marble: 35 + (rng.next() * 6 - 3),
    mushroom: 6 + (rng.next() * 2 - 1),
    firewood: 5 + (rng.next() * 2 - 1),
  };
  // цены с одним знаком после запятой — хвосты не рождаются (ревизия 22)
  for (const k in S.market) S.market[k] = Math.round(S.market[k] * 10) / 10;
  if (S.techs.accountant) S.coins += 2 * S.graves.filter(g => g.occ).length;
  S.donatedToday = 0;
  if (S.rep >= 10 && !S.crow.active) {
    S.crow.active = true;
    log('Ворон признал тебя за равного: у ограды теперь есть дела.', 'crow');
  }
  if (S.crow.active && !S.crow.order && rng.next() < 0.4) {
    S.crow.order = CROW_ORDERS[Math.floor(rng.next() * CROW_ORDERS.length)];
    log('Ворон принёс заказ: «' + S.crow.order.n + '». Птица деловая.', 'crow');
  }
  S.energy = S.maxEnergy;
  checkThresholds(); // ревизия 25: пороги могли быть пересечены вкладами/заказами за день
  const victory = victoryCheck();
  return { ok: true, victory };
}
// ---------- утренние события ----------
// ревизия 31: thief и pendingEvent живут в состоянии S — переживают перезагрузку (save() идёт после morningEvent).

export function morningEvent() {
  // ревизия 31: незакрытое событие из сейва возвращается БЕЗ переролла (0 вызовов rng)
  if (S.pendingEvent) return S.pendingEvent;
  const rolls = [];
  if (S.corpses.some(c => c.days > 2)) rolls.push({ w: 3, id: 'evInspector' });
  rolls.push({ w: 2, id: 'evQuiet' }, { w: 1, id: 'evRain' }, { w: 1, id: 'evPilgrims' },
    { w: 1, id: 'evVagrant' }, { w: 1, id: 'evThief' }, { w: 1, id: 'evComet' },
    { w: 1, id: 'evFind' }, { w: 1, id: 'evGustavDeal' }, { w: 1, id: 'evVolunteers' }, { w: S.rain ? 2 : 1, id: 'evMushrooms' }, { w: 1, id: 'evWoodcutter' }, { w: 1, id: 'evChild' });
  const total = rolls.reduce((a, b) => a + b.w, 0);
  let r = rng.next() * total;
  let ev = rolls[0];
  for (const it of rolls) { if (r < it.w) { ev = it; break; } r -= it.w; }
  S.pendingEvent = EV[ev.id]();
  return S.pendingEvent;
}

const EV = {
  evQuiet() {
    return { id: 'quiet', title: 'Тихое утро', text: 'Утро выдалось тихим. Ворон дремлет на ограде, трава в росе, и только где-то вдалеке лает собака. Деревня живёт своей жизнью, не подозревая, сколько дел у её кладбища.', btn: 'Доброе утро' };
  },
  evRain() {
    S.rain = true;
    return { id: 'rain', title: 'Дождь', text: 'Небо затянуло тучами. Глина размокла, лопата идёт тяжело: копка сегодня дороже по энергии. Зато клумба рада — и земля дышит.', btn: 'Не тужи' };
  },
  evPilgrims() {
    const n = Math.min(have('candle'), 5);
    if (n > 0) {
      const p = Math.round(sellPrice(S, 'candle') * 1.5 * n);
      spend('candle', n); S.coins += p; S.stats.candlesSold += n;
      return { id: 'pilgrims', title: 'Паломники', text: 'Со стороны тракта донеслась песня — паломники идут мимо на ярмарку. Они купили у тебя ' + n + ' свечей по щедрой цене: +' + p + '💰. Паломники верят, что свет в пути начинается с тебя.', btn: 'Славно' };
    }
    return { id: 'pilgrims', title: 'Паломники', text: 'Со стороны тракта донеслась песня — паломники идут мимо на ярмарку. Они заглянули за свечами, но у тебя их нет. Вздохнули и пошли дальше: «Смотритель нынче, видать, запаслив, да не в ту сторону».', btn: 'Обидно' };
  },
  evVagrant() {
    return { id: 'vagrant', title: 'Бродяга у ворот', text: 'У ворот стоит бродяга — грязный, но с ясным взглядом. «Хлеба бы, господин смотритель. А я тебе и помолюсь, и расскажу, что слышал в дороге».', choices: [{ id: 'feed', label: 'Накормить (5💰)' }, { id: 'shoo', label: 'Прогнать' }] };
  },
  evThief() {
    S.thief = null; let stolen = '';
    const pool = ['candle', 'wax', 'bones', 'flowers', 'ink', 'fat', 'flour'];
    const avail = pool.filter(k => have(k) >= 2);
    if (S.coins >= 10) avail.push('_coins');
    if (avail.length) {
      const k = avail[Math.floor(rng.next() * avail.length)];
      if (k === '_coins') { S.coins -= 10; S.thief = { k: 'coins', n: 10 }; stolen = 'горстку монет (10💰)'; }
      else { S.res[k] -= 1; S.thief = { k, n: 1 }; stolen = ITEMS[k].i + ' ' + ITEMS[k].n.toLowerCase() + ' ×1'; }
    }
    return { id: 'thief', title: 'Ночной вор', text: 'Ночью кто-то рылся в сарае. Следы грязи ведут в сторону леса.' + (stolen ? ' Сверившись с полками, ты понял: пропало ' + stolen + '.' : ' Воровать, впрочем, было нечего: сундук почти пуст. Хоть вор честный.'), choices: [{ id: 'find', label: 'Искать (10⚡)' }, { id: 'forgive', label: 'Простить' }] };
  },
  evInspector() {
    const bad = S.corpses.filter(c => c.days > 2).length;
    if (bad > 0) {
      const pen = S.techs.diplomat ? 2 : 5;
      S.rep = Math.max(0, S.rep - pen);
      return { id: 'inspector', title: 'Инспектор', text: 'Инспектор епархии прошёл по кладбищу с блокнотом и тонкой улыбкой. Записал: «' + bad + ' тел в состоянии, несовместимом с понятием „покой“». Репутация −' + pen + '. «Разберитесь, — сказал он, — епархия не любит запахов».', btn: 'Оплеуха' };
    }
    S.rep += 1;
    return { id: 'inspector', title: 'Инспектор', text: 'Инспектор епархии прошёл по кладбищу с блокнотом. Морг чист, могилы ухожены, свечи ровные. Он поставил галочку и впервые улыбнулся: «Порядок, смотритель. Так держать». Репутация +1.', btn: 'Комплимент' };
  },
  evComet() {
    S.science = (S.science || 0) + 3; S.stats.scienceTotal = (S.stats.scienceTotal || 0) + 3;
    return { id: 'comet', title: 'Комета', text: 'Ночью над кладбищем прошла комета. Старожилы говорят: это к знаниям. Ворон смотрел на небо так, будто знал расписание. +3📜.', btn: 'Знаки' };
  },
  evFind() {
    addRes('stone', 2);
    return { id: 'find', title: 'Старый киот', text: 'В дальнем углу кладбища провалился старый киот. Под ним — аккуратно сложенные камни. Дядюшка любил порядок даже в руинах. +2🪨.', btn: 'Находка' };
  },
  evGustavDeal() {
    return { id: 'gustavDeal', title: 'Густав с тележкой', text: 'Густав привёз тележку жира: «Распродажа, смотритель. Всего 4💰 за штуку, пока не кончилось». Жир — товар деликатный, долго не лежит.', choices: [{ id: 'gustav-fat', label: 'Взять' }] };
  },
  evVolunteers() {
    return { id: 'volunteers', title: 'Волонтёры', text: 'Пришли волонтёры с метлами: «Говорят, у вас тут образцовое кладбище будет. Дайте маршрут — и мы нажмём». Убраться силами добрых людей стоит 5 монет на чай.', choices: [{ id: 'volunteer', label: 'Угостить (5💰)' }, { id: 'volunteer-no', label: 'Вежливо отказать' }] };
  },
  evMushrooms() {
    return { id: 'mush', title: 'Грибы после дождя', text: 'Ночью промочило — и под елями вылезли шляпки, целые полки. Лес как будто сам зовёт: забирай, пока солнце.', choices: [{ id: 'pick-mush', label: 'Собрать (5⚡)' }, { id: 'mush-no', label: 'Не лезть' }] };
  },
  evWoodcutter() {
    return { id: 'woodcutter', title: 'Дровосек Матвей', text: 'У опушки Матвей валит сухостой, бревно за бревном. «Поможешь, смотритель? Половина дров — твоя, я не жадный».', choices: [{ id: 'help-cut', label: 'Помочь (10⚡)' }, { id: 'cut-no', label: 'Не лезть' }] };
  },
  evChild() {
    return { id: 'child', title: 'Ребёнок у ручья', text: 'У ручья кричат: пропала Марьяшкина девочка — видели в сторону леса. Ручей после дождя шумит, и это не к добру.', choices: [{ id: 'search-child', label: 'Искать (10⚡)' }, { id: 'wait-home', label: 'Ждать у дома' }] };
  },
};

// действия выбора — дословно из монолита (spend('coins') -> честная проверка S.coins, стандарт 6.0)
export function eventAction(id) {
  switch (id) {
    case 'feed':
      if (S.coins < 5) return { ok: false, toast: 'Не хватает монет' , sfx: 'error' };
      S.coins -= 5; S.rep += 2; S.stats.vagrantFed = true;
      log('Накормил бродягу у ворот. Он помолился — и, кажется, искренне.', 'event');
      return { ok: true, toast: 'Репутация +2. Милосердие в цене.' };
    case 'shoo':
      if (S.techs.diplomat) log('Прогнал бродягу так вежливо, что он извинился. Дипломатия — наука.', 'event');
      else { S.rep = Math.max(0, S.rep - 1); log('Прогнал бродягу. Деревня видела — и запомнила.', 'event'); }
      return { ok: true };
    case 'find': {
      if (!spendE(10)) return { ok: false, toast: 'Слишком мало энергии' , sfx: 'error' };
      if (rng.next() < 0.5) {
        let got = '25💰 как утешительный приз';
        if (S.thief) {
          got = (S.thief.k === 'coins' ? 'монеты обратно' : ITEMS[S.thief.k].i + ' ' + ITEMS[S.thief.k].n + ' обратно');
          if (S.thief.k === 'coins') S.coins += S.thief.n; else addRes(S.thief.k, S.thief.n);
          S.thief = null;
        } else { S.coins += 25; }
        log('Догнал вора в лесу. Вернул добычу и добавил наставлений. Лес запомнил.', 'event');
        return { ok: true, toast: 'Вор пойман: ' + got };
      }
      log('Обшарил весь лес, но следы потерялись в папоротниках. Утро потрачено не зря — почти.', 'event');
      return { ok: true, toast: 'Удача отвернулась' };
    }
    case 'forgive':
      S.rep += 1;
      log('Простил вора. Кто-то из деревни видел это и оценил.', 'event');
      return { ok: true, toast: 'Репутация +1' };
    case 'gustav-fat':
      if (S.coins < 12) return { ok: false, toast: 'Не хватает монет' , sfx: 'error' };
      S.coins -= 12; addRes('fat', 3);
      return { ok: true, toast: 'Жир ×3 за 12💰. Выгодно.' };
    case 'volunteer':
      if (S.coins < 5) return { ok: false, toast: 'Не хватает монет' , sfx: 'error' };
      S.coins -= 5; S.rep += 1;
      log('Волонтёры прибрались на кладбище. Чай был горячим, метлы — весёлыми.', 'event');
      return { ok: true, toast: 'Репутация +1' };
    case 'pick-mush': {
      if (!spendE(5)) return { ok: false, toast: 'Слишком мало энергии' , sfx: 'error' };
      const n = 2 + Math.floor(rng.next() * 2);
      addRes('mushroom', n);
      log('Собрал грибы в чаще: ×' + n + '. Корзина полна, дождь окупился.', 'forest');
      return { ok: true, toast: 'Грибы ×' + n };
    }
    case 'help-cut': {
      if (!spendE(10)) return { ok: false, toast: 'Слишком мало энергии' , sfx: 'error' };
      addRes('firewood', 4);
      log('Помогал Матвею валить сухостой. Половина дров — моя, как договаривались.', 'forest');
      return { ok: true, toast: 'Хворост ×4' };
    }
    case 'search-child': {
      if (!spendE(10)) return { ok: false, toast: 'Слишком мало энергии' , sfx: 'error' };
      if (rng.next() < 0.5) {
        S.rep += 3;
        log('Нашёл ребёнка у ручья, вытащил на берег и унёс домой. Мать плакала и смеялась одновременно.', 'event');
        return { ok: true, toast: 'Ребёнок найден: +3⭐' };
      }
      log('Обошёл чащу вдоль и поперёк — след затерялся. Потом мальчишку вывели волонтёры; наука тут не поможет.', 'event');
      return { ok: true, toast: 'Не нашёл' };
    }
    case 'wait-home':
      S.rep = Math.max(0, S.rep - 2);
      log('Ждал у дома, как учил дядюшка: «Смотритель смотрит, а не бегает». Ребёнка нашли чужие — деревня запомнила.', 'event');
      return { ok: true, toast: 'Репутация −2' };
    default:
      return { ok: true };
  }
}

// victoryCheck — дословная логика монолита (showVictory уходит в main.js: data-слой без DOM).
export function victoryCheck(){if(S.rep>=100&&!S.endless){S.endless=true;return true}return false}
