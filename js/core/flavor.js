// flavor.js — ревизия 29: отдельный мини-генератор для строк-украшений.
// Игровой поток rng принадлежит только игровой логике; флейвор игроку не пеняется,
// поэтому живёт на своём фиксированном сиде и НЕ попадает в сейв.
const _rng = { _next: null };
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const flavor = {
  pick(arr) {
    if (!arr.length) return undefined;
    if (!_rng._next) _rng._next = mulberry32(0xC0FFEE);
    return arr[Math.floor(_rng._next() * arr.length)];
  },
};
