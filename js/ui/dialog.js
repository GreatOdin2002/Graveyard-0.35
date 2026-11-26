import { S } from '../core/state.js';
export function toast(msg) {
  let zone = document.getElementById('toasts');
  if (!zone) {
    zone = document.createElement('div');
    zone.id = 'toasts';
    document.body.appendChild(zone);
  }
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  zone.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

export function modal(html) {
  // модалка — простой overlay, закрывается по клику на фон
  const wrap = document.createElement('div');
  wrap.className = 'modal-wrap';
  wrap.innerHTML = `<div class="modal">${html}</div>`;
  wrap.addEventListener('click', (e) => {
    if (e.target === wrap) wrap.remove();
  });
  document.body.appendChild(wrap);
  return wrap;
}

// sfx — короткий щелчок через WebAudio (заготовка под звук из монолита)
let audioCtx = null;
export function sfx(kind = 'click') {
  try {
    if (S.sound === false) return; // кнопка 🔔 в шапке — как в монолите
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.frequency.value = kind === 'error' ? 180 : 660;
    g.gain.value = 0.05;
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + 0.08);
  } catch (e) {}
}

// floatTxt — дословно из монолита (плюющая цифра; Math.random здесь — только позиция DOM)
export function floatTxt(txt) {
  const e = document.createElement('div');
  e.className = 'float';
  e.textContent = txt;
  e.style.right = (30 + Math.random() * 80) + 'px';
  e.style.bottom = '90px';
  document.body.appendChild(e);
  setTimeout(() => e.remove(), 1100);
}
