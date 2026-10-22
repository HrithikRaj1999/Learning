from __future__ import annotations

import argparse
from collections import Counter
from datetime import date
from itertools import combinations
import json
from pathlib import Path
import re
import shutil
import sqlite3
import subprocess
from urllib.parse import unquote

from markdown_it import MarkdownIt


ROOT = Path(__file__).resolve().parent
CHAPTERS = {
    1: ("Lecture_01_Foundations.md", (1, 4, 6, 8, 10, 11, 12, 13, 14, 15)),
    2: ("Lecture_02_SQL_and_Transactions.md", (16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 33, 34, 36, 38, 40)),
    3: ("Lecture_03_Distributed_Foundations.md", (41, 42, 43, 45, 47, 49, 50)),
    4: ("Lecture_04_Transactions_and_Consistency.md", (56, 57, 61, 62, 63, 64, 65)),
    5: ("Lecture_05_NoSQL_and_Key_Value.md", (66, 67, 68, 69, 70, 71, 74, 76, 78, 79)),
    6: ("Lecture_06_Document_Databases.md", (81, 82, 83, 84, 85)),
    7: ("Lecture_07_Wide_Column_and_Graph.md", (86, 88, 89, 91, 93, 94, 95)),
    8: ("Lecture_08_Search_Databases.md", (96, 97, 98, 99, 100, 101)),
}
QUESTION = re.compile(r"^- \*\*Q(\d+)\. (.+)\*\*$", re.MULTILINE)
FORBIDDEN = re.compile(
    r"Source:|Primary source|Exam[ -]trap|Recall:|Diagnostic:|Worked example|Explanation:",
    re.IGNORECASE,
)
MARKDOWN = MarkdownIt("commonmark")


def question_sections(text: str) -> dict[int, str]:
    headings = list(QUESTION.finditer(text))
    repeated = [number for number, count in Counter(match.group(1) for match in headings).items() if count > 1]
    if repeated:
        raise AssertionError(f"Repeated questions: {repeated}")
    return {
        int(heading.group(1)): text[heading.start():headings[index + 1].start() if index + 1 < len(headings) else len(text)]
        for index, heading in enumerate(headings)
    }


def code_blocks(section: str, language: str) -> list[str]:
    return [
        token.content for token in MARKDOWN.parse(section)
        if token.type == "fence" and token.info == language
    ]


def check_links(path: Path, text: str) -> None:
    for target in re.findall(r"\[[^\]\n]+\]\(([^)\n]+)\)", text):
        if target.startswith(("https://", "http://", "mailto:", "#")):
            continue
        if not (path.parent / unquote(target.split("#", 1)[0])).resolve().exists():
            raise AssertionError(f"Broken local link in {path.name}: {target}")


def check_chapter(lecture: int) -> dict[int, str]:
    filename, expected = CHAPTERS[lecture]
    path = ROOT / filename
    text = path.read_text(encoding="utf-8")
    sections = question_sections(text)
    if tuple(sections) != expected:
        raise AssertionError(f"Question coverage/order mismatch in {filename}: {tuple(sections)}")
    if FORBIDDEN.search(text):
        raise AssertionError(f"Removed explanatory section returned in {filename}")
    in_fence = False
    for line in text.splitlines():
        if "```" in line:
            in_fence = not in_fence
            continue
        if in_fence or not line.strip() or line.startswith("# "):
            continue
        if not re.match(r"^(?:- \*\*Q\d+\.|  > +-) ", line):
            raise AssertionError(f"Non-bullet prose in {filename}: {line}")
        if len(re.sub(r"^.*?- ", "", line).split()) > 15:
            raise AssertionError(f"Bullet exceeds 15 words in {filename}: {line}")
    if in_fence:
        raise AssertionError(f"Unbalanced code fences in {filename}")
    node = shutil.which("node")
    for number, section in sections.items():
        tokens = MARKDOWN.parse(section)
        if sum(token.type == "blockquote_open" for token in tokens) != 1:
            raise AssertionError(f"Q{number} must have one answer box")
        list_sizes = []
        for token in tokens:
            if token.type == "bullet_list_open":
                list_sizes.append(0)
            elif token.type == "list_item_open":
                list_sizes[-1] += 1
            elif token.type == "bullet_list_close":
                if list_sizes.pop() > 5:
                    raise AssertionError(f"Q{number}: more than five points in one cluster")
        if "  >   - " not in section:
            raise AssertionError(f"Q{number}: missing nested answer points")
        for block in code_blocks(section, "python"):
            compile(block, f"{filename}:Q{number}", "exec")
        for block in code_blocks(section, "json"):
            json.loads(block)
        for block in code_blocks(section, "javascript"):
            if not node:
                raise RuntimeError("Node.js is required for MongoDB JavaScript syntax checks")
            result = subprocess.run([node, "--check"], input=block, text=True, capture_output=True)
            if result.returncode:
                raise AssertionError(f"Q{number}: {result.stderr}")
    check_links(path, text)
    print(f"PASS: Lecture {lecture}: {len(sections)} selected questions, boxes, nested bullets, and code syntax.")
    return sections


def check_sql(sections: dict[int, str]) -> None:
    database = sqlite3.connect(":memory:")
    database.execute("PRAGMA foreign_keys = ON")
    database.create_function("YEAR", 1, lambda value: date.fromisoformat(value).year)
    database.create_function("MONTH", 1, lambda value: date.fromisoformat(value).month)
    database.executescript((ROOT / "retail_practice.sql").read_text(encoding="utf-8"))
    blocks = {number: code_blocks(section, "sql") for number, section in sections.items()}
    shipped = [(1, "Asha Rao"), (2, "Ravi Sen"), (3, "Mina Shah")]
    totals = [(101, 2000), (102, 10400), (103, 1000), (104, 2200), (105, 10000), (106, 1000)]
    cases = [
        (21, 0, [(103, "Monitor", 10000), (101, "Keyboard", 1000), (102, "Mouse", 500), (104, "Cable", 200), (105, "Notebook", 100), (106, "Pen", 20)]),
        (21, 1, [(103, "2026-08-01"), (104, "2026-08-02"), (105, "2026-08-03"), (106, "2026-08-04")]),
        (22, 0, [(101, 101, 1000), (101, 102, 1000), (102, 103, 10000), (102, 104, 400), (103, 102, 500), (103, 105, 500), (104, 101, 2000), (104, 104, 200), (105, 103, 10000), (106, 105, 1000)]),
        (22, 1, [(101, 3000), (102, 1500), (103, 20000), (104, 600), (105, 1500), (106, 0)]),
        (23, 0, [(1, 2), (2, 2), (3, 2)]),
        (26, 0, [(101, "Asha Rao", 2000), (102, "Asha Rao", 10400), (103, "Ravi Sen", 1000), (104, "Ravi Sen", 2200), (105, "Mina Shah", 10000), (106, "Mina Shah", 1000)]),
        (26, 1, [(1, "Asha Rao", 2), (2, "Ravi Sen", 2), (3, "Mina Shah", 2), (4, "Omar Khan", 0)]),
        (27, 0, [(4, "Omar Khan")]),
        (27, 1, [(102,), (104,), (106,)]),
        (27, 2, [(106, "Pen")]),
        (28, 0, [(103, "Monitor", 20000)]),
        (28, 1, shipped),
        (29, 0, shipped),
        (30, 0, [("Accessories", 5100), ("Displays", 20000), ("Stationery", 1500)]),
        (30, 1, [(1, "Asha Rao", 12400)]),
        (30, 2, [(2026, 7, 2), (2026, 8, 4)]),
    ]
    try:
        for number, index, expected in cases:
            actual = database.execute(blocks[number][index]).fetchall()
            if actual != expected:
                raise AssertionError(f"Q{number}, block {index + 1}: {actual!r} != {expected!r}")
        database.executescript("""
            CREATE TABLE CUSTOMER (CustomerID INTEGER PRIMARY KEY, CustomerName TEXT);
            CREATE TABLE [ORDER] (OrderID INTEGER PRIMARY KEY, CustomerID INTEGER, Amount INTEGER);
            INSERT INTO CUSTOMER VALUES (1, 'First'), (2, 'Second');
            INSERT INTO [ORDER] VALUES (101, 1, 100), (102, 1, 250);
        """)
        if sorted(database.execute(blocks[25][0]).fetchall()) != [(1, "First", 350), (2, "Second", 0)]:
            raise AssertionError("Q25 must total orders and retain customers without orders")
        invalid = [
            "INSERT INTO customers VALUES (1, 'Other', 'other@example.com', 'Pune')",
            "INSERT INTO customers VALUES (5, 'Other', 'asha@example.com', 'Pune')",
            "INSERT INTO customers VALUES (5, NULL, 'other@example.com', 'Pune')",
            "INSERT INTO products VALUES (107, 'Invalid', 'Accessories', -1, 1)",
            "INSERT INTO orders VALUES (999, 999, '2026-08-01', 'PLACED')",
            "INSERT INTO orders VALUES (999, 1, '2026-08-01', 'INVALID')",
            "INSERT INTO order_items VALUES (101, 101, 1, 1000, NULL)",
            "INSERT INTO order_items VALUES (101, 106, 0, 20, NULL)",
            "INSERT INTO order_items VALUES (101, 999, 1, 20, NULL)",
            "INSERT INTO payments VALUES (504, 101, 2000)",
        ]
        for statement in invalid:
            database.execute("SAVEPOINT constraint_case")
            try:
                database.execute(statement)
            except sqlite3.IntegrityError:
                pass
            else:
                raise AssertionError(f"Invalid insert accepted: {statement}")
            finally:
                database.execute("ROLLBACK TO constraint_case")
                database.execute("RELEASE constraint_case")
        database.executescript(blocks[33][0])
        if database.execute("SELECT unit_price FROM products WHERE product_id = 101").fetchone() != (1100,):
            raise AssertionError("Writer cannot see its updated price")
        database.rollback()
        if database.execute("SELECT unit_price FROM products WHERE product_id = 101").fetchone() != (1000,):
            raise AssertionError("Rollback failed to restore the price")
        database.executescript(blocks[33][0])
        database.commit()
        if database.execute("SELECT unit_price FROM products WHERE product_id = 101").fetchone() != (1100,):
            raise AssertionError("Commit failed to preserve the price")
        for block in blocks[36]:
            database.executescript(block)
        for column, table in (("order_total", "v_order_summary"), ("cached_order_total", "orders")):
            if database.execute(f"SELECT order_id, {column} FROM {table} ORDER BY order_id").fetchall() != totals:
                raise AssertionError(f"Incorrect totals in {table}")
        if database.execute("SELECT COUNT(*) FROM customers WHERE phone IS NOT NULL").fetchone() != (2,):
            raise AssertionError("Phone backfill must populate two customers")
    finally:
        database.close()
    print(f"PASS: {len(cases) + 1} SQL result sets, ten rejected constraint violations, rollback/commit, and migration.")
    print("LIMIT: SQLite checks the shared SQL subset; PostgreSQL plans and SQL Server concurrency are not live-tested.")


def check_distribution() -> None:
    groups = [set(group) for group in combinations(range(5), 3)]
    if not all(read & write for read in groups for write in groups):
        raise AssertionError("Three-of-five read and write quorums must overlap")
    if {0, 1} & {3, 4}:
        raise AssertionError("Two-of-five sets should admit disjoint reads and writes")
    print("PASS: five-replica quorum overlap and disjoint-set counterexample.")


def check_search(sections: dict[int, str]) -> None:
    documents = dict(re.findall(r">   - (D\d+): `([^`]+)`\.", sections[97]))
    if len(documents) != 2:
        raise AssertionError("Q97 must supply both documents")
    postings = {}
    for identifier, content in documents.items():
        for term in content.split():
            postings.setdefault(term, set()).add(identifier)
    expected = {"fast": {"D1"}, "search": {"D1"}, "database": {"D1", "D2"}, "systems": {"D2"}}
    if postings != expected or postings["fast"] & postings["database"] != {"D1"}:
        raise AssertionError("Q97 inverted index or intersection is incorrect")
    print("PASS: inverted-index postings and AND retrieval from the displayed documents.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Check the selected Modern Databases visual answers.")
    parser.add_argument("--lectures", nargs="+", type=int, choices=tuple(CHAPTERS), default=list(CHAPTERS))
    arguments = parser.parse_args()
    all_sections = {}
    for lecture in arguments.lectures:
        sections = check_chapter(lecture)
        if all_sections.keys() & sections.keys():
            raise AssertionError("Question identifiers must be unique across chapters")
        all_sections.update(sections)
        if lecture == 2:
            check_sql(sections)
        if lecture == 3:
            check_distribution()
        if lecture == 8:
            check_search(sections)
    print(f"PASS: {len(all_sections)} unique selected questions.")
    print("LIMIT: Redis, MongoDB, Cassandra, and Neo4j servers are not contacted.")


if __name__ == "__main__":
    main()