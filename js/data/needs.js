// needCheck/whyNeed — дословно из монолита «Вечный покой 5.4» (data-restore)
import { S, have } from '../core/state.js';
import { ITEMS } from './items.js';

export function whyNeed(list) {
  const miss = list.filter((x) => {
    const r = x[0];
    if (r === 'e') return S.energy < x[1];
    if (r === 'science') return S.science < x[1]; // исправление причуды 5.4: наука живёт в S.science
    return have(r) < x[1];
  });
  if (!miss.length) return null;
  return 'Не хватает: ' + miss.map((m) => m[0] === 'e' ? ITEMS.energy.i + ' ' + m[1] + '/' + S.energy : m[0] === 'science' ? '\u{1F4DC} ' + m[1] + '/' + S.science : ITEMS[m[0]].i + ' ' + m[1] + '/' + have(m[0])).join(', ');
}

export function needCheck(list) {
  const w = whyNeed(list);
  if (w) return { ok: false, w };
  return { ok: true };
}
