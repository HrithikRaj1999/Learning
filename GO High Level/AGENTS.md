# Instructions for HLD (High-Level Design) documents in this folder

Follow every rule below for any system design doc here, so the user never has to repeat a correction.

## Where and what to produce
- One folder per system: `High Level\<system_name>_HLD\`, containing `architecture.md` + `architecture.pdf`.
- Build the PDF with `python "C:\Learning\GO High Level\save_pdf.py" "<path to architecture.md>"`. It puts wide diagrams on their own wide page.
- Reference pattern: `High Level\ticket_booking_HLD\architecture.md` (all 5 docs now in this style). Shared engine + generators live in the session files folder `hld\` (`engine.py`, `ticket\gen_ticket_new.py`, `SPEC.md`).
- Write the ASCII diagrams with a small Python generator (box grid, lines only between neighbouring columns, crossing check) and a markdown template with placeholders. Don't draw them by hand.
- Wide is fine: diagrams and data rows grow **sideways** (the HTML scrolls sideways, the PDF puts them on a wide page). Don't stack boxes vertically to save width.
- No ``` fenced blocks inside list items (Python-Markdown breaks them). Inside a step, use an indented code block (blank line, 12-space indent, blank line). Put a blank line before every numbered step (`2. **...**`), otherwise the list after a code block falls apart in HTML/PDF.

## Document structure (in this order)
1. Title + "the one idea to remember" quote in plain words, with a link to the Deep Dive.
2. **No glossary section** ("Simple words used") and **no "Running example" block**. Write full forms inline instead.
3. **Requirements** in 2 columns (HTML table `class="cols"`): Functional | Non-functional. **One `<tr>` per pair**, so each functional item sits in the same row as its matching non-functional item (e.g. "Students enroll" next to "Money is handled exactly once"); leave a cell empty if one side has an extra item. Each item has a short sub-bullet and an "e.g." example from the running example.
4. **APIs** in 2 columns (table only). **No explainer bullets or quotes under it**; the flows explain the headers and choices.
5. **`## Diagram` = quick view**: small boxes connected by arrows. Each box = its name, a line, then **2-3 very short notes** (`- holds queue settings`, `- safe to lose`): what it stores or its one job, one line each, no wrapping. **No badges** (no `FLOWS 1-3`), no arrow labels, no schema boxes hung on it, and no extra table below it. Draw a big double-line frame titled with the system name around everything that is **part of the system**; callers who only *use* it (producers, apps, people) sit **outside on the left**, consumers / receivers **outside on the right**, each side with a heading like `PRODUCERS (outside)`. Above it one short intro line. **No "How to read it", no "Flows at a glance", no quote** under it.
5b. **`## Schema Overview`** (right after the diagram): separate double-line boxes in one sideways row per store group: each SQL DB's tables, Elasticsearch document, Redis keys, Cassandra table, Kafka topics + a message, S3 objects, HLS manifests, CDN rules. **Schema and example are one box**: title (with key / UNIQUE hints, e.g. `bookings (Booking DB) · UNIQUE user_id + idempotency_key`), then only the example JSON, where a field with several possible values shows them inline: `"status": "PENDING" or "CONFIRMED" or "EXPIRED"`. No separate column list.
6. **Flows**: each flow is a slice of the big diagram (see the flow rules below).
7. **Key design choices** table (Area | Choice | Why vs alternative).
8. **Deep Dive**: estimates, data model, events, failure cases, hot spots, caching, walk-through, interview Q&A.

## Language rules (most important)
- **No buzzwords.** Write every short form out in full with brackets, e.g. CDN (Content Delivery Network) or CDC (Change Data Capture).
- Always explain **why** a thing is needed, not just what it is.
- Write so a complete beginner understands. Use real-life comparisons, and go deep and immersive, covering every major detail.
- Explain **how things actually work inside** (e.g. how the transcoder works step by step, or how a file goes S3 → CDN → phone, including cache hit and cache miss).
- Use one running example with named people and ids (e.g. Priya the teacher, Rahul the student, order o-301) in every flow.
- Avoid number-heavy text. Use few numbers, and only when they help.
- Write "about" numbers with `≈`, never `~` (two `~` in one line can render as strikethrough).

## Diagram box rules
- **Do NOT put id numbers like (1), (2), (9) on boxes.** The only numbers inside a flow diagram are **step numbers**.
- Flow diagrams: every box gets a badge on its top edge, `STEP 1, 2`, meaning the box takes part in those steps.
- **No connector / arrow-label boxes.** Arrows go straight box to box: service → service, service → Kafka, DB → Debezium (CDC) → Kafka, DB → DB, Redis → Redis. A CDC tool is its own box between the DB and Kafka. What used to sit on an arrow (HTTP path, SQL, topic) goes into the box lines.
- Each box lists, for every step it takes part in, exactly what happens there:
  ```
  STEP n: what happens here (the agenda)
    - how it is done
    - e.g. small example from the running example
  ```
- Write step numbers the same way everywhere (`STEP n`).
- Arrows must clearly show direction (`──>`), and nothing may cross.
- **Data in this flow**: right under each flow diagram, one code block with all the data boxes that flow touches **side by side in one row** (it scrolls sideways), with `▼ <box name>` over each group. Each box = merged schema + example (same format as Schema Overview), showing that flow's real values: SQL rows, Kafka (topic / key / headers / value), queue message, S3 files, Redis keys, Elasticsearch document. Never hang data boxes inside the flow diagram and never connect them with arrows.

## Flow rules (every flow)
- Heading: `### Flow N. <plain description> (<tech chain>)`.
- **No "Scenario" paragraph** and no "Order of steps" block. The flow starts with its diagram, then **Data in this flow**.
- Numbered steps matching the badges, written as **short nested bullets** so they are easy to track:
  ```
  1. **Step headline**
     - **a) major part**
       - short sub point
     - **b) next part**
       - short sub point
     - **Data change:** exactly what is written, with real values, e.g. `videos` row added `{video_id: v-88, status: UPLOADING}`
     - **Why:** why it is done this way, and what breaks otherwise
  ```
  (3 spaces for level 2, 5 spaces for level 3.)
- **No `>` quote boxes anywhere** except the title's "one idea to remember". A beginner question goes in as a short bullet in the step (e.g. `- **What FOR UPDATE does:** ...`); Deep Dive notes are plain paragraphs.
- End with **Say in the interview:** one or two sentences, as a plain line (not a quote).
- **No dual writes, ever.** Whenever a write must also tell another system (event, call, cache fill, partition setup), save the change and an `outbox` row in ONE transaction (Cassandra: one logged batch with an outbox table), then a relay / Debezium / publisher does the rest with repeat-safe steps. If there is no database row to pair with, write to Kafka first (it acts as the outbox). Calls to outside companies save a "to-do" status first (e.g. `REFUND_PENDING`) and use idempotency keys. Readers drop repeats by event id. Explain the "crash in between" case in the step's **Why**.

## Answering questions in chat
- When the user asks "what is X / why is X needed", answer in plain words with an example, then offer to add it to the doc. Add the same style of explanation into the doc.
