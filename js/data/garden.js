import { S, spend, spendE, addRes, have } from '../core/state.js';

// Дословно из монолита 5.4 (UI-вызовы вынесены в возвращаемые объекты — стандарт 6.0).
// Ревизия 28: атомарно — энергия и семя проверяются ДО списания (раньше энергия
// списывалась первой и исчезала при пустой сумке — причуда 5.4, починена).
// plantSeed: 3 энергии + 1 семя -> planted=true, readyDay=S.day+1
export function plantSeed() {
  if (S.energy < 3) return { ok: false, toast: 'Слишком мало энергии', sfx: 'error' };
  if (!have('seeds', 1)) return { ok: false, toast: 'Нужны семена', sfx: 'error' };
  spendE(3); spend('seeds', 1);
  S.plant.planted = true;
  S.plant.readyDay = S.day + 1;
  return { ok: true, toast: 'Семена в земле. До завтра.' };
}

// fertBed: 1 удобрение -> fert=true
export function fertBed() {
  if (!spend('fertilizer', 1)) return { ok: false, toast: 'Нужно удобрение', sfx: 'error' };
  S.plant.fert = true;
  return { ok: true, toast: 'Клумба удобрена. Урожай будет щедрым.' };
}

// harvest: 2 базово, +1 грядник; при удобрении +4 агроном / +2 иначе; fert сбрасывается
export function harvest() {
  if (!S.plant.planted) return { ok: false, toast: 'Грядка пуста', sfx: 'error' };
  if (S.plant.readyDay > S.day) return { ok: false, toast: 'Ещё не созрели', sfx: 'error' };
  S.plant.planted = false;
  let n = 2 + (S.techs.gardener ? 1 : 0);
  if (S.plant.fert) { n += S.techs.agro ? 4 : 2; S.plant.fert = false; }
  S.stats.flowers += n;
  addRes('flowers', n);
  return { ok: true, toast: 'Собрано цветов: ' + n + ' 🌸', sfx: 'ach' };
}
