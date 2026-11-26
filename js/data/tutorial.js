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
