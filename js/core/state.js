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
