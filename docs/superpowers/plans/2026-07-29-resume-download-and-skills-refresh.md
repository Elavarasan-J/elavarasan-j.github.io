# Résumé Download and Skills Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a résumé PDF download link to the hero and Contact, and rebuild the Skills section into six curated groups drawn from the résumé's skill list.

**Architecture:** This is a static, three-file, zero-dependency page. All three tasks edit `index.html` markup only — no CSS, no JS. Task 1 ships the résumé download plus the two documentation rules that currently forbid it. Task 2 replaces the four skill groups with six. Task 3 is the cross-cutting responsive/accessibility/visual sweep that neither feature task can do alone.

**Tech Stack:** Plain HTML5. Verification is browser assertions via the Playwright MCP tools against a local `python3 -m http.server`. There is no test framework and you must not add one.

**Design spec:** `docs/superpowers/specs/2026-07-29-resume-download-and-skills-refresh-design.md`

## Global Constraints

Every task's requirements implicitly include all of these. They come from `CLAUDE.md`; violating one fails review even if the task's own assertions pass.

- **Three files only:** `index.html`, `styles.css`, `main.js`. Do **not** add `package.json`, a bundler, a framework, a CSS library, or a test framework.
- **This plan adds zero CSS and zero JS.** If you find yourself wanting a new rule in `styles.css`, stop and report it — the design says none is needed and a surprise is a finding, not a fix.
- `index.html` must stay complete and readable with CSS and JS disabled. All content lives in the markup.
- **No invented facts.** Every chip, label, and number in this plan came from the owner or the résumé. Do not add a skill, tool, or figure that is not written in this plan.
- **Palette — introduce no new hue.** `--void #000000`, `--signal #00E24A`, `--glow #7CFFA8` (pulses and `:focus-visible` only), `--paper #EAF3EC` (body prose, never green), `--muted #8FA396`, `--brass #C79A3C` (inside `.award` only), `--line` = signal at 24%.
- **Display type is never uppercase.** Space Grotesk in mixed case. Uppercase is correct only for IBM Plex Mono utility text.
- **`.section` is the sole owner of section vertical padding.** Never add `padding-block`/`padding-top`/`padding-bottom` to a section, `.award`, or `.contact`.
- **At ≥64rem the section head sits in a sticky 14rem left rail** and every other direct child of `.shell` moves to column 2. Any new top-level block must be a direct child of `.shell`.
- **External links** get `target="_blank" rel="noopener"`. `mailto:`, `tel:`, the skip link, and **the same-origin résumé PDF** deliberately do not.
- **Copy:** active voice, sentence case, plain verbs. A control names what happens — the label matches the result. Avoid third-person pronouns for the owner.
- **Accessibility floor:** responsive to 360px with no horizontal scroll at any width; visible `--glow` focus ring on every interactive element; one `h1`; headings in order; body contrast ≥ 7:1.
- **Out of scope, do not touch:** the hero meta line, the tenure figure, Experience role titles, the `.skills__top` featured badges, the circuit canvas, and the signature strip. The résumé's "Associate Staff Engineer / 10+ years" disagrees with the site's "Staff Engineer / 12 Years 2 Months"; the owner will fix the résumé later. **Leave the site alone.**

---

## File Structure

| File | Change | Responsibility |
|---|---|---|
| `Elavarasan_Resume_2026.pdf` | Commit as-is (2 MB, already on disk at repo root) | The downloadable artifact. Must be tracked or the link 404s on GitHub Pages. |
| `index.html` | Modify `.hero__actions` (L54–58), `.contact__list` (L275–280), `.skills__groups` (L96–133), JSON-LD `knowsAbout` (L310–324) | All page content. |
| `CLAUDE.md` | Modify L123–124 | The rule that currently forbids a résumé link. |
| `docs/design-spec.md` | Modify L96, L168–169, L194–197 | The design record: hero actions, top skills, and the Contact résumé row. |
| `styles.css` | **No change** | — |
| `main.js` | **No change** | — |

---

## Task 0: Start the verification harness

Do this once, before Task 1. Every later task assumes the server is running.

**Files:** none — this task writes nothing.

**Interfaces:**
- Consumes: nothing.
- Produces: a served copy of the working tree at `http://127.0.0.1:8765/index.html`, driven by the Playwright MCP tools. Tasks 1–3 all navigate to that URL.

- [ ] **Step 1: Start the static server in the background**

The MCP config blocks the `file:` protocol, so the page must be served over HTTP.

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Run it in the background. Leave it running until Task 3 tears it down.

- [ ] **Step 2: Confirm the page and the PDF are both reachable**

```bash
curl -s -o /dev/null -w '%{http_code} %{content_type}\n' http://127.0.0.1:8765/index.html
curl -s -o /dev/null -w '%{http_code} %{content_type}\n' http://127.0.0.1:8765/Elavarasan_Resume_2026.pdf
```

Expected: `200 text/html` and `200 application/pdf`.

If the PDF is not 200, the file is missing from the working tree — stop and report. Everything in Task 1 depends on it existing.

- [ ] **Step 3: Open the page in the browser**

Navigate to `http://127.0.0.1:8765/index.html` with `browser_navigate`, then resize to 1440×900 with `browser_resize`.

- [ ] **Step 4: Confirm the console is clean before you change anything**

Read `browser_console_messages`. Expected: no errors. This is your baseline — if something is already broken, you need to know now so you do not get blamed for it in Task 3.

---

## Task 1: Résumé PDF download

Adds the download link in two places and rewrites the two documentation rules that currently forbid it. These ship together because `CLAUDE.md` L123 directly contradicts this task's deliverable — splitting them would leave the repo self-inconsistent at a commit boundary.

**Files:**
- Commit: `Elavarasan_Resume_2026.pdf`
- Modify: `index.html:54-58` (`.hero__actions`), `index.html:275-280` (`.contact__list`)
- Modify: `CLAUDE.md:123-124`
- Modify: `docs/design-spec.md:96`, `docs/design-spec.md:194-197`
- Test: browser assertions against `http://127.0.0.1:8765/index.html` (no test file — there is no test framework)

**Interfaces:**
- Consumes: the running server from Task 0.
- Produces: two `a[download][href="Elavarasan_Resume_2026.pdf"]` elements — one inside `.hero__actions`, one inside `.contact__list`. Task 3 asserts on both.

- [ ] **Step 1: Write the failing assertion**

Run this with `browser_evaluate`. It is the whole contract for this task in one object.

```js
() => {
  const links = [...document.querySelectorAll('a[href="Elavarasan_Resume_2026.pdf"]')];
  const nav = document.querySelector('.hero__actions');
  return {
    linkCount: links.length,
    allHaveDownload: links.length > 0 && links.every(a => a.hasAttribute('download')),
    noneHaveTarget: links.every(a => !a.hasAttribute('target')),
    heroLabel: nav.querySelector('a[download]')?.textContent.trim() ?? null,
    contactLabel: document.querySelector('.contact__list a[download]')?.textContent.trim() ?? null,
    contactKey: document.querySelector('.contact__list li:last-child .contact__key')?.textContent.trim() ?? null,
    navAriaLabel: nav.getAttribute('aria-label'),
    heroActionCount: nav.querySelectorAll('a').length,
    contactRowCount: document.querySelectorAll('.contact__list li').length,
  };
}
```

- [ ] **Step 2: Run it to make sure it fails**

Expected **now** (this is the failure you want to see):

```js
{ linkCount: 0, allHaveDownload: false, noneHaveTarget: true,
  heroLabel: null, contactLabel: null, contactKey: 'GitHub',
  navAriaLabel: 'Contact', heroActionCount: 3, contactRowCount: 4 }
```

If `linkCount` is already 2, the change is somehow present — stop and check `git status` before editing.

- [ ] **Step 3: Add the hero link and fix the nav label**

In `index.html`, replace the `.hero__actions` block:

```html
    <nav class="hero__actions" aria-label="Contact">
      <a href="mailto:elavarasan.infotech10@gmail.com">Email</a>
      <a href="https://www.linkedin.com/in/elavarasanj/" target="_blank" rel="noopener">LinkedIn</a>
      <a href="https://github.com/Elavarasan-J" target="_blank" rel="noopener">GitHub</a>
    </nav>
```

with:

```html
    <nav class="hero__actions" aria-label="Contact and résumé">
      <a href="mailto:elavarasan.infotech10@gmail.com">Email</a>
      <a href="https://www.linkedin.com/in/elavarasanj/" target="_blank" rel="noopener">LinkedIn</a>
      <a href="https://github.com/Elavarasan-J" target="_blank" rel="noopener">GitHub</a>
      <a href="Elavarasan_Resume_2026.pdf" download>Download résumé</a>
    </nav>
```

Two things that look like mistakes and are not: the PDF link has **no** `target="_blank"` and **no** `rel="noopener"` (it is same-origin, and `download` makes a new tab pointless), and the `aria-label` gains "and résumé" because a download is not a contact channel.

- [ ] **Step 4: Add the Contact row**

In `index.html`, in `.contact__list`, append one `li` after the GitHub row so the list reads:

```html
    <ul class="contact__list">
      <li><span class="contact__key">Email</span> <a href="mailto:elavarasan.infotech10@gmail.com">elavarasan.infotech10@gmail.com</a></li>
      <li><span class="contact__key">Phone</span> <a href="tel:+918015515823">+91 8015515823</a></li>
      <li><span class="contact__key">LinkedIn</span> <a href="https://www.linkedin.com/in/elavarasanj/" target="_blank" rel="noopener">linkedin.com/in/elavarasanj</a></li>
      <li><span class="contact__key">GitHub</span> <a href="https://github.com/Elavarasan-J" target="_blank" rel="noopener">github.com/Elavarasan-J</a></li>
      <li><span class="contact__key">Résumé</span> <a href="Elavarasan_Resume_2026.pdf" download>Download PDF · 2 MB</a></li>
    </ul>
```

The separator is `·` (U+00B7 middle dot), matching the `employer__meta` lines. Not a hyphen.

- [ ] **Step 5: Re-run the assertion and confirm it passes**

Reload the page with `browser_navigate`, then re-run the Step 1 snippet. Expected:

```js
{ linkCount: 2, allHaveDownload: true, noneHaveTarget: true,
  heroLabel: 'Download résumé', contactLabel: 'Download PDF · 2 MB',
  contactKey: 'Résumé', navAriaLabel: 'Contact and résumé',
  heroActionCount: 4, contactRowCount: 5 }
```

Every field must match. `noneHaveTarget: true` and `contactLabel` containing `·` are the two most likely to be wrong.

- [ ] **Step 6: Confirm the link actually downloads and resolves**

Run with `browser_evaluate`:

```js
async () => {
  const a = document.querySelector('.hero__actions a[download]');
  const res = await fetch(a.href, { method: 'HEAD' });
  return { resolvedHref: a.href, status: res.status, type: res.headers.get('content-type') };
}
```

Expected: `resolvedHref` ends `/Elavarasan_Resume_2026.pdf`, `status: 200`, `type: 'application/pdf'`.

- [ ] **Step 7: Check 360px now, not in Task 3**

"Download résumé" is the longest hero action by a wide margin, and the hero has `overflow: clip` — which has hidden a clipped element on this page before. Resize to 360×800 with `browser_resize`, then:

```js
() => {
  const de = document.documentElement;
  const overflowing = [...document.querySelectorAll('.hero__actions a, .contact__list li, .contact__list a')]
    .filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && (r.right > de.clientWidth + 1 || r.left < -1);
    })
    .map(el => `${el.tagName}.${el.className}: ${el.textContent.trim()}`);
  return { clientWidth: de.clientWidth, scrollWidth: de.scrollWidth, overflowing };
}
```

Expected: `overflowing: []` and `scrollWidth <= clientWidth`. The elements' own client rects are what matter — `scrollWidth` alone is not sufficient here, because `overflow: clip` on the hero suppresses it.

Resize back to 1440×900 when done.

- [ ] **Step 8: Update the CLAUDE.md rule**

In `CLAUDE.md`, under Content rules, replace these two lines:

```markdown
- **No résumé link anywhere.** A Figma résumé link was removed on request — do not
  add it back. Contact is email, phone, LinkedIn, GitHub.
```

with:

```markdown
- **The résumé is a committed, same-origin PDF:** `Elavarasan_Resume_2026.pdf`,
  linked from the hero actions and Contact. Both links carry `download` and no
  `target` — it is same-origin, so the external-link rule does not apply. The file
  must stay tracked in git or the link 404s on Pages. The label promises a download
  because it performs one: "Download résumé" in the hero, "Download PDF · 2 MB" in
  Contact. A **Figma** résumé link was removed on request — do not add that back.
- Contact channels are email, phone, LinkedIn, GitHub, plus the résumé download.
```

- [ ] **Step 9: Update the design-spec record**

Two edits in `docs/design-spec.md`.

First, L96 — replace:

```markdown
Inline contact actions: email, LinkedIn, GitHub, resume.
```

with:

```markdown
Inline contact actions: email, LinkedIn, GitHub, résumé download.
```

Second, L194–197 — replace the Contact table's résumé row and the two lines below it:

```markdown
| Résumé | https://www.figma.com/design/ohYIUOGxrrnRZlZihTa7IW/Ela-Resume-v1?t=hBJfygOzq2f4hoAe-0 |

The résumé is a Figma link, not a PDF download, at the subject's request. The action
is labelled **"View résumé"** — it opens Figma, so it must not promise a download.
```

with:

```markdown
| Résumé | `Elavarasan_Resume_2026.pdf` (same-origin, `download`) |

The résumé is a committed PDF download, at the subject's request — superseding an
earlier Figma link, which must not come back. Because the action *does* download,
it must say so: **"Download résumé"** in the hero, **"Download PDF · 2 MB"** in
Contact. The file size belongs in Contact, where every other row shows its real
destination; the hero stays terse.
```

Leave the rest of `docs/design-spec.md` alone. It records an earlier iteration in places (it still names Archivo Expanded and a specks field) and reconciling that is not this task's job.

- [ ] **Step 10: Commit**

Note `git add -f` is not needed — `.gitignore` only excludes `.playwright-mcp/`, `.DS_Store`, and `Thumbs.db`.

```bash
git add Elavarasan_Resume_2026.pdf index.html CLAUDE.md docs/design-spec.md
git commit -m "feat: add résumé PDF download to hero and contact

Same-origin download, so no target and no rel=noopener. Labels promise a
download because they perform one. Updates the CLAUDE.md rule and the
design-spec record, which both still forbade any résumé link after the
earlier Figma link was removed."
```

- [ ] **Step 11: Confirm the PDF is actually tracked**

```bash
git ls-files --error-unmatch Elavarasan_Resume_2026.pdf && echo TRACKED
```

Expected: the path, then `TRACKED`. If this fails the deployed link will 404 — the single most likely way this task ships broken.

---

## Task 2: Skills groups

Replaces the four existing groups with six. The featured badges above them do not change.

**Files:**
- Modify: `index.html:96-133` (the `dl.skills__groups` block)
- Modify: `index.html:310-324` (JSON-LD `knowsAbout`)
- Modify: `docs/design-spec.md:168-169`
- Test: browser assertions against `http://127.0.0.1:8765/index.html`

**Interfaces:**
- Consumes: the running server from Task 0. Independent of Task 1 — touches disjoint regions of `index.html`.
- Produces: six `.skills__group` elements. Task 3 asserts on their layout and chip overflow.

- [ ] **Step 1: Write the failing assertion**

Run with `browser_evaluate`:

```js
() => {
  const groups = [...document.querySelectorAll('.skills__group')];
  return {
    groupCount: groups.length,
    shape: groups.map(g => [
      g.querySelector('dt').textContent.trim(),
      g.querySelectorAll('.chips li').length,
    ]),
    featured: [...document.querySelectorAll('.skills__top li')].map(li => li.textContent.trim()),
    droppedStillPresent: (document.querySelector('.skills').textContent
      .match(/WordPress|Bootstrap|Cross-browser|Photoshop|FileZilla|VS Code|JIRA|Yarn/g) || []),
    totalChips: document.querySelectorAll('.skills__groups .chips li').length,
  };
}
```

- [ ] **Step 2: Run it to make sure it fails**

Expected **now**:

```js
{ groupCount: 4,
  shape: [['Frameworks & UI', 10], ['Data visualisation', 2],
          ['AI engineering', 3], ['Testing & practice', 6]],
  featured: ['Agentic AI', 'React.js', 'TypeScript', 'Test-driven development', 'Mentoring'],
  droppedStillPresent: ['Cross-browser'],
  totalChips: 21 }
```

Note `featured` — record it. It must be **byte-identical** after your change; those five badges are out of scope.

- [ ] **Step 3: Replace the six groups**

In `index.html`, replace the entire `<dl class="skills__groups">…</dl>` block with this. Chip order within each group is deliberate, not alphabetical — do not sort it.

```html
        <dl class="skills__groups">
          <div class="skills__group">
            <dt>Core</dt>
            <dd>
              <ul class="chips">
                <li>JavaScript (ES6+)</li><li>TypeScript</li><li>HTML</li>
                <li>CSS</li><li>Python</li>
              </ul>
            </dd>
          </div>
          <div class="skills__group">
            <dt>Frameworks &amp; UI</dt>
            <dd>
              <ul class="chips">
                <li>React</li><li>Angular</li><li>StencilJS</li><li>Redux</li>
                <li>Zustand</li><li>Material UI</li><li>shadcn/ui</li>
                <li>Tailwind CSS</li><li>Micro-frontends</li><li>WebSocket</li>
              </ul>
            </dd>
          </div>
          <div class="skills__group">
            <dt>Data visualisation</dt>
            <dd>
              <ul class="chips">
                <li>D3.js</li><li>Highcharts</li>
              </ul>
            </dd>
          </div>
          <div class="skills__group">
            <dt>AI &amp; agentic</dt>
            <dd>
              <ul class="chips">
                <li>Agentic UI generation</li><li>AI copilots &amp; chatbots</li>
                <li>Claude Code</li><li>GitHub Copilot</li><li>AWS Bedrock</li>
              </ul>
            </dd>
          </div>
          <div class="skills__group">
            <dt>Tooling &amp; delivery</dt>
            <dd>
              <ul class="chips">
                <li>Jest</li><li>Git</li><li>Docker</li><li>Vite</li>
                <li>CI/CD</li><li>Nginx</li><li>Postman</li><li>Figma</li>
              </ul>
            </dd>
          </div>
          <div class="skills__group">
            <dt>Practice</dt>
            <dd>
              <ul class="chips">
                <li>Agentic development</li><li>System architecture</li>
                <li>Mentoring</li><li>Code review</li><li>Agile</li>
                <li>Cross-functional collaboration</li>
              </ul>
            </dd>
          </div>
        </dl>
```

Four details worth not getting wrong:

- `&amp;` in the three `dt` labels that contain an ampersand, and in `AI copilots &amp; chatbots`.
- `div.skills__group` wrapping each `dt`/`dd` pair inside the `dl` — this is the existing pattern and it is valid HTML. Keep it.
- `shadcn/ui`, `StencilJS`, `WebSocket`, `D3.js`, `CI/CD` — exact casing. The résumé spells three of these differently and the résumé is wrong.
- `Jest` lives under Tooling & delivery on purpose. Testing as a *practice* is already the `Test-driven development` featured badge, which outranks any group; a separate testing group would say it twice, more weakly.

- [ ] **Step 4: Re-run the assertion and confirm it passes**

Reload, re-run the Step 1 snippet. Expected:

```js
{ groupCount: 6,
  shape: [['Core', 5], ['Frameworks & UI', 10], ['Data visualisation', 2],
          ['AI & agentic', 5], ['Tooling & delivery', 8], ['Practice', 6]],
  featured: ['Agentic AI', 'React.js', 'TypeScript', 'Test-driven development', 'Mentoring'],
  droppedStillPresent: [],
  totalChips: 36 }
```

`featured` unchanged and `droppedStillPresent: []` are the two that catch real mistakes.

- [ ] **Step 5: Confirm no CSS was needed**

The design says six groups flow as an even 2×3 in the existing grid with no new rules. Verify rather than assume:

```bash
git diff --stat styles.css
```

Expected: **empty output.** If you changed `styles.css`, revert it and report why you thought you needed to — that is a finding about the design, not a fix.

Then confirm the grid really is two columns at desktop width and the chips wrap:

```js
() => {
  const dl = document.querySelector('.skills__groups');
  const tops = [...document.querySelectorAll('.skills__group')].map(g => Math.round(g.getBoundingClientRect().top));
  return {
    columns: getComputedStyle(dl).gridTemplateColumns.split(' ').length,
    distinctRows: new Set(tops).size,
    chipsWrap: getComputedStyle(document.querySelector('.chips')).flexWrap,
  };
}
```

Expected at 1440px: `columns: 2`, `distinctRows: 3`, `chipsWrap: 'wrap'`.

- [ ] **Step 6: Add the three new skills to JSON-LD**

In the `application/ld+json` block, `knowsAbout` currently ends:

```json
    "Data visualisation",
    "Micro-frontends",
    "AWS Bedrock"
  ],
```

Change it to:

```json
    "Data visualisation",
    "Micro-frontends",
    "AWS Bedrock",
    "Angular",
    "Python",
    "Docker"
  ],
```

Only these three. Everything else in `knowsAbout` is already there, and no other JSON-LD field changes.

- [ ] **Step 7: Confirm the JSON-LD still parses**

A trailing-comma or missing-comma error here is silent in the browser and invisible on the page.

```js
() => {
  const parsed = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
  return { type: parsed['@type'], knowsAbout: parsed.knowsAbout.slice(-3), count: parsed.knowsAbout.length };
}
```

Expected: `{ type: 'Person', knowsAbout: ['Angular', 'Python', 'Docker'], count: 16 }`.

- [ ] **Step 8: Update the design-spec record**

In `docs/design-spec.md`, replace L168–169:

```markdown
Top skills, surfaced as a compact stack list: Agentic AI, Mentoring, React.js,
TypeScript, Zustand, Test-Driven Development.
```

with:

```markdown
Top skills, surfaced as a compact stack list of five: Agentic AI, React.js,
TypeScript, Test-driven development, Mentoring.

Below them, six groups. A chip earns its place only if a recruiter learns something
from it that the other chips do not already imply — which excludes table stakes
(an editor, a package manager) and anything that pulls against the current
positioning. Dropped on that rule: VS Code, FileZilla, npm/Yarn, JIRA, Photoshop,
WordPress, Bootstrap, Cross-browser.

| Group | Chips |
|---|---|
| Core | JavaScript (ES6+) · TypeScript · HTML · CSS · Python |
| Frameworks & UI | React · Angular · StencilJS · Redux · Zustand · Material UI · shadcn/ui · Tailwind CSS · Micro-frontends · WebSocket |
| Data visualisation | D3.js · Highcharts — kept as its own group despite holding two chips, because it is the 3M signal |
| AI & agentic | Agentic UI generation · AI copilots & chatbots · Claude Code · GitHub Copilot · AWS Bedrock |
| Tooling & delivery | Jest · Git · Docker · Vite · CI/CD · Nginx · Postman · Figma |
| Practice | Agentic development · System architecture · Mentoring · Code review · Agile · Cross-functional collaboration |
```

- [ ] **Step 9: Commit**

```bash
git add index.html docs/design-spec.md
git commit -m "feat: rebuild skills into six curated groups

Draws the technical list from the résumé, dropping table stakes (VS Code,
FileZilla, npm/Yarn, JIRA) and items that pull against the current
positioning (WordPress, Bootstrap, Photoshop, Cross-browser). Keeps Data
visualisation as its own group and the five featured badges unchanged.
Adds Angular, Python, and Docker to JSON-LD knowsAbout to match."
```

---

## Task 3: Full-page verification sweep

Neither feature task can prove the page as a whole still holds. This task is the gate: responsive behaviour at three widths, the sticky rail, colour regressions, reduced motion, keyboard focus, and — the step that has caught every real defect in this page — actually looking at screenshots.

**Files:** none — this task changes nothing. If it finds a defect, report it; do not silently fix it in this task's commit.

**Interfaces:**
- Consumes: the completed markup from Tasks 1 and 2, and the server from Task 0.
- Produces: a pass/fail verdict plus screenshots. Nothing downstream depends on it.

- [ ] **Step 1: No horizontal overflow at 360, 768, and 1440**

For each width, `browser_resize` then run:

```js
() => {
  const de = document.documentElement;
  const overflowing = [...document.querySelectorAll('body *')]
    .filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && (r.right > de.clientWidth + 1 || r.left < -1);
    })
    .map(el => `${el.tagName}.${typeof el.className === 'string' ? el.className : ''}`.trim());
  return {
    width: de.clientWidth,
    scrollWidth: de.scrollWidth,
    bodyScroll: document.body.scrollWidth,
    overflowing: [...new Set(overflowing)].slice(0, 12),
  };
}
```

Expected at every width: `overflowing: []`, and `scrollWidth <= width`. Per `CLAUDE.md`, the per-element rects are the real check — `scrollWidth` alone once passed while the hero's `overflow: clip` was hiding a clipped name.

- [ ] **Step 2: Section heads still fit the 14rem rail**

At 1440×900:

```js
() => [...document.querySelectorAll('.section__head')].map(h => {
  const r = h.getBoundingClientRect();
  return { text: h.textContent.trim(), width: Math.round(r.width), height: Math.round(r.height) };
})
```

Expected: six heads — Skills, About, Experience, Selected work, Recognition, Contact — each `width <= 224` (14rem) and each a single line (`height` under ~40px, and equal across all six). A head that wrapped to two lines will show a visibly larger `height` than its siblings.

Neither task renamed a section, so this is a regression check. If it fails, something unrelated to this plan is wrong.

- [ ] **Step 3: No colour regressions**

```js
() => {
  const brassOutsideAward = [...document.querySelectorAll('body *')]
    .filter(el => !el.closest('.award') && getComputedStyle(el).color === 'rgb(199, 154, 60)')
    .map(el => el.tagName);
  return {
    proseColor: getComputedStyle(document.querySelector('.prose p')).color,
    roleNoteColor: getComputedStyle(document.querySelector('.role__note')).color,
    chipColor: getComputedStyle(document.querySelector('.chips li')).color,
    groupLabelColor: getComputedStyle(document.querySelector('.skills__groups dt')).color,
    brassOutsideAward,
  };
}
```

Expected: `proseColor`, `roleNoteColor`, and `chipColor` all `rgb(234, 243, 236)` (`--paper` — body text is never green); `groupLabelColor` `rgb(0, 226, 74)` (`--signal` — labels are structure); `brassOutsideAward: []`.

- [ ] **Step 4: Reduced motion still renders the finished state**

Use `browser_run_code_unsafe` to emulate the preference, since `browser_evaluate` cannot set it:

```js
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.goto('http://127.0.0.1:8765/index.html');
return await page.evaluate(() => ({
  state: document.querySelector('.signature').dataset.state,
  passOpacity: getComputedStyle(document.querySelector('.state__pass')).opacity,
  transition: getComputedStyle(document.querySelector('.state__pass')).transitionDuration,
}));
```

Expected: `state: 'pass'` **immediately** with no delay, `passOpacity: '1'`, `transition: '0s'`.

Then reset: `await page.emulateMedia({ reducedMotion: null })`.

This plan touched no JS, so this is purely a regression check — but it is the behaviour most easily broken by an unrelated edit, and `CLAUDE.md` calls it non-negotiable.

- [ ] **Step 5: Every link is keyboard reachable with a visible ring**

At 1440×900, reload, then Tab through the page with `browser_press_key`. The order should be: skip link → Email → LinkedIn → GitHub → **Download résumé** → … → the four Contact links → **Download PDF · 2 MB**.

After each Tab, confirm the focused element and that it has a ring:

```js
() => {
  const el = document.activeElement;
  const s = getComputedStyle(el);
  return {
    tag: el.tagName,
    text: el.textContent.trim().slice(0, 40),
    outlineColor: s.outlineColor,
    outlineWidth: s.outlineWidth,
  };
}
```

Expected for each: `outlineWidth` non-zero and `outlineColor` `rgb(124, 255, 168)` (`--glow`). Both résumé links must appear in the sequence.

- [ ] **Step 6: Console clean**

Read `browser_console_messages`. Expected: no errors and no warnings beyond whatever the Task 0 baseline already showed.

- [ ] **Step 7: Take screenshots and actually look at them**

Every real defect in this page was found by looking, not by asserting. Capture with `browser_take_screenshot` and then **view each image**:

1. Hero at 360×800 — do four actions wrap cleanly, or does "Download résumé" crowd the row?
2. Hero at 1440×900 — does the fourth action still read as a peer of the other three?
3. Skills section, full-height, at 1440×900 — chip count went 21 → 36. Does it read as six scannable groups or as a wall?
4. Skills section at 360×800 — the single-column case, where 36 chips is longest.
5. Contact at 1440×900 — does the résumé row sit level with the other four, and does `Download PDF · 2 MB` align like a destination rather than a sentence?

Judgement calls to report rather than fix: Skills reading too dense, `Data visualisation` looking stranded at two chips beside a ten-chip neighbour, or the hero row feeling unbalanced at four items. These are design decisions the owner already made deliberately — flag them, do not act.

- [ ] **Step 8: Confirm no-JS and no-CSS still work**

`index.html` must be complete without either.

```bash
curl -s http://127.0.0.1:8765/index.html | grep -c 'Download résumé\|Download PDF'
curl -s http://127.0.0.1:8765/index.html | grep -c '<dt>'
```

Expected: `2` and `6`. All content is in the markup — no group label or résumé label is injected by `main.js`.

- [ ] **Step 9: Confirm the diff is only what this plan authorised**

```bash
git diff --stat HEAD~2
git status --porcelain
```

Expected: changes to `index.html`, `CLAUDE.md`, `docs/design-spec.md`, and the added `Elavarasan_Resume_2026.pdf` only. **`styles.css` and `main.js` must not appear.** `git status` must not list `.playwright-mcp/`.

- [ ] **Step 10: Tear down the harness**

```bash
rm -rf .playwright-mcp/
```

Then stop the background `python3 -m http.server` process. Per `CLAUDE.md`, `.playwright-mcp/` must never be committed — `.gitignore` covers it, but delete it anyway.

- [ ] **Step 11: Report**

State plainly: which assertions passed, which failed with the actual output, and what the screenshots showed. If anything failed, say so with the output rather than describing it as a minor issue. There is no commit in this task — it verifies, it does not change.

---

## Notes for the reviewer

- **Tasks 1 and 2 are independent** and touch disjoint regions of `index.html`. Either can be rejected without blocking the other. Task 3 requires both.
- **Zero CSS and zero JS is a load-bearing claim,** not an oversight. `git diff --stat styles.css main.js` must be empty at the end. If the implementer changed either, that is a finding about the design being wrong, and it needs the owner's call — not a silent patch.
- **The largest deployment risk is Task 1 Step 11.** If the PDF is not tracked in git, every assertion in this plan still passes locally and the live link 404s.
- **One addition beyond the approved spec:** the spec named only §7 of `docs/design-spec.md`, but Task 2 Step 8 also rewrites its top-skills paragraph (L168–169), which lists six badges including `Zustand` and predates the shipped five. Leaving it would make the design record contradict the page. Flagging it because it was not in the approved scope.
