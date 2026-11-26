// ВОРОН И ЗАКАЗЫ — дословно из монолита «Вечный покой 5.4» (data-restore).
// UI-вызовы вынесены в возвращаемые объекты (стандарт 6.0).
// Ревизия 28: при неполном заказе — честный тост с перечнем недостающего вместо
// молчаливого отказа (причуда 5.4 починена по согласованию в QA-чистке).
import { S, have, spend, log } from '../core/state.js';
import { ITEMS } from './items.js';

export const CROW_ORDERS = [
{n:'Свечи для паломников',need:{candle:5},reward:{coins:40,science:3}},
{n:'Черепа для учёного',need:{skull:2},reward:{coins:60}},
{n:'Цветы для вдовы',need:{flowers:6},reward:{coins:20,rep:3}},
{n:'Чернила для нотариуса',need:{ink:3},reward:{coins:35,science:2}},
{n:'Удобрение для фермера',need:{fertilizer:4},reward:{coins:30}}];

export function orderReady() {
  const o = S.crow.order;
  if (!o) return false;
  return Object.keys(o.need).every(r => have(r) >= o.need[r]);
}

export function crowOrderText(o) { return o.n }

export function doOrder() {
  const o = S.crow.order;
  if (!o) return { ok: false, silent: true };
  const miss = Object.keys(o.need)
    .filter(r => have(r) < o.need[r])
    .map(r => (ITEMS[r] ? ITEMS[r].i + ' ' + ITEMS[r].n : r) + ' ×' + o.need[r]);
  if (miss.length) return { ok: false, toast: 'Ворон заглянул в сумку и не нашёл: ' + miss.join(', '), sfx: 'error' };
  Object.keys(o.need).forEach(r => spend(r, o.need[r]));
  const rw = o.reward;
  // ревизия 25: порог 100⭐ — деревня знает смотрителя, заказ платит ×1.25
  const mult = S.rep >= 100 ? 1.25 : 1;
  if (rw.coins) S.coins += Math.round(rw.coins * mult);
  if (rw.science) { S.science += rw.science; S.stats.scienceTotal += rw.science; }
  if (rw.rep) S.rep += rw.rep;
  S.crow.order = null;
  S.crow.done++;
  log('Ворон получил своё: «' + o.n + '». Взгляд одобряющий.', 'crow');
  return { ok: true, toast: '🐦‍⬛ Заказ сдан: ' + o.n + (mult > 1 ? ' (×1.25 за репутацию 100+)' : ''), sfx: 'ach' };
}
