import { SCREENS } from './router.js';
import { S, fmt } from '../core/state.js';
import { orderReady } from '../data/crow.js';
import { tutBanner } from '../data/tutorial.js';

export function renderTop() {
  const h = document.getElementById('top');
  if (!h) return;
  h.innerHTML = `
    <div class="top-bar">
      <span class="logo">ВЕЧНЫЙ ПОКОЙ</span>
      <div class="stats">
        <span>День: ${S.day}</span>
        <span>Энергия: ${S.energy}/${S.maxEnergy}⚡</span>
        <span>Наука: ${S.science}📜</span>
        <span>Монеты: ${fmt(S.coins)}💰</span>
        <span>Репутация: ${S.rep}⭐</span>
        ${S.rain ? '<span>🌧️ Дождь</span>' : ''}
      </div>
      <button data-action="toggle-sound">${S.sound ? '🔔' : '🔇'}</button>
        <button data-action="help">❔</button>
        <button data-action="reset">↺</button>
        <button data-action="new-day">🌙 Новый день</button>
    </div>`;
}

export function renderTabs() {
  const t = document.getElementById('tabs');
  if (!t) return;
  // вкладки группами (поле group уже в SCREENS): подпись — только там, где вкладок больше одной
  const GROUPS = { graveyard: 'Кладбище', morgue: 'Морг', craft: 'Ремесло', market: 'Рынок', church: 'Церковь', misc: 'Разное' };
  const byG = {}; const order = [];
  for (const s of SCREENS) {
    if (!byG[s.group]) { byG[s.group] = []; order.push(s.group); }
    byG[s.group].push(s);
  }
  t.innerHTML = '<nav class="tab-nav">' + order.map((g) => {
    const items = byG[g].map((s) =>
      `<a href="#" data-screen="${s.id}" class="${S.screen === s.id ? 'active' : ''}">${s.title}${s.hk ? `<span class="hk">${s.hk}</span>` : ''}${s.id === 'crow' && S.crow.active && S.crow.order && orderReady() ? '<span class="badge ok">✓</span>' : ''}</a>`
    ).join('');
    return byG[g].length > 1 ? `<span class="tab-group">${GROUPS[g] || ''}</span>${items}` : items;
  }).join('') + '</nav>';
}

export function renderScreen(html) {
  const c = document.getElementById('content');
  if (!c) return;
  c.innerHTML = `<div class="screen">${tutBanner()}${html}</div>`;
}
