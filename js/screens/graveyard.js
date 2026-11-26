import { S } from '../core/state.js';
import { digCost } from '../data/places.js';

// экраны группы graveyard: graveyard, forest, garden — эталон единого стиля (ревизия 22):
// заголовок → подсказка → состояние → карточки действий; кнопки только .btn.
export function initGraveyard() {
  const cleared = S.gravesOpened || 0;
  let h = '<h2>Кладбище</h2><p class="sub">Двадцать участков в тишине. Дядюшка оставил шесть расчистенными — тебе копать.</p>';
  h += `<p>Участков расчищено: ${cleared}/20.</p>`;
  h += '<div class="grid">';
  h += `<div class="card"><h4>⛏️ Копать</h4><p class="meta">Присмотр за могилой: чистка, присыпка, забота. Репутация любит аккуратных.</p><div class="row"><button class="btn gold" data-action="dig">Копать (${digCost()}⚡)</button></div></div>`;
  h += `<div class="card"><h4>🪦 Расчистить участок</h4><p class="meta">${cleared >= 20 ? 'Простор достигнут: все 20 участков уже расчистены.' : 'Свободная могила принимает постояльцев. Цена: 30💰.'}</p><div class="row">${cleared >= 20 ? '' : '<button class="btn" data-action="buy-grave">Расчистить (30💰)</button>'}</div></div>`;
  return h + '</div>';
}
export function initForest() {
  // ревизия 26: тропа протоптана — лес живой (по прецеденту garden-кнопок: проверка энергии на действии)
  return '<h2>Лес</h2><p class="sub">Источник грибов и хвороста. Тропа протоптана — держи в голове дорогу обратно.</p>' +
    '<div class="grid"><div class="card"><h4>🍄 Собрать в лесу</h4><p class="meta">Грибы, хворост; в редкий день — кролик в силке. Час ходьбы: 8⚡.</p><div class="row"><button class="btn gold" data-action="forage">Сходить в лес (8⚡)</button></div></div></div>' +
    '<p class="flavor">За оградой темнеет чаща: пахнет хвоей, грибами и чуть-чуть чужими тайнами. Дядюшка запрещал туда ходить в туман — и очень зря, надо сказать.</p>';
}
export function initGarden() {
  let h = '<h2>Сад</h2><p class="sub">Клумба за оградой: цветы идут в декор похорон.</p>';
  if (!S.plant.owned) {
    return h + '<p class="flavor">За оградой — пустырь. Земля там мягкая, тёплая.</p><div class="row"><button class="btn gold" data-action="buy-bed">Обустроить клумбу (30💰)</button></div>';
  }
  h += '<div class="grid">';
  if (!S.plant.planted) {
    h += `<div class="card"><h4>🌱 Посеять</h4><p class="meta">Грядка пуста. Созреют к дню ${S.day + 1}.</p><div class="row"><button class="btn gold" data-action="plant-seed">Посеять (1🌾, 3⚡)</button></div></div>`;
    h += `<div class="card"><h4>🧪 Удобрить</h4><p class="meta">Удобрение делает урожай щедрее.</p><div class="row"><button class="btn" data-action="fert-bed">Удобрить (1🌱)</button></div></div>`;
  } else if (S.plant.readyDay > S.day) {
    h += `<div class="card"><h4>⏳ Растёт</h4><p class="meta">Созреют к дню ${S.plant.readyDay}.${S.plant.fert ? ' Клумба удобрена.' : ''}</p><div class="row"><button class="btn" data-action="fert-bed" ${S.plant.fert ? 'disabled' : ''}>Удобрить (1🌱)</button></div></div>`;
  } else {
    h += `<div class="card"><h4>🌸 Урожай</h4><p class="meta">Цветы созрели!${S.plant.fert ? ' Клумба удобрена — урожай щедрый.' : ''}</p><div class="row"><button class="btn gold" data-action="harvest">Собрать цветы</button></div></div>`;
  }
  return h + '</div>';
}
