import { S, have } from '../core/state.js';
import { ACH } from '../data/achievements.js';
import { ITEMS, SELLABLE } from '../data/items.js';
import { sellPrice } from '../data/market.js';
import { needCheck } from '../data/needs.js';
import { activeGoals } from '../data/goals.js';

function ubtn(k, label, cls, action) {
  const c = needCheck([[k, 1]]);
  const dis = c.ok ? '' : 'disabled';
  return '<button class="btn ' + (cls || '') + '" ' + dis + ' data-action="' + action + '" data-arg="' + k + '">' + label + '</button>' + (c.ok ? '' : '<div class="why">' + c.w + '</div>');
}
export function initAch() {
  let h = '<h2>Достижения</h2><p class="sub">Мелкие радости большой смотрительской карьеры.</p><div class="grid">';
  h += ACH.map((a) => {
    const ok = S.ach[a.id];
    return '<div class="card' + (ok ? ' tech-done' : '') + '"><h4>' + (ok ? '🏆 ' : '🔒 ') + a.n + '</h4><p class="meta">' + a.d + '</p></div>';
  }).join('');
  return h + '</div>';
}

// ---------- журнал (ревизия 31): типы, маркеры, дни, свёртка, фильтр ----------
const LOG_MARKS = {
  all: ['\u{1F4D1}', 'Все'],
  info: ['\u{1F4D6}', 'Общее'],
  money: ['\u{1F4B0}', 'Деньги'],
  burial: ['\u26B0\uFE0F', 'Похороны'],
  crow: ['\u{1F426}', 'Ворон'],
  church: ['\u26EA', 'Церковь'],
  garden: ['\u{1F331}', 'Сад'],
  craft: ['\u{1F528}', 'Крафт'],
  forest: ['\u{1F332}', 'Лес'],
  event: ['\u{1F324}\uFE0F', 'События'],
  quest: ['\u{1F3AF}', 'Поручения'],
};
let logFilter = 'all';
export function setLogFilter(f) { if (LOG_MARKS[f]) logFilter = f; }
export function initLog() {
  let h = '<h2>Журнал смотрителя</h2><p class="sub">Дядюшкина тетрадь в кляксах. Ты продолжаешь писать поверх — как и положено наследнику.</p>';
  const goals = activeGoals();
  if (goals.length) {
    h += '<div class="goal-list"><h3 class="goal-title">Ближайшие цели</h3>' + goals.map((g) => '<div class="goal-item"><span class="goal-marker"></span><span>' + (typeof g.text === 'function' ? g.text(S) : g.text) + '</span></div>').join('') + '</div>';
  }
  h += '<div class="chip-row">' + Object.keys(LOG_MARKS).map((k) =>
    '<button class="chip' + (logFilter === k ? ' chip-on' : '') + '" data-action="log-filter" data-arg="' + k + '">' + LOG_MARKS[k][0] + ' ' + LOG_MARKS[k][1] + '</button>'
  ).join('') + '</div>';
  const entries = S.log.filter((l) => logFilter === 'all' || (l.t || 'info') === logFilter);
  if (!entries.length) return h + '<p class="flavor">В этой рубрике тихо. Тетрадь ждёт записей.</p>';
  const days = [];
  for (const l of entries) {
    let g = days.find((d) => d.day === l.day);
    if (!g) { g = { day: l.day, items: [] }; days.push(g); }
    g.items.push(l);
  }
  h += days.map((d, i) => {
    const rows = d.items.map((l) =>
      '<div class="log-row"><span class="log-mark">' + (LOG_MARKS[l.t || 'info'] || LOG_MARKS.info)[0] + '</span><p class="meta" style="font-size:13px">' + l.text + '</p></div>').join('');
    if (i === 0) return '<div class="card" style="margin-bottom:8px"><h4 style="font-size:13px;color:var(--dim)">День ' + d.day + '</h4>' + rows + '</div>';
    return '<details class="card" style="margin-bottom:8px"><summary style="cursor:pointer;font-size:13px;color:var(--dim)">День ' + d.day + ' · записей: ' + d.items.length + '</summary><div style="margin-top:8px">' + rows + '</div></details>';
  }).join('');
  return h;
}

export function initInv() {
  let h = '<h2>🎒 Сумка</h2><p class="sub">Всё, что нажито непосильным трудом смотрителя. Сундуки под домом не тянут, но помнить надо.</p>';
  const keys = Object.keys(ITEMS).filter((k) => ['coins', 'energy', 'rep', 'science'].indexOf(k) < 0 && have(k) > 0);
  if (!keys.length) {
    h += '<p class="flavor">Пусто. Даже паутина ушла куда-то. Копни землю на кладбище — сумка наполнится быстро.</p>';
    return h;
  }
  h += '<div class="grid">' + keys.map((k) => {
    const it = ITEMS[k];
    let act = '';
    if (k === 'coffee' || k === 'elixir') act = ubtn(k, 'Выпить', 'gold', 'use-item');
    else if (k === 'brain') act = ubtn(k, 'Изучить (4⚡ → 3📜)', '', 'craft');
    if (SELLABLE.indexOf(k) >= 0) act += (act ? ' ' : '') + '<button class="btn" data-action="sell" data-item="' + k + '">Продать на рынке (' + sellPrice(S, k).toFixed(1) + '💰)</button>';
    else if (!act) act = '<p class="meta">На рынке не котируется — пригодится в ремесле или у Густава.</p>';
    return '<div class="card"><h4>' + it.i + ' ' + it.n + ' ×' + have(k) + '</h4><p class="meta">' + it.d + '</p><div class="row">' + act + '</div></div>';
  }).join('') + '</div>';
  return h;
}
