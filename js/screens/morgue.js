// МОРГ/ВСКРЫТИЕ/ПОХОРОНЫ — вёрстка монолита tMorgue (адаптация только в рендере)
import { ensureStory, wishText } from '../data/stories.js';
import { S } from '../core/state.js';
import { burialState } from '../data/morgue.js';
import { needCheck } from '../data/needs.js';

export function initMorgue() {
  const cap = S.techs.logistics ? 2 : 1;
  let h = '<h2>Морг</h2><p class="sub">Холодный подвал под церковью. Тела ждут своего часа, но недолго: через два дня они начнут портиться, а инспектор — делать записи в блокнот.</p>';
  h += '<p class="meta">Мест: ' + S.corpses.length + '/' + cap + '. Вскрытие приносит ресурсы и +1 к качеству будущих похорон за каждую процедуру.</p>';
  if (!S.corpses.length) h += '<div class="flavor">Морг пуст. Лавка скрипит от сквозняка, и даже паучок в углу выглядит скучающим.</div>';
  h += '<div class="grid">' + S.corpses.map((c, i) => {
    const star = '\u2605'.repeat(c.stars) + '\u2606'.repeat(5 - c.stars);
    // ревизия 24: история тела на карточке (лениво для старых сейвов)
    ensureStory(c);
    const storyLine = '<p class="meta">' + c.occ + ', ' + c.trait + '.</p>'
      + '<p class="meta">Воля: «' + wishText(c) + '»' + (c.family ? ' \u00b7 родные ждут' : '') + '</p>';
    const q = c.extracted ? 'Процедуры: +' + c.extracted + ' к качеству' : '';
    const warn = c.days > 2
      ? '<span class="trend down">\u26A0 Портится! Дней сверх срока: ' + (c.days - 2) + '</span>'
      : '<span class="trend">Свежесть: ещё ' + Math.max(0, 2 - c.days) + ' дн.</span>';
    const cost = S.techs.gentle ? 1 : 2;
    const ex = ['skull', 'brain', 'blood', 'fat', 'bones', 'flesh'].map((r) =>
      '<button data-action="extract" data-n="' + i + '" data-arg="' + r + '">' + ({skull:'Снять череп \u{1F480}',brain:'Извлечь мозг \u{1F9E0}',blood:'Слить кровь \u{1F978}',fat:'Собрать жир \u{1F9D7}',bones:'Вынуть кости \u{1F9B4}',flesh:'Срезать плоть \u{1F969}'}[r]) + ' (' + cost + '\u26A1)</button>').join('');
    let emb;
    if (c.emb) emb = '<p class="meta">\u2713 Бальзамировано</p>';
    else if (!S.techs.embalm) emb = '';
    else {
      const chk = needCheck([['e', 2], ['water', 1], ['fat', 1]]);
      const dis = chk.ok ? '' : ' disabled';
      emb = '<div class="row" style="margin-top:6px"><button class="gold"' + dis + ' data-action="embalm" data-n="' + i + '">\u{1F9F4} Бальзамировать (+1\u2605)</button>'
        + (chk.ok ? '' : '<div class="why">' + chk.w + '</div>') + '</div>';
    }
    return '<div class="card"><h4>' + (c.name ? c.name + ' — ' : 'Тело: ') + '<span style="color:var(--gold)">' + star + '</span></h4><p class="meta">' + q + '</p>' + storyLine + warn + emb + '<div class="row" style="margin-top:6px">' + ex + '</div></div>';
  }).join('') + '</div>';
  return h;
}

// в монолите морг и вскрытие — один экран; вкладка «Вскрытие» показывает то же
export function initAutopsy() {
  return initMorgue().replace('<h2>Морг</h2>', '<h2>Вскрытие</h2>');
}

export function initBurial() {
  const { bs } = burialState();
  if (bs) return '<p>Похороны уже готовятся — смотри окно обряда.</p>';
  const free = S.graves.map((g, i) => ({ g, i })).filter((x) => x.i < S.gravesOpened && !x.g.occ);
  let h = '<h2>Похороны</h2><p class="sub">Тело из морга, свеча, цветы и бальзам. Чем больше декора и процедур — тем выше качество и репутация.</p>';
  if (!S.corpses.length) h += '<div class="flavor">В морге нет тел — похоронить нечего. Ждём ночную повозку.</div>';
  if (!free.length) h += '<p>Нет свободных расчищенных участков.</p>';
  h += free.map((x) => {
    // ревизия 26: апгрейд могилы прямо у участка (ур.2 — камень, ур.3 — мрамор)
    let upg = '';
    if (x.g.level < 2) upg = '<button data-action="upg-grave" data-n="' + x.i + '" data-arg="2">Каменная могила (2🪨 + 10💰)</button>';
    else if (x.g.level === 2) upg = '<button data-action="upg-grave" data-n="' + x.i + '" data-arg="3">Мраморная могила (2🪦 + 25💰)</button>';
    else upg = '<span class="trend up">\u2713 Максимальный уровень</span>';
    return '<div class="card"><p>Участок №' + (x.i + 1) + ' (ур. ' + x.g.level + ')</p><div class="row">' + upg + '</div><button class="gold" data-action="open-burial" data-n="' + x.i + '">Похороны \u2709</button></div>';
  }).join('');
  return h;
}
