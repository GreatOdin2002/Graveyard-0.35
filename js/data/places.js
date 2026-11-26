// КОПКА И УЧАСТКИ — дословно из монолита «Вечный покой 5.4» (data-restore)
import { rng } from '../core/rng.js';
import { S, have, spend, addRes } from '../core/state.js';

// монолит: Math.ceil((S.techs.ergo?6:8)*(S.rain?1.5:1))
export function digCost(s = S) {
  return Math.ceil((s.techs.ergo ? 6 : 8) * (s.rain ? 1.5 : 1));
}

// Ревизия 32: единый контракт действий — отказ {ok:false, toast:'Слишком мало энергии', sfx:'error'},
// успех {ok:true, toast, sfx, cost}. Проверка энергии ДО любых вызовов rng — бюджет newDay не тронут.
export function dig() {
  const cost = digCost();
  if (S.energy < cost) return { ok: false, toast: 'Слишком мало энергии', sfx: 'error' };
  S.energy -= cost;
  S.stats.digs++; // ревизия 30: статистика копок (раньше — вечный 0)
  const roll = rng.next();
  let msg = '';
  let sfxKind = 'dig';
  if (roll < .45) { const n = 1 + Math.floor(rng.next() * 2); addRes('bones', n); msg = 'Лопата звякнула: кости, аккуратно уложенные кем-то давно. ×' + n; }
  else if (roll < .70) { addRes('stone', 1); msg = 'В пласте глины — камень. Тяжёлый, честный, надёжный.'; }
  else if (roll < .88) { addRes('fat', 1); msg = 'Грунт отдаёт тёмный жир. Не будем уточнять чей — осень, что взять.'; }
  else if (roll < .92) { S.coins += 3; msg = 'Оловянная ложка с погнутой пуговицей. Густав берёт такой лом по три монеты — не спрашивай, зачем ему столько ложек.'; sfxKind = 'coin'; }
  else { S.coins += 2; msg = 'Найдена горстка старых монет. Дядюшка прятал по карманам всей округи.'; sfxKind = 'coin'; }
  return { ok: true, toast: msg, sfx: sfxKind, cost };
}

// buyGrave() из монолита дословно: расчистка участка за 30 монет.
// Отличие от 5.4: там spend('coins',30) молча проваливался (монеты не в S.res) —
// здесь честная проверка S.coins (стандарт 6.0). Формулировки — дословно.
export function buyGrave() {
  if (S.gravesOpened >= 20) {
    return { ok: false, toast: 'Простор достигнут: все 20 участков уже расчистены.', sfx: 'error' };
  }
  if (S.coins < 30) return { ok: false, toast: 'Не хватает монет', sfx: 'error' };
  S.coins -= 30;
  S.gravesOpened++;
  return {
    ok: true,
    log: 'Расчищен новый участок №' + S.gravesOpened + '. Земля впервые за годы встрепенулась.',
    toast: 'Новый участок расчищен!',
    sfx: 'dig',
  };
}

// buyBed() из монолита дословно: клумба за 30 монет.
// ревизия 26: апгрейд могилы — ур.2 (камень) и ур.3 (мрамор). Закрывает достижение a5
// («5 могил мрамора») и делает исполнимой волю «место у алтарной стены» (ур. 2+).
// Поэтапно (нельзя перепрыгнуть уровень), только свободные могилы.
const UPGRADE_COSTS = { 2: { stone: 2, coins: 10 }, 3: { marble: 2, coins: 25 } };
export function upgradeGrave(i, lvl) {
  const g = S.graves[i];
  if (!g) return { ok: false, toast: 'Такой могилы нет', sfx: 'error' };
  if (g.occ) return { ok: false, toast: 'Могила занята — постоялец уже лег спать', sfx: 'error' };
  if (g.level !== lvl - 1) return { ok: false, toast: 'Сначала уровень ' + (lvl - 1), sfx: 'error' };
  const cost = UPGRADE_COSTS[lvl];
  if (!cost) return { ok: false, toast: 'Выше уже некуда', sfx: 'error' };
  if (S.coins < cost.coins) return { ok: false, toast: 'Не хватает монет', sfx: 'error' };
  for (const k in cost) if (k !== 'coins' && !have(k, cost[k])) return { ok: false, toast: 'Не хватает материалов', sfx: 'error' };
  S.coins -= cost.coins;
  for (const k in cost) if (k !== 'coins') spend(k, cost[k]);
  g.level = lvl;
  return { ok: true, toast: 'Могила ур. ' + lvl, sfx: 'dig', log: 'Могила №' + (i + 1) + ' улучшена до уровня ' + lvl + '. Камень честный, постоялец доволен.' };
}

export function buyBed() {
  if (S.coins < 30) return { ok: false, toast: 'Не хватает монет', sfx: 'error' };
  S.coins -= 30;
  S.plant.owned = true;
  return {
    ok: true,
    log: 'Обустроена клумба за оградой. Земля там мягкая, тёплая.',
    toast: 'Клумба готова к посеву!',
    sfx: 'dig',
  };
}
