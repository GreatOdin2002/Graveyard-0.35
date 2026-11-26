// КРАФТ — дословно из монолита «Вечный покой 5.4» (data-restore)
// Стандарт 6.0: UI-вызовы — в возвращаемых объектах.
// Ревизия 28: атомарные траты — сначала проверяется ВСЁ (энергия и ресурсы), потом списывается
// ВСЁ одним пакетом. Причуда 5.4 «энергия тратится первой, до проверки ресурсов» починена:
// раньше нехватка жира съедала энергию, а нехватка нити — уже списанный воск.
import { S, spendE, spend, addRes, have } from '../core/state.js';
import { ITEMS } from './items.js';

// общий паттерн: e — энергия, req — [['res', n], ...]. Отказ — если чего-то не хватает; иначе списывает всё.
function pay(e, req) {
  if (e > 0 && S.energy < e) return { ok: false, toast: 'Слишком мало энергии', sfx: 'error' };
  const miss = (req || []).filter(([k, n]) => !have(k, n));
  if (miss.length) return { ok: false, toast: 'Не хватает: ' + miss.map(([k]) => (ITEMS[k] ? ITEMS[k].i + ' ' + ITEMS[k].n : k)).join(', '), sfx: 'error' };
  if (e > 0) spendE(e);
  (req || []).forEach(([k, n]) => spend(k, n));
  return { ok: true };
}

export function makeWax() {
  const f = pay(3, [['fat', 2]]);
  if (!f.ok) return f;
  addRes('wax', 1); S.stats.waxMade++;
  return { ok: true, toast: 'Воск готов. Печь доволен.' };
}

export function makeWaxGustav() {
  // стандарт 6.0: монеты живут в S.coins — spend('coins') не работает; монеты проверяем ДО pay
  if (S.energy < 3) return { ok: false, toast: 'Слишком мало энергии', sfx: 'error' };
  if (!have('fat', 2)) return { ok: false, toast: 'Не хватает: \u{1FAD7} Жир', sfx: 'error' };
  if (S.coins < 4) return { ok: false, toast: 'Не хватает монет', sfx: 'error' };
  spendE(3); spend('fat', 2); S.coins -= 4;
  addRes('wax', 1);
  return { ok: true, toast: 'Густав: «Воск как слеза». Справились.' };
}

export function makeCandle() {
  const f = pay(3, [['wax', 1], ['thread', 1]]);
  if (!f.ok) return f;
  addRes('candle', 1); S.stats.candlesMade++;
  return { ok: true, toast: 'Свеча ровная и честная. Таких в деревне уважают.', sfx: 'coin' };
}

export function makeFlour() {
  const f = pay(2, [['bones', 2]]);
  if (!f.ok) return f;
  addRes('flour', 1);
  return { ok: true, toast: 'Костная мука готова.' };
}

export function makeFert() {
  const f = pay(2, [['flour', 2], ['water', 1]]);
  if (!f.ok) return f;
  addRes('fertilizer', 1);
  return { ok: true, toast: 'Удобрение готово. Клумба будет в восторге.' };
}

export function studyBrain() {
  const f = pay(4, [['brain', 1]]);
  if (!f.ok) return f;
  S.science += 3; S.stats.scienceTotal += 3;
  return { ok: true, toast: 'Мозг изучен: +3\u{1F4DC}. Чужие мысли стали твоими.', sfx: 'ach' };
}

export function makeInk() {
  const f = pay(2, [['blood', 1], ['water', 1]]);
  if (!f.ok) return f;
  addRes('ink', 1);
  return { ok: true, toast: 'Чернила густые, как совесть при жизни.' };
}

export function makeElixir() {
  const f = pay(3, [['flowers', 2], ['water', 2]]);
  if (!f.ok) return f;
  addRes('elixir', 1);
  return { ok: true, toast: 'Эликсир готов. Цветы, вода и терпение — вот и вся магия.' };
}

export function makeBalsam() {
  const f = pay(3, [['water', 2], ['flowers', 2]]);
  if (!f.ok) return f;
  addRes('balsam', 1);
  return { ok: true, toast: 'Бальзам готов. Аромат — достойный последнего пути.' };
}

// ревизия 26: грибной отвар — лесной энергоноситель (дешевле кофе по монетам, но нужны грибы)
export function makeBroth() {
  const f = pay(2, [['mushroom', 2], ['water', 1]]);
  if (!f.ok) return f;
  addRes('broth', 1);
  return { ok: true, toast: 'Отвар готов. Пахнет лесом и немного — сыростью.' };
}

// useItem — дословно (кофе +10⚡, эликсир +25⚡ с кэпом от maxEnergy); трата одна — уже атомарна
export function useItem(it) {
  if (it === 'coffee') {
    if (!spend('coffee', 1)) return { ok: false, silent: true };
    S.energy = Math.min(S.maxEnergy, S.energy + 10);
    return { ok: true, fx: '+10⚡', toast: 'Приятно. Голова ясная, руки лёгкие.' };
  }
  if (it === 'broth') {
    if (!spend('broth', 1)) return { ok: false, silent: true };
    S.energy = Math.min(S.maxEnergy, S.energy + 10);
    return { ok: true, fx: '+10⚡', toast: 'Приятно. Голова ясная, руки лёгкие.' };
  }
  if (it === 'elixir') {
    if (!spend('elixir', 1)) return { ok: false, silent: true };
    S.energy = Math.min(S.maxEnergy, S.energy + 25);
    return { ok: true, fx: '+25⚡', toast: 'Приятно. Голова ясная, руки лёгкие.' };
  }
  return { ok: false, silent: true };
}

// диспетчер крафта (стандарт 6.0): id кнопки -> функция
export function craftAction(id) {
  switch (id) {
    case 'wax': return makeWax();
    case 'wax-gustav': return makeWaxGustav();
    case 'candle': return makeCandle();
    case 'flour': return makeFlour();
    case 'fert': return makeFert();
    case 'brain': return studyBrain();
    case 'ink': return makeInk();
    case 'elixir': return makeElixir();
    case 'balsam': return makeBalsam();
    case 'broth': return makeBroth();
  }
  return { ok: false, silent: true };
}
