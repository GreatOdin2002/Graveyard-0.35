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
