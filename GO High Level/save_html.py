"""Usage: save_html <.md file or folder> ...  ->  writes <same name>.html next to each .md (self-contained, phone friendly)."""
import re, sys, html, pathlib, markdown

CSS = '''
:root { --bg:#f7f8fb; --card:#fff; --text:#1f2430; --muted:#5b6475; --line:#e3e6ee; --accent:#4f46e5;
        --code-bg:#f2f4f9; --pre-bg:#fbfcfe; --quote:#eef0ff; }
[data-theme=dark] { --bg:#0f1218; --card:#171b24; --text:#e4e7ee; --muted:#9aa3b5; --line:#2a3040; --accent:#8b8cff;
        --code-bg:#222838; --pre-bg:#12161e; --quote:#1d2140; color-scheme:dark; }
* { box-sizing:border-box; }
html { scroll-behavior:smooth; scroll-padding-top:64px; -webkit-text-size-adjust:100%; }
body { margin:0; background:var(--bg); color:var(--text); font:16px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif; }
header { position:sticky; top:0; z-index:10; display:flex; align-items:center; gap:8px; padding:8px 12px;
         background:var(--card); border-bottom:1px solid var(--line); box-shadow:0 1px 6px rgba(0,0,0,.06); }
header .title { flex:1; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
button { font:inherit; font-size:14px; min-width:40px; height:36px; padding:0 10px; border:1px solid var(--line);
         border-radius:8px; background:var(--bg); color:var(--text); cursor:pointer; }
#progress { position:fixed; top:0; left:0; height:3px; background:var(--accent); width:0; z-index:11; }
nav { position:fixed; top:0; bottom:0; left:0; width:min(320px,85vw); background:var(--card); border-right:1px solid var(--line);
      transform:translateX(-100%); transition:transform .2s; z-index:20; overflow-y:auto; padding:16px; }
nav.open { transform:none; box-shadow:4px 0 24px rgba(0,0,0,.2); }
nav ul { list-style:none; padding-left:12px; margin:0; } nav > div > ul { padding-left:0; }
nav a { display:block; padding:6px 4px; color:var(--text); text-decoration:none; border-radius:6px; font-size:14px; }
nav a:hover { background:var(--quote); color:var(--accent); }
#shade { display:none; position:fixed; inset:0; background:rgba(0,0,0,.35); z-index:15; } #shade.open { display:block; }
main { margin:4px; padding:4px; }
article { background:var(--card); border:1px solid var(--line); border-radius:8px; padding:4px; margin:4px; }
h1 { font-size:1.8em; line-height:1.25; margin:.2em 0 .6em; }
h2 { font-size:1.4em; margin-top:2em; padding-bottom:.3em; border-bottom:2px solid var(--line); }
h3 { font-size:1.15em; margin-top:1.6em; color:var(--accent); }
h1,h2,h3,h4 { scroll-margin-top:64px; }
a { color:var(--accent); }
p, li { overflow-wrap:anywhere; }
li { margin:3px 0; }
blockquote { margin:12px 0; padding:10px 14px; background:var(--quote); border-left:4px solid var(--accent); border-radius:0 8px 8px 0; }
blockquote p { margin:4px 0; }
code { font-family:Consolas,"Cascadia Mono",Menlo,"DejaVu Sans Mono","Roboto Mono",monospace; font-size:.88em;
       background:var(--code-bg); padding:1px 5px; border-radius:4px; }
.pre-wrap { position:relative; margin:14px 0; border:1px solid var(--line); border-radius:10px; background:var(--pre-bg); }
.pre-wrap .tools { position:sticky; left:0; display:flex; gap:6px; justify-content:flex-end; padding:6px;
                   border-bottom:1px solid var(--line); }
.pre-wrap .tools button { height:30px; min-width:34px; font-size:13px; }
pre { margin:0; padding:12px; overflow:auto; max-height:80vh; -webkit-overflow-scrolling:touch; touch-action:pan-x pan-y pinch-zoom; }
pre code { background:none; padding:0; font-size:var(--pre-size,12px); line-height:1.15; white-space:pre; display:block; }
.table-scroll { overflow-x:auto; margin:12px 0; }
table { border-collapse:collapse; width:100%; font-size:.95em; }
th, td { border:1px solid var(--line); padding:8px 10px; vertical-align:top; text-align:left; }
th { background:var(--code-bg); }
tr:nth-child(even) td { background:color-mix(in srgb,var(--code-bg) 40%,transparent); }
table.cols { table-layout:fixed; }
table.cols td { background:none !important; border:none; padding:0 16px 0 0; }
table.cols h3 { margin-top:.6em; }
@media (max-width:700px) {
  body { font-size:15px; }
  table.cols, table.cols tbody, table.cols tr, table.cols td { display:block; width:100%; }
  table.cols td:empty { display:none; }
}
#top { position:fixed; right:16px; bottom:16px; border-radius:50%; width:46px; height:46px; display:none;
       background:var(--accent); color:#fff; border:none; box-shadow:0 4px 12px rgba(0,0,0,.25); z-index:12; font-size:20px; }
'''

JS = '''
const root=document.documentElement, nav=document.querySelector('nav'), shade=document.getElementById('shade');
root.dataset.theme=localStorage.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
const toggleNav=o=>{nav.classList.toggle('open',o);shade.classList.toggle('open',o);};
document.getElementById('menu').onclick=()=>toggleNav(true);
shade.onclick=()=>toggleNav(false);
nav.querySelectorAll('a').forEach(a=>a.onclick=()=>toggleNav(false));
document.getElementById('theme').onclick=()=>{root.dataset.theme=localStorage.theme=root.dataset.theme==='dark'?'light':'dark';};
let fs=+(localStorage.fs||16); const setFs=d=>{fs=Math.min(26,Math.max(11,fs+d));document.body.style.fontSize=fs+'px';localStorage.fs=fs;};
setFs(0); document.getElementById('aminus').onclick=()=>setFs(-1); document.getElementById('aplus').onclick=()=>setFs(1);
document.querySelectorAll('.pre-wrap').forEach(w=>{
  const pre=w.querySelector('pre'); let s=12; const set=v=>{s=Math.min(24,Math.max(4,v));pre.style.setProperty('--pre-size',s+'px');};
  w.querySelector('.zin').onclick=()=>set(s+1); w.querySelector('.zout').onclick=()=>set(s-1);
  w.querySelector('.fit').onclick=()=>{set(12);const c=pre.querySelector('code');set(Math.floor(12*(pre.clientWidth-24)/c.scrollWidth));};
  w.querySelector('.full').onclick=()=>{pre.style.maxHeight=pre.style.maxHeight?'':'none';};
});
const bar=document.getElementById('progress'), top=document.getElementById('top');
addEventListener('scroll',()=>{const h=root.scrollHeight-innerHeight;bar.style.width=(h>0?scrollY/h*100:0)+'%';top.style.display=scrollY>600?'block':'none';},{passive:true});
top.onclick=()=>scrollTo(0,0);
'''


def convert(src: pathlib.Path):
    md_text = src.read_text(encoding='utf-8')
    # same preprocessing as save_pdf.py: 2-space nesting -> 4, and md_in_html for <table class="cols">
    md_text = re.sub(r'(?m)^( +)(- )', lambda m: ' ' * (len(m.group(1)) * 2) + m.group(2), md_text)
    md_text = re.sub(r'<table([^>]*)><tr>', r'<table\1 markdown="1"><tr markdown="1">', md_text)
    md_text = re.sub(r'(<td[^>]*) markdown="1"', r'\1 markdown="block"', md_text)
    md = markdown.Markdown(extensions=['fenced_code', 'tables', 'md_in_html', 'toc'],
                           extension_configs={'toc': {'toc_depth': '2-3'}})
    body = md.convert(md_text)
    tools = ('<div class="tools"><button class="zout" title="Smaller">−</button><button class="zin" title="Bigger">+</button>'
             '<button class="fit" title="Fit width">Fit</button><button class="full" title="Expand height">↕</button></div>')
    body = re.sub(r'<pre>(.*?)</pre>', lambda m: f'<div class="pre-wrap">{tools}<pre>{m.group(1)}</pre></div>', body, flags=re.S)
    body = re.sub(r'<table(?![^>]*class="cols")(.*?)</table>', r'<div class="table-scroll"><table\1</table></div>', body, flags=re.S)
    h1 = re.search(r'<h1[^>]*>(.*?)</h1>', body, re.S)
    title = re.sub(r'<[^>]+>', '', h1.group(1)).strip() if h1 else src.stem
    page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=10, user-scalable=yes">
<title>{html.escape(title)}</title><style>{CSS}</style></head><body>
<div id="progress"></div>
<header><button id="menu" title="Contents">☰</button><span class="title">{html.escape(title)}</span>
<button id="aminus" title="Smaller text">A−</button><button id="aplus" title="Bigger text">A+</button><button id="theme" title="Light / dark">◐</button></header>
<nav><strong>Contents</strong>{md.toc}</nav><div id="shade"></div>
<main><article>{body}</article></main><button id="top" title="Back to top">↑</button>
<script>{JS}</script></body></html>'''
    out = src.with_suffix('.html')
    out.write_text(page, encoding='utf-8')
    print(out, out.stat().st_size, 'bytes')


args = [pathlib.Path(a.strip('"')) for a in sys.argv[1:]]
if not args:
    sys.exit('Usage: save_html <.md file or folder> ...')
for p in args:
    if p.is_dir():
        for f in sorted(p.rglob('*.md')):
            convert(f)
    elif p.is_file() and p.suffix == '.md':
        convert(p)
    else:
        sys.exit(f'Not a .md file or folder: {p}')
