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
