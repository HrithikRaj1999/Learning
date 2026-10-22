const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const packageRoot = process.env.PATH.split(path.delimiter)
  .filter(entry => entry.includes('_npx'))
  .map(entry => path.resolve(entry, '..', 'playwright'))
  .find(entry => fs.existsSync(path.join(entry, 'package.json')));
const { chromium } = require(packageRoot || 'playwright');
const sheetUrl = pathToFileURL(path.resolve(__dirname, '../Maths_Lectures_1_to_5_Revision_Sheet.html')).href;

async function verify() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const report = { layout: [], interactions: [], runtimeErrors: [] };
  try {
    const page = await browser.newPage();
    page.on('pageerror', error => report.runtimeErrors.push(error.message));
    await page.goto(`${sheetUrl}#l1-1`);
    await page.waitForFunction(() => document.body.classList.contains('study-ready') && typeof renderMathInElement === 'function');
    await page.evaluate(() => document.fonts.ready);

    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      report.layout.push(await page.evaluate(() => {
        const failures = [];
        for (const topic of topics) {
          renderLesson(topic);
          for (const formula of document.querySelectorAll('.worked-math .katex-display')) {
            if (formula.scrollWidth > formula.clientWidth + 2) {
              failures.push({ topic: topic.id, kind: 'wide-formula', formula: formula.querySelector('annotation').textContent, width: formula.scrollWidth, available: formula.clientWidth });
            }
          }
          if (document.querySelector('#lesson-content .katex-error')) failures.push({ topic: topic.id, kind: 'math-error' });
          document.querySelector('#exam-notes').open = true;
          if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) failures.push({ topic: topic.id, kind: 'page-overflow' });
          for (const svg of document.querySelectorAll('#lesson-content .fig svg')) {
            const view = svg.viewBox.baseVal;
            for (const text of svg.querySelectorAll('text')) {
              const bounds = text.getBBox();
              if (bounds.x < view.x || bounds.x + bounds.width > view.x + view.width || bounds.y < view.y || bounds.y + bounds.height > view.y + view.height) {
                failures.push({ topic: topic.id, kind: 'clipped-label', label: text.textContent });
              }
            }
          }
        }
        return { width: innerWidth, topics: topics.length, failures };
      }));
    }
    const layoutFailures = report.layout.flatMap(result => result.failures);
    if (layoutFailures.length || process.argv.includes('--layout')) {
      console.log(JSON.stringify(report.layout, null, 2));
      assert.equal(layoutFailures.length, 0, 'All guided formulas and diagrams should fit.');
      console.log('Focused layout checks passed.');
      return;
    }

    report.content = await page.evaluate(() => {
      const failures = [];
      for (const topic of topics) {
        renderLesson(topic);
        const lesson = beginnerLessons[topic.id];
        if (!lesson || lesson.steps.length < 2 || !lesson.quiz) failures.push(topic.id);
        const form = document.querySelector('.quiz-form');
        form.requestSubmit();
        if (document.querySelector('#quiz-feedback').textContent !== 'Choose an answer first.') failures.push(`${topic.id}:empty`);
        const options = form.querySelectorAll('input');
        options[(lesson.quiz.answer + 1) % options.length].checked = true;
        form.requestSubmit();
        if (document.querySelector('#quiz-feedback').dataset.correct !== 'false') failures.push(`${topic.id}:incorrect`);
        options[lesson.quiz.answer].checked = true;
        form.requestSubmit();
        if (document.querySelector('#quiz-feedback').dataset.correct !== 'true') failures.push(`${topic.id}:correct`);
      }
      return {
        topics: topics.length,
        quizzes: Object.keys(beginnerLessons).length,
        originalTopics: document.querySelectorAll('#reference-sheet .card').length,
        originalFormulas: document.querySelectorAll('#reference-sheet annotation').length,
        failures
      };
    });
    assert.equal(report.content.topics, 35);
    assert.equal(report.content.originalTopics, 35);
    assert.equal(report.content.originalFormulas, 243);
    assert.deepEqual(report.content.failures, []);

    await page.reload();
    await page.waitForFunction(() => document.querySelector('#lesson-title').textContent === 'What is a vector?');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('button', { name: 'Topics', exact: true }).click();
    const search = page.getByRole('searchbox', { name: 'Find a topic' });
    await search.fill('nothing-matches-this');
    assert.equal(await page.locator('#search-empty').isVisible(), true);
    await search.fill('eigen');
    assert.ok(await page.locator('#search-results a').count() > 0);
    await page.locator('#search-results a[data-topic="l4-4"]').click();
    await page.waitForFunction(() => document.querySelector('#lesson-title').textContent === 'Find directions a matrix does not turn');
    assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'), 'false');
    await page.locator('#next-top').click();
    await page.waitForFunction(() => location.hash === '#l4-5');
    await page.goBack();
    await page.waitForFunction(() => location.hash === '#l4-4');
    await page.locator('#exam-notes > summary').click();
    assert.equal(await page.locator('#exam-notes').getAttribute('open'), '');
    const duplicateIds = await page.evaluate(() => {
      const ids = Array.from(document.querySelectorAll('[id]'), element => element.id);
      return ids.filter((id, index) => ids.indexOf(id) !== index);
    });
    assert.deepEqual(duplicateIds, []);
    report.interactions.push('mobile navigation', 'search and empty state', 'next and browser back', 'expandable notes', 'unique diagram IDs');

    await page.getByRole('button', { name: 'Topics', exact: true }).click();
    await search.fill('');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'), 'false');
    await page.getByRole('button', { name: 'Topics', exact: true }).click();
    await page.locator('.sidebar-footer a').click();
    await page.waitForFunction(() => location.hash === '#exam-checks');
    assert.equal(await page.locator('#lesson-content .key').count(), 6);
    assert.equal(await page.locator('#lesson-content .t tr').count(), 14);
    report.interactions.push('keyboard escape', 'exam checks and calculator');

    await page.emulateMedia({ media: 'print' });
    assert.equal(await page.locator('#study-app').isVisible(), false);
    assert.equal(await page.locator('#reference-sheet').isVisible(), true);
    await page.emulateMedia({ media: 'screen' });
    report.interactions.push('print uses complete original notes');

    for (const [name, width, height, hash] of [
      ['desktop-edge', 1440, 1000, '#l1-1'],
      ['mobile-edge', 390, 844, '#l1-1'],
      ['qr-mobile', 320, 844, '#l5-1']
    ]) {
      await page.setViewportSize({ width, height });
      await page.goto(`${sheetUrl}${hash}`);
      await page.waitForSelector('#lesson-content .katex');
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(__dirname, `${name}.png`), fullPage: true });
    }
    assert.deepEqual(report.runtimeErrors, []);
    console.log(JSON.stringify(report, null, 2));
    console.log('All revision-guide checks passed.');
  } finally {
    fs.writeFileSync(path.join(__dirname, 'validation.json'), JSON.stringify(report, null, 2));
    await browser.close();
  }
}

verify().catch(error => {
  console.error(error);
  process.exitCode = 1;
});