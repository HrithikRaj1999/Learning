from __future__ import annotations

import argparse
from dataclasses import dataclass, field
import hashlib
import importlib.util
import json
import math
import os
from pathlib import Path
import re
import shutil
import subprocess
from xml.sax.saxutils import escape

import fitz
from PIL import Image, ImageDraw, ImageFont, ImageStat
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

from verify_prep import CHAPTERS, FORBIDDEN, MARKDOWN, QUESTION, check_chapter


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "Modern_Databases_Essential_Visual_Revision.pdf"
PREVIEW = ROOT / "_pdf_preview"
LAYOUT_PATH = ROOT.parent / "Study Material" / "Lectures 1-3" / "build_lectures_1_3.py"
SPECIFICATION = importlib.util.spec_from_file_location("lecture_layout", LAYOUT_PATH)
layout = importlib.util.module_from_spec(SPECIFICATION)
SPECIFICATION.loader.exec_module(layout)
PAGE_WIDTH, PAGE_HEIGHT = 1120, 790
MARGIN, COLUMN_GAP, PANEL_GAP = 40, 24, 14
INK = colors.HexColor("#192D2B")
MUTED = colors.HexColor("#53676A")
ACCENTS = [colors.HexColor(value) for value in ("#087D70", "#315FAC", "#A84738")]
SURFACES = [colors.HexColor(value) for value in ("#EEF7F3", "#EFF4FC", "#FFF2EE")]
LECTURES = {
    1: "Foundations",
    2: "SQL and Transactions",
    3: "Distributed Foundations",
    4: "Transactions and Consistency",
    5: "NoSQL and Key-Value Stores",
    6: "Document Databases",
    7: "Wide-Column and Graph Databases",
    8: "Search and Polyglot Persistence",
}


@dataclass
class Block:
    kind: str
    value: str
    plain: str = ""
    depth: int = 0
    image: Path | None = None


@dataclass
class Group:
    title: str
    plain: str
    blocks: list[Block] = field(default_factory=list)


@dataclass
class Question:
    number: int
    lecture: int
    title: str
    groups: list[Group]


def inline_text(token) -> tuple[str, str]:
    markup, plain = [], []
    for child in token.children or []:
        if child.type == "text":
            markup.append(escape(child.content))
            plain.append(child.content)
        elif child.type == "code_inline":
            markup.append(f'<font name="Mono">{escape(child.content)}</font>')
            plain.append(child.content)
        elif child.type in ("strong_open", "strong_close", "em_open", "em_close"):
            markup.append({"strong_open": "<b>", "strong_close": "</b>", "em_open": "<i>", "em_close": "</i>"}[child.type])
        elif child.type in ("softbreak", "hardbreak"):
            markup.append(" ")
            plain.append(" ")
        else:
            raise ValueError(f"Unsupported inline Markdown: {child.type}")
    return "".join(markup), "".join(plain)


def parse_question(number: int, lecture: int, section: str) -> Question:
    heading = QUESTION.search(section)
    groups = []
    in_answer = False
    depth = 0
    for token in MARKDOWN.parse(section):
        if token.type == "blockquote_open":
            in_answer = True
            continue
        if token.type == "blockquote_close":
            break
        if not in_answer:
            continue
        if token.type == "bullet_list_open":
            depth += 1
        elif token.type == "bullet_list_close":
            depth -= 1
        elif token.type == "inline":
            value, plain = inline_text(token)
            if depth == 1:
                groups.append(Group(value, plain))
            else:
                groups[-1].blocks.append(Block("bullet", value, plain, depth - 2))
        elif token.type == "fence":
            kind = "diagram" if token.info == "mermaid" else "code"
            groups[-1].blocks.append(Block(kind, token.content.rstrip(), token.content.rstrip()))
    if not groups:
        raise ValueError(f"Q{number} has no answer groups")
    return Question(number, lecture, heading.group(2), groups)


def load_questions() -> list[Question]:
    return [
        parse_question(number, lecture, section)
        for lecture in CHAPTERS
        for number, section in check_chapter(lecture).items()
    ]


def render_diagrams(questions: list[Question]) -> None:
    diagrams = [block for question in questions for group in question.groups for block in group.blocks if block.kind == "diagram"]
    if not diagrams:
        return
    configuration = {
        "theme": "base",
        "themeVariables": {
            "fontFamily": "Calibri",
            "fontSize": "20px",
            "primaryColor": "#EFF7F3",
            "primaryTextColor": "#192D2B",
            "primaryBorderColor": "#087D70",
            "lineColor": "#53676A",
            "secondaryColor": "#EFF4FC",
            "tertiaryColor": "#FFF2EE",
        },
        "flowchart": {"htmlLabels": False, "curve": "linear", "nodeSpacing": 24, "rankSpacing": 30},
    }
    missing = {}
    for block in diagrams:
        digest = hashlib.sha256((json.dumps(configuration, sort_keys=True) + block.value).encode()).hexdigest()[:20]
        block.image = PREVIEW / f"diagram_{digest}.png"
        if not block.image.exists():
            missing[digest] = block
    if not missing:
        return
    browser = next((path for path in (
        Path("C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"),
        Path("C:/Program Files/Microsoft/Edge/Application/msedge.exe"),
        Path("C:/Program Files/Google/Chrome/Application/chrome.exe"),
    ) if path.exists()), None)
    if browser is None:
        raise RuntimeError("Install Edge or Chrome to render Mermaid diagrams")
    source = PREVIEW / "diagrams.md"
    rendered = PREVIEW / "rendered_diagrams.md"
    config_path = PREVIEW / "mermaid.json"
    browser_config = PREVIEW / "puppeteer.json"
    source.write_text("\n\n".join(f"```mermaid\n{block.value}\n```" for block in missing.values()), encoding="utf-8")
    config_path.write_text(json.dumps(configuration), encoding="utf-8")
    browser_config.write_text(json.dumps({"executablePath": str(browser), "headless": True}), encoding="utf-8")
    executable = shutil.which("mmdc")
    npm = shutil.which("npm")
    if not executable and not npm:
        raise RuntimeError("Node.js/npm is required for the Mermaid renderer")
    command = [executable] if executable else [npm, "exec", "--yes", "--package=@mermaid-js/mermaid-cli", "--", "mmdc"]
    command.extend(["-i", str(source), "-o", str(rendered), "-e", "png", "-b", "transparent", "-s", "2", "-c", str(config_path), "-p", str(browser_config)])
    environment = {**os.environ, "PUPPETEER_SKIP_DOWNLOAD": "true"}
    result = subprocess.run(command, capture_output=True, text=True, env=environment)
    if result.returncode:
        raise RuntimeError(f"Mermaid rendering failed:\n{result.stdout}\n{result.stderr}")
    images = [
        child.attrGet("src") for token in MARKDOWN.parse(rendered.read_text(encoding="utf-8"))
        for child in token.children or [] if child.type == "image"
    ]
    if len(images) != len(missing):
        raise ValueError(f"Expected {len(missing)} diagrams, received {len(images)}")
    for block, target in zip(missing.values(), images, strict=True):
        shutil.copyfile(rendered.parent / target, block.image)
    print(f"PASS: rendered {len(missing)} Mermaid diagrams using the installed browser.")


def paragraph(value: str, size: float, *, bold: bool = False) -> Paragraph:
    style = ParagraphStyle(
        "answer", fontName="BodyBold" if bold else "Body", fontSize=size,
        leading=size * 1.25, textColor=INK, splitLongWords=False,
        allowWidows=0, allowOrphans=0,
    )
    return Paragraph(value, style)


def group_layout(group: Group, width: float, size: float):
    content_width = width - 48
    heading = paragraph(group.title, size + 1, bold=True)
    _, heading_height = heading.wrap(content_width, 2000)
    measured = [("heading", heading, heading_height, 0, None)]
    height = heading_height + 32
    for block in group.blocks:
        if block.kind == "bullet":
            indent = 15 + block.depth * 18
            content = paragraph(block.value, size - block.depth * 0.7)
            _, used = content.wrap(content_width - indent, 2000)
            measured.append(("bullet", content, used, indent, block))
            height += used + 7
        elif block.kind == "code":
            code_width = width - 32
            longest = max(pdfmetrics.stringWidth(line, "Mono", 1) for line in block.value.splitlines())
            code_size = min(12.8, code_width / max(longest, 1), size * 0.79)
            if code_size < 9.8:
                raise ValueError(f"Code cannot fit readably: {group.plain}")
            used = len(block.value.splitlines()) * code_size * 1.3 + 8
            measured.append(("code", code_size, used, 0, block))
            height += used + 7
        else:
            with Image.open(block.image) as image:
                image_width, image_height = image.size
            scale = min((width - 36) / image_width, 184 / image_height)
            used = image_height * scale
            measured.append(("diagram", (image_width * scale, used), used, 0, block))
            height += used + 9
    return height, measured


def question_layout(question: Question, available: float):
    width = (PAGE_WIDTH - 2 * MARGIN - COLUMN_GAP) / 2
    for size in (19, 18, 17, 16, 15, 14):
        groups = [group_layout(group, width, size) for group in question.groups]
        options = []
        for split in range(1, len(groups)):
            left = sum(group[0] for group in groups[:split]) + PANEL_GAP * (split - 1)
            right = sum(group[0] for group in groups[split:]) + PANEL_GAP * (len(groups) - split - 1)
            options.append((max(left, right), abs(left - right), split))
        required, _, split = min(options)
        if required <= available:
            return width, groups, split, size
    raise ValueError(f"Q{question.number} exceeds one readable page")


def draw_group(document, group, measured, left, top, width, index):
    height, rows = measured
    accent = ACCENTS[index % len(ACCENTS)]
    document.setFillColor(SURFACES[index % len(SURFACES)])
    document.roundRect(left, top - height, width, height, 6, fill=1, stroke=0)
    document.setStrokeColor(accent)
    document.setLineWidth(2.5)
    document.line(left + 1.5, top - 14, left + 1.5, top - height + 14)
    cursor = top - 16
    for kind, content, used, indent, block in rows:
        if kind in ("heading", "bullet"):
            text_left = left + 31 + indent
            document.setFillColor(accent if kind == "heading" else MUTED)
            radius = 2.7 if kind == "heading" else 1.65
            baseline = cursor - content.style.fontSize * 0.71
            document.circle(text_left - 10, baseline, radius, fill=0 if block and block.depth else 1, stroke=1)
            content.drawOn(document, text_left, cursor - used)
        elif kind == "code":
            document.setFont("Mono", content)
            document.setFillColor(INK)
            code_top = cursor - content
            for line in block.value.splitlines():
                document.drawString(left + 16, code_top, line)
                code_top -= content * 1.3
        else:
            image_width, image_height = content
            document.drawImage(
                ImageReader(str(block.image)), left + (width - image_width) / 2,
                cursor - image_height, width=image_width, height=image_height, mask="auto",
            )
        cursor -= used + (10 if kind == "heading" else 7)
    if cursor < top - height + 5:
        raise ValueError(f"Panel overflow: {group.plain}")
    return height


def build_pdf(questions: list[Question], output: Path) -> list[dict]:
    document = canvas.Canvas(str(output), pagesize=(PAGE_WIDTH, PAGE_HEIGHT), pageCompression=1)
    document.setTitle("Modern Databases | Essential Questions and Visual Answers")
    document.setSubject("Selected classroom and core questions, with hierarchical answers and diagrams")
    chapters = set()
    pages = []
    for page_index, question in enumerate(questions, 1):
        document.setFillColor(colors.white)
        document.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
        document.setFillColor(ACCENTS[0])
        document.rect(MARGIN, PAGE_HEIGHT - 38, 25, 3, fill=1, stroke=0)
        document.setFont("BodyBold", 11)
        document.setFillColor(MUTED)
        document.drawString(MARGIN + 38, PAGE_HEIGHT - 39, "MODERN DATABASES")
        document.drawRightString(PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 39, f"LECTURE {question.lecture:02d} / {LECTURES[question.lecture]}")
        document.setFont("DisplayBold", 31)
        document.setFillColor(ACCENTS[0])
        document.drawString(MARGIN, PAGE_HEIGHT - 99, f"Q{question.number}")
        title = paragraph(escape(question.title), 27, bold=True)
        _, title_height = title.wrap(PAGE_WIDTH - 2 * MARGIN - 112, 150)
        title.drawOn(document, MARGIN + 112, PAGE_HEIGHT - 69 - title_height)
        top = PAGE_HEIGHT - 93 - max(title_height, 39)
        width, measured, split, size = question_layout(question, top - 43)
        boxes = []
        for column, indexes in enumerate((range(split), range(split, len(question.groups)))):
            cursor = top
            left = MARGIN + column * (width + COLUMN_GAP)
            for index in indexes:
                height = draw_group(document, question.groups[index], measured[index], left, cursor, width, index)
                boxes.append([left, PAGE_HEIGHT - cursor, left + width, PAGE_HEIGHT - cursor + height])
                cursor -= height + PANEL_GAP
        document.setFillColor(MUTED)
        document.setFont("Body", 10)
        document.drawRightString(PAGE_WIDTH - MARGIN, 20, f"{page_index:02d} / {len(questions):02d}")
        key = f"question-{question.number}"
        document.bookmarkPage(key)
        if question.lecture not in chapters:
            document.addOutlineEntry(f"Lecture {question.lecture}: {LECTURES[question.lecture]}", key, level=0)
            chapters.add(question.lecture)
        document.addOutlineEntry(f"Q{question.number}. {question.title}", key, level=1)
        pages.append({"question": question.number, "lecture": question.lecture, "font_size": size, "boxes": boxes})
        document.showPage()
    document.save()
    return pages


def normalized(value: str) -> str:
    return re.sub(r"[^a-z0-9]", "", value.lower())


def validate_and_preview(output: Path, questions: list[Question], pages: list[dict]) -> None:
    thumbnails = []
    selected_previews = {1, 12, 26, 30, 36, 57, 84, 100, 101}
    with fitz.open(output) as document:
        if len(document) != len(questions):
            raise AssertionError("PDF page count does not match selected questions")
        for page, question, metadata in zip(document, questions, pages, strict=True):
            text = page.get_text()
            if FORBIDDEN.search(text) or f"Q{question.number}" not in text:
                raise AssertionError(f"Q{question.number}: forbidden section or missing question")
            compact = normalized(text)
            expected = [question.title] + [group.plain for group in question.groups]
            expected.extend(block.plain for group in question.groups for block in group.blocks if block.kind != "diagram")
            for value in expected:
                if normalized(value) not in compact:
                    raise AssertionError(f"Q{question.number}: missing or changed PDF content: {value[:90]}")
            for text_block in page.get_text("dict")["blocks"]:
                for line in text_block.get("lines", []):
                    for span in line["spans"]:
                        bounds = fitz.Rect(span["bbox"])
                        if not page.rect.contains(bounds):
                            raise AssertionError(f"Q{question.number}: text outside page: {span['text']}")
            boxes = [fitz.Rect(bounds) for bounds in metadata["boxes"]]
            if any(first.intersects(second) for index, first in enumerate(boxes) for second in boxes[index + 1:]):
                raise AssertionError(f"Q{question.number}: overlapping answer boxes")
            pixmap = page.get_pixmap(matrix=fitz.Matrix(0.5, 0.5), alpha=False)
            image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
            if max(ImageStat.Stat(image).stddev) < 8:
                raise AssertionError(f"Q{question.number}: blank-looking page")
            if question.number in selected_previews:
                page.get_pixmap(matrix=fitz.Matrix(1.25, 1.25), alpha=False).save(PREVIEW / f"q{question.number:03d}.png")
            image.thumbnail((336, 238))
            thumbnails.append((question.number, image))
        if len(document.get_toc()) != len(questions) + len({question.lecture for question in questions}):
            raise AssertionError("Chapter/question bookmarks are incomplete")
    columns = 4
    contact = Image.new("RGB", (columns * 352, math.ceil(len(thumbnails) / columns) * 270), "#E8EDED")
    drawing = ImageDraw.Draw(contact)
    font = ImageFont.truetype("C:/Windows/Fonts/calibrib.ttf", 17)
    for index, (number, image) in enumerate(thumbnails):
        left, top = (index % columns) * 352 + 8, (index // columns) * 270 + 7
        drawing.text((left + 2, top), f"Q{number}", fill="#192D2B", font=font)
        contact.paste(image, (left, top + 24))
    contact.save(PREVIEW / "all_pages.jpg", quality=91)
    report = {"file": output.name, "question_count": len(questions), "page_count": len(pages), "pages": pages, "removed_sections_present": False}
    (PREVIEW / "validation.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"PASS: {len(questions)} pages, complete answer text, bookmarks, nonblank renders, and nonoverlapping boxes.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Render the selected boxed Markdown answers as a visual PDF.")
    parser.add_argument("--smoke", action="store_true", help="Render dense SQL pages, diagrams, and three-digit question labels.")
    parser.add_argument("--lectures", nargs="+", type=int, choices=tuple(CHAPTERS))
    arguments = parser.parse_args()
    PREVIEW.mkdir(exist_ok=True)
    layout.register_fonts()
    questions = load_questions()
    if arguments.smoke:
        questions = [question for question in questions if question.number in {1, 12, 26, 30, 36, 57, 84, 100, 101}]
    elif arguments.lectures:
        questions = [question for question in questions if question.lecture in arguments.lectures]
    output = PREVIEW / "layout_probe.pdf" if arguments.smoke else PREVIEW / "chapter_check.pdf" if arguments.lectures else OUTPUT
    render_diagrams(questions)
    pages = build_pdf(questions, output)
    validate_and_preview(output, questions, pages)
    if output == OUTPUT:
        (ROOT / "Modern_Databases_100_Questions_Visual_Revision.pdf").unlink(missing_ok=True)
    print(f"PDF: {output}")


if __name__ == "__main__":
    main()