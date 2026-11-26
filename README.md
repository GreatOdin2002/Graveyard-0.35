# BUILD.md — «Вечный покой» 6.0 (ревизия 35: sfx до конца data-слоя)

Договорённость: этот файл — зеркальная копия кода проекта.
На старте сеанса прикладываются монолит «Вечный покой» и этот BUILD.md — этого достаточно для восстановления всего проекта.

> Состояние: ревизия 35 — sfx до конца data-слоя: 27 отказов озвучены из data, захардкод снят, контракт чист.
> Новое в этой порции:
> js/data/*.js — 27 отказов {ok:false, toast:...} получили sfx: 'error' из data: places 9, morgue 8, garden 5,
> church 3, crow 1, market 1. После патча в data-слое 0 отказов с toast без sfx (контрольная статика по живым
> байтам); 12 silent и 1 needCheck в needs.js — легитимные, не тронуты.
> js/main.js — кейс open-burial: захардкоженный sfx('error') снят, fallback переведён на контракт
> (if (!r.silent) toast; if (r.sfx) sfx;) — звук отказа openBurial теперь из data (morgue.js: 37/65/67).
> tools/smoke.mjs — косметика: комментарии шапки файла ссылаются на актуальное имя (.mjs, а не .js).
> Три чека рев. 35: (1) динамический — монетный отказ donate() из church.js несёт sfx: 'error' из data;
> (2) статический — в data-слое 0 отказов {ok:false, toast} без sfx, полный скан по всем файлам data/ прямо
> в харнессе; (3) статический — в main.js 0 вхождений sfx('error').
> Уточнение скана (честно): построчный regex прошлых прогонов занижал счёт на строках с эмодзи \u{...} внутри
> toast (обрыв матча по закрывающей скобке escape). Свежий скан построчным перечнем подтвердил цифры шапки
> рев. 34: 53 возврата ok:false в data-слое = 12 silent (легитимные) + 1 needCheck (needs.js, не действие) +
> 27 нарушений (патчим здесь) + 13 уже контрактных (day 7, forest 1, market 1, craft 4).
> Артефакты цикла: tools/patches_35.py — идемпотентный патч-скрипт порции (запуск из корня: python3
> tools/patches_35.py [ROOT]; прогон 1 — 9/9 ok, прогон 2 — 9/9 skip, FAIL: 0 в обоих; счётчик «уже применено»
> для market/morgue/places видит и ранее контрактные отказы — запас в skip-проверке; лишних замен не было:
> прогон 1 менял только строки без sfx, ровно по ожиданиям).
> Контракт-карта (рев. 35): 30 действий — единый конверт {ok, toast?, sfx?, log?, fx?, silent?}; каждый отказ
> с toast несёт sfx из data; newDay — {ok, victory}. Исключения не тронуты: whyNeed (needs.js), wishResult
> (stories.js x2) — запросы; load/recover/migrate (save.js x5) — потоки загрузки. Остаток: 8 легитимных.
> Доставка (закрытая глава): работает схема «файл создаётся в текущем заходе»; ссылки doc= из погасших заходов
> и ручной сбор gproxy/FileGuid — неработоспособны, не воспроизводить.
> Оговорки (честно): клавиатура в смоуке — эмуляция keydown, реальная раскладка за пределами харнесса. Бюджет
> рев. 28 сверяется по префиксу [12,19,14,14,12] (заморозка от рев. 28 не восстановима).
> rng: ревизия не касается игрового потока — бюджет newDay сошёлся, инвариант рендеров — дельта rng 0.
> Проверки: round-trip 42/42 секций (0 расхождений с диском, дублей нет); синтакс 35/35 игровых
> js-модулей + smoke.mjs + patches_35.py; смоук 22/22 OK по финальной сборке (19 базовых рев. 34 + 3 чека
> рев. 35), подтверждён из двух точек запуска (/app/proj и /app/proj/Graveyard); идемпотентность
> patches_35.py — прогон 1: 9/9 ok, прогон 2: 9/9 skip (FAIL: 0 в обоих) и по контрольному деплою финала.
> В заметки следующей порции: долги по sfx закрыты полностью, открытых нарушений контракта нет; повестка —
> по желанию: группировка вкладок свёрткой. На старте сеанса прикладывается этот BUILD (35) final.

## Graveyard/css/style.css
```
/* Единая палитра «старый дневник смотрителя» — золотой акцент (ревизия 22: два :root сведены в один; ревизия 30: валидный комментарий) */
:root{--bg:#141317;--panel:#201e26;--panel2:#2a2731;--border:#3d3946;--gold:#c9a84c;--gold-dim:#8a7a4f;--accent:#c9a84c;--text:#e8e2d5;--dim:#9a917f;--green:#7fae7a;--red:#c96a5a;--blue:#7a9ec9}
body{background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;margin:0;padding:0}
#app{max-width:960px;margin:0 auto;padding:1rem}
.top-bar{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem;border-bottom:1px solid var(--border);padding-bottom:.5rem;margin-bottom:1rem}
.stats span{margin-left:1.2rem;font-size:.95rem}
.tab-nav{display:flex;flex-wrap:wrap;align-items:baseline;gap:.25rem 1rem;margin-bottom:1rem}
.tab-nav a{color:var(--dim);text-decoration:none;cursor:pointer}
.tab-nav a.active{color:var(--accent);font-weight:bold}
.tab-group{color:var(--gold-dim);font-size:12px;text-transform:uppercase;letter-spacing:.05em}
.screen{background:var(--panel);padding:1.5rem;border-radius:12px;border:1px solid var(--border)}
button,.btn{background:var(--panel2);color:var(--text);border:1px solid var(--border);padding:.55rem .9rem;cursor:pointer;border-radius:8px;font-size:14px}
button:hover,.btn:hover{background:#332f3b}
button:disabled,.btn:disabled{opacity:.45;cursor:default}
.btn.gold,.btn.gold:hover{background:var(--gold);color:#1a1a1f;border-color:var(--gold-dim)}
.btn.green{background:#2a4a2a;border-color:#3a6a3a;color:var(--green)}
.row{display:flex;gap:.5rem;flex-wrap:wrap;align-items:center}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:50}
.modal{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:1.2rem 1.4rem;max-width:480px;width:90%}
.modal h3{margin:0 0 .5rem;color:var(--accent)}
.modal .row{display:flex;gap:.6rem;margin-top:.8rem}
.card{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:12px}
.card h4{font-size:15px;margin:0 0 6px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:12px}
.sub{color:var(--dim);font-size:13px;margin-bottom:14px;line-height:1.55;max-width:760px}
.card .meta{color:var(--dim);font-size:12px;line-height:1.5;margin-bottom:8px}
.why{color:var(--red);font-size:12px;margin-top:4px}
.tech-done{opacity:.55;border-color:var(--green)}
.trend{font-size:12px}
.flavor{color:var(--dim);font-style:italic;font-size:13px;line-height:1.55;margin:8px 0;max-width:760px}
.float{position:fixed;color:var(--gold);font-weight:bold;pointer-events:none;animation:fl 1.1s forwards;z-index:99;font-size:15px}
@keyframes fl{to{transform:translateY(-44px);opacity:0}}
.badge{background:var(--gold);color:#1a1a1f;border-radius:10px;font-size:11px;padding:0 6px;min-width:18px;text-align:center}
.badge.ok{background:var(--green)}
/* мобильная версия (ревизия 22): одна колонка, крупнее кнопки */
@media (max-width:640px){
  #app{padding:.6rem}
  .stats span{margin-left:.6rem;font-size:.85rem}
  .screen{padding:1rem}
  .grid{grid-template-columns:1fr}
  button,.btn{padding:.6rem .8rem;font-size:15px}
}

/* цели онбординга (ревизия 23) */
.goal-list{margin-bottom:1.25rem}
.goal-title{font-size:1rem;color:var(--gold);margin:0 0 .75rem;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid var(--border);padding-bottom:.5rem}
.goal-item{background:var(--panel2);border:1px solid var(--border);border-radius:6px;padding:.6rem .8rem;display:flex;align-items:center;gap:.6rem;font-size:.95rem;line-height:1.35;margin-bottom:.5rem}
.goal-marker{width:8px;height:8px;background:var(--gold);border-radius:50%;flex-shrink:0}
@media(max-width:640px){.goal-item{padding:.55rem .7rem}}

/* журнал (ревизия 31): фильтр-чипы, маркеры, свёртка дней */
.chip-row{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.75rem}
.chip{background:var(--panel2);border:1px solid var(--border);border-radius:999px;padding:.25rem .7rem;font-size:.8rem;cursor:pointer;color:var(--dim)}
.chip-on{background:var(--gold);color:#1a1410;border-color:var(--gold)}
.log-row{display:flex;align-items:flex-start;gap:.5rem;margin-bottom:.35rem}
.log-mark{flex-shrink:0;font-size:.95rem}
details.card>summary{list-style:none}
details.card>summary::-webkit-details-marker{display:none}
details.card[open]>summary{border-bottom:1px solid var(--border);padding-bottom:.4rem;margin-bottom:.5rem}
/* ревизия 33: хоткей-бейджи навигации */
.tab-nav .hk{display:inline-block;margin-left:4px;padding:0 4px;border:1px solid var(--border);border-radius:3px;font-size:10px;opacity:.65;vertical-align:middle}
```
## Graveyard/index.html
```
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title>Вечный покой</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#141317" />
  <link rel="icon" href="favicon.png" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Вечный покой" />
  <meta property="og:description" content="Текстовая игра про смотрителя кладбища: могилы, вскрытия, свечи и репутация до образцовой." />
  <meta property="og:image" content="preview.png" />
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <div id="app">
    <header id="top"></header>
    <nav id="tabs"></nav>
    <main id="content"></main>
  </div>
  <div id="modalRoot"></div>
  <script type="module" src="js/main.js"></script>
</body>
</html>
```
## Graveyard/js/core/bus.js
```
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
```
## Graveyard/js/core/flavor.js
```
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
```
## Graveyard/js/core/rng.js
```
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
```
## Graveyard/js/core/save.js
```
// СОХРАНЕНИЕ — конверт с версией формата {v:1, s:state} (ревизия 22).
// Читаются: конверт v:1, плоский сейв монолита (S с v:5), старая обёртка {version,state}.
// Испорченный сейв НЕ удаляется: уезжает в vp5_save_broken для разбора, load() возвращает null.
import { S, defaultState, log } from './state.js';
import { rng } from './rng.js';

const KEY = 'vp5_save';
const VERSION = 1;

export function save() {
  try {
    S.rngCount = rng.calls; // ревизия 28: позиция в rng-потоке уезжает в сейв (вариант B)
    localStorage.setItem(KEY, JSON.stringify({ v: VERSION, s: S }));
    return true;
  } catch (e) {
    return false;
  }
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    let parsed;
    try { parsed = JSON.parse(raw); } catch (e) { return recover(raw); }
    if (!parsed || typeof parsed !== 'object') return recover(raw);
    if (typeof parsed.v === 'number' && parsed.s && typeof parsed.s === 'object') return parsed.s;
    if (parsed.state && typeof parsed.state === 'object' && parsed.state.day !== undefined) return parsed.state;
    if (parsed.day !== undefined) return parsed;
    return recover(raw);
  } catch (e) {
    return null;
  }
}

function recover(raw) {
  log('Сейв повреждён — начата новая игра. Прошлая запись сохранена в vp5_save_broken.');
  try {
    if (!localStorage.getItem(KEY + '_broken')) localStorage.setItem(KEY + '_broken', raw);
    localStorage.removeItem(KEY);
  } catch (e) {}
  return null;
}

export function wipe() { try { localStorage.removeItem(KEY); } catch (e) {} }

// миграция: плоский сейв монолита и старая обёртка; дозаливает задатки новых полей,
// не трогая существующее. После — validate (ревизия 22).
export function migrate(data) {
  if (!data || typeof data !== 'object') return null;
  let s = data;
  if (data.state && typeof data.state === 'object' && data.state.day !== undefined) s = data.state;
  if (s.day === undefined) return null;
  const d = defaultState();
  for (const k of Object.keys(d)) if (s[k] === undefined) s[k] = d[k];
  if (!s.graves || !s.graves.length) s.graves = d.graves;
  for (const k of ['market', 'stats']) {
    if (!s[k]) s[k] = d[k];
    else for (const kk of Object.keys(d[k])) if (s[k][kk] === undefined) s[k][kk] = d[k][kk];
  if (Array.isArray(s.log)) for (const l of s.log) if (!l.t) l.t = 'info'; // ревизия 31: старым записям журнала — тип по умолчанию
  }
  return validate(s, d);
}

// валидация (ревизия 22): некорректные типы/значения падают на дефолт, не роняя игру
function num(s, k, d) { return typeof s[k] === 'number' && isFinite(s[k]) ? s[k] : d; }
export function validate(s, d) {
  s.day = Math.max(1, num(s, 'day', d.day));
  s.coins = Math.max(0, num(s, 'coins', d.coins));
  s.maxEnergy = Math.max(10, num(s, 'maxEnergy', d.maxEnergy));
  s.energy = Math.min(s.maxEnergy, Math.max(0, num(s, 'energy', s.maxEnergy)));
  s.rep = Math.max(0, num(s, 'rep', 0));
  // ревизия 28: позиция в rng-потоке; кэп защищает от зависания прокрутки на битом сейве
  s.rngCount = Math.min(1000000, Math.max(0, Math.floor(num(s, 'rngCount', 0))));
  s.science = Math.max(0, num(s, 'science', 0));
  if (!s.res || typeof s.res !== 'object') s.res = d.res;
  for (const k of Object.keys(d.res)) if (typeof s.res[k] !== 'number' || !isFinite(s.res[k]) || s.res[k] < 0) s.res[k] = 0;
  if (!Array.isArray(s.graves) || !s.graves.length) s.graves = d.graves;
  if (!s.market || typeof s.market !== 'object') s.market = d.market;
  if (!s.techs || typeof s.techs !== 'object') s.techs = {};
  if (!s.ach || typeof s.ach !== 'object') s.ach = {};
  if (!s.stats || typeof s.stats !== 'object') s.stats = d.stats;
  if (!Array.isArray(s.log)) s.log = [];
  if (!Array.isArray(s.corpses)) s.corpses = [];
  return s;
}
```
## Graveyard/js/core/state.js
```
// СОСТОЯНИЕ — defaultState дословно из монолита «Вечный покой 5.4» (data-restore)
export function defaultState() {
  {return{v:5,rngCount:0,sound:true,day:1,coins:40,energy:40,maxEnergy:40,rep:0,science:0,res:{fat:2,thread:2,seeds:2},gravesOpened:6,graves:Array.from({length:20},()=>({level:1,occ:null,deco:{}})),corpses:[],market:{candle:12,wax:7,fertilizer:10,ink:14,skull:30,flesh:4,stone:8,marble:35,brain:20,mushroom:6,firewood:5},techs:{},ach:{},crow:{active:false,order:null,done:0},plant:{owned:false,planted:false,readyDay:0,fert:false},donatedToday:0,tut:{on:true},pendingEvent:null,thief:null,rain:false,log:[],stats:{buried:0,candlesSold:0,scienceTotal:0,flowers:0,vagrantFed:false,digs:0,extracted:0,waxMade:0,candlesMade:0,sales:0,firstQuest:0,firstSellHint:0,rep20:0,rep50:0,rep100:0},endless:false}}
}

export let S = defaultState();

export function adopt(newState) {
  if (!newState) return S;
  // сохраняем ссылку на общий объект: мутации видны всем импортёрам
  Object.keys(S).forEach((k) => delete S[k]);
  Object.assign(S, newState);
  return S;
}
export function get() { return S; }

// хелперы — семантика монолита дословно (spend не удаляет нулевые остатки, как в 5.4)
// семантика монолита 5.4: have(res) возвращает КОЛИЧЕСТВО; с числом n — булево (>= n)
// (0 — falsy, так что старые проверки if (have(...)) работают как раньше)
export function have(item, n) { const c = S.res[item] || 0; return n === undefined ? c : c >= n; }
export function addRes(item, n = 1) { S.res[item] = (S.res[item] || 0) + n; }
export function spend(item, n) { if (have(item, n)) { S.res[item] -= n; return true; } return false; }
export function spendE(n) { if (S.energy < n) return false; S.energy -= n; return true; }

export function fmt(n) { return Number(Number(n).toFixed(1)).toLocaleString('ru-RU'); }
export function log(msg, t) { S.log.unshift({ day: S.day, text: msg, t: t || 'info' }); if (S.log.length > 120) S.log.pop(); } // ревизия 31: тип записи (info по умолчанию); ревизия 30: консольный хвост снят
```
## Graveyard/js/data/achievements.js
```
// ДОСТИЖЕНИЯ — тексты дословно из монолита «Вечный покой 5.4» (data-restore).
// Предикаты — дословные условия checkAch монолита, машинно-читаемые (никаких if-ов в логике).
import { TECHS } from './techs.js';

export const ACH = [
{id:'a1',n:'Первая страничка',d:'Провести первые похороны'},
{id:'a2',n:'Десятый постоялец',d:'10 похорон'},
{id:'a3',n:'Свечной магнат',d:'Продать 20 свечей'},
{id:'a4',n:'Учёный',d:'Накопить 50 науки за всё время'},
{id:'a5',n:'Образцовые могилы',d:'5 могил мрамора'},
{id:'a6',n:'Друг ворона',d:'5 выполненных заказов ворона'},
{id:'a7',n:'Зелёные пальцы',d:'Собрать 20 цветов'},
{id:'a8',n:'Старожил',d:'Прожить 30 дней'},
{id:'a9',n:'Милосердие',d:'Накормить бродягу'},
{id:'a10',n:'Эрудит',d:'Изучить все технологии'},
{id:'a11',n:'Тайник',d:'Иметь 500 монет разом'},
{id:'a12',n:'Образцовое кладбище',d:'Достичь 100 репутации'}]

export const TESTS = {
  a1: (s) => s.stats.buried >= 1,
  a2: (s) => s.stats.buried >= 10,
  a3: (s) => s.stats.candlesSold >= 20,
  a4: (s) => s.stats.scienceTotal >= 50,
  a5: (s) => s.graves.filter((g) => g.level === 3).length >= 5,
  a6: (s) => s.crow.done >= 5,
  a7: (s) => s.stats.flowers >= 20,
  a8: (s) => s.day >= 30,
  a9: (s) => s.stats.vagrantFed,
  a10: (s) => Object.keys(s.techs).length >= TECHS.length,
  a11: (s) => s.coins >= 500,
  a12: (s) => s.rep >= 100,
};

// логика монолита дословно; UI-вызовы вынесены в колбэки
export function checkAch(s, hooks = {}) {
  const grant = (id) => {
    if (!s.ach[id]) {
      s.ach[id] = true;
      const a = ACH.find((x) => x.id === id);
      if (hooks.onAch) hooks.onAch(id, a);
    }
  };
  for (const id of Object.keys(TESTS)) if (TESTS[id](s)) grant(id);
  if (s.rep >= 100 && !s.endless) { s.endless = true; if (hooks.onVictory) hooks.onVictory(); }
}
```
## Graveyard/js/data/church.js
```
// ЦЕРКОВЬ — дословно из монолита «Вечный покой 5.4» (data-restore)
// Стандарт 6.0: UI-вызовы — в возвращаемых объектах; монеты живут в S.coins,
// монолитовский spend('coins',20) молча проваливался — честная проверка с тостом.
import { S, spendE } from '../core/state.js';

export function donate() {
  if (S.donatedToday >= 5) return { ok: false, toast: 'Отец Серапион мягко намекает, что и кладбище требует внимания.', sfx: 'error' };
  // стандарт 6.0: честная проверка монет (в 5.4 spend('coins') молча проваливался)
  if (S.coins < 20) return { ok: false, toast: 'Не хватает монет', sfx: 'error' };
  S.coins -= 20;
  S.donatedToday++;
  const r = S.techs.orator ? 2 : 1;
  S.rep += r;
  return { ok: true, toast: 'Пожертвование принято: +' + r + '⭐', sfx: 'coin' };
}

export function preach() {
  if (!spendE(5)) return { ok: false, toast: 'Слишком мало энергии', sfx: 'error' };
  // ревизия 25: порог 50⭐ — церковь запомнила смотрителя
  const gain = 2 + (S.rep >= 50 ? 1 : 0);
  S.science += gain;
  S.stats.scienceTotal += gain;
  return { ok: true, toast: 'Проповедь удалась: +' + gain + '📜' + (gain > 2 ? ' (+1 за репутацию 50+)' : '') };
}
```
## Graveyard/js/data/craft.js
```
// КРАФТ — дословно из монолита «Вечный покой 5.4» (data-restore)
// Стандарт 6.0: UI-вызовы — в возвращаемых объектах.
// Ревизия 28: атомарные траты — сначала проверяется ВСЁ (энергия и ресурсы), потом списывается
// ВСЁ одним пакетом. Причуда 5.4 «энергия тратится первой, до проверки ресурсов» починена:
// раньше нехватка жира съедала энергию, а нехватка нити — уже списанный воск.
import { S, spendE, spend, addRes, have } from '../core/state.js';
import { ITEMS } from './items.js';

// общий паттерн: e — энергия, req — [['res', n], ...]. Отказ — если чего-то не хватает; иначе списывает всё.
function pay(e, req) {
  if (e > 0 && S.energy < e) return { ok: false, toast: 'Слишком мало энергии', sfx: 'error' };
  const miss = (req || []).filter(([k, n]) => !have(k, n));
  if (miss.length) return { ok: false, toast: 'Не хватает: ' + miss.map(([k]) => (ITEMS[k] ? ITEMS[k].i + ' ' + ITEMS[k].n : k)).join(', '), sfx: 'error' };
  if (e > 0) spendE(e);
  (req || []).forEach(([k, n]) => spend(k, n));
  return { ok: true };
}

export function makeWax() {
  const f = pay(3, [['fat', 2]]);
  if (!f.ok) return f;
  addRes('wax', 1); S.stats.waxMade++;
  return { ok: true, toast: 'Воск готов. Печь доволен.' };
}

export function makeWaxGustav() {
  // стандарт 6.0: монеты живут в S.coins — spend('coins') не работает; монеты проверяем ДО pay
  if (S.energy < 3) return { ok: false, toast: 'Слишком мало энергии', sfx: 'error' };
  if (!have('fat', 2)) return { ok: false, toast: 'Не хватает: \u{1FAD7} Жир', sfx: 'error' };
  if (S.coins < 4) return { ok: false, toast: 'Не хватает монет', sfx: 'error' };
  spendE(3); spend('fat', 2); S.coins -= 4;
  addRes('wax', 1);
  return { ok: true, toast: 'Густав: «Воск как слеза». Справились.' };
}

export function makeCandle() {
  const f = pay(3, [['wax', 1], ['thread', 1]]);
  if (!f.ok) return f;
  addRes('candle', 1); S.stats.candlesMade++;
  return { ok: true, toast: 'Свеча ровная и честная. Таких в деревне уважают.', sfx: 'coin' };
}

export function makeFlour() {
  const f = pay(2, [['bones', 2]]);
  if (!f.ok) return f;
  addRes('flour', 1);
  return { ok: true, toast: 'Костная мука готова.' };
}

export function makeFert() {
  const f = pay(2, [['flour', 2], ['water', 1]]);
  if (!f.ok) return f;
  addRes('fertilizer', 1);
  return { ok: true, toast: 'Удобрение готово. Клумба будет в восторге.' };
}

export function studyBrain() {
  const f = pay(4, [['brain', 1]]);
  if (!f.ok) return f;
  S.science += 3; S.stats.scienceTotal += 3;
  return { ok: true, toast: 'Мозг изучен: +3\u{1F4DC}. Чужие мысли стали твоими.', sfx: 'ach' };
}

export function makeInk() {
  const f = pay(2, [['blood', 1], ['water', 1]]);
  if (!f.ok) return f;
  addRes('ink', 1);
  return { ok: true, toast: 'Чернила густые, как совесть при жизни.' };
}

export function makeElixir() {
  const f = pay(3, [['flowers', 2], ['water', 2]]);
  if (!f.ok) return f;
  addRes('elixir', 1);
  return { ok: true, toast: 'Эликсир готов. Цветы, вода и терпение — вот и вся магия.' };
}

export function makeBalsam() {
  const f = pay(3, [['water', 2], ['flowers', 2]]);
  if (!f.ok) return f;
  addRes('balsam', 1);
  return { ok: true, toast: 'Бальзам готов. Аромат — достойный последнего пути.' };
}

// ревизия 26: грибной отвар — лесной энергоноситель (дешевле кофе по монетам, но нужны грибы)
export function makeBroth() {
  const f = pay(2, [['mushroom', 2], ['water', 1]]);
  if (!f.ok) return f;
  addRes('broth', 1);
  return { ok: true, toast: 'Отвар готов. Пахнет лесом и немного — сыростью.' };
}

// useItem — дословно (кофе +10⚡, эликсир +25⚡ с кэпом от maxEnergy); трата одна — уже атомарна
export function useItem(it) {
  if (it === 'coffee') {
    if (!spend('coffee', 1)) return { ok: false, silent: true };
    S.energy = Math.min(S.maxEnergy, S.energy + 10);
    return { ok: true, fx: '+10⚡', toast: 'Приятно. Голова ясная, руки лёгкие.' };
  }
  if (it === 'broth') {
    if (!spend('broth', 1)) return { ok: false, silent: true };
    S.energy = Math.min(S.maxEnergy, S.energy + 10);
    return { ok: true, fx: '+10⚡', toast: 'Приятно. Голова ясная, руки лёгкие.' };
  }
  if (it === 'elixir') {
    if (!spend('elixir', 1)) return { ok: false, silent: true };
    S.energy = Math.min(S.maxEnergy, S.energy + 25);
    return { ok: true, fx: '+25⚡', toast: 'Приятно. Голова ясная, руки лёгкие.' };
  }
  return { ok: false, silent: true };
}

// диспетчер крафта (стандарт 6.0): id кнопки -> функция
export function craftAction(id) {
  switch (id) {
    case 'wax': return makeWax();
    case 'wax-gustav': return makeWaxGustav();
    case 'candle': return makeCandle();
    case 'flour': return makeFlour();
    case 'fert': return makeFert();
    case 'brain': return studyBrain();
    case 'ink': return makeInk();
    case 'elixir': return makeElixir();
    case 'balsam': return makeBalsam();
    case 'broth': return makeBroth();
  }
  return { ok: false, silent: true };
}
```
## Graveyard/js/data/crow.js
```
// ВОРОН И ЗАКАЗЫ — дословно из монолита «Вечный покой 5.4» (data-restore).
// UI-вызовы вынесены в возвращаемые объекты (стандарт 6.0).
// Ревизия 28: при неполном заказе — честный тост с перечнем недостающего вместо
// молчаливого отказа (причуда 5.4 починена по согласованию в QA-чистке).
import { S, have, spend, log } from '../core/state.js';
import { ITEMS } from './items.js';

export const CROW_ORDERS = [
{n:'Свечи для паломников',need:{candle:5},reward:{coins:40,science:3}},
{n:'Черепа для учёного',need:{skull:2},reward:{coins:60}},
{n:'Цветы для вдовы',need:{flowers:6},reward:{coins:20,rep:3}},
{n:'Чернила для нотариуса',need:{ink:3},reward:{coins:35,science:2}},
{n:'Удобрение для фермера',need:{fertilizer:4},reward:{coins:30}}];

export function orderReady() {
  const o = S.crow.order;
  if (!o) return false;
  return Object.keys(o.need).every(r => have(r) >= o.need[r]);
}

export function crowOrderText(o) { return o.n }

export function doOrder() {
  const o = S.crow.order;
  if (!o) return { ok: false, silent: true };
  const miss = Object.keys(o.need)
    .filter(r => have(r) < o.need[r])
    .map(r => (ITEMS[r] ? ITEMS[r].i + ' ' + ITEMS[r].n : r) + ' ×' + o.need[r]);
  if (miss.length) return { ok: false, toast: 'Ворон заглянул в сумку и не нашёл: ' + miss.join(', '), sfx: 'error' };
  Object.keys(o.need).forEach(r => spend(r, o.need[r]));
  const rw = o.reward;
  // ревизия 25: порог 100⭐ — деревня знает смотрителя, заказ платит ×1.25
  const mult = S.rep >= 100 ? 1.25 : 1;
  if (rw.coins) S.coins += Math.round(rw.coins * mult);
  if (rw.science) { S.science += rw.science; S.stats.scienceTotal += rw.science; }
  if (rw.rep) S.rep += rw.rep;
  S.crow.order = null;
  S.crow.done++;
  log('Ворон получил своё: «' + o.n + '». Взгляд одобряющий.', 'crow');
  return { ok: true, toast: '🐦‍⬛ Заказ сдан: ' + o.n + (mult > 1 ? ' (×1.25 за репутацию 100+)' : ''), sfx: 'ach' };
}
```
## Graveyard/js/data/day.js
```
import { S, adopt, get, log, spend, spendE, have, addRes } from '../core/state.js';
import { rng } from '../core/rng.js';
import { GRAVE_NAMES } from './texts.js';
import { CROW_ORDERS } from './crow.js';
import { sellPrice } from './market.js';
import { ITEMS } from './items.js';
import { OCCS_PAIRS, TRAIT_PAIRS, WISHES } from './stories.js';
import { NAMES_M } from './texts.js';
import { checkThresholds } from './rep.js';

// newDay — переход дня (ревизия 34: контракт {ok, victory}, поле toasts снято —
// за всю жизнь проекта ни разу не наполнялось; все сообщения идут через log()).
// morningEvent — дословно из монолита 5.4 (Math.random -> rng, window._thief -> thief).
export function newDay() {
  S.day++;
  S.rain = false;
  S.corpses.forEach(c => c.days++);
  const bad = S.corpses.filter(c => c.days > 2);
  if (bad.length) {
    const pen = bad.length;
    S.rep = Math.max(0, S.rep - pen);
    log('Тела в морге просрочены: репутация −' + pen + '. Ворон посмотрел строго.', 'event');
  }
  if (rng.next() < 0.6) {
    // ревизия 30: честная треугольная — сумма двух вызовов rng (0..2), звёзды 1..5,
    // выброс за кламп исключён по построению. Распределение: 1★ 3.1% / 2★ 25% / 3★ 43.8% / 4★ 25% / 5★ 3.1%.
    const r2 = rng.next() + rng.next();
    const st = 1 + Math.round(r2 * 2);
    const cap = S.techs.logistics ? 2 : 1;
    if (S.corpses.length < cap) {
      // ревизия 24: тело прибывает с историей (имя, занятие, черта, воля, родные)
      // ревизия 27: имя и пол — ОДНИМ вызовом rng (индекс в общем пуле 80).
      // На историю по-прежнему ровно 5 вызовов rng — дрейф цен живых сейвов не сдвигается.
      const idx = Math.floor(rng.next() * GRAVE_NAMES.length);
      const sex = idx < NAMES_M.length ? 'm' : 'f';
      const nm = GRAVE_NAMES[idx];
      const story = {
        name: nm,
        sex,
        occ: OCCS_PAIRS[Math.floor(rng.next() * OCCS_PAIRS.length)][sex === 'f' ? 1 : 0],
        trait: TRAIT_PAIRS[Math.floor(rng.next() * TRAIT_PAIRS.length)][sex === 'f' ? 1 : 0],
        wish: WISHES[Math.floor(rng.next() * WISHES.length)].id,
        family: rng.next() < 0.4 ? 1 : 0
      };
      S.corpses.push({ stars: st, days: 0, extracted: 0, parts: { skull: true, brain: true, blood: true, fat: true, bones: true, flesh: true }, ...story });
      log('Ночью привезли постояльца: ' + nm + ' (' + '★'.repeat(st) + '). ' + story.occ + ', ' + story.trait + '. Повозка скрылась в тумане.', 'event');
    }
  }
  S.marketPrev = { ...S.market };
  S.market = {
    candle: 12 + (rng.next() * 4 - 2),
    wax: 7 + (rng.next() * 2 - 1),
    fertilizer: 10 + (rng.next() * 3 - 1.5),
    ink: 14 + (rng.next() * 4 - 2),
    skull: 30 + (rng.next() * 8 - 4),
    brain: 20 + (rng.next() * 6 - 3),
    flesh: 4 + (rng.next() - 0.5),
    stone: 8 + (rng.next() * 2 - 1),
    marble: 35 + (rng.next() * 6 - 3),
    mushroom: 6 + (rng.next() * 2 - 1),
    firewood: 5 + (rng.next() * 2 - 1),
  };
  // цены с одним знаком после запятой — хвосты не рождаются (ревизия 22)
  for (const k in S.market) S.market[k] = Math.round(S.market[k] * 10) / 10;
  if (S.techs.accountant) S.coins += 2 * S.graves.filter(g => g.occ).length;
  S.donatedToday = 0;
  if (S.rep >= 10 && !S.crow.active) {
    S.crow.active = true;
    log('Ворон признал тебя за равного: у ограды теперь есть дела.', 'crow');
  }
  if (S.crow.active && !S.crow.order && rng.next() < 0.4) {
    S.crow.order = CROW_ORDERS[Math.floor(rng.next() * CROW_ORDERS.length)];
    log('Ворон принёс заказ: «' + S.crow.order.n + '». Птица деловая.', 'crow');
  }
  S.energy = S.maxEnergy;
  checkThresholds(); // ревизия 25: пороги могли быть пересечены вкладами/заказами за день
  const victory = victoryCheck();
  return { ok: true, victory };
}
// ---------- утренние события ----------
// ревизия 31: thief и pendingEvent живут в состоянии S — переживают перезагрузку (save() идёт после morningEvent).

export function morningEvent() {
  // ревизия 31: незакрытое событие из сейва возвращается БЕЗ переролла (0 вызовов rng)
  if (S.pendingEvent) return S.pendingEvent;
  const rolls = [];
  if (S.corpses.some(c => c.days > 2)) rolls.push({ w: 3, id: 'evInspector' });
  rolls.push({ w: 2, id: 'evQuiet' }, { w: 1, id: 'evRain' }, { w: 1, id: 'evPilgrims' },
    { w: 1, id: 'evVagrant' }, { w: 1, id: 'evThief' }, { w: 1, id: 'evComet' },
    { w: 1, id: 'evFind' }, { w: 1, id: 'evGustavDeal' }, { w: 1, id: 'evVolunteers' }, { w: S.rain ? 2 : 1, id: 'evMushrooms' }, { w: 1, id: 'evWoodcutter' }, { w: 1, id: 'evChild' });
  const total = rolls.reduce((a, b) => a + b.w, 0);
  let r = rng.next() * total;
  let ev = rolls[0];
  for (const it of rolls) { if (r < it.w) { ev = it; break; } r -= it.w; }
  S.pendingEvent = EV[ev.id]();
  return S.pendingEvent;
}

const EV = {
  evQuiet() {
    return { id: 'quiet', title: 'Тихое утро', text: 'Утро выдалось тихим. Ворон дремлет на ограде, трава в росе, и только где-то вдалеке лает собака. Деревня живёт своей жизнью, не подозревая, сколько дел у её кладбища.', btn: 'Доброе утро' };
  },
  evRain() {
    S.rain = true;
    return { id: 'rain', title: 'Дождь', text: 'Небо затянуло тучами. Глина размокла, лопата идёт тяжело: копка сегодня дороже по энергии. Зато клумба рада — и земля дышит.', btn: 'Не тужи' };
  },
  evPilgrims() {
    const n = Math.min(have('candle'), 5);
    if (n > 0) {
      const p = Math.round(sellPrice(S, 'candle') * 1.5 * n);
      spend('candle', n); S.coins += p; S.stats.candlesSold += n;
      return { id: 'pilgrims', title: 'Паломники', text: 'Со стороны тракта донеслась песня — паломники идут мимо на ярмарку. Они купили у тебя ' + n + ' свечей по щедрой цене: +' + p + '💰. Паломники верят, что свет в пути начинается с тебя.', btn: 'Славно' };
    }
    return { id: 'pilgrims', title: 'Паломники', text: 'Со стороны тракта донеслась песня — паломники идут мимо на ярмарку. Они заглянули за свечами, но у тебя их нет. Вздохнули и пошли дальше: «Смотритель нынче, видать, запаслив, да не в ту сторону».', btn: 'Обидно' };
  },
  evVagrant() {
    return { id: 'vagrant', title: 'Бродяга у ворот', text: 'У ворот стоит бродяга — грязный, но с ясным взглядом. «Хлеба бы, господин смотритель. А я тебе и помолюсь, и расскажу, что слышал в дороге».', choices: [{ id: 'feed', label: 'Накормить (5💰)' }, { id: 'shoo', label: 'Прогнать' }] };
  },
  evThief() {
    S.thief = null; let stolen = '';
    const pool = ['candle', 'wax', 'bones', 'flowers', 'ink', 'fat', 'flour'];
    const avail = pool.filter(k => have(k) >= 2);
    if (S.coins >= 10) avail.push('_coins');
    if (avail.length) {
      const k = avail[Math.floor(rng.next() * avail.length)];
      if (k === '_coins') { S.coins -= 10; S.thief = { k: 'coins', n: 10 }; stolen = 'горстку монет (10💰)'; }
      else { S.res[k] -= 1; S.thief = { k, n: 1 }; stolen = ITEMS[k].i + ' ' + ITEMS[k].n.toLowerCase() + ' ×1'; }
    }
    return { id: 'thief', title: 'Ночной вор', text: 'Ночью кто-то рылся в сарае. Следы грязи ведут в сторону леса.' + (stolen ? ' Сверившись с полками, ты понял: пропало ' + stolen + '.' : ' Воровать, впрочем, было нечего: сундук почти пуст. Хоть вор честный.'), choices: [{ id: 'find', label: 'Искать (10⚡)' }, { id: 'forgive', label: 'Простить' }] };
  },
  evInspector() {
    const bad = S.corpses.filter(c => c.days > 2).length;
    if (bad > 0) {
      const pen = S.techs.diplomat ? 2 : 5;
      S.rep = Math.max(0, S.rep - pen);
      return { id: 'inspector', title: 'Инспектор', text: 'Инспектор епархии прошёл по кладбищу с блокнотом и тонкой улыбкой. Записал: «' + bad + ' тел в состоянии, несовместимом с понятием „покой“». Репутация −' + pen + '. «Разберитесь, — сказал он, — епархия не любит запахов».', btn: 'Оплеуха' };
    }
    S.rep += 1;
    return { id: 'inspector', title: 'Инспектор', text: 'Инспектор епархии прошёл по кладбищу с блокнотом. Морг чист, могилы ухожены, свечи ровные. Он поставил галочку и впервые улыбнулся: «Порядок, смотритель. Так держать». Репутация +1.', btn: 'Комплимент' };
  },
  evComet() {
    S.science = (S.science || 0) + 3; S.stats.scienceTotal = (S.stats.scienceTotal || 0) + 3;
    return { id: 'comet', title: 'Комета', text: 'Ночью над кладбищем прошла комета. Старожилы говорят: это к знаниям. Ворон смотрел на небо так, будто знал расписание. +3📜.', btn: 'Знаки' };
  },
  evFind() {
    addRes('stone', 2);
    return { id: 'find', title: 'Старый киот', text: 'В дальнем углу кладбища провалился старый киот. Под ним — аккуратно сложенные камни. Дядюшка любил порядок даже в руинах. +2🪨.', btn: 'Находка' };
  },
  evGustavDeal() {
    return { id: 'gustavDeal', title: 'Густав с тележкой', text: 'Густав привёз тележку жира: «Распродажа, смотритель. Всего 4💰 за штуку, пока не кончилось». Жир — товар деликатный, долго не лежит.', choices: [{ id: 'gustav-fat', label: 'Взять' }] };
  },
  evVolunteers() {
    return { id: 'volunteers', title: 'Волонтёры', text: 'Пришли волонтёры с метлами: «Говорят, у вас тут образцовое кладбище будет. Дайте маршрут — и мы нажмём». Убраться силами добрых людей стоит 5 монет на чай.', choices: [{ id: 'volunteer', label: 'Угостить (5💰)' }, { id: 'volunteer-no', label: 'Вежливо отказать' }] };
  },
  evMushrooms() {
    return { id: 'mush', title: 'Грибы после дождя', text: 'Ночью промочило — и под елями вылезли шляпки, целые полки. Лес как будто сам зовёт: забирай, пока солнце.', choices: [{ id: 'pick-mush', label: 'Собрать (5⚡)' }, { id: 'mush-no', label: 'Не лезть' }] };
  },
  evWoodcutter() {
    return { id: 'woodcutter', title: 'Дровосек Матвей', text: 'У опушки Матвей валит сухостой, бревно за бревном. «Поможешь, смотритель? Половина дров — твоя, я не жадный».', choices: [{ id: 'help-cut', label: 'Помочь (10⚡)' }, { id: 'cut-no', label: 'Не лезть' }] };
  },
  evChild() {
    return { id: 'child', title: 'Ребёнок у ручья', text: 'У ручья кричат: пропала Марьяшкина девочка — видели в сторону леса. Ручей после дождя шумит, и это не к добру.', choices: [{ id: 'search-child', label: 'Искать (10⚡)' }, { id: 'wait-home', label: 'Ждать у дома' }] };
  },
};

// действия выбора — дословно из монолита (spend('coins') -> честная проверка S.coins, стандарт 6.0)
export function eventAction(id) {
  switch (id) {
    case 'feed':
      if (S.coins < 5) return { ok: false, toast: 'Не хватает монет' , sfx: 'error' };
      S.coins -= 5; S.rep += 2; S.stats.vagrantFed = true;
      log('Накормил бродягу у ворот. Он помолился — и, кажется, искренне.', 'event');
      return { ok: true, toast: 'Репутация +2. Милосердие в цене.' };
    case 'shoo':
      if (S.techs.diplomat) log('Прогнал бродягу так вежливо, что он извинился. Дипломатия — наука.', 'event');
      else { S.rep = Math.max(0, S.rep - 1); log('Прогнал бродягу. Деревня видела — и запомнила.', 'event'); }
      return { ok: true };
    case 'find': {
      if (!spendE(10)) return { ok: false, toast: 'Слишком мало энергии' , sfx: 'error' };
      if (rng.next() < 0.5) {
        let got = '25💰 как утешительный приз';
        if (S.thief) {
          got = (S.thief.k === 'coins' ? 'монеты обратно' : ITEMS[S.thief.k].i + ' ' + ITEMS[S.thief.k].n + ' обратно');
          if (S.thief.k === 'coins') S.coins += S.thief.n; else addRes(S.thief.k, S.thief.n);
          S.thief = null;
        } else { S.coins += 25; }
        log('Догнал вора в лесу. Вернул добычу и добавил наставлений. Лес запомнил.', 'event');
        return { ok: true, toast: 'Вор пойман: ' + got };
      }
      log('Обшарил весь лес, но следы потерялись в папоротниках. Утро потрачено не зря — почти.', 'event');
      return { ok: true, toast: 'Удача отвернулась' };
    }
    case 'forgive':
      S.rep += 1;
      log('Простил вора. Кто-то из деревни видел это и оценил.', 'event');
      return { ok: true, toast: 'Репутация +1' };
    case 'gustav-fat':
      if (S.coins < 12) return { ok: false, toast: 'Не хватает монет' , sfx: 'error' };
      S.coins -= 12; addRes('fat', 3);
      return { ok: true, toast: 'Жир ×3 за 12💰. Выгодно.' };
    case 'volunteer':
      if (S.coins < 5) return { ok: false, toast: 'Не хватает монет' , sfx: 'error' };
      S.coins -= 5; S.rep += 1;
      log('Волонтёры прибрались на кладбище. Чай был горячим, метлы — весёлыми.', 'event');
      return { ok: true, toast: 'Репутация +1' };
    case 'pick-mush': {
      if (!spendE(5)) return { ok: false, toast: 'Слишком мало энергии' , sfx: 'error' };
      const n = 2 + Math.floor(rng.next() * 2);
      addRes('mushroom', n);
      log('Собрал грибы в чаще: ×' + n + '. Корзина полна, дождь окупился.', 'forest');
      return { ok: true, toast: 'Грибы ×' + n };
    }
    case 'help-cut': {
      if (!spendE(10)) return { ok: false, toast: 'Слишком мало энергии' , sfx: 'error' };
      addRes('firewood', 4);
      log('Помогал Матвею валить сухостой. Половина дров — моя, как договаривались.', 'forest');
      return { ok: true, toast: 'Хворост ×4' };
    }
    case 'search-child': {
      if (!spendE(10)) return { ok: false, toast: 'Слишком мало энергии' , sfx: 'error' };
      if (rng.next() < 0.5) {
        S.rep += 3;
        log('Нашёл ребёнка у ручья, вытащил на берег и унёс домой. Мать плакала и смеялась одновременно.', 'event');
        return { ok: true, toast: 'Ребёнок найден: +3⭐' };
      }
      log('Обошёл чащу вдоль и поперёк — след затерялся. Потом мальчишку вывели волонтёры; наука тут не поможет.', 'event');
      return { ok: true, toast: 'Не нашёл' };
    }
    case 'wait-home':
      S.rep = Math.max(0, S.rep - 2);
      log('Ждал у дома, как учил дядюшка: «Смотритель смотрит, а не бегает». Ребёнка нашли чужие — деревня запомнила.', 'event');
      return { ok: true, toast: 'Репутация −2' };
    default:
      return { ok: true };
  }
}

// victoryCheck — дословная логика монолита (showVictory уходит в main.js: data-слой без DOM).
export function victoryCheck(){if(S.rep>=100&&!S.endless){S.endless=true;return true}return false}
```
## Graveyard/js/data/forest.js
```
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
```
## Graveyard/js/data/garden.js
```
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
```
## Graveyard/js/data/goals.js
```
import { S, log } from '../core/state.js';
import { ONBOARDING_LINES } from './texts.js';

// 6.0-надстройка (ревизия 23): онбординг — ближайшие цели в журнале.
// Предикаты переиспользуют счётчики туториала/stats — никаких новых счётчиков.
export const GOALS=[
  {id:'first_burial',text:()=>'Проведите первые похороны — деревня ждёт.',check:(s)=>(s.stats.buried||0)===0},
  {id:'first_tech',text:()=>'Изучите первую технологию — наука копится, но тратится только здесь.',check:(s)=>Object.keys(s.techs||{}).length===0},
  {id:'rep',text:(s)=>{const r=s.rep||0;if(r<20)return'Доведите репутацию до 20⭐ (сейчас '+r+').';if(r<50)return'Доведите репутацию до 50⭐ (сейчас '+r+').';return'Доведите репутацию до 100⭐ (сейчас '+r+').';},check:(s)=>(s.rep||0)<100}
];

export function activeGoals(){ return GOALS.filter((g)=>g.check(S)); }

// первое поручение — день 1, при включённом туториале, один раз (идемпотентно: зовётся из boot и resetGame)
export function maybeFirstQuest(){
  if (S.day===1 && S.tut.on && !S.stats.firstQuest){ S.stats.firstQuest=1; log(ONBOARDING_LINES.firstQuest, 'quest'); }
}
```
## Graveyard/js/data/items.js
```
// ПОЛНЫЙ РЕЕСТР ПРЕДМЕТОВ — дословно из монолита «Вечный покой 5.4» (data-restore)
export const ITEMS = {
coins:{n:'Монеты',i:'💰',d:'Звенящая валюта деревни. Густав любит повторять: «Монеты мертвы, но всегда в хорошей форме».'},
energy:{n:'Энергия',i:'⚡',d:'Твои силы. Восстанавливаются за сном, кофе и правильным настроением.'},
rep:{n:'Репутация',i:'⭐',d:'Что о тебе думает деревня и епархия. До 100 — образцовое кладбище.'},
science:{n:'Наука',i:'📜',d:'Знания, добытые за столом и в лаборатории. Топливо технологий.'},
fat:{n:'Жир',i:'🫗',d:'Ресурс сомнительного происхождения. Превращается в воск на печи.'},
wax:{n:'Воск',i:'🕯️',d:'Основной товар деревни. Пахнет мёдом и немного — виной.'},
candle:{n:'Свеча',i:'🕯',d:'Свет для живых и мёртвых. Продай на рынке или укрась могилу.'},
thread:{n:'Нить',i:'🧵',d:'Покупается у Густава. Без неё фитиль не свить.'},
bones:{n:'Кости',i:'🦴',d:'Из земли и из морга. Мелются в костную муку.'},
flour:{n:'Костная мука',i:'🥣',d:'Молотые кости. Пахнет старыми обещаниями.'},
fertilizer:{n:'Удобрение',i:'🌱',d:'Питательный грунт для клумб: кости честно отрабатывают своё.'},
blood:{n:'Кровь',i:'🩸',d:'Тёмная и густая. Основа чернил и пары несвязанных загадок.'},
ink:{n:'Чернила',i:'🖋️',d:'Идеальны для писем и расписок. Не спрашивай, из чего.'},
brain:{n:'Мозг',i:'🧠',d:'Хранилище чужих мыслей. Изучается ради науки или продаётся коллекционерам с непритязательными запросами.'},
skull:{n:'Череп',i:'💀',d:'Голова бывшего соседа. Добывается только вскрытием в морге. Дорогая редкость: коллекционеры, ворон и наука.'},
flesh:{n:'Плоть',i:'🥩',d:'Густав покупает её не глядя. Мы тоже не будем.'},
flowers:{n:'Цветы',i:'🌸',d:'С клумбы. Свежие — на могилу и в бальзам.'},
seeds:{n:'Семена',i:'🌾',d:'Посадишь сегодня — соберёшь завтра.'},
stone:{n:'Камень',i:'🪨',d:'Для добротных каменных могил (ур. 2).'},
marble:{n:'Мрамор',i:'🪦',d:'Дорогая роскошь. Могилы ур. 3 для особых постояльцев.'},
water:{n:'Вода',i:'💧',d:'Для растворов, чернил и бальзама.'},
coffee:{n:'Кофе',i:'☕',d:'+10 энергии. Густав варит на славу.'},
balsam:{n:'Бальзам',i:'🧴',d:'Ароматная мазь для бальзамирования: +3 к качеству похорон.'},
mushroom:{n:'Грибы',i:'🍄',d:'Лесной урожай после дождя. В отвар, на сковороду или на рынок — хоть в похоронном меню.'},
firewood:{n:'Хворост',i:'🪵',d:'Сухие ветки и поленья. Печь любит, и сухостой тоже.'},
broth:{n:'Грибной отвар',i:'🍲',d:'+10 энергии при употреблении. Сытно, тепло, грибы честные.'},
elixir:{n:'Эликсир',i:'⚗️',d:'+25 энергии при употреблении. Настой на цветах и родниковой воде — совесть чиста.'}}

// инвентарные предметы — дословно из монолита
export const INV = ['fat','wax','candle','thread','bones','flour','fertilizer','blood','ink','brain','skull','flesh','flowers','seeds','stone','marble','water','coffee','balsam','elixir','mushroom','firewood','broth']

// совместимость со схемой §4.1 ARCHITECTURE: поверх монолитных n/i/d
export function meta(id) {
  const it = ITEMS[id] || {};
  return { id, name: it.n || id, icon: it.i || '', desc: it.d || '', price: it.price ?? 0, ...it };
}

// реестр продаваемых на рынке — дословно из монолита
export const SELLABLE = ['candle', 'wax', 'fertilizer', 'ink', 'skull', 'flesh', 'brain', 'mushroom', 'firewood'];
```
## Graveyard/js/data/market.js
```
// РЫНОК И ГУСТАВ — дословно из монолита «Вечный покой 5.4» (data-restore)

// цены рынка — из defaultState монолита (дрейфуют в newDay монолита, перенос на этапе day-cycle)
export const MARKET = { candle: 12, wax: 7, fertilizer: 10, ink: 14, skull: 30, flesh: 4, stone: 8, marble: 35, brain: 20, mushroom: 6, firewood: 5 };

// sellPrice() из монолита дословно (S передаётся явно)
export function sellPrice(s, it) {
  let p = s.market[it] || 0;
  if (s.techs.trade) p *= 1.15;
  if (it === 'candle' && s.techs.candlemaster) p += 3;
  return p;
}

// ассортимент Густава — дословно (buys); мрамор зависит от технологии
export function buys(s) {
  const base = [['thread', 3, 'Рулон нити'], ['stone', 8, 'Камень'], ['marble', s.techs.marble ? 22 : 25, 'Мрамор'],
          ['water', 2, 'Вода'], ['coffee', 10, 'Кофе'], ['seeds', 5, 'Семена'], ['fat', 6, 'Жир про запас']];
  // ревизия 25: порог 20\u2b50 — Густав продаёт воск партией ×5 (30💰 против 35 поштучно)
  if (s.rep >= 20) base.push(['wax', 30, 'Воск партией ×5', 5]);
  return base;
}

import { S, spend, addRes, fmt, log } from '../core/state.js';
import { ITEMS } from './items.js';
import { ONBOARDING_LINES } from './texts.js';
import { TECHS } from './techs.js';

// sellItem() из монолита дословно (render() и floatTxt() убраны — их делает оболочка)
export function sellItem(it, n) {
  n = n || 1;
  if (!spend(it, n)) return { ok: false, silent: true };
  const p = Math.round(sellPrice(S, it) * n * 10) / 10;
  S.coins += p;
  if (it === 'candle') S.stats.candlesSold += n;
  S.stats.sales += n; // ревизия 30: статистика продаж (туториал шаг 7)
  if (!S.stats.firstSellHint) { S.stats.firstSellHint = 1; log(ONBOARDING_LINES.sellHint, 'money'); }
  // ревизия 29: стандарт 6.0 — UI-вызовы (toast/sfx) ушли в возвращаемый объект
  return { ok: true, toast: 'Продано: ' + ITEMS[it].n + ' ×' + n + ' за ' + fmt(p) + '💰', sfx: 'coin' };
}

// sellGustav() из монолита дословно — скупка по 0.8 рыночной цены
export function sellGustav(it) {
  if (!spend(it, 1)) return { ok: false, silent: true };
  const p = Math.round(sellPrice(S, it) * .8);
  S.coins += p;
  if (it === 'candle') S.stats.candlesSold++;
  S.stats.sales++; // ревизия 30: статистика продаж (скупка Густава)
  return { ok: true, toast: '+' + p + '💰', sfx: 'coin' };
}

// buyRes() из монолита дословно, с фиксом бага монолита (см. шапку)
export function buyRes(it, p, n) {
  n = n || 1;
  if (S.coins < p) return { ok: false, toast: 'Не хватает монет', sfx: 'error' };
  S.coins -= p;
  addRes(it, n);
  return { ok: true, toast: 'Куплено: ' + ITEMS[it].n + (n > 1 ? ' ×' + n : ''), sfx: 'coin' };
}

// learn(id) из монолита дословно — по стандарту 6.0: UI-вызовы в возвращаемом объекте
// (конвенция donate/preach), checkAch — глобальный в refresh() (рев. 31). Причуда-баг 5.4
// (needCheck([['science',cost]]) звал have('science') при науке в S.science — кнопки были
// вечно задизейблены) исправлена: честная проверка S.science здесь и в needs.js.
export function learn(id) {
  const t = TECHS.find((x) => x.id === id);
  if (!t) return { ok: false, silent: true };
  if (S.techs[id]) return { ok: false, silent: true };
  if (S.science < t.cost) return { ok: false, toast: 'Не хватает науки: \u{1F4DC} ' + t.cost + '/' + S.science, sfx: 'error' };
  S.science -= t.cost;
  S.techs[id] = true;
  if (id === 'rituals') S.maxEnergy += 10;
  return {
    ok: true,
    toast: '\u{1F4DA} Технология: ' + t.n,
    sfx: 'ach',
    log: 'Изучена технология: \u00AB' + t.n + '\u00BB. ' + t.f,
  };
}
```
## Graveyard/js/data/morgue.js
```
// МОРГ, ВСКРЫТИЕ, ПОХОРОНЫ — дословно из монолита «Вечный покой 5.4»
// window._bs/_bdraw/_bi/_bn заменены модульными переменными, Math.random -> rng,
// UI-вызовы вынесены в возвращаемые объекты (стандарт 6.0).
import { wishResult, repDeltaFor, ensureStory, sexWord } from './stories.js';
import { S, have, spend, spendE, addRes } from '../core/state.js';
import { GRAVE_NAMES, BURIAL_LINES } from './texts.js';
import { flavor } from '../core/flavor.js';
import { checkThresholds } from './rep.js';

let bs = null;   // состояние декора похорон (монолит: window._bs)
let bi = -1;     // индекс участка (монолит: window._bi)
let bname = '';  // имя покойного (монолит: window._bn)

// extract() из монолита дословно. Причуда 5.4 сохранена: энергия тратится
// ДО проверки части, так что повторная процедура по той же части «сжигает» энергию.
export function extract(i, res) {
  const c = S.corpses[i];
  if (!c) return { ok: false, toast: 'Нет такого тела.', sfx: 'error' };
  if (!spendE(S.techs.gentle ? 1 : 2)) return { ok: false, toast: 'Слишком мало энергии', sfx: 'error' };
  if (res === 'skull') { if (!c.parts.skull) return { ok: true, silent: true }; addRes('skull', 1); c.parts.skull = false; }
  else if (res === 'brain') { if (!c.parts.brain) return { ok: true, silent: true }; addRes('brain', 1); c.parts.brain = false; }
  else if (res === 'blood') { if (!c.parts.blood) return { ok: true, silent: true }; addRes('blood', 1); c.parts.blood = false; }
  else if (res === 'fat') { if (!c.parts.fat) return { ok: true, silent: true }; addRes('fat', 1); c.parts.fat = false; }
  else if (res === 'bones') { if (!c.parts.bones) return { ok: true, silent: true }; addRes('bones', 2); c.parts.bones = false; }
  else if (res === 'flesh') { if (!c.parts.flesh) return { ok: true, silent: true }; addRes('flesh', 1); c.parts.flesh = false; }
  c.extracted = (c.extracted || 0) + 1;
  S.stats.extracted++;
  return { ok: true, toast: 'Процедура завершена: +1 к качеству похорон.', sfx: 'dig' };
}

// openBurial() из монолита дословно (модалку рисует main.js).
// Как в 5.4: занятый участок — молчаливый отказ.
export function openBurial(i) {
  const g = S.graves[i];
  if (g.occ) return { ok: false, silent: true }; // ревизия 32: контракт — отказ недостижим (кнопка disabled), но форма честная
  const c = S.corpses[0];
  if (!c) return { ok: false, toast: 'В морге нет тел — похоронить нечего. Ждём ночную повозку.', sfx: 'error' };
  // ревизия 24: имя берётся из истории тела (фолбэк — старая формула для безымянных)
  ensureStory(c);
  bname = c.name || GRAVE_NAMES[(S.day * 7 + i * 3) % GRAVE_NAMES.length];
  bs = { candle: 0, flowers: 0, balsam: 0 };
  bi = i;
  return { ok: true };
}

export function burialState() { return { bs, bi, bname }; }
// ревизия 31: тупик «Отложить» закрыт — обряд сбрасывается, вкладка выходит из «смотри окно обряда»
export function burialCancel() { bs = null; bi = -1; bname = ''; return { ok: true }; }

// bInc/bDec/bTog из монолита дословно (window._bs -> bs, window._bdraw рисует main.js)
export function bInc(k) {
  if (k === 'candle') { if (have('candle') > bs.candle) bs.candle++; }
}
export function bDec(k) {
  if (k === 'candle' && bs.candle > 0) bs.candle--;
}
export function bTog(k) {
  bs[k] = bs[k] ? 0 : 1;
}

// doBurial() из монолита дословно. Отличие от 5.4: монеты проверяет сама кнопка
// spend('coins',...) в 5.4 — молча проваливался; здесь декор списывается честно.
export function doBurial(i) {
  const c = S.corpses[0];
  if (!c) return { ok: false, toast: 'Тело уже ушло.', sfx: 'error' }; // ревизия 30: морг пуст — защита
  if (bs.candle > have('candle') || (bs.flowers ? have('flowers') < 2 : false) || bs.balsam > have('balsam')) { // ревизия 30: проверка цветов читаемо (семантика прежняя)
    return { ok: false, toast: 'Не хватает декора. Проверь счётчики.', sfx: 'error' };
  }
  spend('candle', bs.candle);
  if (bs.flowers) spend('flowers', 2);
  if (bs.balsam) spend('balsam', 1);
  const q = c.stars + (c.extracted || 0) + S.graves[i].level + bs.candle * 2 + (bs.flowers ? 2 : 0) + bs.balsam * 3;
  S.graves[i].occ = bname;
  S.graves[i].deco = { candle: bs.candle, flowers: bs.flowers ? 1 : 0, balsam: bs.balsam };
  S.corpses.shift();
  S.coins += 15 + q * 2;
  // ревизия 24: последняя воля — единая точка правды wishResult/repDeltaFor
  const wr = wishResult(S, c, { candle: bs.candle, flowers: bs.flowers, balsam: bs.balsam, level: S.graves[i].level });
  const repDelta = repDeltaFor(q, wr);
  S.rep += repDelta;
  checkThresholds(); // ревизия 25: похороны могли пересечь порог
  S.stats.buried++;
  const line = flavor.pick(BURIAL_LINES);
  const wline = wr ? (wr.ok ? 'Последняя воля исполнена: +' + wr.bonus + '\u2b50' : 'Воля не исполнена (' + (wr.failNote || 'условия не сошлись') + ').') : '';
  const res = { ok: true, toast: '\u2709 ' + bname + sexWord(c, ' упокоен', ' упокоена') + '. Репутация +' + repDelta + ', монет +' + (15 + q * 2) + (wr ? '. ' + wline : ''), log: 'Похороны ' + bname + ': качество ' + q + '. ' + (wline ? wline + ' ' : '') + line };
  bs = null; bi = -1; bname = '';
  return res;
}

// embalm(i) — 6.0-надстройка (вариант А: переработка тел, стол бальзамирования).
// Цена: 2⚡ + вода 1 + жир 1 (жир — трейд-офф со свечной петлёй). +1★ телу,
// один раз на тело (флаг c.emb), кэп 5★ — проверяется ПЕРВЫМ (информативнее).
// Проверки до списания — причуда 5.4 (энергия до проверки) не копируется.
export function embalm(i) {
  const c = S.corpses[i];
  if (!c) return { ok: false, toast: 'Нет такого тела.', sfx: 'error' };
  if (!c.emb && c.stars >= 5) return { ok: false, toast: 'Безупречно — выше не бывает.', sfx: 'error' };
  if (c.emb) return { ok: false, silent: true };
  if (S.energy < 2) return { ok: false, toast: 'Слишком мало энергии', sfx: 'error' };
  if (have('water', 1) !== true) return { ok: false, toast: 'Не хватает: \u{1F4A7} ' + have('water') + '/1', sfx: 'error' }; // ревизия 30: реальный остаток
  if (have('fat', 1) !== true) return { ok: false, toast: 'Не хватает: \u{1F9D7} ' + have('fat') + '/1', sfx: 'error' }; // ревизия 30: реальный остаток
  S.energy -= 2;
  spend('water', 1);
  spend('fat', 1);
  c.stars = Math.min(5, c.stars + 1);
  c.emb = true;
  S.stats.embalmed = (S.stats.embalmed || 0) + 1;
  const r = { ok: true, toast: '\u{1F9F4} Бальзамирование завершено: тело теперь ' + '\u2605'.repeat(c.stars) + ' — качество похорон выше.' };
  // ревизия 24: родные доплачивают за бальзам
  if (c.family) { S.coins += 3; r.toast += ' Родные доплатили 3\u{1F4B0}.'; }
  return r;
}
```
## Graveyard/js/data/needs.js
```
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
```
## Graveyard/js/data/places.js
```
// КОПКА И УЧАСТКИ — дословно из монолита «Вечный покой 5.4» (data-restore)
import { rng } from '../core/rng.js';
import { S, have, spend, addRes } from '../core/state.js';

// монолит: Math.ceil((S.techs.ergo?6:8)*(S.rain?1.5:1))
export function digCost(s = S) {
  return Math.ceil((s.techs.ergo ? 6 : 8) * (s.rain ? 1.5 : 1));
}

// Ревизия 32: единый контракт действий — отказ {ok:false, toast:'Слишком мало энергии', sfx:'error'},
// успех {ok:true, toast, sfx, cost}. Проверка энергии ДО любых вызовов rng — бюджет newDay не тронут.
export function dig() {
  const cost = digCost();
  if (S.energy < cost) return { ok: false, toast: 'Слишком мало энергии', sfx: 'error' };
  S.energy -= cost;
  S.stats.digs++; // ревизия 30: статистика копок (раньше — вечный 0)
  const roll = rng.next();
  let msg = '';
  let sfxKind = 'dig';
  if (roll < .45) { const n = 1 + Math.floor(rng.next() * 2); addRes('bones', n); msg = 'Лопата звякнула: кости, аккуратно уложенные кем-то давно. ×' + n; }
  else if (roll < .70) { addRes('stone', 1); msg = 'В пласте глины — камень. Тяжёлый, честный, надёжный.'; }
  else if (roll < .88) { addRes('fat', 1); msg = 'Грунт отдаёт тёмный жир. Не будем уточнять чей — осень, что взять.'; }
  else if (roll < .92) { S.coins += 3; msg = 'Оловянная ложка с погнутой пуговицей. Густав берёт такой лом по три монеты — не спрашивай, зачем ему столько ложек.'; sfxKind = 'coin'; }
  else { S.coins += 2; msg = 'Найдена горстка старых монет. Дядюшка прятал по карманам всей округи.'; sfxKind = 'coin'; }
  return { ok: true, toast: msg, sfx: sfxKind, cost };
}

// buyGrave() из монолита дословно: расчистка участка за 30 монет.
// Отличие от 5.4: там spend('coins',30) молча проваливался (монеты не в S.res) —
// здесь честная проверка S.coins (стандарт 6.0). Формулировки — дословно.
export function buyGrave() {
  if (S.gravesOpened >= 20) {
    return { ok: false, toast: 'Простор достигнут: все 20 участков уже расчистены.', sfx: 'error' };
  }
  if (S.coins < 30) return { ok: false, toast: 'Не хватает монет', sfx: 'error' };
  S.coins -= 30;
  S.gravesOpened++;
  return {
    ok: true,
    log: 'Расчищен новый участок №' + S.gravesOpened + '. Земля впервые за годы встрепенулась.',
    toast: 'Новый участок расчищен!',
    sfx: 'dig',
  };
}

// buyBed() из монолита дословно: клумба за 30 монет.
// ревизия 26: апгрейд могилы — ур.2 (камень) и ур.3 (мрамор). Закрывает достижение a5
// («5 могил мрамора») и делает исполнимой волю «место у алтарной стены» (ур. 2+).
// Поэтапно (нельзя перепрыгнуть уровень), только свободные могилы.
const UPGRADE_COSTS = { 2: { stone: 2, coins: 10 }, 3: { marble: 2, coins: 25 } };
export function upgradeGrave(i, lvl) {
  const g = S.graves[i];
  if (!g) return { ok: false, toast: 'Такой могилы нет', sfx: 'error' };
  if (g.occ) return { ok: false, toast: 'Могила занята — постоялец уже лег спать', sfx: 'error' };
  if (g.level !== lvl - 1) return { ok: false, toast: 'Сначала уровень ' + (lvl - 1), sfx: 'error' };
  const cost = UPGRADE_COSTS[lvl];
  if (!cost) return { ok: false, toast: 'Выше уже некуда', sfx: 'error' };
  if (S.coins < cost.coins) return { ok: false, toast: 'Не хватает монет', sfx: 'error' };
  for (const k in cost) if (k !== 'coins' && !have(k, cost[k])) return { ok: false, toast: 'Не хватает материалов', sfx: 'error' };
  S.coins -= cost.coins;
  for (const k in cost) if (k !== 'coins') spend(k, cost[k]);
  g.level = lvl;
  return { ok: true, toast: 'Могила ур. ' + lvl, sfx: 'dig', log: 'Могила №' + (i + 1) + ' улучшена до уровня ' + lvl + '. Камень честный, постоялец доволен.' };
}

export function buyBed() {
  if (S.coins < 30) return { ok: false, toast: 'Не хватает монет', sfx: 'error' };
  S.coins -= 30;
  S.plant.owned = true;
  return {
    ok: true,
    log: 'Обустроена клумба за оградой. Земля там мягкая, тёплая.',
    toast: 'Клумба готова к посеву!',
    sfx: 'dig',
  };
}
```
## Graveyard/js/data/rep.js
```
// РЕПУТАЦИЯ-ПОРОГИ — ревизия 25 (6.0-надстройка)
// Три порога поверх ЕДИНОЙ S.rep (никаких новых шкал). Награды живут там,
// где уже есть механика: рынок (Густав), церковь (проповедь), ворон (заказы).
// Порог пересечён — одна строка в журнал, один раз (флаги в stats).
import { S, log } from '../core/state.js';

export const THRESHOLDS = [
  { id: 'rep20', min: 20, log: 'Деревня прониклась (20\u2b50): Густав выставил воск партией \u2014 со скидкой.' },
  { id: 'rep50', min: 50, log: 'Церковь запомнила вас (50\u2b50): проповедь теперь даёт на 1\u{1F4DC} больше.' },
  { id: 'rep100', min: 100, log: 'Деревня знает вас (100\u2b50): вороний заказ платит на четверть больше.' }
];

// Идемпотентно: зовётся из boot() (старые сейвы получают записи задним числом, ровно один раз),
// из doBurial (похороны) и из newDay (вклады и заказы между днями).
export function checkThresholds() {
  THRESHOLDS.forEach((t) => {
    if (!S.stats[t.id] && S.rep >= t.min) {
      S.stats[t.id] = 1;
      log(t.log, 'church');
    }
  });
}
```
## Graveyard/js/data/stories.js
```
// Истории умерших — ревизия 27 (6.0-надстройка): пулы с полом и последняя воля.
// Воли — компромиссы, не «правильно/неправильно»: у выгодного решения цена
// (вскрытие даёт ресурсы, но гасит надежду покойного), у гуманного — трейд-офф.
// Ревизия 27: имя и пол — ОДНИМ вызовом rng (индекс в общем пуле 80): последовательность
// дрейфа цен живых сейвов не сдвигается. Занятия/черты/воли — парами форм по полу.
import { GRAVE_NAMES, NAMES_M, NAMES_F } from './texts.js';

// Занятия парами [муж, жен] — общий индекс, форма выбирается по полу тела.
export const OCCS_PAIRS = [
  ['лесник', 'лесничиха'], ['кузнец', 'кузнечиха'], ['портной', 'портниха'],
  ['ткач', 'ткачиха'], ['пастух', 'пастушка'], ['рыбак', 'рыбачка'],
  ['охотник', 'охотница'], ['травник', 'травница'], ['мельник', 'мельничиха'],
  ['шорник', 'шорница'], ['бортник', 'бортница'], ['учитель', 'учительница']
];
// Совместимость со старыми импортами (OCCS/TRAITS): плоские списки из мужских форм.
export const OCCS = OCCS_PAIRS.map((p) => p[0]);

// Черты парами форм — общий индекс.
export const TRAIT_PAIRS = [
  ['ворчун, но душа компании', 'ворчунья, но душа компании'],
  ['молчаливый и добрый', 'молчаливая и добрая'],
  ['придира до последнего гвоздя', 'придира до последнего гвоздя'],
  ['весельчак', 'веселушка'],
  ['скуп на слова, щедр на дела', 'скупа на слова, щедра на дела'],
  ['любимец всей деревни', 'любимица всей деревни'],
  ['прямой как оглобля', 'прямая как оглобля'],
  ['мечтатель о дальних краях', 'мечтательница о дальних краях'],
  ['строгий, но справедливый', 'строгая, но справедливая'],
  ['знал все тропинки округи', 'знала все тропинки округи']
];
export const TRAITS = TRAIT_PAIRS.map((p) => p[0]);

// d — выбранный декор похорон: { candle, flowers, balsam, level }.
// penalty — репутационная цена неисполнения (только «нетронутый»: вскрытие против воли).
// tM/tF — текст воли по полу (поле text оставлено из мужской формы для совместимости).
export const WISHES = [
  { id: 'candles', tM: 'Просил не жалеть свечей.', tF: 'Просила не жалеть свечей.', text: 'Просил не жалеть свечей.', check: (c, d) => (d.candle || 0) >= 3, bonus: 2, penalty: 0, failNote: 'мало свечей' },
  { id: 'flowers', tM: 'Хотел цветов на могиле.', tF: 'Хотела цветов на могиле.', text: 'Хотел цветов на могиле.', check: (c, d) => !!d.flowers, bonus: 2, penalty: 0, failNote: 'без цветов' },
  { id: 'intact', tM: 'Просил лечь в землю нетронутым.', tF: 'Просила лечь в землю нетронутым.', text: 'Просил лечь в землю нетронутым.', check: (c) => (c.extracted || 0) === 0, bonus: 2, penalty: 1, failNote: 'тело вскрыто' },
  { id: 'altar', tM: 'Мечтал о месте у алтарной стены.', tF: 'Мечтала о месте у алтарной стены.', text: 'Мечтал о месте у алтарной стены.', check: (c, d) => (d.level || 1) >= 2, bonus: 2, penalty: 0, failNote: 'участок ещё прост' },
  { id: 'embalm', tM: 'Семья просит бальзамирования.', tF: 'Семья просит бальзамирования.', text: 'Семья просит бальзамирования.', check: (c) => !!c.emb, bonus: 2, penalty: 0, failNote: 'без бальзама' }
];

// Пол старых тел: по имени из пула, затем по женской форме занятия, фолбэк мужской.
// Без rng — старые сейвы не дрейфуют.
export function sexOf(c) {
  if (!c) return 'm';
  if (c.sex === 'm' || c.sex === 'f') return c.sex;
  if (c.name) {
    if (NAMES_F.indexOf(c.name) >= 0) return 'f';
    if (NAMES_M.indexOf(c.name) >= 0) return 'm';
  }
  if (c.occ) {
    if (OCCS_PAIRS.some((p) => p[1] === c.occ)) return 'f';
    if (OCCS_PAIRS.some((p) => p[0] === c.occ)) return 'm';
  }
  return 'm';
}

// Хелпер родовых слов: sexWord(c, 'упокоен', 'упокоена').
export function sexWord(c, m, f) { return sexOf(c) === 'f' ? f : m; }

// Единая точка правды: превью в модалке и итог в doBurial зовут одну функцию.
export function wishResult(S, c, d) {
  if (!c || !c.wish) return null;
  const w = WISHES.find((x) => x.id === c.wish);
  if (!w) return null;
  const ok = !!w.check(c, d || {});
  return { id: w.id, text: sexWord(c, w.tM, w.tF), ok, bonus: w.bonus, penalty: w.penalty, failNote: w.failNote };
}

// Единая арифметика репутации: q + бонус воли − штраф неисполнения.
export function repDeltaFor(q, wr) {
  if (!wr) return q;
  return q + (wr.ok ? wr.bonus : 0) - (wr.ok ? 0 : wr.penalty);
}

export function wishText(c) {
  const w = WISHES.find((x) => x.id === c.wish);
  return w ? sexWord(c, w.tM, w.tF) : '—';
}

// Ленивая история для старых безымянных тел: детерминированно, БЕЗ rng —
// последовательность дрейфа цен старых сейвов не сдвигается. Занятие/черта — из пула пола имени.
export function ensureStory(c) {
  if (!c || c.name) return c;
  const seed = c.stars * 7 + (c.days || 0) * 3 + (c.extracted || 0) * 5 + 1;
  c.name = GRAVE_NAMES[seed % GRAVE_NAMES.length];
  const sx = sexOf(c);
  c.occ = OCCS_PAIRS[(seed >> 1) % OCCS_PAIRS.length][sx === 'f' ? 1 : 0];
  c.trait = TRAIT_PAIRS[(seed + 3) % TRAIT_PAIRS.length][sx === 'f' ? 1 : 0];
  c.wish = WISHES[(seed + 1) % WISHES.length].id;
  c.family = seed % 5 === 0 ? 1 : 0;
  c.sex = sx;
  return c;
}
```
## Graveyard/js/data/techs.js
```
// ПОЛНЫЙ РЕЕСТР ТЕХНОЛОГИЙ — дословно из монолита «Вечный покой 5.4» (data-restore)
// Формат монолита: массив {id, n, cost, d, f}. Изученные — ключи в S.techs (id -> true).
export const TECHS = [
{id:'trade',n:'Торговый нюх',cost:4,d:'Продажа на рынке дороже на 15%.',f:'Густав: «У тебя глаз намётан, смотритель».'},
{id:'ergo',n:'Эргономика',cost:4,d:'Копка земли: 6⚡ вместо 8⚡.',f:'Лопата с удобной рукоятью — половина успеха.'},
{id:'rituals',n:'Утренние ритуалы',cost:5,d:'Максимум энергии +10.',f:'Растяжка, холодная вода и мысль о вечном.'},
{id:'oven',n:'Печной мастер',cost:6,d:'Своя печь: воск без услуг Густава.',f:'Печь дядюшки ещё дышит — надо лишь раздуть.'},
{id:'orator',n:'Оратор',cost:6,d:'Пожертвования дают двойную репутацию.',f:'Ты научился говорить так, что слушают даже ворон.'},
{id:'stone',n:'Каменное дело',cost:8,d:'Открывает каменные могилы (ур. 2).',f:'Каменщик из соседней деревни поделился секретом.'},
{id:'marble',n:'Мраморный резец',cost:14,d:'Мраморные могилы (ур. 3), мрамор дешевле.',f:'Резец поёт, стружка летит, вдова плачет от красоты.'},
{id:'accountant',n:'Бухгалтерия',cost:8,d:'+2 монеты в день за каждую занятую могилу.',f:'Покойники платят исправно — главное, не опаздывать с бумагами.'},
{id:'alchemy1',n:'Алхимия I',cost:8,d:'Лаборатория: изучение мозгов и чернила.',f:'Реторты, колбы и запах серы. Наука требует жертв.'},
{id:'alchemy2',n:'Алхимия II',cost:12,d:'Эликсир энергии и бальзам в лаборатории.',f:'Дядюшка оставил недописанный трактат. Ты его закончишь.'},
{id:'logistics',n:'Логистика',cost:10,d:'Второе место в морге.',f:'Стеллаж, накидка и уважение к очереди.'},
{id:'gentle',n:'Тихие руки',cost:6,d:'Вскрытие: 1⚡ вместо 2⚡.',f:'Ты двигаешься так, что будильник не завидует.'},
{id:'gardener',n:'Садовник',cost:5,d:'+1 цветок с каждого сбора.',f:'Клумба зашептала, что хочет жить.'},
{id:'agro',n:'Агрономия',cost:9,d:'Удобрение даёт вдвое больше цветов.',f:'Кости в землю — цветы в руки. Круговорот.'},
{id:'diplomat',n:'Дипломатия',cost:7,d:'Прогнать бродягу без потери репутации.',f:'Иногда вместо каши нужен лишь твёрдый взгляд.'},
{id:'candlemaster',n:'Мастер свечей',cost:11,d:'+3 монеты к цене каждой свечи.',f:'Фитиль ровный, воск чистый — витринное качество.'},
{id:'embalm',n:'Стол бальзамирования',cost:4,d:'Бальзамирование: +1\u2605 телу в морге (один раз).',f:'Холодный стол, игла и нить. Тело обретает достоинство, а не только запах.'}]

// машинные эффекты — источник: места использования в монолите (никаких if(tech==='ergo') в логике):
//   ergo         -> digCost 6 вместо 8            (data/places.js)
//   trade        -> sellPrice x1.15               (data/market.js)
//   candlemaster -> свеча +3 к цене продажи       (data/market.js)
//   marble       -> мрамор у Густава 22 вместо 25 (data/market.js)
export function has(s, id) { return !!(s.techs && s.techs[id]); }
export function learnedCount(s) { return Object.keys(s.techs || {}).length; }
```
## Graveyard/js/data/texts.js
```
// ТЕКСТЫ — дословно из монолита «Вечный покой 5.4» (data-restore).
// Этап texts перепишет тон по DESIGN.md — исходники сохранены здесь целиком.

export const GUSTAV_LINES=['Густав вытирает прилавок. «Свечи нынче в цене, смотритель. Люди боятся темноты, а тьма — вечный бизнес».','«Слыхал? У епархии новые инспекторы. Ходят с бумажками и дурным настроением».','Густав щурится: «Кофе — священный напиток. Дороже только отпевание».','«Плоть беру по строгим правилам: не глядя и без вопросов». Он загадочно улыбается.','«Мрамор подорожал. Война где-то далеко, а камень, как всегда, рядом».','Густав наливает тебе кофе без спроса. «За счёт заведения. Ты единственный клиент, который не спорит»','«Слышал, на ярмарке в соседнем городе свечи разбирают как пряники? Жаль, телега у меня одна, а дорога та ещё»','Густав принюхивается: «Пахнешь мышами и наукой. Это комплимент, между прочим»','«Инспектор вчера брал у меня свечу. Одну. Для кого — не сказал. Но руки у него дрожали»','«Дядюшка твой когда-то выменял у меня ящик свечей на партию гвоздей. Странные времена были, смотритель»','Густав ставит на прилавок вторую чашку. «Кофе подорожал. Но тебе — по старой памяти, без наценки»','«Кузнец спрашивал про мрамор. Говорит, кто-то заказал большую партию. Не твой ли кладбищенский размах?»']

export const RAVEN_LINES=['Ворон важно расхаживает по ограде, будто он тут смотритель, а ты — ассистент.','Ворон склоняет голову набок. В его взгляде читается: «Дела, у тебя дела».','Где-то ухнула сова. Ворон сделал вид, что не испугался.','Ворон принёс в клюве блестящую пуговицу и оставил на подоконнике. Комплимент? Плата? Знак?','Ворон принёс крышку от карманных часов. Чья — лучше не спрашивать.','Ворон смотрит на тебя с ветки ивы — взгляд практика, оценивающего подмастерье.','Ворон каркнул трижды. По поверьям — к деньгам. По вороновым — к делу.','Ворон прощупывает клювом ограду. Инспекция или скука — не разобрать.','Ворон вернулся с луга и сел на надгробие, как на трибуну.','Ворон положил перед моргом живого крота и выжидательно наклонил голову. Подарок или счёт за услуги?']

export const BURIAL_LINES=['Кучер бросил «Держи, смотритель» и исчез, не дожидаясь квитанции.','Свеча на могиле горит ровно — хороший знак.','Старушка из деревни утерла слезу и назвала тебя хорошим человеком.','Пономарь записал церемонию в приходскую книгу аккуратным почерком.','Ворон провожал процессию до самой ограды — по-деловому, как сторож.','Дождь вдруг кончился, когда опустили крышку. Деревня запомнит.','Густав уже пересчитал выручку и довольно кивнул сам себе.']

export const LOGOS=[
'Первый день на новом месте. Дядюшкино кладбище досталось тебе вместе с долгами, лопатой и кое-какой репутацией.',
'Деревня смотрит косо: новый смотритель — это всегда вопрос. Докажи делом.',
'Густав из лавки шепнул: «Главное, не поднимай цены резко. Деревня всё помнит».',
'Свежая могила пахнет землёй и смирением. Работа сделана — совесть чиста.',
'Ворон сегодня наблюдал за тобой с ветки ивы. Как будто оценивал.',
'Ночь прошла спокойно. Никто не стучался в ворота — и слава богу.',
'Мимо кладбища прошли циркачи. Один помахал тебе рукой с крыши кареты — вы, кажется, знакомы.',
'Пономарь попросил свечей к воскресной службе. Официально это называется «спрос».',
'Кузнец починил твою лопату и отказался брать плату. «За покойников — не считаю».',
'Кто-то оставил на ограде венок с запиской: «Спасибо за порядок». Подписи нет.',
'Ворон вороновича вида: он всю ночь раскладывал на ограде пуговицы. Что-то он знает.',
'Густав намекнул, что коллекционер черепов спрашивал о тебе. Дважды.',
'На рассвете над кладбищем кружил аист. Деревня гадает: к чему бы это.',
'Дядюшкино завещание снова перечитано. Каждое слово, кажется, понимается иначе, чем в первый день']

// Ревизия 27: пулы имён по полу (40+40). Все 20 старых имён сохранены на своих местах.
export const NAMES_M=['Агапит','Прохор','Савелий','Захар','Тихон','Ерофей','Гордей','Софрон','Пантелей','Серафим','Арефий','Богдан','Василий','Гервасий','Демьян','Епифан','Ждан','Игнат','Капитон','Лаврентий','Митрофан','Никодим','Онуфрий','Потап','Родион','Севир','Трофим','Ульян','Филат','Харитон','Хрисанф','Ювеналий','Яким','Мирон','Симон','Мокий','Никанор','Пафнутий','Антон','Тарас']
export const NAMES_F=['Феодора','Марфа','Устинья','Клеопатра','Пелагея','Агафья','Василиса','Лукерья','Дарья','Евдокия','Аглая','Аксинья','Анфиса','Васса','Глафира','Евпраксия','Зинаида','Ирина','Капитолина','Лариса','Мавра','Меланья','Наталья','Оксения','Прасковья','Руфина','Секлетея','Степанида','Таисия','Улита','Феврония','Хиония','Хавронья','Акулина','Ефросинья','Фёкла','Юлия','Аграфена','Настасья','Домна']
export const GRAVE_NAMES=[...NAMES_M,...NAMES_F]

// 6.0-надстройка (ревизия 23): онбординг — не из монолита
export const ONBOARDING_LINES={
  firstQuest:'Первое поручение деревни: вдова Аглая приедет к вечеру. Проведите первые похороны с достойным декором — она запомнит, как её встретили.',
  sellHint:'Деньги пошли: выручку стоит вкладывать — воск на свечи (у рынка свеча дороже воска), семена на клумбу. Так петля и крутится.'
};
```
## Graveyard/js/data/tutorial.js
```
// Туториал — из монолита 5.4: TUT_STEPS/curTut/tutBanner/tutOff дословно.
// Адаптация 6.0: inline onclick -> data-action (конвенция модулей), done-предикаты
// работают с импортированным S (в монолите S был глобальным объектом).
import { S } from '../core/state.js';

export const TUT_STEPS=[
{t:'Добро пожаловать на кладбище!',d:'Ты — смотритель. Начни простое: копай землю на вкладке Кладбище — из грунта достаются кости, камень и жир. Копка тратит энергию.',tab:'graveyard',lbl:'К кладбищу',done:()=>S.stats.digs>=1},
{t:'Ночью приедут постояльцы',d:'Тела привозят сами — после кнопки «Новый день» внизу экрана. Утром загляни в Морг.',tab:'morgue',lbl:'К моргу',done:()=>S.corpses.length>0||S.stats.buried>0},
{t:'Проведи вскрытие',d:'Во Морг: процедуры дают ресурсы и плюс к качеству будущих похорон. Череп добывается только при вскрытии — голова постояльца, не из земли.',tab:'morgue',lbl:'К моргу',done:()=>S.stats.extracted>=1},
{t:'Свари воск',d:'В Ремесле: жир ×2 и немного энергии дают воск. Воск — основа свечей, товара деревни.',tab:'craft',lbl:'К ремеслу',done:()=>S.stats.waxMade>=1},
{t:'Скрути свечу',d:'В Ремесле: воск и нить дают свечу. Нити нет — купи у Густава в лавке.',tab:'craft',lbl:'К ремеслу',done:()=>S.stats.candlesMade>=1},
{t:'Проведи первые похороны',d:'Выбери свободную могилу на Кладбище, добавь декор (свеча даёт больше всего звёзд) и подтверди. Качество похорон превращается в репутацию и монеты.',tab:'graveyard',lbl:'К кладбищу',done:()=>S.stats.buried>=1},
{t:'Продай свечу на рынке',d:'Рынок живой: цены дышат, стрелки показывают вчерашний ход. Продавай на пике — торговля тоже ремесло.',tab:'market',lbl:'К рынку',done:()=>S.stats.sales>=1},
{t:'Изучи технологию',d:'Технологии открывают перки за науку. Первую уже можно взять.',tab:'techs',lbl:'К технологиям',done:()=>Object.keys(S.techs).length>=1},
{t:'Заказ ворона',d:'Ворон изредка приносит заказы. Сдавай вовремя — премии приятны и репутации полезны.',tab:'crow',lbl:'К ворону',done:()=>S.crow.done>=1},
{t:'Дальше — сам, смотритель',d:'Доведи репутацию до 100. Гниющие тела, каменные могилы, дожди и строгий инспектор — всё уже в пути. Удачи!',tab:'graveyard',lbl:'К кладбищу',done:()=>false}
];

export function curTut(){if(!S.tut||!S.tut.on)return -1;for(let i=0;i<TUT_STEPS.length;i++){if(!TUT_STEPS[i].done())return i}return -1}

export function tutBanner(){const i=curTut();if(i<0)return '';const t=TUT_STEPS[i];
const last=i===TUT_STEPS.length-1;return '<div class="card" style="border-color:#c9a227"><b>📖 Обучение, шаг '+(i+1)+' из '+TUT_STEPS.length+': '+t.t+'</b><p class="sub">'+t.d+'</p><div class="row">'+(last?'<button class="btn gold" data-action="tut-off">Понял, спасибо</button>':'<button class="btn gold" data-action="tut-goto" data-arg="'+t.tab+'">Идти: '+t.lbl+'</button><button class="btn" data-action="tut-off">Не мешай, я сам</button>')+'</div></div>'}

export function tutOff(){S.tut.on=false;return{ok:true,toast:'Обучение скрыто. Вернуть: справка ❔ → «Показать обучение».'}}
```
## Graveyard/js/main.js
```
import { maybeFirstQuest } from './data/goals.js';
import { checkAch } from './data/achievements.js';
import { wishResult, repDeltaFor, ensureStory } from './data/stories.js';
import { rng } from './core/rng.js';
import { bus } from './core/bus.js';
import { S, adopt, get, log, have, fmt, defaultState } from './core/state.js';
import { load, save, migrate, wipe } from './core/save.js';
import { renderTop, renderTabs, renderScreen } from './ui/render.js';
import { SCREENS } from './ui/router.js';
import { bindActions } from './ui/input.js';
import { toast, sfx, floatTxt } from './ui/dialog.js';
import { dig, buyGrave, buyBed, upgradeGrave } from './data/places.js';
import { forage } from './data/forest.js';
import { sellItem, sellGustav, buyRes, learn } from './data/market.js';
import { plantSeed, fertBed, harvest } from './data/garden.js';
import { newDay, morningEvent, eventAction, victoryCheck } from './data/day.js';
import { extract, openBurial, bInc, bDec, bTog, doBurial, burialState, burialCancel, embalm } from './data/morgue.js';
import { craftAction, useItem } from './data/craft.js';
import { donate, preach } from './data/church.js';
import { doOrder } from './data/crow.js';
import { tutOff } from './data/tutorial.js';

import * as graveyardScreen from './screens/graveyard.js';
import * as morgueScreen from './screens/morgue.js';
import * as marketScreen from './screens/market.js';
import * as churchScreen from './screens/church.js';
import * as craftScreen from './screens/craft.js';
import * as crowScreen from './screens/crow.js';
import * as journalScreen from './screens/journal.js';
import { checkThresholds } from './data/rep.js';

// реестр рендеров: id -> функция, возвращающая HTML
const RENDERERS = {
  graveyard: graveyardScreen.initGraveyard,
  forest: graveyardScreen.initForest,
  garden: graveyardScreen.initGarden,
  morgue: morgueScreen.initMorgue,
  autopsy: morgueScreen.initAutopsy,
  burial: morgueScreen.initBurial,
  craft: craftScreen.initCraft,
  lab: craftScreen.initLab,
  market: marketScreen.initMarket,
  techs: marketScreen.initTechs,
  gustav: marketScreen.initGustav,
  church: churchScreen.initChurch,
  sermons: churchScreen.initSermons,
  stats: churchScreen.initStats,
  crow: crowScreen.initCrow,
  inv: journalScreen.initInv,
  ach: journalScreen.initAch,
  log: journalScreen.initLog,
};

function switchScreen(name) {
  S.screen = name; // ревизия 30: мутация вместо пересоздания всего состояния
  renderTabs();
  const fn = RENDERERS[name];
  renderScreen(fn ? fn() : '<p>Экран в разработке</p>');
}

// ревизия 33: цифровые хоткеи 1-8 (реестр hk в router.js).
// Игнор: открытая модалка (modalRoot не пуст), фокус в поле ввода.
function initHotkeys() {
  document.addEventListener('keydown', (e) => {
    if (e.key < '1' || e.key > '8') return;
    const mr = document.getElementById('modalRoot');
    if (mr && mr.children.length) return;
    const ae = document.activeElement;
    if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA')) return;
    const s = SCREENS.find((x) => x.hk === Number(e.key));
    if (s && s.id !== S.screen) { e.preventDefault(); switchScreen(s.id); }
  });
}

// модалка утреннего события (вёрстка монолита showEvent)
function showEventModal(ev) {
  const root = document.getElementById('modalRoot');
  let h = '<h3>' + ev.title + '</h3><p>' + ev.text + '</p>';
  if (ev.choices && ev.choices.length) {
    h += '<div class="row">' + ev.choices.map((c, i) =>
      '<button class="btn ' + (i === 0 ? 'gold' : '') + '" data-action="event-choice" data-arg="' + c.id + '">' + c.label + '</button>').join('') + '</div>';
  } else {
    h += '<button class="btn gold" data-action="event-close">' + (ev.btn || 'Дальше') + '</button>';
  }
  root.innerHTML = '<div class="modal-bg"><div class="modal">' + h + '</div></div>';
}
function closeModal() { document.getElementById('modalRoot').innerHTML = ''; }

// модалка победы — вёрстка монолита showVictory дословно (inline onclick -> data-action)
function showVictoryModal() {
  document.getElementById('modalRoot').innerHTML = '<div class="modal-bg"><div class="modal"><h2>\u2696 ОБРАЗЦОВОЕ КЛАДБИЩЕ \u2696</h2><p>Репутация достигла 100. Церковь в восторге, ворон смотрит с уважением, а Густав предложил партнёрство.</p><p>Ты пришёл сюда безвестным наследником с лопатой — а стал человеком, о котором говорят за столами всей епархии. Дядюшка, где бы он ни был, доволен.</p><p>День ' + S.day + '. Похоронено: ' + S.stats.buried + '. Монет в сундуке: ' + fmt(S.coins) + '.</p><button class="btn gold" data-action="victory-close">Продолжить бессмертие</button></div></div>';
}

// справка — вёрстка монолита showHelp дословно (inline onclick -> data-action; bg-закрытие
// по прецеденту модалки похорон: data-action на modal-bg)
function showHelpModal() {
  document.getElementById('modalRoot').innerHTML = '<div class="modal-bg" data-action="help-close"><div class="modal"><h3>Как играть</h3><p><b>Цель:</b> довести репутацию до 100 и стать образцовым кладбищем.</p><p><b>Цикл:</b> ночью привозят тела — утром вскрывай (ресурсы + качество), хорони с декором, днём копай землю, крафти свечи, торгуй на рынке. Вечером — «Новый день».</p><p><b>Помни:</b> тела гниют после двух дней — инспектор строг. Кости → мука → удобрение → цветы → могилы и бальзам. Мозг → наука или продажа. Череп — из головы постояльца, а не из мозга.</p><p><b>🎒 Сумка</b> — всё твоё добро в одном месте: выпить, изучить, продать.</p><p><b>Прогресс</b> сохраняется сам в браузере.</p><div class="row"><button class="btn gold" data-action="help-close">Понял</button><button class="btn" data-action="tut-restart">Показать обучение</button></div></div></div>';
}

// сброс — монолит resetGame дословно (localStorage.removeItem('vp5_save') -> wipe(), ключ совпадает;
// intro() в 6.0 нет — сразу рендер кладбища)
function resetGame() {
  if (!confirm('Начать заново? Прогресс сотрётся.')) return;
  wipe();
  adopt(defaultState());
  rng.init(1); // ревизия 28: свежая игра — свежий поток
  maybeFirstQuest();
  closeModal();
  refresh();
}

function refresh() {
  renderTop();
  switchScreen(S.screen);
  // ревизия 30: глобальный checkAch — ачивки объявляются сразу, без ожидания следующего действия
  // (оговорка рев. 29 «глобальный checkAch и так зовётся» была ошибкой — признаём и чиним)
  checkAch(S);
  if (victoryCheck()) { showVictoryModal(); sfx('win'); }
  save();
}

// модалка похорон — вёрстка монолита openBurial (window._bdraw -> renderBurialModal)
function showBurialModal() {
  const { bs, bi, bname } = burialState();
  if (!bs) return;
  const c = S.corpses[0];
  ensureStory(c);
  const stars = '\u2605'.repeat(c.stars) + '\u2606'.repeat(5 - c.stars);
  const q = c.stars + (c.extracted || 0) + S.graves[bi].level + bs.candle * 2 + (bs.flowers ? 2 : 0) + bs.balsam * 3;
  // ревизия 24: превью воли ДО кнопки — та же wishResult, что в doBurial
  const wr = wishResult(S, c, { candle: bs.candle, flowers: bs.flowers, balsam: bs.balsam, level: S.graves[bi].level });
  const repDelta = repDeltaFor(q, wr);
  const wishHtml = wr ? '<p class="meta">Воля: «' + wr.text + '» — <b>' + (wr.ok ? 'исполнена (+' + wr.bonus + '\u2b50)' : 'не исполнена' + (wr.failNote ? ': ' + wr.failNote : '')) + '</b></p>' : '';
  const root = document.getElementById('modalRoot');
  root.innerHTML =
    '<div class="modal-bg" data-action="burial-close"><div class="modal">' +
    '<h3>Похороны: ' + bname + '</h3>' +
    '<p class="flavor">Тело: ' + stars + '. Извлечено процедур: ' + (c.extracted || 0) + '. Могила ур. ' + S.graves[bi].level + '.</p>' +
    '<div class="row">\u{1F56F} Свечи (+' + (bs.candle * 2) + '): <button data-action="b-dec" data-arg="candle">\u2212</button> ' + bs.candle +
      ' <button data-action="b-inc" data-arg="candle">+</button> (есть ' + have('candle') + ')</div>' +
    '<div class="row">\u{1F338} Цветы \u00D72 (+' + (bs.flowers ? 2 : 0) + '): <button data-action="b-tog" data-arg="flowers">' + (bs.flowers ? 'снять' : 'положить') + '</button> (есть ' + have('flowers') + ')</div>' +
    '<div class="row">\u{1F9F4} Бальзам (+' + (bs.balsam * 3) + '): <button data-action="b-tog" data-arg="balsam">' + (bs.balsam ? 'без' : 'нанести') + '</button> (есть ' + have('balsam') + ')</div>' +
    wishHtml +
    '<p class="flavor">Качество похорон: <b>' + q + '</b> \u2192 репутация +' + repDelta + ', монет +' + (15 + q * 2) + '.</p>' +
    '<button class="gold" data-action="do-burial" data-n="' + bi + '">Провести похороны \u2709</button> ' +
    '<button data-action="burial-close">Отложить</button>' +
    '<p class="why" id="berr"></p></div></div>';
}

function handleAction(payload) {
  switch (payload.action) {
    case 'dig': { // ревизия 32: контракт — отказ несёт toast+sfx из data
      const r = dig();
      if (!r.silent) toast(r.toast);
      if (r.ok) { sfx(r.sfx); refresh(); }
      break;
    }
    case 'forage': { // ревизия 32: контракт — отказ несёт toast+sfx из data
      const r = forage();
      if (!r.silent) toast(r.toast);
      if (r.ok) { sfx(r.sfx); refresh(); }
      break;
    }
    case 'upg-grave': {
      const r = upgradeGrave(Number(payload.n), Number(payload.arg));
      if (!r.silent) toast(r.toast); // рев. 32: контракт
      if (r.ok) { if (r.log) log(r.log); sfx(r.sfx); refresh(); }
      break;
    }
    case 'buy-grave': {
      const r = buyGrave();
      if (!r.silent) toast(r.toast); // рев. 32: контракт
      if (r.ok) { if (r.log) log(r.log); sfx(r.sfx); refresh(); }
      break;
    }
    case 'buy-bed': {
      const r = buyBed();
      if (!r.silent) toast(r.toast); // рев. 32: контракт
      if (r.ok) { if (r.log) log(r.log); sfx(r.sfx); refresh(); }
      break;
    }
    case 'plant-seed': {
      const r = plantSeed();
      if (!r.silent) toast(r.toast); // рев. 32: контракт
      if (r.ok) refresh();
      break;
    }
    case 'fert-bed': {
      const r = fertBed();
      if (!r.silent) toast(r.toast); // рев. 32: контракт
      if (r.ok) refresh();
      break;
    }
    case 'harvest': {
      const r = harvest();
      if (!r.silent) toast(r.toast); // рев. 32: контракт
      if (r.ok) { if (r.sfx) sfx(r.sfx); refresh(); }
      break;
    }
    case 'new-day': {
      const r = newDay();
      // ревизия 34: поле toasts снято из контракта newDay ({ok, victory}) —
      // сообщения дня идут через log() внутри newDay, тосты здесь не нужны.
      if (r.victory) sfx('win');
      renderTop();
      const ev = morningEvent(); // ревизия 31: событие ДО сейва — refresh() пишет сейв уже с pendingEvent
      refresh();
      if (ev) showEventModal(ev);
      break;
    }
    case 'event-choice': {
      const r = eventAction(payload.arg);
      if (!r.ok) { if (!r.silent) toast(r.toast); if (r.sfx) sfx(r.sfx); break; } // модалка остаётся, как в монолите (ревизия 34: sfx из data)
      closeModal();
      S.pendingEvent = null; S.thief = null;
      if (r.toast) toast(r.toast);
      if (r.log) log(r.log);
      refresh();
      break;
    }
    case 'event-close': {
      S.pendingEvent = null; S.thief = null;
      closeModal();
      refresh();
      break;
    }
    case 'inspect':
      toast('Тело осмотрено (заглушка)');
      break;
    case 'sell': {
      const r = sellItem(payload.item, payload.n);
      if (!r.silent) toast(r.toast); // рев. 32: отказ sellItem — silent:true, тост только на успехе
      if (r.ok) { sfx(r.sfx); refresh(); }
      break;
    }
    case 'sell-gustav': {
      const rG = sellGustav(payload.item);
      if (!rG.silent) toast(rG.toast);
      if (rG.ok) { sfx(rG.sfx); refresh(); }
      break;
    }
    case 'buy': {
      const n = payload.n || 1;
      const rB = buyRes(payload.item, payload.price * n, n);
      if (!rB.silent) toast(rB.toast); // рев. 32: тост «Не хватает монет» теперь доигрывается (раньше глотался)
      if (rB.ok) { sfx(rB.sfx); refresh(); }
      break;
    }
    case 'extract': {
      const r = extract(Number(payload.n), payload.arg);
      if (!r.silent) toast(r.toast);
      if (r.ok) { if (r.sfx) sfx(r.sfx); refresh(); }
      break;
    }
    case 'open-burial': {
      const r = openBurial(Number(payload.n));
      if (!r.ok && r.toast) { if (!r.silent) toast(r.toast); if (r.sfx) sfx(r.sfx); } // ревизия 35: звук из data
      if (r.ok) { showBurialModal(); sfx('open'); }
      break;
    }
    case 'b-inc': { bInc(payload.arg); showBurialModal(); break; }
    case 'b-dec': { bDec(payload.arg); showBurialModal(); break; }
    case 'b-tog': { bTog(payload.arg); showBurialModal(); break; }
    case 'do-burial': {
      const r = doBurial(Number(payload.n));
      if (!r.ok) {
        const err = document.getElementById('berr');
        if (err) err.textContent = r.toast; // рев. 32: контракт — поле error снято
        break;
      }
      closeModal();
      if (r.toast) toast(r.toast);
      if (r.log) log(r.log);
      sfx('bury');
      refresh();
      break;
    }
    case 'burial-close': { closeModal(); burialCancel(); refresh(); break; }
    case 'craft': {
      const r = craftAction(payload.arg); // ревизия 32: контракт — sfx:'error' приходит из data
      if (!r.silent) toast(r.toast);
      if (r.ok) {
        if (r.sfx) sfx(r.sfx);
        if (r.fx) floatTxt(r.fx);
        refresh();
      }
      break;
    }
    case 'use-item': {
      const r = useItem(payload.arg);
      if (!r.silent) toast(r.toast); // рев. 32: отказ useItem — silent:true
      if (r.ok) { if (r.fx) floatTxt(r.fx); refresh(); }
      break;
    }
    case 'learn': {
      const r = learn(payload.arg);
      if (!r.silent) toast(r.toast);
      if (r.ok) { if (r.sfx) sfx(r.sfx); if (r.log) log(r.log); refresh(); }
      break;
    }
    case 'embalm': {
      const r = embalm(Number(payload.n));
      if (!r.silent) toast(r.toast);
      if (r.ok) { if (r.sfx) sfx(r.sfx); refresh(); }
      break;
    }
    case 'donate': {
      const r = donate();
      if (!r.silent) toast(r.toast); // рев. 32: контракт
      if (r.ok) { if (r.sfx) sfx(r.sfx); refresh(); }
      break;
    }
    case 'preach': {
      const r = preach();
      if (!r.silent) toast(r.toast); // рев. 32: контракт
      if (r.ok) refresh();
      break;
    }
    case 'crow-order': {
      const r = doOrder();
      if (!r.silent) toast(r.toast);
      if (r.ok) { if (r.sfx) sfx(r.sfx); refresh(); }
      break;
    }
    case 'log-filter': { // ревизия 31: фильтр журнала — UI-состояние экрана журнала
      journalScreen.setLogFilter(payload.arg);
      refresh();
      break;
    }
    case 'toggle-sound': {
      S.sound = !S.sound;
      if (S.sound) sfx('click');
      renderTop();
      break;
    }
    case 'help': { showHelpModal(); break; }
    case 'help-close': { closeModal(); break; }
    case 'reset': { resetGame(); break; }
    case 'victory-close': { closeModal(); break; }
    case 'tut-off': {
      const r = tutOff();
      if (r.toast) toast(r.toast);
      refresh();
      break;
    }
    case 'tut-goto': { switchScreen(payload.arg); break; }
    case 'tut-restart': {
      if (!S.tut) S.tut = { on: true }; // как в монолитном showHelp
      S.tut.on = true;
      closeModal();
      refresh();
      break;
    }
  }
}

async function boot() {
  rng.init(1); // фиксированный сид; позиция в потоке восстанавливается из сейва (вариант B, ревизия 28)
  const saved = load();
  if (saved) {
    const s = migrate(saved);
    if (s) adopt(s);
  }
  // БАГФИКС 28: maybeFirstQuest — и на самом первом запуске (раньше вызывался только при
  // наличии сейва, и первая строка поручения у новичка не появлялась). Идемпотентен.
  maybeFirstQuest();
  // вариант B: сейв хранит позицию в rng-потоке — прокручиваем до неё.
  // Игровой поток теперь детерминирован независимо от перезагрузок страницы.
  const fw = Math.min(1000000, Math.max(0, (S.rngCount || 0) | 0));
  for (let i = 0; i < fw; i++) rng.next();
  checkThresholds(); // ревизия 25: старые сейвы получают записи о порогах задним числом, один раз
  bindActions(document.getElementById('app'));
  bindActions(document.getElementById('modalRoot'));
  bus.on('screen', switchScreen);
  bus.on('action', handleAction);
  initHotkeys();
  renderTop();
  switchScreen(S.screen || 'graveyard');
  // ревизия 31: незакрытое утреннее событие восстанавливается из сейва
  if (S.pendingEvent) showEventModal(S.pendingEvent);
}

boot();
```
## Graveyard/js/screens/church.js
```
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
```
## Graveyard/js/screens/craft.js
```
// РЕМЕСЛО И ЛАБОРАТОРИЯ — вёрстка tCraft/tLab монолита (адаптация только в рендере)
import { S, have } from '../core/state.js';
import { needCheck } from '../data/needs.js';

// монолитный btn, переписанный под data-action (стандарт 6.0)
function cbtn(arg, label, cls, need) {
  const c = needCheck(need);
  const dis = c.ok ? '' : 'disabled';
  return '<button class="btn ' + (cls || '') + '" ' + dis + ' data-action="craft" data-arg="' + arg + '">' + label + '</button>' + (c.ok ? '' : '<div class="why">' + c.w + '</div>');
}

export function initCraft() {
  let h = '<h2>Ремесло</h2><p class="sub">Верстак, ступка и — если повезёт с технологией — собственная печь. Руки помнят работу дядюшки, голова — уже твоя.</p>';
  if (S.techs.oven) h += '<div class="card" style="margin-bottom:12px"><h4>🔥 Печь (своя)</h4><p class="meta">Жир ×2 → Воск ×1. Дым пахнет мёдом и чуть-чуть тайной.</p>' + cbtn('wax', 'Перетопить жир', 'gold', [['fat', 2], ['e', 3]]) + '</div>';
  else h += '<div class="card" style="margin-bottom:12px"><h4>🔥 Печь (сломана)</h4><p class="meta">Дядюшкина печь стоит холодная. Изучи «Печной мастер», чтобы топить самому, — или плати Густаву.</p>' + cbtn('wax-gustav', 'Перетопить у Густава (4💰)', '', [['fat', 2], ['e', 3]]) + '</div>';
  h += '<div class="card" style="margin-bottom:12px"><h4>🕯 Верстак</h4><p class="meta">Воск ×1 + Нить ×1 → Свеча ×1.</p>' + cbtn('candle', 'Сделать свечу', 'gold', [['wax', 1], ['thread', 1], ['e', 3]]) + '</div>';
  h += '<div class="card" style="margin-bottom:12px"><h4>🥣 Ступка</h4><p class="meta">Кости ×2 → Костная мука ×1.</p>' + cbtn('flour', 'Молоть кости', 'gold', [['bones', 2], ['e', 2]]) + '</div>';
  h += '<div class="card" style="margin-bottom:12px"><h4>🌱 Садовый стол</h4><p class="meta">Костная мука ×2 + Вода ×1 → Удобрение ×1. Кости уходят в землю — и это честно.</p>' + cbtn('fert', 'Смешать удобрение', 'gold', [['flour', 2], ['water', 1], ['e', 2]]) + '</div>';
  h += '<div class="card" style="margin-bottom:12px"><h4>🍲 Котёл на углях</h4><p class="meta">Грибы ×2 + Вода ×1 → Грибной отвар ×1 (+10⚡). Лесной обед для тех, у кого кофе не выношен.</p>' + cbtn('broth', 'Варить отвар', 'gold', [['mushroom', 2], ['water', 1], ['e', 2]]) + '</div>';
  h += '<h3>Употребить</h3><div class="row">';
  if (have('coffee')) h += '<button class="btn green" data-action="use-item" data-arg="coffee">☕ Кофе (+10⚡)</button>';
  if (have('elixir')) h += '<button class="btn green" data-action="use-item" data-arg="elixir">⚗️ Эликсир (+25⚡)</button>';
  if (have('broth')) h += '<button class="btn green" data-action="use-item" data-arg="broth">🍲 Отвар (+10⚡)</button>';
  if (!have('coffee') && !have('elixir') && !have('broth')) h += '<span class="sub" style="margin:0">Ничего бодрящего под рукой. Загляни к Густаву.</span>';
  h += '</div>';
  return h;
}

export function initLab() {
  if (!S.techs.alchemy1) return '<h2>Лаборатория</h2><p class="sub">Дверь заперта. За ней — пыль, реторты и трактат дядюшки. Изучи технологию «Алхимия I».</p>';
  let h = '<h2>Лаборатория</h2><p class="sub">Колбы тихо булькают сами собой — дядюшка ставил их так, что не затихают и по сей день.</p>';
  h += '<div class="grid">';
  h += '<div class="card"><h4>📜 Изучить мозг</h4><p class="meta">Мозг ×1 → Наука ×3. Незваные мысли становятся знаниями.</p>' + cbtn('brain', 'Изучить', 'gold', [['brain', 1], ['e', 4]]) + '</div>';
  h += '<div class="card"><h4>🖋 Чернила</h4><p class="meta">Кровь ×1 + Вода ×1 → Чернила ×1.</p>' + cbtn('ink', 'Сварить чернила', 'gold', [['blood', 1], ['water', 1], ['e', 2]]) + '</div>';
  if (S.techs.alchemy2) {
    h += '<div class="card"><h4>⚗ Эликсир</h4><p class="meta">Цветы ×2 + Вода ×2 → Эликсир ×1 (+25⚡). Секрет — в настое, а не в составляющих.</p>' + cbtn('elixir', 'Сварить эликсир', 'gold', [['flowers', 2], ['water', 2], ['e', 3]]) + '</div>';
    h += '<div class="card"><h4>🧴 Бальзам</h4><p class="meta">Вода ×2 + Цветы ×2 → Бальзам ×1 (+3 к похоронам).</p>' + cbtn('balsam', 'Сварить бальзам', 'gold', [['water', 2], ['flowers', 2], ['e', 3]]) + '</div>';
  } else h += '<div class="card tech-done"><h4>⚗ Эликсир</h4><p class="meta">Нужна технология «Алхимия II». Трактат дядюшки обрывается на середине страницы.</p></div>';
  h += '</div>';
  return h;
}
```
## Graveyard/js/screens/crow.js
```
// ЭКРАН ВОРОНА — вёрстка tCrow монолита (адаптация: Math.random -> rng, btn -> cbtn).
import { S } from '../core/state.js';
import { RAVEN_LINES } from '../data/texts.js';
import { ITEMS } from '../data/items.js';
import { orderReady } from '../data/crow.js';
import { flavor } from '../core/flavor.js';

function cbtn(arg, label, cls) {
  return '<button class="btn ' + (cls || '') + '" data-action="' + arg + '">' + label + '</button>';
}

export function initCrow() {
  if (!S.crow.active) {
    return '<h2>Ворон</h2><p class="sub">На ограде сидит важная птица и смотрит сквозь тебя. Пока она считает, что ты мелкая сошка, заказов не будет. Набери 10 репутации — и она присмотрится.</p>';
  }
  let h = '<h2>Ворон</h2><p class="flavor">' + flavor.pick(RAVEN_LINES) + '</p>';
  if (!S.crow.order) h += '<p class="sub">Ворон приносит заказы время от времени. Пока — только карает взглядом.</p>';
  else {
    const o = S.crow.order;
    const need = Object.keys(o.need).map(r => ITEMS[r].i + ' ' + o.need[r] + '/' + (S.res[r] || 0)).join(', ');
    h += '<div class="card"><h4>📦 Заказ: «' + o.n + '»</h4><p class="meta">Нужно: ' + need + '</p>';
    h += '<p class="meta">Награда: ' + Object.keys(o.reward).map(r => (r === 'coins' ? '💰' : r === 'science' ? '📜' : r === 'rep' ? '⭐' : '') + ' ' + o.reward[r]).join(', ') + '</p>';
    h += cbtn('crow-order', 'Сдать заказ', 'green');
    h += '</div>';
  }
  return h;
}
```
## Graveyard/js/screens/graveyard.js
```
import { S } from '../core/state.js';
import { digCost } from '../data/places.js';

// экраны группы graveyard: graveyard, forest, garden — эталон единого стиля (ревизия 22):
// заголовок → подсказка → состояние → карточки действий; кнопки только .btn.
export function initGraveyard() {
  const cleared = S.gravesOpened || 0;
  let h = '<h2>Кладбище</h2><p class="sub">Двадцать участков в тишине. Дядюшка оставил шесть расчистенными — тебе копать.</p>';
  h += `<p>Участков расчищено: ${cleared}/20.</p>`;
  h += '<div class="grid">';
  h += `<div class="card"><h4>⛏️ Копать</h4><p class="meta">Присмотр за могилой: чистка, присыпка, забота. Репутация любит аккуратных.</p><div class="row"><button class="btn gold" data-action="dig">Копать (${digCost()}⚡)</button></div></div>`;
  h += `<div class="card"><h4>🪦 Расчистить участок</h4><p class="meta">${cleared >= 20 ? 'Простор достигнут: все 20 участков уже расчистены.' : 'Свободная могила принимает постояльцев. Цена: 30💰.'}</p><div class="row">${cleared >= 20 ? '' : '<button class="btn" data-action="buy-grave">Расчистить (30💰)</button>'}</div></div>`;
  return h + '</div>';
}
export function initForest() {
  // ревизия 26: тропа протоптана — лес живой (по прецеденту garden-кнопок: проверка энергии на действии)
  return '<h2>Лес</h2><p class="sub">Источник грибов и хвороста. Тропа протоптана — держи в голове дорогу обратно.</p>' +
    '<div class="grid"><div class="card"><h4>🍄 Собрать в лесу</h4><p class="meta">Грибы, хворост; в редкий день — кролик в силке. Час ходьбы: 8⚡.</p><div class="row"><button class="btn gold" data-action="forage">Сходить в лес (8⚡)</button></div></div></div>' +
    '<p class="flavor">За оградой темнеет чаща: пахнет хвоей, грибами и чуть-чуть чужими тайнами. Дядюшка запрещал туда ходить в туман — и очень зря, надо сказать.</p>';
}
export function initGarden() {
  let h = '<h2>Сад</h2><p class="sub">Клумба за оградой: цветы идут в декор похорон.</p>';
  if (!S.plant.owned) {
    return h + '<p class="flavor">За оградой — пустырь. Земля там мягкая, тёплая.</p><div class="row"><button class="btn gold" data-action="buy-bed">Обустроить клумбу (30💰)</button></div>';
  }
  h += '<div class="grid">';
  if (!S.plant.planted) {
    h += `<div class="card"><h4>🌱 Посеять</h4><p class="meta">Грядка пуста. Созреют к дню ${S.day + 1}.</p><div class="row"><button class="btn gold" data-action="plant-seed">Посеять (1🌾, 3⚡)</button></div></div>`;
    h += `<div class="card"><h4>🧪 Удобрить</h4><p class="meta">Удобрение делает урожай щедрее.</p><div class="row"><button class="btn" data-action="fert-bed">Удобрить (1🌱)</button></div></div>`;
  } else if (S.plant.readyDay > S.day) {
    h += `<div class="card"><h4>⏳ Растёт</h4><p class="meta">Созреют к дню ${S.plant.readyDay}.${S.plant.fert ? ' Клумба удобрена.' : ''}</p><div class="row"><button class="btn" data-action="fert-bed" ${S.plant.fert ? 'disabled' : ''}>Удобрить (1🌱)</button></div></div>`;
  } else {
    h += `<div class="card"><h4>🌸 Урожай</h4><p class="meta">Цветы созрели!${S.plant.fert ? ' Клумба удобрена — урожай щедрый.' : ''}</p><div class="row"><button class="btn gold" data-action="harvest">Собрать цветы</button></div></div>`;
  }
  return h + '</div>';
}
```
## Graveyard/js/screens/journal.js
```
import { S, have } from '../core/state.js';
import { ACH } from '../data/achievements.js';
import { ITEMS, SELLABLE } from '../data/items.js';
import { sellPrice } from '../data/market.js';
import { needCheck } from '../data/needs.js';
import { activeGoals } from '../data/goals.js';

function ubtn(k, label, cls, action) {
  const c = needCheck([[k, 1]]);
  const dis = c.ok ? '' : 'disabled';
  return '<button class="btn ' + (cls || '') + '" ' + dis + ' data-action="' + action + '" data-arg="' + k + '">' + label + '</button>' + (c.ok ? '' : '<div class="why">' + c.w + '</div>');
}
export function initAch() {
  let h = '<h2>Достижения</h2><p class="sub">Мелкие радости большой смотрительской карьеры.</p><div class="grid">';
  h += ACH.map((a) => {
    const ok = S.ach[a.id];
    return '<div class="card' + (ok ? ' tech-done' : '') + '"><h4>' + (ok ? '🏆 ' : '🔒 ') + a.n + '</h4><p class="meta">' + a.d + '</p></div>';
  }).join('');
  return h + '</div>';
}

// ---------- журнал (ревизия 31): типы, маркеры, дни, свёртка, фильтр ----------
const LOG_MARKS = {
  all: ['\u{1F4D1}', 'Все'],
  info: ['\u{1F4D6}', 'Общее'],
  money: ['\u{1F4B0}', 'Деньги'],
  burial: ['\u26B0\uFE0F', 'Похороны'],
  crow: ['\u{1F426}', 'Ворон'],
  church: ['\u26EA', 'Церковь'],
  garden: ['\u{1F331}', 'Сад'],
  craft: ['\u{1F528}', 'Крафт'],
  forest: ['\u{1F332}', 'Лес'],
  event: ['\u{1F324}\uFE0F', 'События'],
  quest: ['\u{1F3AF}', 'Поручения'],
};
let logFilter = 'all';
export function setLogFilter(f) { if (LOG_MARKS[f]) logFilter = f; }
export function initLog() {
  let h = '<h2>Журнал смотрителя</h2><p class="sub">Дядюшкина тетрадь в кляксах. Ты продолжаешь писать поверх — как и положено наследнику.</p>';
  const goals = activeGoals();
  if (goals.length) {
    h += '<div class="goal-list"><h3 class="goal-title">Ближайшие цели</h3>' + goals.map((g) => '<div class="goal-item"><span class="goal-marker"></span><span>' + (typeof g.text === 'function' ? g.text(S) : g.text) + '</span></div>').join('') + '</div>';
  }
  h += '<div class="chip-row">' + Object.keys(LOG_MARKS).map((k) =>
    '<button class="chip' + (logFilter === k ? ' chip-on' : '') + '" data-action="log-filter" data-arg="' + k + '">' + LOG_MARKS[k][0] + ' ' + LOG_MARKS[k][1] + '</button>'
  ).join('') + '</div>';
  const entries = S.log.filter((l) => logFilter === 'all' || (l.t || 'info') === logFilter);
  if (!entries.length) return h + '<p class="flavor">В этой рубрике тихо. Тетрадь ждёт записей.</p>';
  const days = [];
  for (const l of entries) {
    let g = days.find((d) => d.day === l.day);
    if (!g) { g = { day: l.day, items: [] }; days.push(g); }
    g.items.push(l);
  }
  h += days.map((d, i) => {
    const rows = d.items.map((l) =>
      '<div class="log-row"><span class="log-mark">' + (LOG_MARKS[l.t || 'info'] || LOG_MARKS.info)[0] + '</span><p class="meta" style="font-size:13px">' + l.text + '</p></div>').join('');
    if (i === 0) return '<div class="card" style="margin-bottom:8px"><h4 style="font-size:13px;color:var(--dim)">День ' + d.day + '</h4>' + rows + '</div>';
    return '<details class="card" style="margin-bottom:8px"><summary style="cursor:pointer;font-size:13px;color:var(--dim)">День ' + d.day + ' · записей: ' + d.items.length + '</summary><div style="margin-top:8px">' + rows + '</div></details>';
  }).join('');
  return h;
}

export function initInv() {
  let h = '<h2>🎒 Сумка</h2><p class="sub">Всё, что нажито непосильным трудом смотрителя. Сундуки под домом не тянут, но помнить надо.</p>';
  const keys = Object.keys(ITEMS).filter((k) => ['coins', 'energy', 'rep', 'science'].indexOf(k) < 0 && have(k) > 0);
  if (!keys.length) {
    h += '<p class="flavor">Пусто. Даже паутина ушла куда-то. Копни землю на кладбище — сумка наполнится быстро.</p>';
    return h;
  }
  h += '<div class="grid">' + keys.map((k) => {
    const it = ITEMS[k];
    let act = '';
    if (k === 'coffee' || k === 'elixir') act = ubtn(k, 'Выпить', 'gold', 'use-item');
    else if (k === 'brain') act = ubtn(k, 'Изучить (4⚡ → 3📜)', '', 'craft');
    if (SELLABLE.indexOf(k) >= 0) act += (act ? ' ' : '') + '<button class="btn" data-action="sell" data-item="' + k + '">Продать на рынке (' + sellPrice(S, k).toFixed(1) + '💰)</button>';
    else if (!act) act = '<p class="meta">На рынке не котируется — пригодится в ремесле или у Густава.</p>';
    return '<div class="card"><h4>' + it.i + ' ' + it.n + ' ×' + have(k) + '</h4><p class="meta">' + it.d + '</p><div class="row">' + act + '</div></div>';
  }).join('') + '</div>';
  return h;
}
```
## Graveyard/js/screens/market.js
```
import { S } from '../core/state.js';
import { ITEMS, INV } from '../data/items.js';
import { MARKET, sellPrice, buys } from '../data/market.js';
import { TECHS } from '../data/techs.js';
import { fmt } from '../core/state.js';
import { needCheck } from '../data/needs.js';

export function initMarket() {
  const shop = Object.entries(MARKET).map(([id]) => {
    const it = ITEMS[id] || { i: '', n: id };
    const price = (S.market[id] !== undefined) ? Math.round(S.market[id] * 10) / 10 : MARKET[id];
    return `<div class="row"><span>${it.i} ${it.n} — ${fmt(price)}💰</span>
      <span><button data-action="buy" data-item="${id}" data-price="${price}">×1</button>
      <button data-action="buy" data-item="${id}" data-price="${price}" data-n="5">×5</button></span></div>`;
  }).join('');
  const rows = INV.filter((id) => (S.res[id] || 0) > 0)
    .map((id) => {
      const it = ITEMS[id] || { i: '', n: id };
      const p = Math.floor(sellPrice(S, id));
      return `<div class="row"><span>${it.i} ${it.n} ×${S.res[id]}</span>
        <span><button data-action="sell" data-item="${id}">Продать</button>
        <button data-action="sell" data-item="${id}" data-n="5">×5</button></span></div>`;
    }).join('') || '<p>Инвентарь пуст.</p>';
  return `<h2>Рынок</h2><p class="sub">День ${S.day}. Цены дрейфуют каждый день — рынок живой.</p><h3>Купить у рынка</h3>${shop}<h3>Продать</h3>${rows}`;
}
// вёрстка tTechs монолита: карточки, flavor, живая кнопка «Изучить (N📜)».
// Причуда 5.4 (вечный дизейбл needCheck([['science',cost]])) исправлена — ветка
// science в needs.js теперь честная.
export function initTechs() {
  const rows = TECHS.map((t) => {
    const owned = !!S.techs[t.id];
    let act;
    if (owned) act = '<span class="trend up">\u2713 Изучено</span>';
    else {
      const c = needCheck([['science', t.cost]]);
      const dis = c.ok ? '' : ' disabled';
      act = '<button class="gold"' + dis + ' data-action="learn" data-arg="' + t.id + '">Изучить (' + t.cost + '\u{1F4DC})</button>'
        + (c.ok ? '' : '<div class="why">' + c.w + '</div>');
    }
    return '<div class="card' + (owned ? ' tech-done' : '') + '"><h4>' + t.n + '</h4><p class="meta">' + t.d + '</p><p class="flavor">' + t.f + '</p>' + act + '</div>';
  }).join('');
  return '<h2>Технологии</h2><p class="sub">Наука — ' + S.science + '\u{1F4DC}. Трактат дядюшки открывается страница за страницей.</p><p class="meta">Изучено: ' + Object.keys(S.techs || {}).length + '/' + TECHS.length + '</p><div class="grid">' + rows + '</div>';
}
// лавка Густава: покупка ресурсов дословно (buys) + скупка свечей/воска/плоти/костей/черепа по 0.8
const GUSTAV_BUYS = ['candle', 'wax', 'flesh', 'bones', 'skull'];
export function initGustav() {
  const shop = buys(S).map(([id, price, note, batch]) => {
    const it = ITEMS[id] || { i: '', n: id };
    return `<div class="row"><span>${it.i || ''} ${note} — ${fmt(price)}💰</span>
      <span><button data-action="buy" data-item="${id}" data-price="${price}"${batch ? ` data-n="${batch}"` : ''}>Купить${batch ? ` ×${batch}` : ''}</button></span></div>`;
  }).join('');
  const sell = GUSTAV_BUYS.filter((id) => (S.res[id] || 0) > 0).map((id) => {
    const it = ITEMS[id] || { i: '', n: id };
    const p = Math.round(sellPrice(S, id) * .8);
    return `<div class="row"><span>${it.i} ${it.n} ×${S.res[id]} — скупка ${fmt(p)}💰</span>
      <span><button data-action="sell-gustav" data-item="${id}">Продать</button></span></div>`;
  }).join('') || '<p>Густаву пока нечего предложить.</p>';
  return `<h2>Густав</h2><p class="sub">«Рад видеть тебя, смотритель».</p><h3>Товар Густава</h3>${shop}<h3>Скупка</h3>${sell}`;
}
```
## Graveyard/js/screens/morgue.js
```
// МОРГ/ВСКРЫТИЕ/ПОХОРОНЫ — вёрстка монолита tMorgue (адаптация только в рендере)
import { ensureStory, wishText } from '../data/stories.js';
import { S } from '../core/state.js';
import { burialState } from '../data/morgue.js';
import { needCheck } from '../data/needs.js';

export function initMorgue() {
  const cap = S.techs.logistics ? 2 : 1;
  let h = '<h2>Морг</h2><p class="sub">Холодный подвал под церковью. Тела ждут своего часа, но недолго: через два дня они начнут портиться, а инспектор — делать записи в блокнот.</p>';
  h += '<p class="meta">Мест: ' + S.corpses.length + '/' + cap + '. Вскрытие приносит ресурсы и +1 к качеству будущих похорон за каждую процедуру.</p>';
  if (!S.corpses.length) h += '<div class="flavor">Морг пуст. Лавка скрипит от сквозняка, и даже паучок в углу выглядит скучающим.</div>';
  h += '<div class="grid">' + S.corpses.map((c, i) => {
    const star = '\u2605'.repeat(c.stars) + '\u2606'.repeat(5 - c.stars);
    // ревизия 24: история тела на карточке (лениво для старых сейвов)
    ensureStory(c);
    const storyLine = '<p class="meta">' + c.occ + ', ' + c.trait + '.</p>'
      + '<p class="meta">Воля: «' + wishText(c) + '»' + (c.family ? ' \u00b7 родные ждут' : '') + '</p>';
    const q = c.extracted ? 'Процедуры: +' + c.extracted + ' к качеству' : '';
    const warn = c.days > 2
      ? '<span class="trend down">\u26A0 Портится! Дней сверх срока: ' + (c.days - 2) + '</span>'
      : '<span class="trend">Свежесть: ещё ' + Math.max(0, 2 - c.days) + ' дн.</span>';
    const cost = S.techs.gentle ? 1 : 2;
    const ex = ['skull', 'brain', 'blood', 'fat', 'bones', 'flesh'].map((r) =>
      '<button data-action="extract" data-n="' + i + '" data-arg="' + r + '">' + ({skull:'Снять череп \u{1F480}',brain:'Извлечь мозг \u{1F9E0}',blood:'Слить кровь \u{1F978}',fat:'Собрать жир \u{1F9D7}',bones:'Вынуть кости \u{1F9B4}',flesh:'Срезать плоть \u{1F969}'}[r]) + ' (' + cost + '\u26A1)</button>').join('');
    let emb;
    if (c.emb) emb = '<p class="meta">\u2713 Бальзамировано</p>';
    else if (!S.techs.embalm) emb = '';
    else {
      const chk = needCheck([['e', 2], ['water', 1], ['fat', 1]]);
      const dis = chk.ok ? '' : ' disabled';
      emb = '<div class="row" style="margin-top:6px"><button class="gold"' + dis + ' data-action="embalm" data-n="' + i + '">\u{1F9F4} Бальзамировать (+1\u2605)</button>'
        + (chk.ok ? '' : '<div class="why">' + chk.w + '</div>') + '</div>';
    }
    return '<div class="card"><h4>' + (c.name ? c.name + ' — ' : 'Тело: ') + '<span style="color:var(--gold)">' + star + '</span></h4><p class="meta">' + q + '</p>' + storyLine + warn + emb + '<div class="row" style="margin-top:6px">' + ex + '</div></div>';
  }).join('') + '</div>';
  return h;
}

// в монолите морг и вскрытие — один экран; вкладка «Вскрытие» показывает то же
export function initAutopsy() {
  return initMorgue().replace('<h2>Морг</h2>', '<h2>Вскрытие</h2>');
}

export function initBurial() {
  const { bs } = burialState();
  if (bs) return '<p>Похороны уже готовятся — смотри окно обряда.</p>';
  const free = S.graves.map((g, i) => ({ g, i })).filter((x) => x.i < S.gravesOpened && !x.g.occ);
  let h = '<h2>Похороны</h2><p class="sub">Тело из морга, свеча, цветы и бальзам. Чем больше декора и процедур — тем выше качество и репутация.</p>';
  if (!S.corpses.length) h += '<div class="flavor">В морге нет тел — похоронить нечего. Ждём ночную повозку.</div>';
  if (!free.length) h += '<p>Нет свободных расчищенных участков.</p>';
  h += free.map((x) => {
    // ревизия 26: апгрейд могилы прямо у участка (ур.2 — камень, ур.3 — мрамор)
    let upg = '';
    if (x.g.level < 2) upg = '<button data-action="upg-grave" data-n="' + x.i + '" data-arg="2">Каменная могила (2🪨 + 10💰)</button>';
    else if (x.g.level === 2) upg = '<button data-action="upg-grave" data-n="' + x.i + '" data-arg="3">Мраморная могила (2🪦 + 25💰)</button>';
    else upg = '<span class="trend up">\u2713 Максимальный уровень</span>';
    return '<div class="card"><p>Участок №' + (x.i + 1) + ' (ур. ' + x.g.level + ')</p><div class="row">' + upg + '</div><button class="gold" data-action="open-burial" data-n="' + x.i + '">Похороны \u2709</button></div>';
  }).join('');
  return h;
}
```
## Graveyard/js/ui/dialog.js
```
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
```
## Graveyard/js/ui/input.js
```
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
```
## Graveyard/js/ui/render.js
```
import { SCREENS } from './router.js';
import { S, fmt } from '../core/state.js';
import { orderReady } from '../data/crow.js';
import { tutBanner } from '../data/tutorial.js';

export function renderTop() {
  const h = document.getElementById('top');
  if (!h) return;
  h.innerHTML = `
    <div class="top-bar">
      <span class="logo">ВЕЧНЫЙ ПОКОЙ</span>
      <div class="stats">
        <span>День: ${S.day}</span>
        <span>Энергия: ${S.energy}/${S.maxEnergy}⚡</span>
        <span>Наука: ${S.science}📜</span>
        <span>Монеты: ${fmt(S.coins)}💰</span>
        <span>Репутация: ${S.rep}⭐</span>
        ${S.rain ? '<span>🌧️ Дождь</span>' : ''}
      </div>
      <button data-action="toggle-sound">${S.sound ? '🔔' : '🔇'}</button>
        <button data-action="help">❔</button>
        <button data-action="reset">↺</button>
        <button data-action="new-day">🌙 Новый день</button>
    </div>`;
}

export function renderTabs() {
  const t = document.getElementById('tabs');
  if (!t) return;
  // вкладки группами (поле group уже в SCREENS): подпись — только там, где вкладок больше одной
  const GROUPS = { graveyard: 'Кладбище', morgue: 'Морг', craft: 'Ремесло', market: 'Рынок', church: 'Церковь', misc: 'Разное' };
  const byG = {}; const order = [];
  for (const s of SCREENS) {
    if (!byG[s.group]) { byG[s.group] = []; order.push(s.group); }
    byG[s.group].push(s);
  }
  t.innerHTML = '<nav class="tab-nav">' + order.map((g) => {
    const items = byG[g].map((s) =>
      `<a href="#" data-screen="${s.id}" class="${S.screen === s.id ? 'active' : ''}">${s.title}${s.hk ? `<span class="hk">${s.hk}</span>` : ''}${s.id === 'crow' && S.crow.active && S.crow.order && orderReady() ? '<span class="badge ok">✓</span>' : ''}</a>`
    ).join('');
    return byG[g].length > 1 ? `<span class="tab-group">${GROUPS[g] || ''}</span>${items}` : items;
  }).join('') + '</nav>';
}

export function renderScreen(html) {
  const c = document.getElementById('content');
  if (!c) return;
  c.innerHTML = `<div class="screen">${tutBanner()}${html}</div>`;
}
```
## Graveyard/js/ui/router.js
```
// единый реестр экранов: массив (одинаковый контракт и в router, и в render)
export const SCREENS = [
  { id: 'graveyard', title: 'Кладбище', group: 'graveyard' , hk: 1 },
  { id: 'forest',    title: 'Лес',      group: 'graveyard' },
  { id: 'garden',    title: 'Сад',      group: 'graveyard' },
  { id: 'morgue',    title: 'Морг',     group: 'morgue' , hk: 2 },
  { id: 'autopsy',   title: 'Вскрытие', group: 'morgue' },
  { id: 'burial',    title: 'Похороны', group: 'morgue' },
  { id: 'craft',     title: 'Ремесло',   group: 'craft' , hk: 3 },
  { id: 'lab',       title: 'Лаборатория', group: 'craft' },
  { id: 'inv',       title: 'Сумка',       group: 'craft' },
  { id: 'market',    title: 'Рынок',    group: 'market' , hk: 4 },
  { id: 'techs',     title: 'Технологии', group: 'market' },
  { id: 'gustav',    title: 'Густав',   group: 'market' },
  { id: 'church',    title: 'Церковь',  group: 'church' , hk: 5 },
  { id: 'sermons',   title: 'Проповеди', group: 'church' },
  { id: 'stats',     title: 'Статистика', group: 'church' },
  { id: 'crow',      title: 'Ворон',    group: 'crow' , hk: 6 },
  { id: 'ach',       title: 'Достижения', group: 'misc' , hk: 8 },
  { id: 'log',       title: 'Журнал',   group: 'misc' , hk: 7 },
];

export function findScreen(id) {
  return SCREENS.find((s) => s.id === id) || SCREENS[0];
}
```
## Graveyard/package.json
```
{"name": "graveyard-6", "version": "6.0.0", "type": "module"}
```
## tools/patches_33.py
```
#!/usr/bin/env python3
# tools/patches_33.py - ревизия 33 «Меню и навигация: хоткеи 1-8»
# Запуск из корня проекта: python3 tools/patches_33.py [ROOT]
# Идемпотентен: повторный прогон не меняет файлы (уже применённые правки пропускаются).
import os, sys, re as _re

ROOT = sys.argv[1] if len(sys.argv) > 1 else '.'

def rd(p): return open(os.path.join(ROOT, p), encoding='utf-8').read()
def wr(p, s): open(os.path.join(ROOT, p), 'w', encoding='utf-8').write(s)

def hk_lines(code):
    order = {'graveyard':1,'morgue':2,'craft':3,'market':4,'church':5,'crow':6,'log':7,'ach':8}
    n = 0
    for sid, hkn in order.items():
        m = _re.search(r"\{ id: '%s'.*?\},\n" % sid, code)
        if not m: raise AssertionError('no line for ' + sid)
        line = m.group(0)
        if 'hk:' in line: continue
        code = code.replace(line, line[:-3] + ", hk: %d },\n" % hkn, 1); n += 1
    return code, n

HOTKEY_FN = '''
// ревизия 33: цифровые хоткеи 1-8 (реестр hk в router.js).
// Игнор: открытая модалка (modalRoot не пуст), фокус в поле ввода.
function initHotkeys() {
  document.addEventListener('keydown', (e) => {
    if (e.key < '1' || e.key > '8') return;
    const mr = document.getElementById('modalRoot');
    if (mr && mr.children.length) return;
    const ae = document.activeElement;
    if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA')) return;
    const s = SCREENS.find((x) => x.hk === Number(e.key));
    if (s && s.id !== S.screen) { e.preventDefault(); switchScreen(s.id); }
  });
}
'''

def p_render(c):
    if 'class="hk"' in c: return c, 0
    f = ">${s.title}${s.id === 'crow'"
    r = ">${s.title}${s.hk ? `<span class=\"hk\">${s.hk}</span>` : ''}${s.id === 'crow'"
    n = c.count(f)
    assert n == 1, 'render.js: anchor found %d times' % n
    return c.replace(f, r), n

def p_import(c):
    f = "import { renderTop, renderTabs, renderScreen } from './ui/render.js';"
    r = f + "\nimport { SCREENS } from './ui/router.js';"
    if "from './ui/router.js'" in c: return c, 0
    n = c.count(f)
    return (c.replace(f, r), n) if n else (c, 0)

def p_boot(c):
    f = "  bus.on('action', handleAction);"
    if 'initHotkeys();' in c: return c, 0
    n = c.count(f)
    return (c.replace(f, f + '\n  initHotkeys();'), n) if n else (c, 0)

def p_fn(c):
    f = "  renderScreen(fn ? fn() : '<p>Экран в разработке</p>');\n}\n"
    if 'function initHotkeys' in c: return c, 0
    n = c.count(f)
    return (c.replace(f, f + HOTKEY_FN), n) if n else (c, 0)

def p_css(c):
    if 'хоткей-бейджи навигации' in c: return c, 0
    return c + '\n/* ревизия 33: хоткей-бейджи навигации */\n.tab-nav .hk{display:inline-block;margin-left:4px;padding:0 4px;border:1px solid var(--border);border-radius:3px;font-size:10px;opacity:.65;vertical-align:middle}\n', 1

patches = [
  ('js/ui/router.js', 'hk-поля 8 основных экранов', hk_lines, 8),
  ('js/ui/render.js', 'бейдж-подсказка hk в renderTabs', p_render, 1),
  ('js/main.js', 'import SCREENS', p_import, 1),
  ('js/main.js', 'initHotkeys() в boot()', p_boot, 1),
  ('js/main.js', 'функция initHotkeys', p_fn, 1),
  ('css/style.css', 'стили хоткей-бейджей', p_css, 1),
]

def patch_file(path, desc, fn, expect):
    c = rd(path)
    new, applied = fn(c)
    if applied == 0 and new == c:
        print('  skip (already):', path, '-', desc); return
    assert applied == expect, '%s: %s: applied %d, expect %d' % (path, desc, applied, expect)
    wr(path, new); print('  ok:', path, '-', desc)

for path, desc, fn, expect in patches:
    patch_file(path, desc, fn, expect)
print('patches_33: done')
```
## tools/patches_34.py
```
#!/usr/bin/env python3
# patches_34.py — ревизия 34: события дня — унификация newDay под контракт.
# Запуск из корня: python3 tools/patches_34.py [ROOT]
# Идемпотентен: повторный прогон ничего не меняет (все патчи дают [skip]).
import os, sys, io

ROOT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.abspath('.')
print('ROOT =', ROOT)

def rd(rel):
    with io.open(os.path.join(ROOT, rel), 'r', encoding='utf-8') as f:
        return f.read()

def wr(rel, t):
    with io.open(os.path.join(ROOT, rel), 'w', encoding='utf-8') as f:
        f.write(t)

def rep(t, old, new, n, label):
    c = t.count(old)
    if c == 0:
        if new in t:
            print('[skip] %-28s (уже применено)' % label)
            return t, 0
        print('[FAIL] %-28s якорь не найден!' % label)
        return t, -1
    if c != n:
        print('[FAIL] %-28s ожидание %d, факт %d' % (label, n, c))
        return t, -1
    print('[ok]   %-28s x%d' % (label, c))
    return t.replace(old, new), c

DAY = 'Graveyard/js/data/day.js'
MAIN = 'Graveyard/js/main.js'
fails = 0

t = rd(DAY)
NOTE_OLD = (
  "// newDay — дословно из монолита 5.4 (Math.random -> rng, showVictory -> флаг victory).\n"
  "// morningEvent — дословно из монолита 5.4 (Math.random -> rng, window._thief -> thief)."
)
NOTE_NEW = (
  "// newDay — переход дня (ревизия 34: контракт {ok, victory}, поле toasts снято —\n"
  "// за всю жизнь проекта ни разу не наполнялось; все сообщения идут через log()).\n"
  "// morningEvent — дословно из монолита 5.4 (Math.random -> rng, window._thief -> thief)."
)
t, c = rep(t, NOTE_OLD, NOTE_NEW, 1, 'day: комментарий newDay'); fails += (c < 0)
t, c = rep(t, "  const toasts = [];\n", "", 1, 'day: снято const toasts'); fails += (c < 0)
t, c = rep(t, "  return { ok: true, toasts, victory };", "  return { ok: true, victory };", 1, 'day: возврат newDay'); fails += (c < 0)
for old, n, lab in [
    ("if (S.coins < 5) return { ok: false, toast: 'Не хватает монет' };", 2, 'day: отказ монеты<5'),
    ("if (S.coins < 12) return { ok: false, toast: 'Не хватает монет' };", 1, 'day: отказ монеты<12'),
    ("if (!spendE(10)) return { ok: false, toast: 'Слишком мало энергии' };", 3, 'day: отказ энергия 10'),
    ("if (!spendE(5)) return { ok: false, toast: 'Слишком мало энергии' };", 1, 'day: отказ энергия 5'),
]:
    t, c = rep(t, old, old[:-2] + ", sfx: 'error' };", n, lab); fails += (c < 0)
wr(DAY, t)

t = rd(MAIN)
t, c = rep(t,
    "      for (const t of r.toasts || []) toast(t);",
    "      // ревизия 34: поле toasts снято из контракта newDay ({ok, victory}) —\n"
    "      // сообщения дня идут через log() внутри newDay, тосты здесь не нужны.",
    1, 'main: снят мёртвый цикл r.toasts'); fails += (c < 0)
t, c = rep(t,
    "      if (!r.ok) { toast(r.toast); sfx('error'); break; } // модалка остаётся, как в монолите",
    "      if (!r.ok) { if (!r.silent) toast(r.toast); if (r.sfx) sfx(r.sfx); break; } // модалка остаётся, как в монолите (ревизия 34: sfx из data)",
    1, 'main: event-choice контракт'); fails += (c < 0)
wr(MAIN, t)

print('итого FAIL:', fails)
sys.exit(1 if fails else 0)
```
## tools/smoke.mjs
```
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
```
## tools/patches_35.py
```
#!/usr/bin/env python3
# patches_35.py — ревизия 35: sfx до конца data-слоя.
# 27 отказов {ok:false, toast:...} в шести модулях получают sfx: 'error' из data;
# кейс open-burial в main.js: захардкоженный sfx('error') снят — звук из data;
# косметика smoke.mjs: комментарии ссылаются на актуальное имя файла.
# Запуск из корня: python3 tools/patches_35.py [ROOT]
import os, sys, io, re

ROOT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.abspath('.')
DATA = os.path.join(ROOT, 'Graveyard', 'js', 'data')
fails = 0

# 1) data-слой: каждый однострочный отказ {ok:false, toast:...} без sfx получает sfx:'error'
EXPECT = {'church.js': 3, 'garden.js': 5, 'places.js': 9, 'crow.js': 1, 'morgue.js': 8, 'market.js': 1}
PAT = re.compile(r"return \{ ok: false, toast: (.+?) \};" + re.escape(' '))
for fn, n_exp in sorted(EXPECT.items()):
    p = os.path.join(DATA, fn)
    t = io.open(p, encoding='utf-8').read()
    lines = t.split('\n')
    hits = 0
    for i, ln in enumerate(lines):
        if 'ok: false' in ln and 'toast:' in ln and 'sfx' not in ln and 'return {' in ln:
            lines[i] = re.sub(r"return \{ ok: false, toast: (.+?) \};",
                              r"return { ok: false, toast: \1, sfx: 'error' };", ln, count=1)
            hits += 1
    if hits == 0 and n_exp > 0:
        # идемпотентность: проверяем, что все n_exp отказов уже несут sfx
        already = sum(1 for ln in io.open(p, encoding='utf-8').read().split('\n')
                      if 'ok: false' in ln and 'toast:' in ln and "sfx: 'error'" in ln)
        if already >= n_exp:
            print('[skip] %-12s ожидание %d (уже применено: %d)' % (fn, n_exp, already))
        else:
            print('[FAIL] %-12s не найден якорь, уже применено %d/%d' % (fn, already, n_exp)); fails += 1
        continue
    if hits != n_exp:
        print('[FAIL] %-12s замен %d, ожидание %d' % (fn, hits, n_exp)); fails += 1
        continue
    io.open(p, 'w', encoding='utf-8').write('\n'.join(lines))
    print('[ok]   %-12s x%d' % (fn, hits))

# 2) main.js: fallback кейса open-burial — звук из data вместо захардкода
p = os.path.join(ROOT, 'Graveyard', 'js', 'main.js')
t = io.open(p, encoding='utf-8').read()
OLD = "      if (!r.ok && r.toast) { toast(r.toast); sfx('error'); }"
NEW = "      if (!r.ok && r.toast) { if (!r.silent) toast(r.toast); if (r.sfx) sfx(r.sfx); } // ревизия 35: звук из data"
if OLD in t:
    t = t.replace(OLD, NEW, 1); io.open(p, 'w', encoding='utf-8').write(t)
    print('[ok]   %-12s x1' % 'main: fallback')
elif NEW.split(' //')[0] in t:
    print('[skip] %-12s (уже применено)' % 'main: fallback')
else:
    print('[FAIL] %-12s якорь не найден!' % 'main: fallback'); fails += 1

# 3) smoke.mjs: косметика имён в комментариях
p = os.path.join(ROOT, 'tools', 'smoke.mjs')
t = io.open(p, encoding='utf-8').read()
for old, new, lab in [
    ('// tools/smoke.js — харнесс смоука', '// tools/smoke.mjs — харнесс смоука', 'smoke: шапка'),
    ('// Запуск из корня проекта: node tools/smoke.js', '// Запуск из корня проекта: node tools/smoke.mjs', 'smoke: запуск'),
]:
    if old in t:
        t = t.replace(old, new, 1); io.open(p, 'w', encoding='utf-8').write(t)
        print('[ok]   %-28s x1' % lab)
    elif new in t:
        print('[skip] %-28s (уже применено)' % lab)
    else:
        print('[FAIL] %-28s якорь не найден!' % lab); fails += 1

print('итого FAIL:', fails); sys.exit(1 if fails else 0)
```
