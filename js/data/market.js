// РЫНОК И ГУСТАВ — дословно из монолита «Вечный покой 5.4» (data-restore)

// цены рынка — из defaultState монолита (дрейфуют в newDay монолита, перенос на этапе day-cycle)
export const MARKET = { candle: 12, wax: 7, fertilizer: 10, ink: 14, skull: 30, flesh: 4, stone: 8, marble: 35, brain: 20, mushroom: 6, firewood: 5 };

// sellPrice() из монолита дословно (S передаётся явно)
export function sellPrice(s, it) {
  let p = s.market[it] || 0;
  if (s.techs.trade) p *= 1.15;
  if (it === 'candle' && s.techs.candlemaster) p += 3;
  return p;
}

// ассортимент Густава — дословно (buys); мрамор зависит от технологии
export function buys(s) {
  const base = [['thread', 3, 'Рулон нити'], ['stone', 8, 'Камень'], ['marble', s.techs.marble ? 22 : 25, 'Мрамор'],
          ['water', 2, 'Вода'], ['coffee', 10, 'Кофе'], ['seeds', 5, 'Семена'], ['fat', 6, 'Жир про запас']];
  // ревизия 25: порог 20\u2b50 — Густав продаёт воск партией ×5 (30💰 против 35 поштучно)
  if (s.rep >= 20) base.push(['wax', 30, 'Воск партией ×5', 5]);
  return base;
}

import { S, spend, addRes, fmt, log } from '../core/state.js';
import { ITEMS } from './items.js';
import { ONBOARDING_LINES } from './texts.js';
import { TECHS } from './techs.js';

// sellItem() из монолита дословно (render() и floatTxt() убраны — их делает оболочка)
export function sellItem(it, n) {
  n = n || 1;
  if (!spend(it, n)) return { ok: false, silent: true };
  const p = Math.round(sellPrice(S, it) * n * 10) / 10;
  S.coins += p;
  if (it === 'candle') S.stats.candlesSold += n;
  S.stats.sales += n; // ревизия 30: статистика продаж (туториал шаг 7)
  if (!S.stats.firstSellHint) { S.stats.firstSellHint = 1; log(ONBOARDING_LINES.sellHint, 'money'); }
  // ревизия 29: стандарт 6.0 — UI-вызовы (toast/sfx) ушли в возвращаемый объект
  return { ok: true, toast: 'Продано: ' + ITEMS[it].n + ' ×' + n + ' за ' + fmt(p) + '💰', sfx: 'coin' };
}

// sellGustav() из монолита дословно — скупка по 0.8 рыночной цены
export function sellGustav(it) {
  if (!spend(it, 1)) return { ok: false, silent: true };
  const p = Math.round(sellPrice(S, it) * .8);
  S.coins += p;
  if (it === 'candle') S.stats.candlesSold++;
  S.stats.sales++; // ревизия 30: статистика продаж (скупка Густава)
  return { ok: true, toast: '+' + p + '💰', sfx: 'coin' };
}

// buyRes() из монолита дословно, с фиксом бага монолита (см. шапку)
export function buyRes(it, p, n) {
  n = n || 1;
  if (S.coins < p) return { ok: false, toast: 'Не хватает монет', sfx: 'error' };
  S.coins -= p;
  addRes(it, n);
  return { ok: true, toast: 'Куплено: ' + ITEMS[it].n + (n > 1 ? ' ×' + n : ''), sfx: 'coin' };
}

// learn(id) из монолита дословно — по стандарту 6.0: UI-вызовы в возвращаемом объекте
// (конвенция donate/preach), checkAch — глобальный в refresh() (рев. 31). Причуда-баг 5.4
// (needCheck([['science',cost]]) звал have('science') при науке в S.science — кнопки были
// вечно задизейблены) исправлена: честная проверка S.science здесь и в needs.js.
export function learn(id) {
  const t = TECHS.find((x) => x.id === id);
  if (!t) return { ok: false, silent: true };
  if (S.techs[id]) return { ok: false, silent: true };
  if (S.science < t.cost) return { ok: false, toast: 'Не хватает науки: \u{1F4DC} ' + t.cost + '/' + S.science, sfx: 'error' };
  S.science -= t.cost;
  S.techs[id] = true;
  if (id === 'rituals') S.maxEnergy += 10;
  return {
    ok: true,
    toast: '\u{1F4DA} Технология: ' + t.n,
    sfx: 'ach',
    log: 'Изучена технология: \u00AB' + t.n + '\u00BB. ' + t.f,
  };
}
