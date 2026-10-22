# Modern Databases: Essential Revision

- **Visual PDF**
  - [Modern_Databases_Essential_Visual_Revision.pdf](Modern_Databases_Essential_Visual_Revision.pdf)
  - 72 selected questions across eight lectures.
    - Short answers, nested bullets, colored boxes, and diagrams.
    - One question per page; chapter and question bookmarks provide navigation.
  - Classroom and representative guidance questions are condensed, not guaranteed examination questions.

- **Lecture Notes**
  - [Lecture_01_Foundations.md](Lecture_01_Foundations.md): 10 questions.
  - [Lecture_02_SQL_and_Transactions.md](Lecture_02_SQL_and_Transactions.md): 20 questions.
  - [Lecture_03_Distributed_Foundations.md](Lecture_03_Distributed_Foundations.md): seven questions.
  - [Lecture_04_Transactions_and_Consistency.md](Lecture_04_Transactions_and_Consistency.md): seven questions.
  - [Lecture_05_NoSQL_and_Key_Value.md](Lecture_05_NoSQL_and_Key_Value.md): 10 questions.
  - [Lecture_06_Document_Databases.md](Lecture_06_Document_Databases.md): five questions.
  - [Lecture_07_Wide_Column_and_Graph.md](Lecture_07_Wide_Column_and_Graph.md): seven questions.
  - [Lecture_08_Search_Databases.md](Lecture_08_Search_Databases.md): six questions.
    - Original question identifiers remain where practical; numbering gaps reflect removed or combined questions.

- **Rebuild**
  - Run from the DataScience workspace root.
    ```powershell
    .\.venv\Scripts\python.exe ".\ModernDb\Prep Questions\verify_prep.py"
    .\.venv\Scripts\python.exe ".\ModernDb\Prep Questions\build_prep_pdf.py"
    ```
  - [build_prep_pdf.py](build_prep_pdf.py) renders the current Markdown answers directly.
    - Python packages: `markdown-it-py`, `reportlab`, `PyMuPDF`, and `Pillow`.
    - Mermaid rendering requires Node.js/npm and installed Edge or Chrome.
    - Layout fonts reuse the existing Windows-based PDF setup.
  - Add `--smoke` to preview dense code, diagrams, and three-digit question identifiers.

- **Checks**
  - [verify_prep.py](verify_prep.py) checks question coverage, answer boxes, nested bullets, and syntax.
    - Every prose bullet contains at most 15 words.
    - Seventeen SQL results, ten constraint violations, transactions, and migration totals are checked.
    - Replica-overlap and inverted-index answers are checked independently.
  - [retail_practice.sql](retail_practice.sql) remains the shared SQL test dataset.
    - SQLite validates the common SQL subset, not database-specific server behavior.
    - Redis, MongoDB, Cassandra, and Neo4j services are not started or live-tested.
  - PDF checks cover text completeness, nonblank pages, bookmarks, and nonoverlapping boxes.
    - Rendered previews and validation results remain under `_pdf_preview/`.