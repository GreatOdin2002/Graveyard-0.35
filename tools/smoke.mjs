// tools/smoke.mjs — харнесс смоука «Вечный покой» (dev-only, в браузерный бандл не попадает)
// Запуск из корня проекта: node tools/smoke.mjs
// Стабы браузера ставятся ДО динамического импорта main.js (boot() вызывается на верхнем уровне модуля).
const listeners = {};
const elems = {};
function mkEl(id) {
  const el = {
    id, children: [], innerHTML: '', textContent: '', value: '', checked: false,
    disabled: false, style: {}, dataset: {}, scrollTop: 0, currentTime: 0,
    classList: { add(){}, remove(){}, toggle(){}, contains(){ return false; } },
    addEventListener(){}, removeEventListener(){}, setAttribute(){}, getAttribute(){ return null; },
    appendChild(c){ this.children.push(c); return c; },
    replaceChildren(){ this.children.length = 0; },
    remove(){}, focus(){}, blur(){}, play(){}, pause(){},
    querySelector(){ return null; }, querySelectorAll(){ return [] },
  };
  return el;
}
globalThis.window = globalThis;
globalThis.document = {
  getElementById: (id) => (elems[id] = elems[id] || mkEl(id)),
  querySelector: () => null, querySelectorAll: () => [],
  createElement: (t) => mkEl('el_' + t),
  addEventListener: (t, f) => { (listeners[t] = listeners[t] || []).push(f); },
  removeEventListener(){}, body: mkEl('body'), head: mkEl('head'), activeElement: null
};
globalThis.localStorage = { _m: {},
  getItem(k){ return k in this._m ? this._m[k] : null; },
  setItem(k,v){ this._m[k] = String(v); },
  removeItem(k){ delete this._m[k]; } };
class FAudio { constructor(){ this.volume = 1; } play(){} pause(){} }
globalThis.Audio = FAudio;
class FCtx { constructor(){ this.destination = {}; this.currentTime = 0; this.state = 'running'; }
  createOscillator(){ const n = { type:'', frequency:{ value:0, setValueAtTime(){}, exponentialRampToValueAtTime(){}, linearRampToValueAtTime(){}, setTargetAtTime(){} }, connect(){ return n; }, start(){}, stop(){} }; return n; }
  createGain(){ const g = { gain:{ value:0, setValueAtTime(){}, exponentialRampToValueAtTime(){}, linearRampToValueAtTime(){}, setTargetAtTime(){} }, connect(){ return g; } }; return g; }
  createBufferSource(){ return { connect(){}, start(){}, stop(){} }; }
  resume(){ return Promise.resolve(); } close(){ return Promise.resolve(); } }
globalThis.AudioContext = FCtx; globalThis.webkitAudioContext = FCtx;
globalThis.requestAnimationFrame = (f) => 0;

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// ревизия 34: root-резолвинг устойчив к расположению tools/ (внутри Graveyard или рядом с ней):
// ищем вверх по дереву каталог с js/core/state.js (root = Graveyard) или с Graveyard/js/core/state.js (root = родитель + Graveyard).
let root = null;
{
  let cur = path.dirname(fileURLToPath(import.meta.url));
  for (; cur !== path.dirname(cur); cur = path.dirname(cur)) {
    if (fs.existsSync(path.join(cur, 'js', 'core', 'state.js'))) { root = cur + path.sep; break; }
    if (fs.existsSync(path.join(cur, 'Graveyard', 'js', 'core', 'state.js'))) { root = path.join(cur, 'Graveyard') + path.sep; break; }
  }
}
if (!root) throw new Error('root не найден: js/core/state.js не найден вверх по дереву');
const { S, adopt, defaultState } = await import(root + 'js/core/state.js');
const { rng } = await import(root + 'js/core/rng.js');
const { bus } = await import(root + 'js/core/bus.js');
const { addRes } = await import(root + 'js/core/state.js');
const { dig } = await import(root + 'js/data/places.js');
const { forage } = await import(root + 'js/data/forest.js');
const { buyRes } = await import(root + 'js/data/market.js');
const { makeCandle, makeWaxGustav } = await import(root + 'js/data/craft.js');
const { doBurial } = await import(root + 'js/data/morgue.js');
const { newDay, eventAction } = await import(root + 'js/data/day.js');
const { donate } = await import(root + 'js/data/church.js'); // ревизия 35: чек отказа data
const { SCREENS } = await import(root + 'js/ui/router.js');
await import(root + 'js/main.js');

const R = [];
const T = (name, cond, detail) => { R.push([name, !!cond, detail]); };
const KEYS = () => (listeners.keydown || []);

T('boot: день 1, экран graveyard', S.day === 1 && S.screen === 'graveyard', 'day=' + S.day + ' screen=' + S.screen);

const bud = [];
for (let i = 0; i < 30; i++) { const c0 = rng.calls; newDay(); bud.push(rng.calls - c0); }
const PREFIX = [12,19,14,14,12];
T('бюджет newDay: префикс рев.28 [12,19,14,14,12]', PREFIX.every((v,i)=>bud[i]===v), 'bud[0..4]=' + bud.slice(0,5).join(','));

for (let i = 0; i < 30; i++) newDay();
T('регресс 60 дней: день 61, без NaN, репутация >= 0',
  S.day === 61 && [S.coins, S.rep, S.energy].every(Number.isFinite) && S.rep >= 0,
  'day=' + S.day + ' rep=' + S.rep + ' coins=' + S.coins);

adopt(defaultState());
S.energy = 0; const c5 = rng.calls; const r5 = dig();
T('dig отказ: конверт {ok:false,toast,sfx}, дельта rng=0',
  r5 && r5.ok === false && r5.toast === 'Слишком мало энергии' && r5.sfx === 'error' && rng.calls - c5 === 0, JSON.stringify(r5));
S.energy = 100; const d0 = S.stats.digs; const r6 = dig();
T('dig успех: ok:true, stats.digs растёт', r6 && r6.ok === true && S.stats.digs === d0 + 1, JSON.stringify(r6));
S.energy = 0; const c7 = rng.calls; const r7 = forage();
T('forage отказ: конверт, дельта rng=0', r7 && r7.ok === false && r7.sfx === 'error' && rng.calls - c7 === 0, JSON.stringify(r7));
S.energy = 100; const r8 = forage();
T('forage успех: ok:true', r8 && r8.ok === true, JSON.stringify(r8));
S.corpses = []; const r9 = doBurial(0);
T('doBurial пустой морг: toast «Тело уже ушло.», поля error нет',
  r9 && r9.ok === false && r9.toast === 'Тело уже ушло.' && !('error' in r9), JSON.stringify(r9));
S.coins = 0; const r10 = buyRes('wax', 5, 1);
T('buy отказ: тост слышен, монеты не списаны', r10 && r10.ok === false && r10.sfx === 'error' && S.coins === 0, JSON.stringify(r10));
S.energy = 100; S.coins = 0; const r11 = makeWaxGustav();
T('makeWaxGustav отказ: sfx error из data', r11 && r11.ok === false && r11.sfx === 'error', JSON.stringify(r11));
S.coins = 100; const r12 = makeCandle();
T('makeCandle отказ: pay-контракт, тост «Не хватает»', r12 && r12.ok === false && String(r12.toast).includes('Не хватает'), JSON.stringify(r12));
addRes('wax', 1); addRes('thread', 1); const r12b = makeCandle();
T('makeCandle успех: ok:true', r12b && r12b.ok === true, JSON.stringify(r12b));
// ревизия 34: два чека контракта событий дня
S.coins = 0;
const r13 = eventAction('feed');
T('eventAction отказ: sfx error из data (нет монет)', r13 && r13.ok === false && r13.sfx === 'error', JSON.stringify(r13));
const r14 = newDay();
T('newDay контракт: {ok, victory} без toasts', r14 && r14.ok === true && !('toasts' in r14) && 'victory' in r14, JSON.stringify(r14));

// ревизия 35: три чека sfx до конца data-слоя
S.donatedToday = 0;
const prevCoins = S.coins; S.coins = 0;
const r15 = donate();
S.coins = prevCoins;
T('донат отказ: sfx error из data (нет монет)', r15 && r15.ok === false && r15.sfx === 'error' && r15.toast === 'Не хватает монет', JSON.stringify(r15));
let dataBad = 0;
for (const f of fs.readdirSync(root + 'js' + path.sep + 'data').filter(n => n.endsWith('.js'))) {
  const src = fs.readFileSync(root + 'js' + path.sep + 'data' + path.sep + f, 'utf8');
  for (const ln of src.split('\n')) if (ln.includes('ok: false') && ln.includes('toast:') && !ln.includes('sfx')) dataBad++;
}
T('данные: 0 отказов {ok:false, toast} без sfx', dataBad === 0, String(dataBad));
const mainSrc = fs.readFileSync(root + 'js' + path.sep + 'main.js', 'utf8');
T('main.js: 0 захардкоженных sfx(\'error\')', mainSrc.indexOf("sfx('error')") === -1, String(mainSrc.indexOf("sfx('error')")));

let invFail = null;
for (const s of SCREENS) { const c0 = rng.calls; bus.emit('screen', s.id); if (rng.calls !== c0) { invFail = s.id; break; } }
T('инвариант рендеров: дельта rng=0 на всех ' + SCREENS.length + ' экранах', !invFail, String(invFail || 'ok'));

document.activeElement = null; elems.modalRoot.children.length = 0;
for (const f of KEYS()) f({ key: '3', preventDefault(){} });
T('хоткей 3 -> Ремесло', S.screen === 'craft', S.screen);
elems.modalRoot.children.push(mkEl('m'));
for (const f of KEYS()) f({ key: '2', preventDefault(){} });
T('хоткей при открытой модалке игнорируется', S.screen === 'craft', S.screen);
elems.modalRoot.children.length = 0;
document.activeElement = { tagName: 'INPUT' };
for (const f of KEYS()) f({ key: '1', preventDefault(){} });
T('хоткей в поле ввода игнорируется', S.screen === 'craft', S.screen);
document.activeElement = null;
for (const f of KEYS()) f({ key: '1', preventDefault(){} });
T('хоткей 1 -> Кладбище', S.screen === 'graveyard', S.screen);

const fails = R.filter(r => !r[1]);
for (const [n, ok, d] of R) console.log((ok ? 'PASS ' : 'FAIL ') + n + (ok ? '' : ' :: ' + d));
console.log('SMOKE: ' + (R.length - fails.length) + '/' + R.length + ' OK' + (fails.length ? ' — FAILS: ' + fails.map(f=>f[0]).join('; ') : ''));
process.exitCode = fails.length ? 1 : 0;
