import { S } from '../core/state.js';
import { ITEMS, INV } from '../data/items.js';
import { MARKET, sellPrice, buys } from '../data/market.js';
import { TECHS } from '../data/techs.js';
import { fmt } from '../core/state.js';
import { needCheck } from '../data/needs.js';

export function initMarket() {
  const shop = Object.entries(MARKET).map(([id]) => {
    const it = ITEMS[id] || { i: '', n: id };
    const price = (S.market[id] !== undefined) ? Math.round(S.market[id] * 10) / 10 : MARKET[id];
    return `<div class="row"><span>${it.i} ${it.n} — ${fmt(price)}💰</span>
      <span><button data-action="buy" data-item="${id}" data-price="${price}">×1</button>
      <button data-action="buy" data-item="${id}" data-price="${price}" data-n="5">×5</button></span></div>`;
  }).join('');
  const rows = INV.filter((id) => (S.res[id] || 0) > 0)
    .map((id) => {
      const it = ITEMS[id] || { i: '', n: id };
      const p = Math.floor(sellPrice(S, id));
      return `<div class="row"><span>${it.i} ${it.n} ×${S.res[id]}</span>
        <span><button data-action="sell" data-item="${id}">Продать</button>
        <button data-action="sell" data-item="${id}" data-n="5">×5</button></span></div>`;
    }).join('') || '<p>Инвентарь пуст.</p>';
  return `<h2>Рынок</h2><p class="sub">День ${S.day}. Цены дрейфуют каждый день — рынок живой.</p><h3>Купить у рынка</h3>${shop}<h3>Продать</h3>${rows}`;
}
// вёрстка tTechs монолита: карточки, flavor, живая кнопка «Изучить (N📜)».
// Причуда 5.4 (вечный дизейбл needCheck([['science',cost]])) исправлена — ветка
// science в needs.js теперь честная.
export function initTechs() {
  const rows = TECHS.map((t) => {
    const owned = !!S.techs[t.id];
    let act;
    if (owned) act = '<span class="trend up">\u2713 Изучено</span>';
    else {
      const c = needCheck([['science', t.cost]]);
      const dis = c.ok ? '' : ' disabled';
      act = '<button class="gold"' + dis + ' data-action="learn" data-arg="' + t.id + '">Изучить (' + t.cost + '\u{1F4DC})</button>'
        + (c.ok ? '' : '<div class="why">' + c.w + '</div>');
    }
    return '<div class="card' + (owned ? ' tech-done' : '') + '"><h4>' + t.n + '</h4><p class="meta">' + t.d + '</p><p class="flavor">' + t.f + '</p>' + act + '</div>';
  }).join('');
  return '<h2>Технологии</h2><p class="sub">Наука — ' + S.science + '\u{1F4DC}. Трактат дядюшки открывается страница за страницей.</p><p class="meta">Изучено: ' + Object.keys(S.techs || {}).length + '/' + TECHS.length + '</p><div class="grid">' + rows + '</div>';
}
// лавка Густава: покупка ресурсов дословно (buys) + скупка свечей/воска/плоти/костей/черепа по 0.8
const GUSTAV_BUYS = ['candle', 'wax', 'flesh', 'bones', 'skull'];
export function initGustav() {
  const shop = buys(S).map(([id, price, note, batch]) => {
    const it = ITEMS[id] || { i: '', n: id };
    return `<div class="row"><span>${it.i || ''} ${note} — ${fmt(price)}💰</span>
      <span><button data-action="buy" data-item="${id}" data-price="${price}"${batch ? ` data-n="${batch}"` : ''}>Купить${batch ? ` ×${batch}` : ''}</button></span></div>`;
  }).join('');
  const sell = GUSTAV_BUYS.filter((id) => (S.res[id] || 0) > 0).map((id) => {
    const it = ITEMS[id] || { i: '', n: id };
    const p = Math.round(sellPrice(S, id) * .8);
    return `<div class="row"><span>${it.i} ${it.n} ×${S.res[id]} — скупка ${fmt(p)}💰</span>
      <span><button data-action="sell-gustav" data-item="${id}">Продать</button></span></div>`;
  }).join('') || '<p>Густаву пока нечего предложить.</p>';
  return `<h2>Густав</h2><p class="sub">«Рад видеть тебя, смотритель».</p><h3>Товар Густава</h3>${shop}<h3>Скупка</h3>${sell}`;
}
