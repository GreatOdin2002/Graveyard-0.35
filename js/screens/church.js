// ЦЕРКОВЬ И ПРОПОВЕДИ — вёрстка tChurch монолита (адаптация только в рендере)
import { S, fmt } from '../core/state.js';

// монолитный btn без needCheck: в 5.4 донат-кнопка была глушена навсегда
// (have('coins') всегда 0, монеты не в S.res) — по стандарту 6.0 кнопка живая,
// отказ обрабатывает donate() честным тостом
function cbtn(arg, label, cls) {
  return '<button class="btn ' + (cls || '') + '" data-action="' + arg + '">' + label + '</button>';
}

export function initChurch() {
  let h = '<h2>Церковь</h2><p class="sub">Отец Серапион приветливо кивает, но взгляд у него бухгалтерский: репутация — валюта епархии.</p>';
  h += '<div class="card" style="margin-bottom:12px"><h4>🕯 Пожертвовать (20💰 → +' + (S.techs.orator ? 2 : 1) + '⭐)</h4><p class="meta">Сегодня уже пожертвовано: ' + S.donatedToday + '/5.</p>' + cbtn('donate', 'Пожертвовать', 'gold') + '</div>';
  return h;
}

export function initSermons() {
  return '<h2>Проповеди</h2><p class="sub">Слово в воскресенье — и наука растёт.</p><div class="card"><h4>📖 Проповедь (5⚡ → +2📜)</h4><p class="meta">Слушатели кивают, вороны на крыше вторят. Наука — это тоже вера, только с таблицами.</p>' + cbtn('preach', 'Читать проповедь', 'gold') + '</div>';
}

export function initStats() {
  // 6.0-надстройка: в монолите отдельного экрана статистики нет — заполняем счётчиками S.stats
  const st = S.stats || {};
  const rows = [
    ['⏳', 'Дней в смотрителях', S.day],
    ['💰', 'Монет в сундуке', fmt(S.coins)],
    ['⭐', 'Репутация', S.rep],
    ['📜', 'Наука всего', st.scienceTotal || 0],
    ['⚰️', 'Похоронено', st.buried || 0],
    ['🔬', 'Вскрытий', st.extracted || 0],
    ['⛏️', 'Копок земли', st.digs || 0],
    ['🕯️', 'Свечей сделано', st.candlesMade || 0],
    ['🛒', 'Продаж на рынке', st.sales || 0],
  ];
  return '<h2>Статистика</h2><p class="sub">Строки для могильной доски. Пока только цифры — таблички с именами добавит время.</p><div class="grid">' +
    rows.map((r) => '<div class="card"><h4>' + r[0] + ' ' + r[1] + '</h4><p class="meta" style="font-size:18px"><b>' + r[2] + '</b></p></div>').join('') + '</div>';
}
