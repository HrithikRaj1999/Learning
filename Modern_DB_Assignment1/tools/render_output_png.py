"""Render a captured console log into paginated terminal-style PNG screenshots."""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

FONT_PATH = r"C:\Windows\Fonts\consola.ttf"
FONT_SIZE = 16
PADDING = 18
LINES_PER_PAGE = 46
BG = (12, 12, 12)
FG = (220, 220, 220)
HEADER_BG = (30, 30, 30)
HEADER_FG = (120, 200, 255)


def render(source: Path, out_dir: Path, title: str, prefix: str) -> list[Path]:
    font = ImageFont.truetype(FONT_PATH, FONT_SIZE)
    lines = source.read_text(encoding="utf-8", errors="replace").splitlines()
    lines = [ln.rstrip() for ln in lines]

    char_w = font.getlength("M")
    line_h = FONT_SIZE + 5
    max_cols = max((len(ln) for ln in lines), default=80)
    max_cols = max(max_cols, len(title) + 10)
    width = int(PADDING * 2 + char_w * max_cols)

    out_dir.mkdir(parents=True, exist_ok=True)
    pages = [lines[i:i + LINES_PER_PAGE] for i in range(0, len(lines), LINES_PER_PAGE)] or [[]]
    written = []

    for idx, page in enumerate(pages, start=1):
        header = f" {title}  -  page {idx}/{len(pages)}"
        height = int(PADDING * 2 + line_h * (len(page) + 2))
        img = Image.new("RGB", (width, height), BG)
        draw = ImageDraw.Draw(img)
        draw.rectangle([0, 0, width, PADDING + line_h], fill=HEADER_BG)
        draw.text((PADDING, PADDING // 2), header, font=font, fill=HEADER_FG)

        y = PADDING + line_h + line_h // 2
        for line in page:
            draw.text((PADDING, y), line, font=font, fill=FG)
            y += line_h

        path = out_dir / f"{prefix}_page{idx:02d}.png"
        img.save(path)
        written.append(path)

    return written


if __name__ == "__main__":
    src = Path(sys.argv[1])
    dest = Path(sys.argv[2])
    caption = sys.argv[3]
    name = sys.argv[4]
    for p in render(src, dest, caption, name):
        print(p)
