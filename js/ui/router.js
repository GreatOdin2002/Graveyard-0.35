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
