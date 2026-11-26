// ЛЕС — ревизия 26 (6.0-надстройка): тропа, грибы, хворост, редкий кролик.
// forage() — по образцу dig() (рев. 32: единый контракт действий).
import { S, spendE, addRes } from '../core/state.js';
import { rng } from '../core/rng.js';

export function forage() {
  const cost = 8;
  if (S.energy < cost) return { ok: false, toast: 'Слишком мало энергии', sfx: 'error' };
  S.energy -= cost;
  const roll = rng.next();
  let msg = ''; let sfxKind = 'dig';
  if (roll < .45) { const n = 1 + Math.floor(rng.next() * 2); addRes('mushroom', n); msg = 'Под елями — целые полки шляпок. Грибы ×' + n; }
  else if (roll < .80) { const n = 1 + Math.floor(rng.next() * 2); addRes('firewood', n); msg = 'Хворост ломается охотно, сухой и звонкий. Хворост ×' + n; }
  else if (roll < .92) { msg = 'Час брожения по чаще — и ничего. Тропа есть, удачи пока нет.'; }
  else { addRes('flesh', 1); msg = 'Кролик в силке, свежий. Густав покупает плоть не глядя — и мы не будем. Плоть ×1'; sfxKind = 'coin'; }
  return { ok: true, toast: msg, sfx: sfxKind, cost };
}
