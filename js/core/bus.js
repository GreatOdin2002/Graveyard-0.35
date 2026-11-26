export const bus = {
  _l: {},
  on(event, cb) {
    (this._l[event] = this._l[event] || []).push(cb);
    return () => this.off(event, cb);
  },
  off(event, cb) {
    if (this._l[event]) {
      this._l[event] = this._l[event].filter((f) => f !== cb);
    }
  },
  emit(event, payload) {
    if (!this._l[event]) return;
    for (const cb of this._l[event]) {
      try { cb(payload); } catch (e) { console.error('[bus]', event, e); }
    }
  },
};
