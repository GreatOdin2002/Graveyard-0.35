// ЭКРАН ВОРОНА — вёрстка tCrow монолита (адаптация: Math.random -> rng, btn -> cbtn).
import { S } from '../core/state.js';
import { RAVEN_LINES } from '../data/texts.js';
import { ITEMS } from '../data/items.js';
import { orderReady } from '../data/crow.js';
import { flavor } from '../core/flavor.js';

function cbtn(arg, label, cls) {
  return '<button class="btn ' + (cls || '') + '" data-action="' + arg + '">' + label + '</button>';
}

export function initCrow() {
  if (!S.crow.active) {
    return '<h2>Ворон</h2><p class="sub">На ограде сидит важная птица и смотрит сквозь тебя. Пока она считает, что ты мелкая сошка, заказов не будет. Набери 10 репутации — и она присмотрится.</p>';
  }
  let h = '<h2>Ворон</h2><p class="flavor">' + flavor.pick(RAVEN_LINES) + '</p>';
  if (!S.crow.order) h += '<p class="sub">Ворон приносит заказы время от времени. Пока — только карает взглядом.</p>';
  else {
    const o = S.crow.order;
    const need = Object.keys(o.need).map(r => ITEMS[r].i + ' ' + o.need[r] + '/' + (S.res[r] || 0)).join(', ');
    h += '<div class="card"><h4>📦 Заказ: «' + o.n + '»</h4><p class="meta">Нужно: ' + need + '</p>';
    h += '<p class="meta">Награда: ' + Object.keys(o.reward).map(r => (r === 'coins' ? '💰' : r === 'science' ? '📜' : r === 'rep' ? '⭐' : '') + ' ' + o.reward[r]).join(', ') + '</p>';
    h += cbtn('crow-order', 'Сдать заказ', 'green');
    h += '</div>';
  }
  return h;
}
