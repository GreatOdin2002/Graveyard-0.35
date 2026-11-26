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
