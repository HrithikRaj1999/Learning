"""Usage: save_pdf <full path to .md>  ->  writes <same name>.pdf next to it."""
import re, sys, subprocess, pathlib, tempfile, markdown

# join args so an unquoted path with spaces still works
arg = ' '.join(sys.argv[1:]).strip('"')
if not arg or not pathlib.Path(arg).is_file():
    sys.exit(f'File not found: {arg!r}\nUsage: save_pdf <full path to .md file>')
src = pathlib.Path(arg).resolve()
out_pdf = src.with_suffix('.pdf')
tmp_html = pathlib.Path(tempfile.gettempdir()) / (src.stem + '_print.html')

md_text = src.read_text(encoding='utf-8')
WIDE_COLS = 250                    # wider code blocks than this get their own wide page
blocks = [b.split('\n') for b in re.findall(r'```[^\n]*\n(.*?)\n```', md_text, re.S)]
wide = [b for b in blocks if max(len(l) for l in b) > WIDE_COLS]
cols = max((len(l) for b in wide for l in b), default=0)
rows = max((len(b) for b in wide), default=0)

FONT_PX = 10
CHAR_W = 0.55 * FONT_PX           # Consolas advance width
LINE_H = 1.2 * FONT_PX
PX_MM = 25.4 / 96
page_w = int(cols * CHAR_W * PX_MM) + 40
page_h = max(200, int(rows * LINE_H * PX_MM) + 50)

# python-markdown needs 4-space nesting; source uses 2
md_text = re.sub(r'(?m)^( +)(- )', lambda m: ' ' * (len(m.group(1)) * 2) + m.group(2), md_text)
# md_in_html: <table>/<tr> parents must be marked too, and <td> needs "block" (else lists stay inline)
md_text = re.sub(r'<table([^>]*)><tr>', r'<table\1 markdown="1"><tr markdown="1">', md_text)
md_text = re.sub(r'(<td[^>]*) markdown="1"', r'\1 markdown="block"', md_text)
body = markdown.markdown(md_text, extensions=['fenced_code', 'tables', 'md_in_html'])
def wrap_wide(m):
    text = re.sub(r'<[^>]+>', '', m.group(2))
    return f'<div class="wide">{m.group(0)}</div>' if max(len(l) for l in text.split('\n')) > WIDE_COLS else m.group(0)
body = re.sub(r'(<h[23][^>]*>[^<]*</h[23]>\s*)?<pre>(.*?)</pre>', wrap_wide, body, flags=re.S)

css = f'''
@page {{ size: A3 landscape; margin: 12mm; }}
@page wide {{ size: {page_w}mm {page_h}mm; margin: 10mm; }}
.wide {{ page: wide; }}
body {{ font-family: "Segoe UI", Arial, sans-serif; font-size: 12px; color: #222; }}
h1 {{ font-size: 24px; border-bottom: 2px solid #ddd; }}
h2 {{ font-size: 18px; border-bottom: 1px solid #ddd; margin-top: 18px; }}
h3 {{ font-size: 14px; margin: 12px 0 6px; }}
h2, h3, h3 + p {{ break-after: avoid; page-break-after: avoid; }}
table {{ border-collapse: collapse; width: 100%; margin: 6px 0; page-break-inside: avoid; }}
th, td {{ border: 1px solid #ccc; padding: 4px 6px; vertical-align: top; word-wrap: break-word; }}
th {{ background: #f3f3f3; }}
code {{ font-family: Consolas, monospace; background: #f3f3f3; padding: 0 3px; font-size: 11px; }}
pre {{ font-family: Consolas, monospace; font-size: {FONT_PX}px; line-height: {LINE_H}px;
       white-space: pre; overflow: visible; margin: 0; }}
pre code {{ background: none; padding: 0; font-size: inherit; }}

table.cols {{ table-layout: fixed; margin: 4px 0 10px; }}
table.cols td {{ border: none; padding: 0 20px 0 0; }}
li {{ break-inside: avoid; margin: 1px 0; }}
li ul {{ display: block !important; padding-left: 16px; margin: 0; }}
blockquote {{ color: #555; border-left: 3px solid #ccc; margin: 0; padding-left: 10px; }}
'''
tmp_html.write_text(f'<!doctype html><html><head><meta charset="utf-8"><style>{css}</style></head><body>{body}</body></html>', encoding='utf-8')

edge = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
subprocess.run([edge, '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
                f'--print-to-pdf={out_pdf}', tmp_html.as_uri()], check=True, timeout=120)
tmp_html.unlink(missing_ok=True)
print(out_pdf, out_pdf.stat().st_size, 'bytes' + (f'; wide page {page_w} x {page_h} mm' if wide else ''))
