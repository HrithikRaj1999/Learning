from __future__ import annotations

import argparse
import math
import sqlite3
from itertools import combinations
from pathlib import Path
from xml.sax.saxutils import escape

import fitz
from PIL import Image, ImageDraw
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Table, TableStyle


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "Modern_Databases_Lectures_1-3.pdf"
SLIDE = (960, 540)
INK = colors.HexColor("#192C29")
TEAL = colors.HexColor("#087C70")
CORAL = colors.HexColor("#C54C36")
BLUE = colors.HexColor("#355DA6")
MUTED = colors.HexColor("#53615E")
LINE = colors.HexColor("#D7E1DD")
PALE = colors.HexColor("#F1F6F4")
WHITE = colors.white

SCHEMA_SQL = """CREATE TABLE customers (
    customer_id INTEGER PRIMARY KEY,
    full_name VARCHAR(60) NOT NULL,
    city VARCHAR(40) NOT NULL
);
CREATE TABLE products (
    product_id INTEGER PRIMARY KEY,
    product_name VARCHAR(60) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0)
);
CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(customer_id),
    order_date DATE NOT NULL,
    status VARCHAR(12) NOT NULL CHECK (status IN ('PAID', 'PENDING'))
);
CREATE TABLE order_items (
    order_id INTEGER NOT NULL REFERENCES orders(order_id),
    product_id INTEGER NOT NULL REFERENCES products(product_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    PRIMARY KEY (order_id, product_id)
);
CREATE TABLE payments (
    payment_id INTEGER PRIMARY KEY,
    order_id INTEGER NOT NULL UNIQUE REFERENCES orders(order_id),
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0)
);"""

SEED_SQL = """INSERT INTO customers VALUES
    (1, 'Asha', 'Pune'), (2, 'Ravi', 'Delhi'), (3, 'Mina', 'Pune');
INSERT INTO products VALUES (10, 'Pen', 10), (20, 'Book', 100);
INSERT INTO orders VALUES
    (101, 1, '2026-08-01', 'PAID'),
    (102, 1, '2026-08-02', 'PAID'),
    (103, 2, '2026-08-02', 'PENDING');
INSERT INTO order_items VALUES
    (101, 10, 2, 10), (101, 20, 1, 100),
    (102, 20, 2, 100), (103, 10, 1, 10);
INSERT INTO payments VALUES (501, 101, 120), (502, 102, 200);"""

TOTALS_SQL = """SELECT order_id,
       SUM(quantity * unit_price) AS order_total
FROM order_items
GROUP BY order_id
ORDER BY order_id;"""

SPEND_SQL = """SELECT customers.customer_id, customers.full_name,
       SUM(order_items.quantity * order_items.unit_price) AS spent
FROM customers
JOIN orders ON orders.customer_id = customers.customer_id
JOIN order_items ON order_items.order_id = orders.order_id
WHERE orders.status = 'PAID'
GROUP BY customers.customer_id, customers.full_name
HAVING SUM(order_items.quantity * order_items.unit_price) >= 250
ORDER BY spent DESC, customers.customer_id;"""

COUNTS_SQL = """SELECT customers.full_name,
       COUNT(orders.order_id) AS order_count
FROM customers
LEFT JOIN orders ON orders.customer_id = customers.customer_id
GROUP BY customers.customer_id, customers.full_name
ORDER BY customers.customer_id;"""

NEVER_SQL = """SELECT customers.full_name
FROM customers
WHERE NOT EXISTS (
    SELECT 1 FROM orders
    WHERE orders.customer_id = customers.customer_id
)
ORDER BY customers.customer_id;"""

UNPAID_SQL = """SELECT orders.order_id
FROM orders
LEFT JOIN payments ON payments.order_id = orders.order_id
WHERE payments.payment_id IS NULL
ORDER BY orders.order_id;"""

GROUPED_SQL = """SELECT customer_id, COUNT(*) AS total
FROM orders
WHERE status = 'PAID'
GROUP BY customer_id
HAVING COUNT(*) >= 2
ORDER BY customer_id;"""

FILTER_SQL = """SELECT product_id, product_name, unit_price
FROM products
WHERE unit_price < 50
ORDER BY unit_price, product_id;"""

SCALAR_SQL = """SELECT product_name, unit_price
FROM products
WHERE unit_price > (SELECT AVG(unit_price) FROM products)
ORDER BY product_id;"""

CTE_SQL = """WITH order_totals AS (
    SELECT order_id, SUM(quantity * unit_price) AS total
    FROM order_items
    GROUP BY order_id
)
SELECT order_id, total FROM order_totals
WHERE total >= 100
ORDER BY order_id;"""

PAID_LEFT_SQL = """SELECT customers.full_name,
       COUNT(orders.order_id) AS paid_orders
FROM customers
LEFT JOIN orders ON orders.customer_id = customers.customer_id
                AND orders.status = 'PAID'
GROUP BY customers.customer_id, customers.full_name
ORDER BY customers.customer_id;"""

TRANSFER_SQL = """BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;
COMMIT;"""


def verify_sql():
    database = sqlite3.connect(":memory:")
    database.execute("PRAGMA foreign_keys = ON")
    database.executescript(SCHEMA_SQL + SEED_SQL)
    assert database.execute(TOTALS_SQL).fetchall() == [(101, 120), (102, 200), (103, 10)]
    assert database.execute(SPEND_SQL).fetchall() == [(1, "Asha", 320)]
    assert database.execute(COUNTS_SQL).fetchall() == [("Asha", 2), ("Ravi", 1), ("Mina", 0)]
    assert database.execute(NEVER_SQL).fetchall() == [("Mina",)]
    assert database.execute(UNPAID_SQL).fetchall() == [(103,)]
    assert database.execute(GROUPED_SQL).fetchall() == [(1, 2)]
    assert database.execute(FILTER_SQL).fetchall() == [(10, "Pen", 10)]
    assert database.execute(SCALAR_SQL).fetchall() == [("Book", 100)]
    assert database.execute(CTE_SQL).fetchall() == [(101, 120), (102, 200)]
    assert database.execute(PAID_LEFT_SQL).fetchall() == [("Asha", 2), ("Ravi", 0), ("Mina", 0)]
    for statement in (
        "INSERT INTO order_items VALUES (999, 10, 1, 10)",
        "INSERT INTO order_items VALUES (102, 10, 0, 10)",
        "INSERT INTO payments VALUES (503, 101, 120)",
        "INSERT INTO order_items VALUES (101, 10, 1, 10)",
    ):
        try:
            database.execute(statement)
        except sqlite3.IntegrityError:
            database.rollback()
        else:
            raise AssertionError(f"Invalid data was accepted: {statement}")
    database.execute("CREATE TABLE accounts (account_id INTEGER PRIMARY KEY, balance INTEGER CHECK (balance >= 0))")
    database.executemany("INSERT INTO accounts VALUES (?, ?)", [(1, 1000), (2, 400)])
    database.commit()
    database.execute("BEGIN")
    database.execute("UPDATE accounts SET balance = balance - 100 WHERE account_id = 1")
    database.rollback()
    assert database.execute("SELECT balance FROM accounts ORDER BY account_id").fetchall() == [(1000,), (400,)]
    database.executescript(TRANSFER_SQL)
    assert database.execute("SELECT balance FROM accounts ORDER BY account_id").fetchall() == [(900,), (500,)]
    database.close()
    assert 2 + 2 > 3
    assert 1 + 2 <= 3
    assert all(set(read_set) & set(write_set) for read_set in combinations(range(5), 3) for write_set in combinations(range(5), 3))
    assert not ({0, 1} & {2, 3, 4})
    print("PASS: ten SQL result sets, four constraint failures, rollback, commit, and quorum overlap checks.")


def register_fonts():
    filenames = {
        "Body": "calibri.ttf",
        "BodyBold": "calibrib.ttf",
        "BodyItalic": "calibrii.ttf",
        "Display": "georgia.ttf",
        "DisplayBold": "georgiab.ttf",
        "Mono": "consola.ttf",
    }
    for family, filename in filenames.items():
        font_path = Path("C:/Windows/Fonts") / filename
        if not font_path.exists():
            raise FileNotFoundError(f"Required font is missing: {font_path}")
        pdfmetrics.registerFont(TTFont(family, str(font_path)))
    pdfmetrics.registerFontFamily("Body", normal="Body", bold="BodyBold", italic="BodyItalic", boldItalic="BodyBold")
    pdfmetrics.registerFontFamily("Display", normal="Display", bold="DisplayBold", italic="Display", boldItalic="DisplayBold")


def paragraph(document, text, left, top, width, size=17, leading=None, font="Body", color=INK):
    style = ParagraphStyle(
        "local", fontName=font, fontSize=size, leading=leading or size * 1.32,
        textColor=color, alignment=TA_LEFT, spaceAfter=0, allowWidows=0,
        allowOrphans=0, splitLongWords=False,
    )
    block = Paragraph(text, style)
    _, height = block.wrap(width, 2000)
    block.drawOn(document, left, top - height)
    return height


class Flow:
    def __init__(self, book, left, top, width, bottom=None):
        self.book = book
        self.left = left
        self.top = top
        self.width = width
        self.bottom = bottom if bottom is not None else book.body_bottom

    def reserve(self, height, gap=10):
        if self.top - height < self.bottom:
            self.book.layout_errors[self.book.number] = f"Page {self.book.number} ({self.book.title}): overflow by {self.bottom - self.top + height:.1f} pt"
        original_top = self.top
        self.top -= height + gap
        return original_top

    def text(self, text, size=None, gap=None, color=INK, font="Body"):
        size = size or self.book.body_size
        gap = gap if gap is not None else (11 if self.book.slide else 8)
        style = ParagraphStyle("measure", fontName=font, fontSize=size, leading=size * 1.32, splitLongWords=False)
        block = Paragraph(text, style)
        _, height = block.wrap(self.width, 2000)
        top = self.reserve(height, gap)
        paragraph(self.book.document, text, self.left, top, self.width, size, font=font, color=color)
        return self

    def heading(self, text):
        return self.text(text, size=19 if self.book.slide else 13.5, font="BodyBold", color=TEAL, gap=7)

    def code(self, text, size=None, gap=12):
        size = size or (13 if self.book.slide else 9)
        lines = text.strip().splitlines()
        longest = max(pdfmetrics.stringWidth(line, "Mono", size) for line in lines)
        if longest > self.width - 22:
            raise ValueError(f"Page {self.book.number}: code line exceeds frame by {longest - self.width + 22:.1f} pt")
        leading = size * 1.4
        height = len(lines) * leading + 22
        top = self.reserve(height, gap)
        document = self.book.document
        document.setFillColor(PALE)
        document.rect(self.left, top - height, self.width, height, fill=1, stroke=0)
        document.setFillColor(BLUE)
        document.setFont("Mono", size)
        for index, line in enumerate(lines):
            document.drawString(self.left + 11, top - 15 - size - index * leading, line)
        return self

    def table(self, headers, rows, fractions=None, size=None, gap=None):
        size = size or (14.5 if self.book.slide else 10.2)
        gap = gap if gap is not None else (12 if self.book.slide else 9)
        fractions = fractions or [1 / len(headers)] * len(headers)
        widths = [self.width * fraction for fraction in fractions]
        cell_style = ParagraphStyle("cell", fontName="Body", fontSize=size, leading=size * 1.23, textColor=INK, splitLongWords=False)
        header_style = ParagraphStyle("head", parent=cell_style, fontName="BodyBold", textColor=WHITE)
        values = [[Paragraph(str(value), header_style) for value in headers]]
        values.extend([[Paragraph(str(value), cell_style) for value in row] for row in rows])
        table = Table(values, colWidths=widths, hAlign="LEFT")
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), INK),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, PALE]),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("LINEBELOW", (0, -1), (-1, -1), 0.5, LINE),
        ]))
        _, height = table.wrap(self.width, 2000)
        top = self.reserve(height, gap)
        table.drawOn(self.book.document, self.left, top - height)
        return self

    def note(self, title, text, color=CORAL):
        size = 14.5 if self.book.slide else 10.4
        style = ParagraphStyle("note", fontName="Body", fontSize=size, leading=size * 1.32)
        markup = f"<b>{title}</b><br/>{text}"
        block = Paragraph(markup, style)
        _, height = block.wrap(self.width - 14, 2000)
        top = self.reserve(height + 4, 12)
        self.book.document.setStrokeColor(color)
        self.book.document.setLineWidth(2.5)
        self.book.document.line(self.left, top, self.left, top - height)
        paragraph(self.book.document, markup, self.left + 13, top, self.width - 14, size)
        return self


class Book:
    def __init__(self):
        self.document = canvas.Canvas(str(OUTPUT), pagesize=SLIDE, pageCompression=1)
        self.document.setTitle("Modern Databases | Lectures 1-3 | Presentation and Exam Notes")
        self.document.setAuthor("Independent Study Edition")
        self.document.setSubject("DSE ZG507: source-grounded lessons, worked SQL, and exam practice")
        self.document.setKeywords("Modern Databases, DSE ZG507, SQL, ACID, distributed databases, exam notes")
        self.number = 0
        self.pages = []
        self.layout_errors = {}

    def page(self, title, chapter, source, recall, slide=True, subtitle=None, bookmark=None):
        if self.number:
            self.document.showPage()
        self.number += 1
        self.slide = slide
        self.title = title
        self.width, self.height = SLIDE if slide else A4
        self.body_size = 17 if slide else 11
        self.body_top = self.height - (136 if slide else 122)
        self.body_bottom = 99 if slide else 79
        self.margin = 46 if slide else 43
        self.document.setPageSize((self.width, self.height))
        self.document.setFillColor(WHITE)
        self.document.rect(0, 0, self.width, self.height, fill=1, stroke=0)
        self.document.setFillColor(TEAL)
        self.document.rect(self.margin, self.height - 38, 34, 4, fill=1, stroke=0)
        paragraph(self.document, "MODERN DATABASES / DSE ZG507", self.margin + 46, self.height - 30, 360, 9, font="BodyBold", color=MUTED)
        self.document.setFont("BodyBold", 9)
        self.document.setFillColor(CORAL)
        self.document.drawRightString(self.width - self.margin, self.height - 39, chapter)
        paragraph(self.document, title, self.margin, self.height - 61, self.width - self.margin * 2, 32 if slide else 25, font="DisplayBold")
        if subtitle:
            paragraph(self.document, subtitle, self.margin, self.height - (105 if slide else 99), self.width - self.margin * 2, 13 if slide else 10, color=MUTED)
        self.document.setStrokeColor(LINE)
        self.document.setLineWidth(0.65)
        self.document.line(self.margin, 55, self.width - self.margin, 55)
        paragraph(self.document, escape(source), self.margin, 40, self.width - self.margin * 2 - 30, 8, color=MUTED)
        self.document.setFont("BodyBold", 10)
        self.document.setFillColor(INK)
        self.document.drawRightString(self.width - self.margin, 31, f"{self.number:02d}")
        if recall:
            paragraph(self.document, f"<b>RECALL</b> &nbsp; {recall}", self.margin, 87 if slide else 72, self.width - self.margin * 2, 12 if slide else 8.8, color=TEAL)
        key = bookmark or f"page-{self.number}"
        self.document.bookmarkPage(key)
        self.document.addOutlineEntry(title, key, level=0)
        self.pages.append({"title": title, "slide": slide, "source": source})
        return Flow(self, self.margin, self.body_top, self.width - 2 * self.margin)

    def columns(self, ratio=0.5, gap=32):
        available = self.width - self.margin * 2 - gap
        first_width = available * ratio
        return (
            Flow(self, self.margin, self.body_top, first_width),
            Flow(self, self.margin + first_width + gap, self.body_top, available - first_width),
        )

    def node(self, left, top, width, height, title, detail, tint=PALE):
        document = self.document
        document.setFillColor(tint)
        document.setStrokeColor(LINE)
        document.setLineWidth(0.7)
        document.roundRect(left, top - height, width, height, 4, fill=1, stroke=1)
        paragraph(document, title, left + 12, top - 12, width - 24, 14, font="BodyBold", color=TEAL)
        used = paragraph(document, detail, left + 12, top - 37, width - 24, 12.5)
        if used > height - 44:
            raise ValueError(f"Diagram node overflow on page {self.number}: {title}")

    def arrow(self, start_left, start_top, end_left, end_top, color=TEAL):
        document = self.document
        document.setStrokeColor(color)
        document.setFillColor(color)
        document.setLineWidth(1.5)
        document.line(start_left, start_top, end_left, end_top)
        angle = math.atan2(end_top - start_top, end_left - start_left)
        path = document.beginPath()
        path.moveTo(end_left, end_top)
        path.lineTo(end_left - 8 * math.cos(angle - 0.4), end_top - 8 * math.sin(angle - 0.4))
        path.lineTo(end_left - 8 * math.cos(angle + 0.4), end_top - 8 * math.sin(angle + 0.4))
        path.close()
        document.drawPath(path, fill=1, stroke=0)

    def save(self):
        if self.layout_errors:
            raise ValueError("Layout checks failed:\n" + "\n".join(self.layout_errors.values()))
        self.document.save()


def add_cover(book):
    book.page(
        "Modern Databases", "LECTURES 01-03", "Source key: H = course handout; L1, L2, L3 = supplied lecture decks. Full references in the notes.",
        "Model the facts. Ask precise questions. Protect changes. Then distribute the work.",
        subtitle="A combined lesson, presentation and closed-book study companion", bookmark="start",
    )
    left, right = book.columns(0.52, 45)
    left.text("One shop.<br/>Three database problems.", size=32, font="Display", gap=20)
    left.text("How do we store an order correctly?<br/>How do we query and change it safely?<br/>How does it work across regions?", size=19, gap=18)
    left.note("Independent study edition", "Based on your supplied course material. Teaching examples and practice questions are original; this is not an official examination paper.", color=TEAL)
    book.node(right.left, 385, right.width, 70, "01 / STRUCTURE", "Entities, tables, keys and relationships")
    book.arrow(right.left + right.width / 2, 312, right.left + right.width / 2, 289)
    book.node(right.left, 286, right.width, 70, "02 / BEHAVIOUR", "Structured Query Language (SQL)")
    book.arrow(right.left + right.width / 2, 213, right.left + right.width / 2, 190)
    book.node(right.left, 187, right.width, 70, "03 / DISTRIBUTION", "Architecture, partitioning and replication")


def add_sql_sample(book):
    book.page("Four line items become three totals", "02 / SQL", "L2, slides 20-23. Original teaching data; query results checked with SQLite.", "A group produces one result row. Multiply each line first, then add.")
    left, right = book.columns(0.5)
    left.heading("Input: order_items")
    left.table(["order_id", "product_id", "quantity", "unit_price"], [
        [101, 10, 2, 10], [101, 20, 1, 100], [102, 20, 2, 100], [103, 10, 1, 10],
    ], size=13.5)
    left.text("Order 101: (2 x 10) + (1 x 100) = <b>120</b>.<br/>The output grain is <b>one row per order</b>.", size=16)
    right.code(TOTALS_SQL, size=12)
    right.table(["order_id", "order_total"], [[101, 120], [102, 200], [103, 10]], size=14)


def add_slides(book):
    add_cover(book)

    flow = book.page("The three lectures form one argument", "READING MAP", "H, contact sessions 1-3 and evaluation scheme; L1-L3. This companion covers only lectures 1-3.", "Design first. Query second. Protect every change. Distribute when the workload requires it.")
    flow.table(["Lecture", "Question", "What you should be able to produce"], [
        ["1 / Foundations", "What facts belong together?", "A schema with entities, keys, relationships and clear rules."],
        ["2 / SQL and transactions", "How do we retrieve and change facts?", "Correct queries, checked results and explained transaction guarantees."],
        ["3 / Distributed databases", "Where should facts and copies live?", "An architecture choice with partitioning, replication and trade-offs."],
    ], [0.22, 0.30, 0.48], size=16)
    flow.note("Scope matters", "The local handout lists a two-hour, closed-book midterm covering sessions 1-8. These three lectures are the foundation, not the complete midterm syllabus.", color=TEAL)

    book.page("Data becomes useful when meaning is clear", "01 / FOUNDATIONS", "L1, slides 16-23 and 36-41.", "Data = facts; information = facts with context; knowledge = understanding used for a decision.")
    left, right = book.columns(0.52)
    left.table(["Level", "Tiny shop example"], [
        ["Data", "101, 2, 10"],
        ["Information", "Order 101 contains two pens priced at 10 each."],
        ["Knowledge", "Repeated pen sales can help the shop decide when to restock."],
    ], [0.25, 0.75], size=16)
    right.heading("Database is not DBMS")
    right.text("A <b>database</b> is an organised collection of related data. A <b>Database Management System (DBMS)</b> is the software that manages it.", size=17)
    right.text("The shopping application shows the checkout screen. The DBMS stores and protects the resulting order.", size=17)
    right.note("Why this matters", "An application, its database, and its DBMS are three different things.")

    book.page("One customer, three files, conflicting answers", "01 / FOUNDATIONS", "L1, slides 26-33 and 41-42. Original shop example.", "Uncontrolled copies create disagreement. A DBMS supplies shared structure, rules and controlled access.")
    left, right = book.columns()
    left.heading("Separate application files")
    left.table(["File", "Asha's city"], [["Sales", "Pune"], ["Delivery", "Mumbai"], ["Support", "Pune"]], size=16)
    left.text("<b>Redundancy</b> means storing the same fact repeatedly. <b>Inconsistency</b> means the copies disagree.", size=17)
    right.heading("A controlled database")
    right.text("Store the customer's current city once. Let orders refer to the customer using an identifier.", size=18)
    right.text("The DBMS also provides permissions, validation rules, concurrency control, and recovery after failures.", size=17)
    right.note("Do not overclaim", "A valid city field can still contain the wrong real-world city. Constraints cannot guarantee factual accuracy.")

    book.page("The schema is the plan; rows are the instance", "01 / FOUNDATIONS", "L1, slides 36-43. In this example, a customer identifier is a whole number.", "Schema describes structure. Instance is current data. Metadata describes meaning and rules.")
    left, right = book.columns(0.49)
    left.heading("Schema: customers")
    left.table(["Attribute / column", "Type and rule"], [
        ["customer_id", "Integer; unique identity"], ["full_name", "Text; required"], ["city", "Text; required"],
    ], [0.48, 0.52], size=15.5)
    left.text("A <b>domain</b> is the set of allowed values. A <b>constraint</b> is a rule the database checks.", size=16)
    right.heading("Instance: today's rows")
    right.table(["customer_id", "full_name", "city"], [[1, "Asha", "Pune"], [2, "Ravi", "Delhi"], [3, "Mina", "Pune"]], size=14.5)
    right.text("A <b>tuple</b> is one row. An <b>attribute</b> is one column. Metadata includes names, types, descriptions and allowed values.", size=16)

    flow = book.page("Keys identify rows and protect relationships", "01 / FOUNDATIONS", "L1, slides 42-49 and 64-66. Eligible UNIQUE references are a general SQL clarification.", "Primary key identifies this row. Foreign key validates a reference. A composite key uses several columns.")
    flow.table(["Term", "Meaning", "Shop example"], [
        ["Candidate key", "A minimal set of columns that can uniquely identify a row.", "customer_id; email only if the business guarantees uniqueness."],
        ["Primary key", "Chosen candidate key; unique, with no missing or unknown (NULL) value.", "customers.customer_id"],
        ["Foreign key", "A reference to an eligible key, often another table's primary key.", "orders.customer_id refers to customers.customer_id."],
        ["Composite key", "A key made from more than one column.", "order_items: (order_id, product_id) in our simplified model."],
    ], [0.18, 0.40, 0.42], size=14.5)
    flow.note("A foreign key is not automatically unique", "Asha can have many orders. Their customer_id values may all be 1. NOT NULL makes the reference mandatory.")

    book.page("The retail model, drawn as relationships", "01 / FOUNDATIONS", "L1, slides 60-67; L2, slide 4. Original diagram; PK = primary key, FK = foreign key.", "Put the foreign key on the many side. Resolve many-to-many relationships with a junction table.")
    book.node(46, 392, 172, 107, "CUSTOMERS", "customer_id PK<br/>full_name, city")
    book.node(274, 392, 172, 107, "ORDERS", "order_id PK<br/>customer_id FK<br/>date, status")
    book.node(508, 392, 204, 107, "ORDER_ITEMS", "order_id PK, FK<br/>product_id PK, FK<br/>quantity, sale price")
    book.node(768, 392, 146, 107, "PRODUCTS", "product_id PK<br/>name<br/>current price")
    book.arrow(219, 342, 272, 342)
    book.arrow(447, 342, 506, 342)
    book.arrow(767, 342, 714, 342)
    paragraph(book.document, "1 : many", 219, 370, 56, 10)
    paragraph(book.document, "1 : many", 449, 370, 60, 10)
    paragraph(book.document, "1 : many", 713, 370, 56, 10)
    book.node(274, 234, 172, 97, "PAYMENTS", "payment_id PK<br/>order_id FK, UNIQUE<br/>amount")
    book.arrow(360, 283, 360, 237)
    paragraph(book.document, "1 : 0 or 1", 373, 265, 90, 11)
    Flow(book, 46, 248, 190).text("An <b>entity</b> is something we store facts about. A <b>relationship</b> connects entities.", size=16)
    Flow(book, 508, 248, 406).text("<b>Cardinality</b> describes how many records may be related. Order items form the <b>junction table</b> between orders and products.", size=17, gap=8).text("Assumptions: one row per product per order; at most one payment record per order. Real systems may need multiple payment attempts.", size=15, color=MUTED)

    book.page("Normalise current facts; preserve history", "01 / FOUNDATIONS", "L1, slides 54-55; L2, slides 4 and 41. Historical-price distinction is teaching clarification.", "Normalisation reduces repeated facts and anomalies. Similar-looking values may represent different facts.")
    left, right = book.columns()
    left.heading("Before: repeated customer details")
    left.table(["Order", "Customer", "Current city"], [[101, "Asha", "Pune"], [102, "Asha", "Pune"]], size=16)
    left.text("An <b>update anomaly</b> occurs when one real-world change requires several edits that can disagree.", size=17)
    left.note("Repair", "Keep the current city in customers. Orders keep customer_id and their own order facts.", color=TEAL)
    right.heading("After: each fact has a clear home")
    right.text("<b>Normalisation</b> organises related tables to reduce redundancy and insertion, update and deletion anomalies.", size=18)
    right.text("But a product's <b>current price</b> is not its <b>price at the time of sale</b>. Keep the actual sale price in order_items.", size=18)
    right.note("Business meaning comes first", "Changing tomorrow's catalogue price must not change yesterday's invoice.")

    flow = book.page("SQL has different jobs, not one command", "02 / SQL", "L2, slides 6-15 and 58. Statement families follow the lecture's convention.", "CREATE defines. INSERT adds. SELECT retrieves. UPDATE changes. COMMIT accepts. ROLLBACK cancels.")
    flow.table(["Family", "Full name", "Job / commands"], [
        ["DDL", "Data Definition Language", "Define objects: CREATE, ALTER, DROP."],
        ["DML", "Data Manipulation Language", "Change rows: INSERT, UPDATE, DELETE."],
        ["DQL", "Data Query Language", "Retrieve results: SELECT."],
        ["TCL", "Transaction Control Language", "Control a work unit: BEGIN, COMMIT, ROLLBACK."],
        ["DCL", "Data Control Language", "Manage permissions: GRANT, REVOKE."],
    ], [0.12, 0.34, 0.54], size=14.5)
    flow.note("SQL = Structured Query Language", "Preview matching rows before UPDATE or DELETE. Without a WHERE condition, every row can be affected.")

    book.page("SQL is written in one order, reasoned in another", "02 / SQL", "L2, slides 5 and 17-22; slide 58. Logical order is not a fixed physical execution plan.", "FROM / JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY.")
    left, right = book.columns(0.49)
    left.heading("Business question")
    left.text("Which customers placed at least two paid orders?", size=23, font="Display")
    left.text("<b>WHERE</b> removes unpaid rows before grouping.<br/><b>GROUP BY</b> gathers each customer's rows.<br/><b>HAVING</b> keeps groups containing at least two rows.", size=17)
    left.note("Two different filters", "COUNT(*) belongs in HAVING here, not in WHERE.")
    right.code(GROUPED_SQL, size=13)
    right.table(["customer_id", "total"], [[1, 2]], size=16)
    right.text("Without ORDER BY, result order is not guaranteed.", size=16)

    add_sql_sample(book)

    book.page("A LEFT JOIN keeps Mina, even without an order", "02 / SQL", "L2, slides 24-27. Original result from the shared dataset.", "INNER keeps matches. LEFT preserves the left table. COUNT(column) ignores NULL.")
    left, right = book.columns(0.51)
    left.text("A <b>join</b> combines rows using a condition. Mina is a customer, but she has no matching order.", size=17)
    left.table(["Customer", "INNER JOIN", "LEFT JOIN"], [["Asha", "101, 102", "101, 102"], ["Ravi", "103", "103"], ["Mina", "No row", "One row: order_id NULL"]], [0.24, 0.30, 0.46], size=15)
    left.note("NULL means missing or unknown", "Use IS NULL, not = NULL. COUNT(*) counts Mina's preserved row; COUNT(orders.order_id) gives zero.")
    right.heading("Expected order counts")
    right.table(["Customer", "COUNT(order_id)"], [["Asha", 2], ["Ravi", 1], ["Mina", 0]], size=16)
    right.text("To preserve customers without paid orders, put the paid-order condition in the join's <b>ON</b> clause.", size=17)
    right.text("Putting that right-table condition in <b>WHERE</b> removes the NULL-extended rows.", size=16, color=CORAL)

    book.page("Use EXISTS when the question asks 'any?'", "02 / SQL", "L2, slides 28-31. The correlated NOT EXISTS example is verified on the shared dataset.", "A subquery is a query inside another query. EXISTS tests presence, not the number of matches.")
    left, right = book.columns(0.58)
    left.code(NEVER_SQL, size=12)
    left.text("Result: <b>Mina</b>. For each customer, the inner query asks whether a matching order exists.", size=17)
    right.heading("Three useful patterns")
    right.text("A <b>scalar subquery</b> returns one value, such as the average product price.", size=17)
    right.text("A <b>correlated subquery</b> refers to the current outer row, as this example does.", size=17)
    right.text("A <b>Common Table Expression (CTE)</b> names a result for the following statement using WITH.", size=17)
    right.note("Do not assume storage", "A CTE is not automatically a saved table or a faster query.")

    book.page("A money transfer is one logical change", "02 / TRANSACTIONS", "L1, slide 56; L2, slides 32-37. Original transfer; commit and rollback arithmetic verified.", "Atomicity, Consistency, Isolation, Durability: ACID protects a transaction, not just one statement.")
    left, right = book.columns(0.46)
    left.heading("Transfer 100 from account 1 to account 2")
    left.table(["Account", "Before", "After commit"], [[1, 1000, 900], [2, 400, 500], ["Total", 1400, 1400]], size=16)
    left.text("A <b>transaction</b> is a group of operations treated as one logical unit of work.", size=17)
    left.note("Failure between the two updates", "ROLLBACK restores 1000 and 400. A successful COMMIT accepts 900 and 500.")
    right.table(["Property", "What it means here"], [
        ["Atomicity", "Both updates happen, or neither remains."],
        ["Consistency", "Declared balance rules stay valid; correct logic preserves the total."],
        ["Isolation", "Concurrent operations are controlled by the chosen isolation level."],
        ["Durability", "Committed changes survive failures within the system's guarantees."],
    ], [0.28, 0.72], size=14.5)

    book.page("Correct SQL can still meet another writer", "02 / TRANSACTIONS", "L2, slides 34-36. Isolation-level behaviour differs across DBMS products.", "Name the anomaly, show the conflicting operations, then state the required protection.")
    left, right = book.columns(0.56)
    left.table(["Problem", "Tiny example"], [
        ["Dirty read", "Read a new balance before its transaction commits."],
        ["Non-repeatable read", "Read one row twice; a committed update changes it."],
        ["Phantom read", "Repeat a condition-based query; the matching row set changes."],
        ["Lost update", "Two readers compute from 10; both write 9 instead of reaching 8."],
    ], [0.31, 0.69], size=14.5)
    right.heading("Isolation is a chosen guarantee")
    right.text("<b>Serializable</b> execution has an effect equivalent to some one-at-a-time transaction order.", size=18)
    right.text("Weaker levels can allow more concurrency but permit particular anomalies. Locks and row versions are common techniques.", size=17)
    right.note("Two different waiting problems", "Blocking: one transaction waits. Deadlock: a cycle of transactions waits on itself.")

    book.page("Change a live schema in small, safe stages", "02 / EVOLUTION", "L2, slides 38-43. Expand-migrate-contract is the lecture's safe rollout pattern.", "Expand -> migrate and verify -> contract. Measure before denormalising.")
    left, right = book.columns()
    left.heading("Add a required phone number")
    left.text("<b>1. Expand.</b> Add a nullable phone column without breaking old applications.", size=17)
    left.text("<b>2. Migrate.</b> Update applications and backfill genuine values in existing rows.", size=17)
    left.text("<b>3. Contract.</b> Verify readiness, enforce NOT NULL, and retire obsolete fields.", size=17)
    left.note("Migration = controlled database change", "Keep ordered scripts in version control. Never invent phone numbers to satisfy NOT NULL.")
    right.heading("Denormalisation is a separate decision")
    right.text("<b>Denormalisation</b> deliberately stores repeated or precomputed facts to make selected reads faster.", size=18)
    right.text("A cached order total avoids repeated summation, but every line-item change must refresh or invalidate it.", size=17)
    right.note("View versus stored result", "An ordinary view stores a query definition. A materialized view or summary table stores results.")

    flow = book.page("Choose a data model from the question", "02 / BEYOND RELATIONAL", "L2, slides 44-54. This is the lecture's overview, not a replacement for later NoSQL lectures.", "Workload -> access pattern -> correctness requirement -> suitable model -> stated trade-off.")
    flow.table(["Need", "Possible fit", "Important cost"], [
        ["Orders, payments, flexible reports", "Relational tables and transactions", "Joins and distributed coordination may become expensive."],
        ["Fetch one active cart by identifier", "Key-value store", "Limited querying beyond the key."],
        ["Read a nested product catalogue entry", "Document database", "Duplicated embedded data needs update discipline."],
        ["Large write streams queried by a known key", "Wide-column store", "Design around planned access patterns."],
        ["Follow several levels of connections", "Graph database", "Specialised model and operational requirements."],
    ], [0.33, 0.29, 0.38], size=13.5)
    flow.note("NoSQL commonly means 'Not Only SQL'", "Relational databases can distribute data too. NoSQL does not automatically mean no schema, no transactions, or better performance.")

    book.page("Distribution solves scale, distance and failure", "03 / DISTRIBUTED", "L3, slides 4-20. Benefits depend on placement, replication and system design.", "Scale up adds resources to one machine. Scale out adds machines. Distribution introduces coordination.")
    left, right = book.columns()
    left.text("A <b>distributed database</b> stores related data across networked sites and coordinates access as one logical system.", size=20)
    left.table(["Measure", "Plain meaning"], [["Latency", "Time taken for one request."], ["Throughput", "Requests completed per unit time."], ["Availability", "Ability to provide service when requested."]], [0.31, 0.69], size=15)
    right.heading("Why the shop grows beyond one site")
    right.text("More machines can share a growing workload. Nearby data can reduce travel time. Copies can help when a machine fails.", size=18)
    right.note("The price of distribution", "Networks delay or lose messages. Some machines fail while others work. Keeping copies and transactions coordinated becomes harder.")
    right.text("A small, local workload may be better served by a simpler central database.", size=16)

    book.page("One logical database, several physical sites", "03 / ARCHITECTURE", "L3, slides 21-26 and 30. Original architecture diagram; autonomy depends on system design.", "Location transparency hides where; fragmentation hides splitting; replication hides copies.")
    book.node(46, 391, 239, 92, "APPLICATION", "One logical view:<br/>customers and orders")
    book.node(343, 391, 273, 92, "DISTRIBUTED DBMS", "Plan queries, coordinate changes,<br/>locate fragments and replicas")
    book.arrow(286, 347, 341, 347)
    book.node(48, 229, 230, 93, "SITE A", "Local DBMS and stored data")
    book.node(365, 229, 230, 93, "SITE B", "Local DBMS and stored data")
    book.node(682, 229, 230, 93, "SITE C", "Local DBMS and stored data")
    book.arrow(430, 297, 163, 232)
    book.arrow(480, 297, 480, 232)
    book.arrow(530, 297, 797, 232)
    Flow(book, 660, 390, 254).text("A <b>global schema</b> is the unified design. A <b>local schema</b> describes data at a site.", size=17).text("The catalogue records where data and its copies live.", size=16)

    flow = book.page("Architecture names describe different choices", "03 / ARCHITECTURE", "L3, slides 27-30. Orthogonal classifications are a general architectural clarification.", "Ask separately about node roles, shared hardware, DBMS uniformity and independence.")
    flow.table(["Choice", "Meaning", "What to watch"], [
        ["Client-server", "Clients request database services from servers.", "This alone does not prove that data is distributed."],
        ["Peer-to-peer", "Nodes have comparable client and server roles.", "Coordination and membership still need management."],
        ["Shared-nothing", "Each node owns its processor, memory and storage.", "Data movement crosses a network."],
        ["Homogeneous / heterogeneous", "Same DBMS family / different systems to integrate.", "Different systems need translation and semantic agreement."],
        ["Federated", "Autonomous databases expose an integrated view.", "Global access must respect local control and differences."],
    ], [0.24, 0.41, 0.35], size=13.5)
    flow.text("These labels can overlap: a system may be homogeneous, shared-nothing and client-server.", size=16)

    book.page("Partitioning splits data; replication copies it", "03 / DATA PLACEMENT", "L3, slides 41-44 and 52-54. Original diagram using the shared orders.", "Split for scale and locality. Copy for resilience and read capacity. Most large designs use both.")
    left, right = book.columns()
    left.heading("Partitioning: different row subsets")
    left.text("A <b>fragment</b> is a subset of the data. Here each order belongs to one horizontal fragment.", size=16)
    book.node(left.left, 282, 183, 85, "PARTITION A", "Orders 101, 102")
    book.node(left.left + 222, 282, 183, 85, "PARTITION B", "Order 103")
    Flow(book, left.left, 178, left.width).text("Together: all three orders. If A fails without a copy, its orders become unavailable.", size=16)
    right.heading("Replication: the same row subset copied")
    right.text("A <b>replica</b> is a copy. Both machines below hold the same logical orders after synchronisation.", size=16)
    book.node(right.left, 282, 183, 85, "COPY 1", "Orders 101, 102, 103")
    book.node(right.left + 222, 282, 183, 85, "COPY 2", "Orders 101, 102, 103")
    Flow(book, right.left, 178, right.width).text("Copies cost storage and coordination. Replication does not replace independent backups.", size=16)

    flow = book.page("A partition key decides where a row belongs", "03 / PARTITIONING", "L3, slides 42-51. The monotonic-key warning is qualified for the partitioning method.", "Rows versus columns describes what is split. Range, hash and list describe how rows are assigned.")
    flow.table(["Strategy", "Example", "Strength", "Risk"], [
        ["Range", "Orders by month", "Date intervals and pruning", "Newest range may receive most writes."],
        ["Hash", "hash(customer_id) modulo node count", "Equality lookups; spreading many keys", "Range queries scatter; one popular key still gets hot."],
        ["List / geographic", "region IN ('EU', 'APAC')", "Regional access and residency", "Unequal regional load; cross-region work."],
        ["Vertical", "Customer basics / contact details", "Read only needed column groups", "Keep the key in both; join to reconstruct."],
    ], [0.16, 0.27, 0.26, 0.31], size=13.5)
    flow.note("Choose for the workload, not just the identifier", "A hash maps a key to a repeatable number; modulo gives the division remainder. Pruning skips irrelevant partitions. Increasing keys can create a hot range; hashing changes that behaviour.")

    book.page("Replication has two separate design questions", "03 / REPLICATION", "L3, slides 53-56. Acknowledgement and read-routing details affect the guarantees.", "Who accepts writes? When may success be acknowledged? Answer both questions.")
    left, right = book.columns()
    left.heading("1 / Who accepts writes?")
    left.table(["Topology", "Basic behaviour"], [
        ["Leader-follower", "One leader accepts writes; followers copy them."],
        ["Multi-leader", "Several designated leaders accept writes; conflicts are possible."],
        ["Leaderless", "Requests coordinate with replicas without one permanent write leader."],
    ], [0.34, 0.66], size=14.5)
    right.heading("2 / When is a write successful?")
    right.text("<b>Synchronous:</b> wait for the required replica acknowledgement before reporting success.", size=18)
    right.text("<b>Asynchronous:</b> report success before followers necessarily receive or apply the write.", size=18)
    right.note("Trade-off", "Waiting adds latency and can block when required replicas fail. Not waiting risks stale reads and losing recent writes. Failover means switching service to another node.")

    book.page("Quorums work by overlapping replica sets", "03 / QUORUMS", "L3, slide 56. Fixed replica-set assumption and overlap limits are precision notes.", "N = replicas; W = write acknowledgements; R = read responses. R + W > N forces overlap.")
    left, right = book.columns(0.52)
    left.text("With <b>N = 3, W = 2, R = 2</b>, a completed write and a later read must share at least one replica.", size=19)
    book.node(left.left, 306, 123, 86, "REPLICA A", "Read set", tint=colors.HexColor("#EDF2FA"))
    book.node(left.left + 150, 306, 123, 86, "REPLICA B", "Read + write", tint=colors.HexColor("#DDF1EA"))
    book.node(left.left + 300, 306, 123, 86, "REPLICA C", "Write set", tint=colors.HexColor("#FBECE7"))
    Flow(book, left.left, 199, left.width).text("Read {A, B}; write {B, C}.<br/>Intersection: <b>{B}</b>. Here 2 + 2 &gt; 3.", size=18)
    right.heading("A useful counterexample")
    right.text("With R = 1 and W = 2, read {A} and write {B, C} can be disjoint. Equality R + W = N is not enough.", size=18)
    right.note("Overlap is not a complete consistency proof", "Version comparison, concurrent writes, replica membership and failover rules still matter. The inequality alone does not guarantee linearizability.")

    book.page("During a network split, promises can conflict", "03 / FAILURES AND CAP", "L3, slides 31-37 and 39; L2, slide 52. Precise CAP wording is a teaching clarification.", "A data partition is an intentional split. A network partition is a communication failure.")
    left, right = book.columns(0.48)
    left.text("Two regions cannot communicate. Both receive a request for the last item in stock.", size=22, font="Display")
    left.text("<b>Consistency (C):</b> operations behave like one up-to-date copy, respecting real-time order.", size=16)
    left.text("<b>Availability (A):</b> every request to a non-failing node receives a successful response.", size=16)
    left.text("<b>Partition tolerance (P):</b> the design accounts for broken communication between groups of nodes.", size=16)
    right.heading("The CAP theorem's trade-off")
    right.text("During a network partition, a system cannot guarantee both that consistency and that availability for the same operations.", size=18)
    right.note("Protect the single stock item", "Refuse or delay operations that cannot be coordinated. Some requests lose availability, but contradictory confirmed sales are prevented.", color=TEAL)
    right.note("Do not memorise 'pick any two'", "The trade-off arises during a partition. ACID consistency instead means preserving database rules.")

    book.page("Two-phase commit asks before deciding", "03 / TRANSACTION PREVIEW", "L3, slide 38. The handout develops distributed transactions further in session 4.", "Prepare and vote -> record the decision -> commit or abort. A prepared participant may have to wait.")
    left, right = book.columns(0.54)
    left.heading("Two-Phase Commit (2PC)")
    left.table(["Phase", "Coordinator", "Participants"], [
        ["1 / Prepare", "Ask whether every participant can commit.", "Persist readiness, then vote YES or NO."],
        ["2 / Decision", "If all vote YES, record COMMIT; otherwise choose ABORT before commitment.", "Apply the recorded outcome when learned."],
    ], [0.19, 0.41, 0.40], size=14)
    left.text("Example: an order at site A and its reservation at site B need one all-or-nothing outcome.", size=17)
    right.heading("Why blocking matters")
    right.text("After voting YES, a participant cannot safely guess the outcome when the coordinator becomes unreachable.", size=18)
    right.note("The limitation", "Classic 2PC may hold resources while waiting for the decision. A local timeout is not permission to undo a transaction already committed elsewhere.")
    right.text("This is an atomic-commit protocol, not a substitute for every replication or consensus mechanism.", size=16)

    flow = book.page("Consistency is a promise about observations", "03 / CONSISTENCY", "L3, slides 57-58. Definitions are clarified beyond shorthand wording in the deck.", "Strong: real-time single-copy behaviour. Eventual: convergence. Causal: cause first. RYW: my write stays visible.")
    flow.table(["Promise", "Plain meaning", "Example"], [
        ["Strong / linearizable", "Operations appear on one copy in a real-time-respecting order.", "A later read sees a completed update or a newer one."],
        ["Eventual", "Without new writes, successful propagation and resolution let replicas converge.", "A product description may briefly differ across regions."],
        ["Causal", "Cause-and-effect dependencies are observed in order.", "Show a post before a reply that depends on it."],
        ["Read-your-writes (RYW)", "A client's later reads reflect its own writes or newer values.", "After updating your address, you can see the change."],
    ], [0.21, 0.44, 0.35], size=14)
    flow.note("Concurrent writes can conflict", "Last-write-wins is simple but can discard an update. Merge rules must match the data; timestamps are not perfect clocks.")

    book.page("Put the three lectures together", "WORKED DESIGN CHOICE", "L1-L3, especially L2 slide 53 and L3 slides 49-60. Original scenario, not an exam prediction.", "Choice -> reason -> trade-off -> conclusion. A good answer ties the design to the workload.")
    left, right = book.columns()
    left.heading("The shop now serves several regions")
    left.text("Keep customers, orders and line items in a relational design. Their identities and relationships remain the same.", size=18)
    left.text("Group customer-related data together where practical. Use transactions for critical order and payment changes.", size=18)
    left.text("Add replicas and distribute suitable partitions when workload, distance or resilience requirements justify the cost.", size=18)
    right.heading("State what the design gives up")
    right.text("A regional partition key supports local reads but can create uneven load. Global reports must combine regional results.", size=17)
    right.text("Asynchronous catalogue copies may tolerate brief staleness. Critical stock decisions need stronger coordination.", size=17)
    right.note("Check question", "Why can copying one large database improve resilience without solving every write-scaling problem?")


def add_notes(book):
    flow = book.page("Exam notes and source map", "PART II / PRINTABLE NOTES", "H = ModernDb/Handout.md. L1-L3 = original decks in ModernDb/Class Material.", "These notes cover lectures 1-3; the handout's midterm scope is sessions 1-8.", slide=False, bookmark="exam-notes")
    flow.text("<b>Course:</b> Modern Databases, DSE ZG507. The local handout lists the midterm on <b>20 September 2026, afternoon</b>: two hours, closed book, 30% weight. Course announcements may update the schedule.")
    flow.heading("1 / Find the part you need")
    flow.table(["Topic", "Presentation", "Detailed notes"], [
        ["Foundations and relational design", "3-8", '<link href="#page-30" color="#087C70">30-31</link>'],
        ["Shared dataset and table creation", "7, 11", '<link href="#page-32" color="#087C70">32-33</link>'],
        ["Queries, joins and worked SQL", "9-13", '<link href="#page-34" color="#087C70">34-37</link>'],
        ["Transactions and schema evolution", "14-17", '<link href="#page-38" color="#087C70">38-39</link>'],
        ["Distributed databases", "18-28", '<link href="#page-40" color="#087C70">40-43</link>'],
        ["Practice, answers and final recall", "28", '<link href="#page-44" color="#087C70">44-47</link>'],
    ], [0.57, 0.20, 0.23], size=10.2)
    flow.heading("2 / Original course sources")
    flow.table(["Key", "File and relevant coverage"], [
        ["H", "ModernDb/Handout.md<br/>Contact sessions 1-3; evaluation scheme."],
        ["L1", "ModernDB-lecture1-26Jul.pptx<br/>70 slides; subject teaching mainly slides 16-67."],
        ["L2", "Modern DB_lecture2_Aug2nd.pptx<br/>59 slides; SQL, transactions, evolution and datastore choices."],
        ["L3", "ModernDB_lecture3_Aug9th.pptx<br/>60 slides; architectures, partitioning, replication and previews."],
    ], [0.10, 0.90], size=10)
    flow.heading("3 / What has been checked")
    flow.text("Worked SQL results, selected constraints, and the transfer's commit/rollback behaviour were executed in an in-memory <b>SQLite</b> database. The lecture lab uses <b>Microsoft SQL Server</b>. SQL Server-specific syntax, exact type enforcement, concurrency, crash durability and distributed protocols were not executed here.", size=10.4)
    flow.text("The dataset, diagrams, explanations and practice questions are study additions, not copied examination questions. Precision notes qualify slide shorthand. The handout develops CAP and distributed transactions further in session 4.", size=10.4)

    flow = book.page("Lecture 1 / Meaning before tables", "01 / FOUNDATIONS", "L1, slides 16-43 and 46-47. Examples and concise wording are original teaching material.", "Facts -> meaning -> design -> validation -> controlled access.", slide=False)
    flow.heading("1 / The words you must separate")
    flow.table(["Term", "Exam-ready meaning and tiny example"], [
        ["Data / information / knowledge", "Raw recorded facts / facts with context / understanding used for a decision. '2, 10' becomes two pens at 10 each; sales patterns inform restocking."],
        ["Database / DBMS", "An organised collection of related data / software that creates and manages databases. Stored orders are data; PostgreSQL is a DBMS."],
        ["Schema / instance", "The defined structure / current stored rows. Adding a column changes the schema; inserting Asha changes the instance."],
        ["Metadata / domain", "Descriptions of data / allowed values. 'quantity is a positive integer' describes a column and restricts its domain."],
        ["Relation / tuple / attribute", "A table-like relation / one row / one named column. SQL results can contain duplicates unless constrained or explicitly deduplicated."],
    ], [0.27, 0.73], size=10.2)
    flow.heading("2 / Structure and the data lifecycle")
    flow.text("<b>Structured data</b> follows a defined shape, such as an account table. <b>Semi-structured data</b> carries flexible labels, such as JavaScript Object Notation (JSON) or Extensible Markup Language (XML). Images and audio are examples of <b>unstructured data</b>; they can still have metadata.")
    flow.text("Lifecycle: <b>create -> store -> process -> query -> analyse -> archive or safely remove</b>. Validation and access control matter throughout. Database history moves from application-owned files through hierarchical trees and network-linked records to relational tables and specialised modern systems.", size=10.5)
    flow.heading("3 / Quality is more than a correct data type")
    flow.table(["Quality", "Question to ask"], [
        ["Accuracy", "Does the value describe the real world correctly?"],
        ["Completeness", "Are required values present?"],
        ["Consistency", "Do records about the same fact agree?"],
        ["Timeliness", "Is the value current enough for its purpose?"],
        ["Validity", "Does it obey the required type, format and range?"],
    ], [0.27, 0.73], size=10)
    flow.text("A <b>Database Administrator (DBA)</b> manages security, backup and performance. Designers define schemas; developers build applications; end users work through them. <b>Check:</b> a correctly formatted but obsolete address is valid, yet not timely.", size=10.5)

    flow = book.page("Lecture 1 / Design and integrity", "01 / EXAM ANSWERS", "L1, slides 42-50 and 54-67. Normal forms beyond the basic idea are not assumed here.", "Entity -> attributes -> candidate key -> relationships -> cardinality -> tables and constraints.", slide=False)
    flow.heading("1 / Write a design answer in a repeatable order")
    flow.text("An <b>entity</b> is a distinguishable thing we store facts about. Its <b>attributes</b> describe it; a <b>relationship</b> associates entities. Identify these from the scenario, state assumptions, then convert them into tables. An <b>Entity-Relationship (ER)</b> diagram is a picture of that design.")
    flow.text("A <b>candidate key</b> is a minimal unique identifier; a <b>superkey</b> may include unnecessary columns. Choose one candidate as the <b>primary key</b>. A <b>foreign key</b> references an eligible key in another or the same table. Foreign-key values may repeat; NULL is allowed unless a rule such as NOT NULL forbids it.")
    flow.heading("2 / Worked model: students take courses")
    flow.text("<b>Given:</b> students take several courses; a course has several students. Store a grade for each student's enrolment. <b>Assumption:</b> at most one attempt per student, course and semester.")
    flow.table(["Table", "Columns and chosen keys"], [
        ["Students", "StudentID (primary key), Name"],
        ["Courses", "CourseID (primary key), Title"],
        ["Enrolments", "StudentID, CourseID, Semester, Grade.<br/>Primary key: (StudentID, CourseID, Semester).<br/>StudentID and CourseID are foreign keys."],
    ], [0.24, 0.76], size=10.5)
    flow.text("<b>Why Grade belongs in Enrolments:</b> it describes a particular student's attempt, not the student alone or the course alone. This junction table resolves the many-to-many relationship. If multiple attempts occur within one semester, add an attempt identifier.")
    flow.heading("3 / Cardinality is not optionality")
    flow.text("One-to-many normally places the foreign key on the many side. 'A customer may have many orders' does not require every customer to have an order. In our shop, each order requires exactly one customer, but a customer may have zero orders. A UNIQUE foreign key limits an order to at most one payment record.")
    flow.heading("4 / Why normalisation helps")
    flow.table(["Anomaly", "Problem in one combined customer-order table"], [
        ["Insertion", "Cannot conveniently add a customer without inventing an order."],
        ["Update", "Changing a current address requires several rows to agree."],
        ["Deletion", "Deleting a customer's last order may erase the customer's only record."],
    ], [0.20, 0.80], size=10)
    flow.note("Mark-saving distinction", "Normalisation separates facts by meaning. A product's catalogue price and a line item's historical sale price are different facts; keep the historical price.")

    flow = book.page("The shared dataset", "02 / WORKED DATA", "L2, slide 4 supplies the retail pattern. All rows below are original, verified teaching data.", "101 totals 120; 102 totals 200; 103 totals 10. Asha's paid spend is 320; Mina has no orders.", slide=False)
    flow.text("All amounts use one currency and whole monetary units. Dates are in year-month-day order. These exact rows are used in the worked answers; <b>PAID</b> and <b>PENDING</b> are our simplified order states.", size=10.5)
    flow.table(["customers<br/>customer_id", "full_name", "city"], [[1, "Asha", "Pune"], [2, "Ravi", "Delhi"], [3, "Mina", "Pune"]], [0.35, 0.33, 0.32], size=9.5, gap=6)
    flow.table(["products<br/>product_id", "product_name", "unit_price"], [[10, "Pen", 10], [20, "Book", 100]], [0.35, 0.33, 0.32], size=9.5, gap=6)
    flow.table(["orders<br/>order_id", "customer_id", "order_date", "status"], [[101, 1, "2026-08-01", "PAID"], [102, 1, "2026-08-02", "PAID"], [103, 2, "2026-08-02", "PENDING"]], [0.25, 0.24, 0.27, 0.24], size=9.5, gap=6)
    flow.table(["order_items<br/>order_id", "product_id", "quantity", "unit_price"], [[101, 10, 2, 10], [101, 20, 1, 100], [102, 20, 2, 100], [103, 10, 1, 10]], [0.28, 0.24, 0.24, 0.24], size=9.5, gap=6)
    flow.table(["payments<br/>payment_id", "order_id", "amount"], [[501, 101, 120], [502, 102, 200]], [0.35, 0.33, 0.32], size=9.5, gap=6)
    flow.text("<b>Assumptions:</b> one line per product per order; quantity combines repeated units. At most one payment record per order. A line's unit_price records its actual sale price; the products table holds the current catalogue price.", size=10.3)
    flow.text("<b>Hand check:</b> order 101 = 2 x 10 + 1 x 100 = 120. Asha paid 120 + 200 = 320. The payment rows agree with those two order totals.", size=10.3)

    flow = book.page("SQL / Define the rules once", "02 / TABLE CREATION", "L2, slides 6-11. Simplified, unqualified table names; lecture labs use the retail schema.", "Create parents before children. Use keys, CHECK and NOT NULL together.", slide=False)
    flow.text("<b>INTEGER</b> stores whole numbers. <b>VARCHAR(n)</b> declares variable-length text with a length limit in SQL Server. <b>DECIMAL(p,s)</b> declares p total decimal digits, with s after the point. <b>DATE</b> represents a calendar date. These declarations are not enforced identically by every DBMS.", size=10.5)
    flow.code(SCHEMA_SQL, size=9)
    flow.heading("Why these constraints belong in the database")
    flow.text("<b>PRIMARY KEY</b> identifies a row. <b>FOREIGN KEY</b> rejects references to absent parent rows. <b>UNIQUE</b> on payments.order_id enforces the one-payment-record assumption. <b>CHECK</b> rejects non-positive quantities or negative prices. <b>NOT NULL</b> makes required values mandatory.", size=10.5)
    flow.note("What this schema does not enforce", "It does not guarantee that every order has an item, that PAID always matches a payment, or that payment amount equals the sum of lines. Those cross-table business rules need transaction/application logic or additional database mechanisms.")
    flow.text("<b>SQLite check boundary:</b> foreign-key enforcement was explicitly enabled. The tests check selected logical constraints, not SQL Server length or decimal-precision enforcement. DEFAULT supplies an omitted value; it does not prove correctness.", size=10.2)

    flow = book.page("SQL / Filter, group and sort", "02 / QUERY METHOD", "L2, slides 5 and 17-23; slide 58. Result-producing queries on this page were executed.", "FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY.", slide=False)
    flow.heading("1 / Translate the question into rows and columns")
    flow.text("<b>Selection</b> keeps qualifying rows; <b>projection</b> chooses columns. A <b>predicate</b> is a condition, such as unit_price &lt; 50. An <b>alias</b>, introduced with AS, gives an expression a readable result name.")
    flow.code(FILTER_SQL, size=9.5)
    flow.text("Result: <b>(10, Pen, 10)</b>. ORDER BY specifies presentation order; a key used as a final tie-breaker makes ties predictable.", size=10.5)
    flow.heading("2 / Match the filter to its purpose")
    flow.table(["Expression", "Meaning / caution"], [
        ["=, &lt;&gt;, &gt;, &gt;=", "Equal, not equal, greater than, at least."],
        ["BETWEEN / IN / LIKE", "Inclusive range / set membership / text pattern. LIKE 'A%' finds a prefix."],
        ["IS NULL / IS NOT NULL", "Test missing values. = NULL does not perform this test."],
        ["AND / OR / NOT", "Combine conditions. Parentheses make intended grouping explicit."],
        ["COALESCE(value, 0)", "Return the first non-NULL argument, not automatically the correct business value."],
    ], [0.32, 0.68], size=10)
    flow.heading("3 / Group only after filtering individual rows")
    flow.code(GROUPED_SQL, size=9.5)
    flow.text("Result: <b>customer_id 1, total 2</b>. WHERE keeps paid orders; GROUP BY collects them by customer; HAVING tests each completed group. SELECT returns the requested expressions. The optimizer may choose a different physical plan while preserving the query's meaning.", size=10.5)
    flow.note("Counts and aggregates", "COUNT(*) counts rows; COUNT(column) ignores NULL. SUM and AVG also ignore NULL inputs. Group selected non-aggregate columns in these queries. Never use SUM(DISTINCT amount) as a general repair for join duplication.")

    flow = book.page("SQL / Joins without lost customers", "02 / JOINS", "L2, slides 24-27. Counts and paid-only LEFT JOIN results were executed on the shared dataset.", "Choose the rows to preserve. Put relationship logic in ON. Check the result's grain.", slide=False)
    flow.table(["Join", "Rows returned"], [
        ["INNER", "Only matching pairs."],
        ["LEFT / RIGHT", "All rows of the preserved side; NULL values for missing matches."],
        ["FULL OUTER", "Matches plus unmatched rows from both sides."],
        ["CROSS", "Every possible pair: m rows with n rows produces m x n rows."],
        ["Self join", "The same table in two roles, normally given different aliases."],
    ], [0.25, 0.75], size=10.2)
    flow.heading("1 / Count every customer's orders, including zero")
    flow.code(COUNTS_SQL, size=9.1)
    flow.text("Result: <b>Asha 2; Ravi 1; Mina 0</b>. Mina's preserved join row has orders.order_id = NULL, so COUNT(orders.order_id) excludes it. COUNT(*) would incorrectly report one for her.", size=10.5)
    flow.heading("2 / Preserve customers while counting only paid orders")
    flow.code(PAID_LEFT_SQL, size=9.1)
    flow.text("Result: <b>Asha 2; Ravi 0; Mina 0</b>. The status condition belongs in ON because it limits which orders may match. Placing it in WHERE would discard Ravi and Mina from this result.", size=10.5)
    flow.note("A join changes grain", "Grain means what one output row represents. Joining orders to order_items produces one row per matching item, not one row per order. COUNT(DISTINCT orders.order_id) can count orders; pre-aggregating items can prevent repeated parent totals.")

    flow = book.page("SQL / Subqueries and CTEs", "02 / QUERY PATTERNS", "L2, slides 28-31. All three examples below were executed on the shared dataset.", "Scalar = one value. EXISTS = presence. Correlated = outer reference. CTE = named query stage.", slide=False)
    flow.heading("1 / Scalar subquery: compare against one value")
    flow.text("Question: which product is more expensive than the average product? Average = (10 + 100) / 2 = <b>55</b>. The inner query supplies one value to the outer comparison.", size=10.5)
    flow.code(SCALAR_SQL, size=9.3)
    flow.text("Result: <b>Book, 100</b>. A scalar subquery used as one value must not return several rows.", size=10.5)
    flow.heading("2 / Correlated NOT EXISTS: find customers with no orders")
    flow.code(NEVER_SQL, size=9.1)
    flow.text("Result: <b>Mina</b>. The reference to customers.customer_id ties the inner question to each outer customer. SELECT 1 is merely a conventional placeholder; EXISTS cares whether a row exists.", size=10.5)
    flow.heading("3 / Common Table Expression: name an intermediate result")
    flow.code(CTE_SQL, size=9.1)
    flow.text("Result: <b>(101, 120), (102, 200)</b>. The CTE first produces one row per order. The following statement filters those rows. Here total is an ordinary column in that outer query, so WHERE is appropriate.", size=10.5)
    flow.note("Avoid a common missing-value trap", "NOT IN can behave unexpectedly when its subquery includes NULL. NOT EXISTS is a clear way to express 'no related row'. CTEs improve structure; they do not automatically materialize data or improve speed.")

    flow = book.page("Worked SQL / Paid customer spend", "02 / EXAM-STYLE PROBLEM", "L2, slides 21-31 and 55. Original six-mark practice problem; allocation is illustrative.", "State the grain, join on keys, filter rows, calculate amounts, group, then filter groups.", slide=False)
    flow.text("<b>Question:</b> using the shared dataset, list customers whose total <b>paid-order</b> spending is at least 250. Return customer identifier, name and spending, highest spending first. Use a stable identifier to separate different people with the same name.")
    flow.heading("1 / Work out the answer before writing the query")
    flow.table(["Customer", "Order", "Quantity x sale price", "Line amount"], [
        ["Asha", 101, "2 x 10", 20], ["Asha", 101, "1 x 100", 100], ["Asha", 102, "2 x 100", 200],
    ], [0.21, 0.16, 0.40, 0.23], size=10.2)
    flow.text("Ravi's order is PENDING, so it does not enter the paid rows. Mina has no orders. Asha's paid spending is 20 + 100 + 200 = <b>320</b>, which passes the 250 threshold.", size=10.5)
    flow.heading("2 / SQL answer")
    flow.code(SPEND_SQL, size=9.1)
    flow.table(["customer_id", "full_name", "spent"], [[1, "Asha", 320]], size=10.5)
    flow.heading("3 / Explain why the answer is correct")
    flow.text("FROM and the two JOIN clauses link each line item to its order and customer. WHERE keeps only paid orders. SUM adds quantity times historical unit price. GROUP BY identifies each customer; HAVING applies the spending threshold. ORDER BY sorts the remaining result.", size=10.5)
    flow.note("Suggested six-mark self-check", "Two correct join conditions (2); paid-order filter (1); quantity times price and grouping (1); HAVING threshold (1); requested output, order and verified result (1). These are practice marks, not an official marking scheme.")

    flow = book.page("SQL / Transactions and isolation", "02 / CORRECTNESS", "L2, slides 32-37. Transfer arithmetic executed; isolation table is a general SQL-standard summary.", "A transaction is one logical work unit. Choose isolation deliberately; do not assume it.", slide=False)
    flow.heading("1 / Protect a two-step transfer")
    flow.text("Assume both accounts exist, account 1 has at least 100, and balances start at 1000 and 400. The intended result is 900 and 500; the total remains 1400. In production, check affected-row counts and roll back the entire unit if any step fails.", size=10.5)
    flow.code(TRANSFER_SQL, size=9.1)
    flow.table(["ACID property", "Exam-ready explanation"], [
        ["Atomicity", "All operations take effect, or none remain. Failure after debit requires rollback."],
        ["Consistency", "A valid transaction takes the database from one valid state to another. Constraints and correct business logic preserve declared invariants."],
        ["Isolation", "Controls interference between concurrent transactions. Serializable provides equivalence to a serial order; weaker levels provide less."],
        ["Durability", "After successful commit, accepted changes survive failures within the configured storage and recovery guarantees."],
    ], [0.24, 0.76], size=10)
    flow.heading("2 / Recognise the classic isolation ladder")
    flow.table(["Level", "Dirty read", "Non-repeatable", "Phantom"], [
        ["Read uncommitted", "May occur", "May occur", "May occur"],
        ["Read committed", "Prevented", "May occur", "May occur"],
        ["Repeatable read", "Prevented", "Prevented", "May occur"],
        ["Serializable", "Prevented", "Prevented", "Prevented"],
    ], [0.31, 0.20, 0.27, 0.22], size=9.6)
    flow.text("These are classic minimum distinctions, not identical implementations. Snapshot approaches use row versions and may prevent additional anomalies; snapshot isolation is not automatically serializable. A <b>lost update</b> overwrites another writer's work. A <b>deadlock</b> is a cycle of waits.", size=10.3)
    flow.text("<b>States:</b> active -> partially committed -> committed on success; active or partially committed -> failed -> aborted on failure. ROLLBACK cancels uncommitted work; it is not a command to undo any historical commit.", size=10.3)

    flow = book.page("SQL / Evolve and choose carefully", "02 / DESIGN TRADE-OFFS", "L2, slides 7-15, 38-54 and 58-59. Source-specific syntax is described, not executed.", "Preview changes. Version migrations. Measure read costs. Choose stores by access pattern.", slide=False)
    flow.heading("1 / Separate data changes from structure changes")
    flow.table(["Command", "What changes", "Critical distinction"], [
        ["INSERT / UPDATE", "Add / modify rows", "Name columns; preview affected rows."],
        ["DELETE", "Remove rows", "WHERE can select a subset."],
        ["TRUNCATE", "Remove all table rows", "No WHERE; restrictions and transactional behaviour are DBMS-specific."],
        ["DROP", "Remove an object", "Removes the table definition, not merely its rows."],
        ["ALTER", "Modify structure", "Check existing data and dependent applications."],
    ], [0.24, 0.30, 0.46], size=10)
    flow.heading("2 / Model answer: make phone compulsory safely")
    flow.text("<b>Choice:</b> expand-migrate-contract. <b>Reason:</b> old applications and existing rows must continue to work. Add phone as nullable; update writers and readers; backfill verified values; check remaining NULLs; enforce NOT NULL only when ready. <b>Trade-off:</b> temporary compatibility work. <b>Conclusion:</b> keep ordered migration scripts and verify each deployment.")
    flow.heading("3 / Normalisation and denormalisation solve different needs")
    flow.text("Normalisation reduces repeated facts and anomalies. Denormalisation deliberately adds repeated data or precomputed results to improve a measured read path. Cache an order total only with a rule for updating or invalidating it. An ordinary view saves a query; materialized results or summary tables store its output.")
    flow.heading("4 / Why another datastore might help")
    flow.text("An <b>access pattern</b> describes how data is commonly retrieved or changed. Use relational systems for strong integrity and flexible joins; key-value stores for direct key lookups; documents for nested records read together; wide-column stores for planned large-scale key-based workloads; graph databases for connected-path queries.")
    flow.text("<b>Object-relational impedance mismatch</b> is the difficulty of mapping nested application objects to flat related tables. An <b>Object-Relational Mapper (ORM)</b> automates parts of this mapping but cannot remove every query and design trade-off. NoSQL is not a universal replacement for SQL.", size=10.5)
    flow.note("Dialect boundary", "The lecture lab uses SQL Server's retail schema, TOP, BIT, GO and BEGIN TRAN. GO is a client batch separator, not a database SQL statement. These notes use an executable common subset and do not reproduce the platform-installation lab.")

    flow = book.page("Lecture 3 / Architecture and failure", "03 / SYSTEM DESIGN", "L3, slides 4-40. Query-transfer calculation is an original numerical illustration.", "One logical view needs local storage, a catalogue, coordination, recovery and communication.", slide=False)
    flow.heading("1 / Define the distributed system precisely")
    flow.text("A distributed database stores related data at multiple networked sites and coordinates access as a logical whole. A <b>node</b> is a participating machine; a <b>site</b> is a logical location containing nodes. Local autonomy is the control a site retains over its own operations; its extent depends on the architecture.")
    flow.table(["Service", "Responsibility"], [
        ["Query processor", "Validate a query, choose a plan, run local/remote work and combine results according to the query's semantics."],
        ["Transaction manager", "Coordinate concurrent work and distributed commit outcomes."],
        ["Recovery manager", "Use logs and checkpoints to support rollback, redo and recovery."],
        ["Metadata catalogue", "Describe schemas and locate fragments, replicas and sites."],
        ["Communication manager", "Exchange requests, data and protocol messages among nodes."],
    ], [0.29, 0.71], size=10)
    flow.heading("2 / Compare architectures without mixing categories")
    flow.text("Centralized systems simplify administration but concentrate risk and capacity. Distributed systems can improve scale, locality and resilience, while increasing coordination cost. Homogeneous systems use similar DBMS technology; heterogeneous systems integrate different technologies. Shared-nothing describes separate hardware resources. Federated describes integration while retaining database autonomy.", size=10.5)
    flow.text("<b>Transparency:</b> location hides where data lives; fragmentation hides how it is split; replication hides the copies. Client-server describes roles, not necessarily multi-site data. A hybrid can combine central control with local operations.", size=10.5)
    flow.heading("3 / Expect partial failure and expensive communication")
    flow.text("A <b>partial failure</b> affects only part of the system. A timeout might mean a crash, a slow node or a delayed network: it is evidence, not proof. A <b>network partition</b> prevents node groups from communicating. Physical clocks drift; logical clocks help track causal order. Distributed deadlocks are harder to detect because waiting information is spread across sites.", size=10.5)
    flow.text("Push useful filtering and column selection towards the data. Example: shipping 10,000 rows of 200 bytes moves 2,000,000 bytes. Shipping 100 filtered rows of 20 bytes moves 2,000 bytes, ignoring protocol overhead. This illustrates why network movement can dominate a query.", size=10.5)
    flow.note("Security has separate jobs", "Authentication verifies identity; authorization checks permission; encryption protects data in transit and storage; auditing records actions. Applying these consistently across sites is part of the architecture.")

    flow = book.page("Lecture 3 / Partitioning", "03 / DATA PLACEMENT", "L3, slides 41-51. Reconstruction conditions and sharding terminology are clarifications.", "Choose a key for queries and load. Preserve complete data and a valid reconstruction path.", slide=False)
    flow.heading("1 / What is being divided?")
    flow.text("<b>Horizontal partitioning</b> divides rows while preserving the same columns. <b>Vertical partitioning</b> divides columns, keeping an identifying key in each fragment so rows can be reconstructed. <b>Hybrid partitioning</b> combines both. A <b>shard</b> is a data partition placed on a separate database instance or node; partitions can also exist inside one instance.")
    flow.heading("2 / Worked horizontal and vertical splits")
    flow.table(["Split", "Fragments from the shared dataset", "Reconstruction"], [
        ["Horizontal, by date", "Before 2026-08-02: order 101.<br/>On/after 2026-08-02: orders 102, 103.", "Combine all rows. These predicates cover all dates without overlap."],
        ["Vertical, by purpose", "CustomerBasics(customer_id, full_name).<br/>CustomerCity(customer_id, city).", "Join on customer_id. Preserve one matching row per customer in both fragments."],
    ], [0.22, 0.47, 0.31], size=10)
    flow.text("For horizontal fragmentation, check <b>completeness</b> (no missing rows), <b>reconstruction</b> (recover the original relation) and intended <b>disjointness</b> (no unintended duplicated rows). Disjoint fragments can be combined with UNION ALL in SQL. Vertical fragments deliberately share their reconstruction key.", size=10.5)
    flow.heading("3 / How are rows assigned?")
    flow.table(["Method", "Good fit", "Risk to state"], [
        ["Range", "Date or identifier interval queries; prune irrelevant ranges.", "Uneven ranges and newest-range write hotspots."],
        ["Hash", "Direct key lookups spread across many distinct keys.", "Range scans touch several partitions; a single hot key remains hot."],
        ["List / geographic", "Named regions, categories, residency and nearby access.", "Unequal regions; global operations cross sites."],
    ], [0.20, 0.40, 0.40], size=10)
    flow.text("A <b>partition key</b> controls placement. <b>Hashing</b> maps it to a repeatable number; <b>modulo</b> gives the division remainder. For the toy rule customer_id modulo 2, customers 1 and 3 go to partition 1; customer 2 goes to partition 0. Real systems typically hash before applying a remainder or another placement rule. Choose stable keys that spread actual requests; many distinct keys alone cannot prevent a hot key.", size=10.5)
    flow.note("Moving and joining data has a price", "Rebalancing moves data after capacity or load changes. Consistent hashing can reduce remapping when nodes change. Co-locating related rows can reduce cross-partition joins and transactions; global reports still need coordination.")

    flow = book.page("Lecture 3 / Replicas and quorums", "03 / REPLICATION", "L3, slides 52-58. Quorum arithmetic and fixed-set intersections were checked.", "Replication topology and acknowledgement timing are separate decisions.", slide=False)
    flow.heading("1 / Explain the write path")
    flow.table(["Strategy", "What happens", "Main trade-off"], [
        ["Leader-follower", "One leader accepts writes; followers copy them and may serve reads.", "Read scaling and failover, but leader capacity and replication lag matter."],
        ["Multi-leader", "Several designated leaders accept writes and exchange updates.", "Local writes and autonomy, but concurrent changes can conflict."],
        ["Leaderless", "A request contacts multiple replicas without a permanent write leader.", "Tunable response requirements, but versions and reconciliation matter."],
    ], [0.24, 0.39, 0.37], size=10)
    flow.text("<b>Synchronous replication</b> waits for required replica acknowledgements; this costs latency and may prevent progress during failures. <b>Asynchronous replication</b> acknowledges before followers necessarily apply the change; reads may be stale, and a failed leader's latest acknowledged changes may be missing from a promoted follower.", size=10.5)
    flow.heading("2 / Worked quorum question")
    flow.text("A <b>quorum</b> is a required set or count of replica responses. Let <b>N</b> be the number of replicas, <b>W</b> the write acknowledgements and <b>R</b> the read responses. For one fixed replica set, <b>R + W &gt; N</b> forces each read set and completed write set to intersect.")
    flow.table(["N", "W", "R", "Test", "Conclusion"], [
        [5, 3, 3, "3 + 3 = 6 &gt; 5", "At least one shared replica."],
        [5, 3, 2, "2 + 3 = 5", "Sets can be disjoint; overlap is not guaranteed."],
        [3, 2, 2, "2 + 2 = 4 &gt; 3", "At least one shared replica."],
    ], [0.08, 0.08, 0.08, 0.27, 0.49], size=10)
    flow.text("With N = 5 and W = 3, the smallest R that forces overlap is <b>3</b>. A write to {1, 2, 3} can be missed by a read of {4, 5}. With three read responses, that disjoint arrangement is impossible.", size=10.5)
    flow.heading("3 / State what the inequality does not establish")
    flow.text("Overlap supplies a common replica, not a complete linearizability proof. The protocol still needs meaningful versions, appropriate read selection, concurrency handling and membership rules. Even overlapping write sets (for example W &gt; N/2) do not by themselves totally order concurrent writes.", size=10.5)
    flow.note("Two mark-saving qualifications", "Synchronous acknowledgements alone do not guarantee fresh reads from every replica. Replication also is not a backup: accidental deletion or corruption can spread to the copies. Failover needs a safe choice of new leader.")

    flow = book.page("Lecture 3 / Consistency and commit", "03 / PRECISION NOTES", "L3, slides 37-38 and 57-58; L2, slide 52. These are brief previews of later material.", "CAP concerns observations during a split. ACID consistency concerns valid database states.", slide=False)
    flow.heading("1 / Compare four observation guarantees")
    flow.table(["Model", "Definition and example"], [
        ["Strong / linearizable", "Operations appear on one copy in a real-time-respecting order. A read after a completed write sees that write or a newer one."],
        ["Eventual", "If writes stop and propagation and resolution succeed, replicas converge. Temporary disagreement is permitted."],
        ["Causal", "Preserve cause-and-effect dependencies. A reply should not be observed before the post it depends on."],
        ["Read-your-writes", "A client can observe its own completed writes or newer values. Other clients need not have the same guarantee."],
    ], [0.25, 0.75], size=10)
    flow.heading("2 / State CAP with its condition")
    flow.text("The <b>Consistency, Availability and Partition tolerance (CAP)</b> theorem says that during a network partition a distributed system cannot guarantee both linearizable consistency and a successful response to every request at a non-failing node. Continuing to serve both disconnected sides may sacrifice consistency; rejecting or delaying some operations sacrifices availability.", size=10.5)
    flow.text("For one remaining stock item, both sides cannot independently promise a successful exclusive sale. An availability-oriented design might accept tentative requests and reconcile them, but that changes the business guarantee. 'Pick any two' hides the condition that matters.", size=10.5)
    flow.heading("3 / PACELC adds the normal-time question")
    flow.text("<b>PACELC:</b> if there is a <b>Partition (P)</b>, consider <b>Availability (A)</b> versus <b>Consistency (C)</b>; <b>Else (E)</b>, consider <b>Latency (L)</b> versus <b>Consistency (C)</b>. Even without a partition, waiting for distant coordination can increase response time. This is a design lens, not a reason to ignore application semantics.", size=10.5)
    flow.heading("4 / Two-Phase Commit and the uncertain participant")
    flow.text("In <b>Two-Phase Commit (2PC)</b>, a coordinator first asks participants to prepare. Participants persist readiness and vote. If all vote YES, the coordinator durably records COMMIT and communicates it. Otherwise it chooses ABORT before a commit decision. A participant that has voted YES may have to wait if the decision cannot be learned; it must not unilaterally abort merely because a timeout occurs.", size=10.5)
    flow.note("Conflicts and protocol boundaries", "Last-write-wins uses a timestamp or version rule and can lose an update. Merging must match business meaning. 2PC coordinates an atomic transaction outcome; consensus agrees replicated state. They solve different problems and may be combined.")

    flow = book.page("Closed-book practice", "30 MARKS / 40 MINUTES", "Original practice based on L1-L3. Questions and mark allocations are not official exam predictions.", "Attempt first, then compare with the model answers on the next two pages.", slide=False)
    flow.text("Use the shared dataset on page 32 for Question 3; it may remain visible as question data. Otherwise close the teaching pages. Write assumptions and reasons, not only names of technologies.")
    flow.heading("1 / Definitions | 5 marks")
    flow.text("Distinguish a database from a DBMS (2). Distinguish schema, instance and metadata using a customer-table example (3).")
    flow.heading("2 / Relational design | 5 marks")
    flow.text("Model customers, orders, products, order items and payments. State the main primary/foreign keys and relationship counts. Assume one line per product per order and at most one payment record per order. Explain how you enforce the payment restriction.")
    flow.heading("3 / SQL reasoning | 6 marks")
    flow.text("Using the given rows, find customers whose paid-order spending is at least 250. Return identifier, name and spending in descending spending order. Show the SQL and manually verify the result. Use the line item's historical price.")
    flow.heading("4 / Transaction correctness | 4 marks")
    flow.text("Transfer 100 from an account with 1000 to an account with 400. Explain each ACID property using this transaction. What should remain if the operation fails after the debit and the transaction is rolled back?")
    flow.heading("5 / Partitioning and replication | 6 marks")
    flow.text("A large shop mainly retrieves one customer's orders, but also produces monthly global reports. Propose a partition key and replication topology with one trade-off each (4). With N = 5 replicas and W = 3, find the smallest R that guarantees read/write-set overlap, and state the guarantee's limit (2).")
    flow.heading("6 / Network failure and commitment | 4 marks")
    flow.text("Two regions lose communication. Explain why they cannot both guarantee the latest stock state and a successful response to every request (2). In classic 2PC, may a participant that voted YES abort solely because the coordinator times out? Explain (2).")
    flow.note("Answer shape", "Definitions: precise meaning plus example. SQL: query plus result and grain. Design scenarios: Choice -> Reason -> Trade-off -> Conclusion. No method earns full credit merely because its name sounds modern.", color=TEAL)

    flow = book.page("Model answers / Questions 1-3", "SELF-MARKING / 16 MARKS", "Original answers. The suggested marking points support practice, not an official examination scheme.", "Award credit for correct reasoning, not identical wording. Verify SQL results by hand.", slide=False)
    flow.heading("1 / Database, DBMS and descriptions | 5")
    flow.text("A <b>database</b> is an organised collection of related data, such as stored customer and order records (1). A <b>DBMS</b> is the software managing storage, queries, rules and access, such as PostgreSQL (1). The <b>schema</b> defines customer columns and rules (1); the <b>instance</b> is the current customer rows (1); <b>metadata</b> describes the columns' meanings, types or permitted values (1).", size=10.5)
    flow.heading("2 / Retail design | 5")
    flow.table(["Table", "Key and relationship marking point"], [
        ["customers", "customer_id primary key; a customer may have zero or many orders (1)."],
        ["orders", "order_id primary key; customer_id NOT NULL foreign key to customers (1)."],
        ["products", "product_id primary key; a product can appear in many order items (1)."],
        ["order_items", "Composite primary key (order_id, product_id); both are foreign keys (1)."],
        ["payments", "payment_id primary key; order_id NOT NULL, UNIQUE foreign key, giving at most one payment record per order (1)."],
    ], [0.24, 0.76], size=10)
    flow.heading("3 / Paid spending | 6")
    flow.code(SPEND_SQL, size=9)
    flow.text("<b>Result:</b> customer 1, Asha, 320. The three paid line amounts are 20, 100 and 200. Ravi's pending order is excluded; Mina has no paid spending. Before grouping, one row represents one order item; afterwards, one row represents one qualifying customer.", size=10.5)
    flow.text("Suggested points: correct join paths (2); WHERE status = 'PAID' (1); SUM of quantity times sale price and suitable grouping (1); HAVING threshold (1); requested output, ordering and checked result (1).", size=10.3)
    flow.note("Do not silently change the question", "Filtering product price at 250 is not filtering customer spending. Using the current product price can rewrite historical sales. Grouping only by a name may merge different customers.")

    flow = book.page("Model answers / Questions 4-6", "SELF-MARKING / 14 MARKS", "Original answers based on L2, slides 32-37, and L3, slides 37-38 and 41-58.", "State the benefit, the cost, and the condition under which the guarantee holds.", slide=False)
    flow.heading("4 / Transfer and ACID | 4")
    flow.text("<b>Atomicity (1):</b> both debit and credit happen or neither remains; rollback after the failed debit restores 1000 and 400. <b>Consistency (1):</b> correct logic and constraints preserve valid balances and the total 1400. <b>Isolation (1):</b> concurrent access is controlled; at serializable isolation the result matches a serial transaction order. <b>Durability (1):</b> after successful commit, 900 and 500 remain despite covered failures.")
    flow.heading("5 / One defensible distributed design | 6")
    flow.text("<b>Choice:</b> hash-partition by customer_id (1). <b>Reason:</b> the dominant query is one customer's order history; put that customer's orders and related items on the same shard where practical. <b>Trade-off:</b> monthly global reports scan/aggregate across shards, and unusually busy customers can still create hotspots (1).", size=10.5)
    flow.text("<b>Replication choice:</b> leader-follower copies for each shard (1). <b>Reason:</b> a clear write path plus copies for recovery and suitable reads. <b>Trade-off:</b> synchronous acknowledgements cost latency and availability when required replicas fail; asynchronous copies risk stale reads and losing recent writes during failover (1). Choose the acknowledgement policy from the business's tolerated data loss, not the name of the store.", size=10.5)
    flow.text("<b>Quorum:</b> R + 3 &gt; 5, so the smallest integer R is <b>3</b> (1). This guarantees intersection for the fixed replica sets, not automatic linearizability; versions, concurrent writes and the read protocol still matter (1). A different partition strategy can earn credit if the workload reasoning and costs are sound.", size=10.5)
    flow.heading("6 / CAP and an uncertain 2PC outcome | 4")
    flow.text("<b>CAP (2):</b> during the communication split, the regions cannot coordinate the latest stock decision. Preserving linearizable consistency may require rejecting or delaying some operations; always serving both sides may permit stale or contradictory results. The impossibility is simultaneous C and A during the partition, not a universal instruction to choose any two letters.", size=10.5)
    flow.text("<b>2PC (2):</b> no. After voting YES, the participant has promised to follow the global outcome. The coordinator might already have committed and informed another participant. The uncertain participant must learn the durable outcome and may block; a timeout alone does not justify unilateral abort.", size=10.5)
    flow.note("Use errors to choose the next practice", "Wrong keys: redraw the relationship. Wrong SQL total: list joined rows before grouping. Wrong distributed answer: separate data placement, write acknowledgement and read guarantees. Record only mistakes you actually made.", color=TEAL)

    flow = book.page("The final recall sheet", "LECTURES 01-03 / QUICK RECALL", "Synthesis of L1-L3. Full source map on page 29; this is revision material, not an exam aid.", "Model -> keys -> query -> transaction -> partition -> replicate -> state the trade-off.", slide=False)
    flow.heading("1 / Foundations in six distinctions")
    flow.table(["Do not confuse", "Say this instead"], [
        ["Database / DBMS", "Stored related data / software managing it."],
        ["Schema / instance", "Structure and rules / current rows."],
        ["Primary / foreign key", "Identity here / valid reference to an eligible key."],
        ["One-to-many / many-to-many", "Foreign key on many side / junction table."],
        ["Normalise / denormalise", "Reduce repeated facts / add measured read-time shortcuts."],
        ["Current / historical price", "Catalogue value now / actual value agreed at sale."],
    ], [0.39, 0.61], size=10)
    flow.heading("2 / SQL and transaction checks")
    flow.text("<b>Logical query order:</b> FROM/JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY. <b>WHERE:</b> rows. <b>HAVING:</b> groups. <b>IS NULL:</b> missing value test. <b>COUNT(column):</b> excludes NULL. <b>LEFT JOIN:</b> preserves the left side. <b>EXISTS:</b> checks presence.", size=10.5)
    flow.text("<b>ACID:</b> Atomicity = all-or-nothing; Consistency = valid state transitions; Isolation = controlled concurrency; Durability = committed survival. Serializable gives a serial-equivalent result. COMMIT accepts uncommitted work; ROLLBACK cancels it. Expand -> migrate -> contract for compatible schema changes.", size=10.5)
    flow.heading("3 / Distributed design checks")
    flow.table(["Decision", "Recall"], [
        ["Partition / replicate", "Split data / keep copies. A network partition is a different kind of split."],
        ["Horizontal / vertical", "Rows / columns. Retain a reconstruction key for vertical fragments."],
        ["Range / hash / list", "Intervals / hashed key / named values. Test real load, not only row counts."],
        ["Replication", "Leader-follower, multi-leader or leaderless; synchronous or asynchronous acknowledgement."],
        ["Quorum", "R + W > N guarantees fixed-set overlap, not every consistency property."],
        ["CAP / 2PC", "C versus A during a network split / prepare then decide, with possible blocking."],
    ], [0.28, 0.72], size=10)
    flow.note("One check question", "Asha has two orders. Should orders.customer_id be UNIQUE? Explain using the relationship, not just the keyword. Answer: no; repeated foreign-key values are exactly how this one-to-many relationship is represented.", color=TEAL)


def inspect_pdf(book, previews=True):
    document = fitz.open(OUTPUT)
    assert len(document) == len(book.pages)
    assert len(document.get_toc()) == len(book.pages)
    if any(not page["slide"] for page in book.pages):
        links = document[28].get_links()
        destinations = [int(link["page"]) + (1 if isinstance(link["page"], int) else 0) for link in links]
        assert destinations == [30, 32, 34, 38, 40, 44], destinations
    for index, page in enumerate(document):
        assert len(page.get_text().strip()) > 120, f"Sparse or empty page: {index + 1}"
        expected = SLIDE if book.pages[index]["slide"] else A4
        assert abs(page.rect.width - expected[0]) < 1
        assert abs(page.rect.height - expected[1]) < 1
        spans = []
        for block in page.get_text("dict")["blocks"]:
            for line in block.get("lines", []):
                for span in line["spans"]:
                    bounds = fitz.Rect(span["bbox"])
                    assert page.rect.contains(bounds), f"Text outside page {index + 1}: {span['text']}"
                    if span["text"].strip():
                        spans.append(span)
        for first_index, first in enumerate(spans):
            for second in spans[first_index + 1:]:
                overlap = fitz.Rect(first["bbox"]) & fitz.Rect(second["bbox"])
                assert overlap.width <= 2 or overlap.height <= 3, f"Overlapping text on page {index + 1}: {first['text']} / {second['text']}"
        pixmap = page.get_pixmap(matrix=fitz.Matrix(0.3, 0.3), alpha=False)
        image = Image.frombytes("RGB", [pixmap.width, pixmap.height], pixmap.samples)
        nonwhite = sum(image.convert("L").histogram()[:235])
        assert nonwhite / (image.width * image.height) > 0.04, f"Blank-looking page {index + 1}"
    if previews:
        preview_dir = ROOT / "_preview"
        preview_dir.mkdir(exist_ok=True)
        for start in range(0, len(document), 12):
            sheet = Image.new("RGB", (1500, 1200), "#E4E8E6")
            drawing = ImageDraw.Draw(sheet)
            for offset in range(min(12, len(document) - start)):
                page = document[start + offset]
                pixmap = page.get_pixmap(matrix=fitz.Matrix(0.6, 0.6), alpha=False)
                image = Image.frombytes("RGB", [pixmap.width, pixmap.height], pixmap.samples)
                image.thumbnail((475, 262))
                left = (offset % 3) * 500 + (500 - image.width) // 2
                top = (offset // 3) * 300 + 12
                sheet.paste(image, (left, top))
                drawing.text(((offset % 3) * 500 + 15, (offset // 3) * 300 + 280), f"{start + offset + 1:02d}  {book.pages[start + offset]['title']}", fill="#192C29")
            sheet.save(preview_dir / f"contact_{start + 1:02d}.png")
        detail_pages = {0, len(document) - 1}
        if len(document) > 28:
            detail_pages.update({28, 31, 32, 36, 40})
        for index in detail_pages:
            document[index].get_pixmap(matrix=fitz.Matrix(1.4, 1.4), alpha=False).save(preview_dir / f"page_{index + 1:02d}.png")
    print(f"PASS: {len(document)} pages; page sizes, text bounds, no text overlap, bookmarks, contents links, and nonblank rendering.")
    document.close()


def main():
    parser = argparse.ArgumentParser(description="Build the Modern Databases lecture companion PDF.")
    parser.add_argument("--smoke", action="store_true", help="Render two representative presentation pages.")
    arguments = parser.parse_args()
    verify_sql()
    register_fonts()
    book = Book()
    if arguments.smoke:
        add_cover(book)
        add_sql_sample(book)
    else:
        add_slides(book)
        add_notes(book)
    book.save()
    inspect_pdf(book)
    print(f"Created: {OUTPUT}")


if __name__ == "__main__":
    main()