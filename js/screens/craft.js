// РЕМЕСЛО И ЛАБОРАТОРИЯ — вёрстка tCraft/tLab монолита (адаптация только в рендере)
import { S, have } from '../core/state.js';
import { needCheck } from '../data/needs.js';

// монолитный btn, переписанный под data-action (стандарт 6.0)
function cbtn(arg, label, cls, need) {
  const c = needCheck(need);
  const dis = c.ok ? '' : 'disabled';
  return '<button class="btn ' + (cls || '') + '" ' + dis + ' data-action="craft" data-arg="' + arg + '">' + label + '</button>' + (c.ok ? '' : '<div class="why">' + c.w + '</div>');
}

export function initCraft() {
  let h = '<h2>Ремесло</h2><p class="sub">Верстак, ступка и — если повезёт с технологией — собственная печь. Руки помнят работу дядюшки, голова — уже твоя.</p>';
  if (S.techs.oven) h += '<div class="card" style="margin-bottom:12px"><h4>🔥 Печь (своя)</h4><p class="meta">Жир ×2 → Воск ×1. Дым пахнет мёдом и чуть-чуть тайной.</p>' + cbtn('wax', 'Перетопить жир', 'gold', [['fat', 2], ['e', 3]]) + '</div>';
  else h += '<div class="card" style="margin-bottom:12px"><h4>🔥 Печь (сломана)</h4><p class="meta">Дядюшкина печь стоит холодная. Изучи «Печной мастер», чтобы топить самому, — или плати Густаву.</p>' + cbtn('wax-gustav', 'Перетопить у Густава (4💰)', '', [['fat', 2], ['e', 3]]) + '</div>';
  h += '<div class="card" style="margin-bottom:12px"><h4>🕯 Верстак</h4><p class="meta">Воск ×1 + Нить ×1 → Свеча ×1.</p>' + cbtn('candle', 'Сделать свечу', 'gold', [['wax', 1], ['thread', 1], ['e', 3]]) + '</div>';
  h += '<div class="card" style="margin-bottom:12px"><h4>🥣 Ступка</h4><p class="meta">Кости ×2 → Костная мука ×1.</p>' + cbtn('flour', 'Молоть кости', 'gold', [['bones', 2], ['e', 2]]) + '</div>';
  h += '<div class="card" style="margin-bottom:12px"><h4>🌱 Садовый стол</h4><p class="meta">Костная мука ×2 + Вода ×1 → Удобрение ×1. Кости уходят в землю — и это честно.</p>' + cbtn('fert', 'Смешать удобрение', 'gold', [['flour', 2], ['water', 1], ['e', 2]]) + '</div>';
  h += '<div class="card" style="margin-bottom:12px"><h4>🍲 Котёл на углях</h4><p class="meta">Грибы ×2 + Вода ×1 → Грибной отвар ×1 (+10⚡). Лесной обед для тех, у кого кофе не выношен.</p>' + cbtn('broth', 'Варить отвар', 'gold', [['mushroom', 2], ['water', 1], ['e', 2]]) + '</div>';
  h += '<h3>Употребить</h3><div class="row">';
  if (have('coffee')) h += '<button class="btn green" data-action="use-item" data-arg="coffee">☕ Кофе (+10⚡)</button>';
  if (have('elixir')) h += '<button class="btn green" data-action="use-item" data-arg="elixir">⚗️ Эликсир (+25⚡)</button>';
  if (have('broth')) h += '<button class="btn green" data-action="use-item" data-arg="broth">🍲 Отвар (+10⚡)</button>';
  if (!have('coffee') && !have('elixir') && !have('broth')) h += '<span class="sub" style="margin:0">Ничего бодрящего под рукой. Загляни к Густаву.</span>';
  h += '</div>';
  return h;
}

export function initLab() {
  if (!S.techs.alchemy1) return '<h2>Лаборатория</h2><p class="sub">Дверь заперта. За ней — пыль, реторты и трактат дядюшки. Изучи технологию «Алхимия I».</p>';
  let h = '<h2>Лаборатория</h2><p class="sub">Колбы тихо булькают сами собой — дядюшка ставил их так, что не затихают и по сей день.</p>';
  h += '<div class="grid">';
  h += '<div class="card"><h4>📜 Изучить мозг</h4><p class="meta">Мозг ×1 → Наука ×3. Незваные мысли становятся знаниями.</p>' + cbtn('brain', 'Изучить', 'gold', [['brain', 1], ['e', 4]]) + '</div>';
  h += '<div class="card"><h4>🖋 Чернила</h4><p class="meta">Кровь ×1 + Вода ×1 → Чернила ×1.</p>' + cbtn('ink', 'Сварить чернила', 'gold', [['blood', 1], ['water', 1], ['e', 2]]) + '</div>';
  if (S.techs.alchemy2) {
    h += '<div class="card"><h4>⚗ Эликсир</h4><p class="meta">Цветы ×2 + Вода ×2 → Эликсир ×1 (+25⚡). Секрет — в настое, а не в составляющих.</p>' + cbtn('elixir', 'Сварить эликсир', 'gold', [['flowers', 2], ['water', 2], ['e', 3]]) + '</div>';
    h += '<div class="card"><h4>🧴 Бальзам</h4><p class="meta">Вода ×2 + Цветы ×2 → Бальзам ×1 (+3 к похоронам).</p>' + cbtn('balsam', 'Сварить бальзам', 'gold', [['water', 2], ['flowers', 2], ['e', 3]]) + '</div>';
  } else h += '<div class="card tech-done"><h4>⚗ Эликсир</h4><p class="meta">Нужна технология «Алхимия II». Трактат дядюшки обрывается на середине страницы.</p></div>';
  h += '</div>';
  return h;
}
