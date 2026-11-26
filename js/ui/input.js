import { bus } from '../core/bus.js';

// делегирование: один слушатель на весь #app, экшены через data-action
export function bindActions(root) {
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const d = btn.dataset;
    bus.emit('action', {
      action: d.action,
      arg: d.arg || null,
      item: d.item || null,
      n: d.n ? Number(d.n) : undefined,
      price: d.price ? Number(d.price) : undefined,
    });
  });
  root.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-screen]');
    if (!tab) return;
    e.preventDefault();
    bus.emit('screen', tab.dataset.screen);
  });
}
