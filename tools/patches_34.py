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
