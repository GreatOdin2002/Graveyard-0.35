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
