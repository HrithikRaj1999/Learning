const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");

const studyDirectory = __dirname;
const toolsDirectory = path.join(studyDirectory, "..", ".venv", "visual-tools");
const localRequire = createRequire(path.join(toolsDirectory, "package.json"));
const { Marked } = localRequire("marked");
const markedKatex = localRequire("marked-katex-extension");
const libraryDirectory = path.join(toolsDirectory, "node_modules");

const readStudy = (filename) => fs.readFileSync(path.join(studyDirectory, filename), "utf8");
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);
const slug = (value) => value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
const references = new Map([
    ["01_Combined_Lecture_Notes.md", "full-notes"],
    ["02_Solved_Exam_and_Sample_Paper.md", "solved-papers"],
    ["03_Targeted_Practice_and_Assignment.md", "practice"],
]);

function makeParser(prefix) {
    return new Marked(markedKatex({ throwOnError: true, nonStandard: true }), {
        gfm: true,
        renderer: {
            heading({ depth, text, tokens }) {
                const level = Math.max(2, depth);
                return `<h${level} id="${prefix}-${slug(text)}">${this.parser.parseInline(tokens)}</h${level}>\n`;
            },
            code({ lang, text }) {
                if (lang === "mermaid") {
                    return `<figure class="diagram"><pre class="mermaid">${escapeHtml(text)}</pre></figure>\n`;
                }
                return `<pre class="code"><code>${escapeHtml(text)}</code></pre>\n`;
            },
            link({ href, tokens }) {
                let target = href;
                if (href.startsWith("#")) target = `#${prefix}-${href.slice(1)}`;
                if (references.has(href)) target = `#${references.get(href)}`;
                return `<a href="${escapeHtml(target)}">${this.parser.parseInline(tokens)}</a>`;
            },
            blockquote({ tokens }) {
                const contents = this.parser.parse(tokens);
                const caution = /COMMON MISTAKE|LEAKAGE RULE|TIME CHECK/.test(contents);
                return `<blockquote class="${caution ? "caution" : "rule"}">${contents}</blockquote>\n`;
            },
        },
    });
}

const notes = readStudy("01_Combined_Lecture_Notes.md");
const quickParser = makeParser("revision");
const tokens = quickParser.lexer(notes);
const sessionStarts = tokens.flatMap((token, index) => (
    token.type === "heading" && token.depth === 2 && /^Session [1-8]\./.test(token.text)
        ? [index] : []
));
assert.equal(sessionStarts.length, 8, "Expected all eight source sessions");

function nextHeading(start, depth) {
    const offset = tokens.slice(start + 1).findIndex((token) => token.type === "heading" && token.depth <= depth);
    return offset < 0 ? tokens.length : start + 1 + offset;
}

const revisionSheets = sessionStarts.map((start, sessionIndex) => {
    const end = nextHeading(start, 2);
    const section = tokens.slice(start, end);
    const boxStart = section.findIndex((token) => token.type === "heading" && token.text.startsWith("Revision Box "));
    assert(boxStart >= 0, `Missing revision box for session ${sessionIndex + 1}`);
    const followingHeading = section.slice(boxStart + 1).findIndex((token) => token.type === "heading" && token.depth <= 3);
    assert(followingHeading >= 0, "Expected detailed notes after each revision box");
    const selected = [section[0], ...section.slice(boxStart, boxStart + 1 + followingHeading)];
    const markdown = selected.map((token) => token.raw).join("");
    return {
        title: section[0].text,
        anchor: `revision-${slug(section[0].text)}`,
        html: `<section class="chapter" data-session="${sessionIndex + 1}">${quickParser.parse(markdown)}</section>`,
    };
});

const introEnd = tokens.findIndex((token) => token.type === "hr");
assert(introEnd > 0 && introEnd < sessionStarts[0], "Missing end of one-day route");
const introMarkdown = tokens.slice(1, introEnd).map((token) => token.raw).join("");
const finalStart = tokens.findIndex((token) => token.type === "heading" && token.text.startsWith("Final Revision:"));
assert(finalStart > sessionStarts.at(-1), "Missing final formula and recall section");
const finalMarkdown = tokens.slice(finalStart).map((token) => token.raw).join("");
const finalBlocks = quickParser.lexer(finalMarkdown);
const finalParts = [];
let currentPart = [];
for (const token of finalBlocks) {
    if (token.type === "heading" && token.depth === 3 && currentPart.length > 0) {
        finalParts.push(currentPart);
        currentPart = [];
    }
    currentPart.push(token);
}
if (currentPart.length) finalParts.push(currentPart);
const finalHtml = finalParts.map((part) => {
    const heading = part.find((token) => token.type === "heading");
    const pageClass = /Formula Recall|Ten Common|Last 20|Check Your Answers/.test(heading?.text ?? "") ? "new-page" : "";
    return `<section class="recall-part ${pageClass}">${quickParser.parse(part.map((token) => token.raw).join(""))}</section>`;
}).join("\n");

const appendixTitles = ["Full notes: sessions 1-8", "Solved exam and sample worksheet", "24 drills and assignment practice"];
const appendices = [...references.entries()].map(([filename, identifier], index) => {
    const parser = makeParser(identifier);
    return `<details class="reference" id="${identifier}" open><summary>${appendixTitles[index]}</summary>
        <div class="reference-body">${parser.parse(readStudy(filename))}</div></details>`;
}).join("\n");

let mathCss = fs.readFileSync(path.join(libraryDirectory, "katex", "dist", "katex.min.css"), "utf8");
mathCss = mathCss.replace(/url\((fonts\/[^)]+)\)/g, (_, filename) => {
    const extension = path.extname(filename).slice(1);
    const data = fs.readFileSync(path.join(libraryDirectory, "katex", "dist", filename)).toString("base64");
    return `url(data:font/${extension};base64,${data})`;
});
const mermaidScript = fs.readFileSync(path.join(libraryDirectory, "mermaid", "dist", "mermaid.min.js"), "utf8")
    .replace(/<\/script/gi, "<\\/script");

const styles = `
:root { --ink: #262b2a; --green: #176b48; --teal: #146877; --red: #92384c; --line: #d9e1dc; --paper: #fff; }
* { box-sizing: border-box; }
html { scroll-padding-top: 24px; }
body { margin: 0; color: var(--ink); background: #f2f5f3; font: 16px/1.55 "Trebuchet MS", sans-serif; letter-spacing: 0; }
a { color: var(--teal); text-underline-offset: 3px; overflow-wrap: anywhere; }
a:focus-visible, summary:focus-visible { outline: 3px solid #b95070; outline-offset: 4px; }
.layout { display: grid; grid-template-columns: 220px minmax(0, 980px); max-width: 1260px; margin: auto; min-height: 100vh; }
.contents { padding: 30px 16px; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
.contents h2 { font-size: 16px; margin: 0 0 16px; color: var(--green); }
.contents a { display: block; padding: 7px 0; font-size: 14px; text-decoration: none; border-bottom: 1px solid var(--line); }
.contents .references-label { margin: 24px 0 5px; font-size: 12px; text-transform: uppercase; font-weight: bold; }
main { min-width: 0; padding: 36px 48px 60px; background: var(--paper); }
.document-header { border-top: 7px solid var(--green); padding-top: 20px; margin-bottom: 28px; }
.eyebrow { color: var(--red); font-size: 13px; font-weight: bold; text-transform: uppercase; margin: 0 0 8px; }
h1 { font: bold 34px/1.15 Cambria, Georgia, serif; letter-spacing: 0; margin: 0 0 12px; }
h2 { font: bold 25px/1.25 Cambria, Georgia, serif; margin: 32px 0 18px; overflow-wrap: anywhere; }
h3 { color: var(--green); font-size: 19px; line-height: 1.3; margin: 25px 0 12px; }
h4 { font-size: 16px; margin: 20px 0 10px; }
p { margin: 10px 0; }
li { margin: 5px 0; }
ol, ul { padding-left: 25px; }
.document-meta { margin: 0; color: #55605a; font-size: 14px; }
.chapter { margin-top: 48px; padding-top: 4px; border-top: 3px solid var(--green); }
.chapter h2 { margin-top: 20px; }
.chapter h3 { color: var(--red); }
blockquote { margin: 18px 0; padding: 12px 17px; border: 1px solid #b6d4c1; border-left: 5px solid var(--green); border-radius: 4px; background: #f0f8f3; }
blockquote p { margin: 5px 0; }
blockquote p:first-child { color: var(--green); }
blockquote.caution { border-color: #e6c681; border-left-color: #9c651b; background: #fff8e8; }
blockquote.caution p:first-child { color: #784b11; }
table { width: 100%; border-collapse: collapse; font-size: 14px; margin: 18px 0; }
th { background: #eaf1ed; color: #194e3b; text-align: left; font-weight: bold; }
th, td { border: 1px solid var(--line); padding: 9px 11px; vertical-align: top; overflow-wrap: anywhere; }
tr:nth-child(even) td { background: #fafbf9; }
.table-scroll { max-width: 100%; overflow-x: auto; }
.diagram { margin: 20px 0; border-block: 1px solid var(--line); padding: 16px 4px; background: #fcfefd; text-align: center; }
.mermaid { margin: 0; white-space: normal; font: inherit; }
.mermaid:not([data-processed]) { visibility: hidden; min-height: 180px; }
.mermaid svg { max-width: 100%; height: auto; display: block; margin: auto; }
.diagram .label { font-family: "Trebuchet MS", sans-serif; }
code { font: 0.88em/1.4 Consolas, monospace; color: #763548; background: #f6f2f3; padding: 1px 4px; border-radius: 2px; overflow-wrap: anywhere; }
pre.code { overflow-x: auto; padding: 16px; margin: 18px 0; border: 1px solid var(--line); border-left: 4px solid var(--teal); background: #f4f7f7; border-radius: 4px; }
pre.code code { padding: 0; color: #213b43; background: none; white-space: pre-wrap; overflow-wrap: anywhere; }
.katex { font-size: 1.06em; }
.katex-display { overflow-x: auto; overflow-y: hidden; padding: 8px 0; margin: 14px 0; }
.katex-display > .katex { white-space: normal; }
.reference { border-top: 2px solid var(--teal); margin-top: 22px; }
summary { cursor: pointer; color: var(--teal); font-size: 19px; font-weight: bold; padding: 18px 4px; }
.reference-body { padding-bottom: 24px; }
.reference-body h2 { border-top: 1px solid var(--line); padding-top: 24px; }
.reference-body .diagram { max-width: 760px; }
.reference-label { border-top: 4px solid var(--red); padding-top: 24px; margin-top: 55px; }
.render-error { color: #9b1c31; background: #fff0f0; padding: 16px; border: 1px solid #9b1c31; }
footer { margin-top: 36px; border-top: 1px solid var(--line); padding-top: 16px; font-size: 13px; color: #59665e; }
@media (max-width: 900px) {
  .layout { grid-template-columns: minmax(0, 1fr); }
  .contents { position: static; height: auto; padding: 16px 22px; }
  .contents nav { display: flex; flex-wrap: wrap; gap: 6px 20px; }
  .contents a { border: 0; padding: 3px 0; }
  .contents .references-label { display: none; }
  main { padding: 26px 24px 40px; }
}
@media (max-width: 520px) {
  body { font-size: 15px; }
  main { padding: 22px 16px 36px; }
  h1 { font-size: 29px; }
  h2 { font-size: 23px; }
  h3 { font-size: 18px; }
  table { font-size: 13px; }
  th, td { padding: 7px; }
  blockquote { padding: 10px 12px; }
  .chapter { margin-top: 34px; }
}
@page { size: A4; margin: 13mm 14mm 16mm; }
@media print {
  html { scroll-behavior: auto; }
  body { background: white; font: 10pt/1.35 "Trebuchet MS", sans-serif; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  .layout { display: block; max-width: none; }
  .contents, .reference, .reference-label, .screen-only, footer { display: none !important; }
  main { padding: 0; }
  .document-header { padding-top: 10px; margin-bottom: 16px; }
  h1 { font-size: 25pt; }
  h2 { font-size: 19pt; margin: 15px 0 12px; }
  h3 { font-size: 13pt; margin: 16px 0 9px; }
  h2, h3, h4, summary { break-after: avoid; }
  p { margin: 7px 0; }
  blockquote { padding: 8px 12px; margin: 11px 0; break-inside: avoid; }
  table { font-size: 9pt; margin: 11px 0; }
  th, td { padding: 6px 8px; }
  tr, pre.code, .diagram { break-inside: avoid; }
  thead { display: table-header-group; }
  .chapter { break-before: page; margin-top: 0; padding-top: 0; }
  .chapter h2 { margin-top: 13px; }
  .new-page { break-before: page; }
  .diagram { padding: 8px 0; margin: 12px 0; }
  .mermaid svg { max-height: 55mm; width: auto; max-width: 100%; }
  .katex-display { overflow: visible; margin: 10px 0; padding: 4px 0; }
  .table-scroll { overflow: visible; }
  a { color: inherit; text-decoration: none; }
}
`;

const navigation = revisionSheets.map((sheet, index) => `<a href="#${sheet.anchor}">${index + 1}. ${[
    "Quality checks", "Profiling", "Blanks and outliers", "Matching records", "Encoding", "Scaling and logs", "New features", "Imbalance and SMOTE",
][index]}</a>`).join("\n");

const browserScript = `
mermaid.initialize({
    startOnLoad: false, securityLevel: "strict", theme: "base",
    fontFamily: "Trebuchet MS, sans-serif",
    flowchart: { htmlLabels: false, useMaxWidth: true, nodeSpacing: 24, rankSpacing: 30, curve: "linear", padding: 12 },
    themeVariables: { primaryColor: "#edf7f0", primaryTextColor: "#213f31", primaryBorderColor: "#6f9b80", lineColor: "#64796e", secondaryColor: "#eaf3f5", tertiaryColor: "#fff3d3", fontSize: "16px" }
});
document.querySelectorAll("table").forEach((table) => {
    const wrapper = document.createElement("div");
    wrapper.className = "table-scroll";
    table.before(wrapper);
    wrapper.append(table);
});
document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#']");
    if (!link) return;
    const target = document.getElementById(link.getAttribute("href").slice(1));
    if (!target) return;
    const parent = target.closest("details");
    if (parent) parent.open = true;
});
async function finishRendering() {
    try {
        await document.fonts.ready;
        await mermaid.run({ nodes: document.querySelectorAll(".mermaid") });
        document.querySelectorAll("details.reference").forEach((section) => { section.open = false; });
        const target = document.getElementById(location.hash.slice(1));
        if (target) {
            const reference = target.closest("details");
            if (reference) reference.open = true;
            target.scrollIntoView();
        }
        document.body.dataset.ready = "true";
    } catch (error) {
        document.body.dataset.ready = "error";
        const warning = document.createElement("p");
        warning.className = "render-error";
        warning.textContent = "A diagram could not be rendered: " + error.message;
        document.querySelector("main").prepend(warning);
        console.error(error);
    }
}
finishRendering();
`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Preprocessing for AI-Ready Data | One-Day Visual Revision</title>
<style>${mathCss}\n${styles}</style></head>
<body><div class="layout">
<aside class="contents"><h2>DSE ZG505</h2><nav aria-label="Study contents">
<a href="#start">One-day route</a>${navigation}
<a href="#revision-final-revision-methods-tokens-and-traps">Formulas and code</a>
<a href="#revision-last-20-minutes-closed-book-check">Final self-test</a>
<p class="references-label">Full reference</p>
<a href="#full-notes">All lecture notes</a><a href="#solved-papers">Solved papers</a><a href="#practice">Drills and assignment</a>
<a href="04_One_Day_Revision.pdf">Revision PDF</a></nav></aside>
<main id="start"><header class="document-header"><p class="eyebrow">One-day revision / Sessions 1-8</p>
<h1>Preprocessing for<br>AI-Ready Data</h1>
<p class="document-meta">DSE ZG505 &middot; 30-mark exam pattern &middot; Simple explanations and worked answers</p></header>
<section class="route">${quickParser.parse(introMarkdown)}</section>
${revisionSheets.map((sheet) => sheet.html).join("\n")}
<div class="final-recall">${finalHtml}</div>
<h2 class="reference-label">Full Notes and Practice</h2>${appendices}
<footer>Based on your supplied lectures, exam, worksheet, and assignment. Independent study guidance, not an official answer key or a prediction of the next paper.</footer>
</main></div>
<script>${mermaidScript}</script><script>${browserScript}</script></body></html>`;

assert.equal((html.match(/data-session="[1-8]"/g) ?? []).length, 8);
assert.equal((html.match(/class="mermaid"/g) ?? []).length, 19);
assert(!/<script[^>]+src=|<link[^>]+href=/.test(html), "Guide must not depend on external scripts or styles");
const destination = path.join(studyDirectory, "04_Visual_Study_Guide.html");
fs.writeFileSync(destination, html, "utf8");
console.log(`PASS: eight revision sheets, 19 diagrams including full notes, three combined references, and locally embedded math/fonts.`);
console.log(`Created ${destination} (${Math.round(Buffer.byteLength(html) / 1024)} KB).`);