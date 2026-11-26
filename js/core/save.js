// СОХРАНЕНИЕ — конверт с версией формата {v:1, s:state} (ревизия 22).
// Читаются: конверт v:1, плоский сейв монолита (S с v:5), старая обёртка {version,state}.
// Испорченный сейв НЕ удаляется: уезжает в vp5_save_broken для разбора, load() возвращает null.
import { S, defaultState, log } from './state.js';
import { rng } from './rng.js';

const KEY = 'vp5_save';
const VERSION = 1;

export function save() {
  try {
    S.rngCount = rng.calls; // ревизия 28: позиция в rng-потоке уезжает в сейв (вариант B)
    localStorage.setItem(KEY, JSON.stringify({ v: VERSION, s: S }));
    return true;
  } catch (e) {
    return false;
  }
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    let parsed;
    try { parsed = JSON.parse(raw); } catch (e) { return recover(raw); }
    if (!parsed || typeof parsed !== 'object') return recover(raw);
    if (typeof parsed.v === 'number' && parsed.s && typeof parsed.s === 'object') return parsed.s;
    if (parsed.state && typeof parsed.state === 'object' && parsed.state.day !== undefined) return parsed.state;
    if (parsed.day !== undefined) return parsed;
    return recover(raw);
  } catch (e) {
    return null;
  }
}

function recover(raw) {
  log('Сейв повреждён — начата новая игра. Прошлая запись сохранена в vp5_save_broken.');
  try {
    if (!localStorage.getItem(KEY + '_broken')) localStorage.setItem(KEY + '_broken', raw);
    localStorage.removeItem(KEY);
  } catch (e) {}
  return null;
}

export function wipe() { try { localStorage.removeItem(KEY); } catch (e) {} }

// миграция: плоский сейв монолита и старая обёртка; дозаливает задатки новых полей,
// не трогая существующее. После — validate (ревизия 22).
export function migrate(data) {
  if (!data || typeof data !== 'object') return null;
  let s = data;
  if (data.state && typeof data.state === 'object' && data.state.day !== undefined) s = data.state;
  if (s.day === undefined) return null;
  const d = defaultState();
  for (const k of Object.keys(d)) if (s[k] === undefined) s[k] = d[k];
  if (!s.graves || !s.graves.length) s.graves = d.graves;
  for (const k of ['market', 'stats']) {
    if (!s[k]) s[k] = d[k];
    else for (const kk of Object.keys(d[k])) if (s[k][kk] === undefined) s[k][kk] = d[k][kk];
  if (Array.isArray(s.log)) for (const l of s.log) if (!l.t) l.t = 'info'; // ревизия 31: старым записям журнала — тип по умолчанию
  }
  return validate(s, d);
}

// валидация (ревизия 22): некорректные типы/значения падают на дефолт, не роняя игру
function num(s, k, d) { return typeof s[k] === 'number' && isFinite(s[k]) ? s[k] : d; }
export function validate(s, d) {
  s.day = Math.max(1, num(s, 'day', d.day));
  s.coins = Math.max(0, num(s, 'coins', d.coins));
  s.maxEnergy = Math.max(10, num(s, 'maxEnergy', d.maxEnergy));
  s.energy = Math.min(s.maxEnergy, Math.max(0, num(s, 'energy', s.maxEnergy)));
  s.rep = Math.max(0, num(s, 'rep', 0));
  // ревизия 28: позиция в rng-потоке; кэп защищает от зависания прокрутки на битом сейве
  s.rngCount = Math.min(1000000, Math.max(0, Math.floor(num(s, 'rngCount', 0))));
  s.science = Math.max(0, num(s, 'science', 0));
  if (!s.res || typeof s.res !== 'object') s.res = d.res;
  for (const k of Object.keys(d.res)) if (typeof s.res[k] !== 'number' || !isFinite(s.res[k]) || s.res[k] < 0) s.res[k] = 0;
  if (!Array.isArray(s.graves) || !s.graves.length) s.graves = d.graves;
  if (!s.market || typeof s.market !== 'object') s.market = d.market;
  if (!s.techs || typeof s.techs !== 'object') s.techs = {};
  if (!s.ach || typeof s.ach !== 'object') s.ach = {};
  if (!s.stats || typeof s.stats !== 'object') s.stats = d.stats;
  if (!Array.isArray(s.log)) s.log = [];
  if (!Array.isArray(s.corpses)) s.corpses = [];
  return s;
}
