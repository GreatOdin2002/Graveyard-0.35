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
