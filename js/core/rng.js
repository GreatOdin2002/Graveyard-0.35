export const rng = {
  seed: 1,
  calls: 0, // ревизия 28: счётчик вызовов — позиция в потоке; уезжает в сейв (вариант B)
  _next: null,
  mulberry32(a) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  },
  init(seed) {
    this.seed = seed >>> 0;
    this.calls = 0;
    this._next = this.mulberry32(this.seed);
  },
  next() {
    if (!this._next) this.init(this.seed);
    this.calls++;
    return this._next();
  },
  int(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  },
  pick(arr) {
    if (!arr.length) return undefined;
    return arr[this.int(0, arr.length - 1)];
  },
  // выбор по весам: [{ v: значение, w: вес }]
  one(arr) {
    const r = this.next();
    const sum = arr.reduce((s, x) => s + x.w, 0);
    let acc = 0;
    for (const x of arr) {
      acc += x.w / sum;
      if (r <= acc) return x.v;
    }
    return arr[arr.length - 1].v;
  },
};
