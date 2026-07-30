# Profile Site Implementation Plan

> **Historical record — superseded 2026-07-29.** This plan documents the site's
> original build, including a Figma "View résumé" link. That link was replaced by a
> committed, same-origin PDF download (`Elavarasan_Resume_2026.pdf`) on 2026-07-29.
> Every reference below to the Figma résumé URL, the "View résumé" label, or
> assertion **A7** describes that earlier, no-longer-true state — A7 as written now
> throws on `null`. `CLAUDE.md` is the authority for current rules; see its Content
> rules section for the résumé's actual current behaviour. Nothing in this file
> should be read as a live requirement or a passing test.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single static profile page for Elavarasan J — a permanent, credible professional presence aimed at recruiters, HR, and business readers.

**Architecture:** Three files, no build step, no dependencies. `index.html` carries all content and is fully readable with CSS and JS disabled. `styles.css` declares design tokens as custom properties, then layout, then components. `main.js` progressively enhances three isolated concerns — tenure computation, the signature load sequence, and an ambient speck field — and exposes its pure functions on `window.__profile` as a test seam.

**Tech Stack:** Vanilla HTML5, CSS (custom properties, `color-mix`, variable fonts), ES2020 JavaScript in an IIFE, Canvas 2D. Google Fonts with system fallbacks. Verification via the Playwright MCP tools.

**Spec:** `docs/superpowers/specs/2026-07-28-profile-site-design.md`

## Global Constraints

Every task's requirements implicitly include this section.

- **Working directory:** all site files live in `frontend-design-sample/`. Do not create `package.json`, do not add dependencies, do not add a build step.
- **Page URL for all verification:** `file:///home/elavarasan/Desktop/Projects/url-shortner/frontend-design-sample/index.html`
- **Palette — use these exact values, no others:** `--void: #000000`, `--moss: #0A2A16`, `--signal: #00E24A`, `--glow: #7CFFA8`, `--paper: #EAF3EC`, `--muted: #8FA396`, `--brass: #C79A3C`.
- **Body prose is always `--paper`, never green.** Green carries structure and state only.
- **`--glow` is reserved** for the signature moment and focus rings. Nowhere else.
- **`--brass` appears only** inside the Recognition section.
- **Glow effects must never sit behind running prose.** Content sections are flat `--void` with no effects.
- **Typefaces:** Archivo (width axis, display), Newsreader (body, 19px, weight 450), IBM Plex Mono (labels/dates/stack only — never body copy).
- **Headshot never renders wider than 140px.** Source is 200×200.
- **Vertical section rhythm is owned by the single `.section` rule.** No other selector declares `padding-block` on a section, to avoid specificity fights.
- **Every number on the page is one the subject supplied.** Invent no metrics.
- **Copy rules:** active voice, sentence case, no third-person pronouns for the subject. The certificate citation is quoted verbatim and keeps the certificate's own wording.
- ~~**Résumé action reads "View résumé"** — it opens Figma and must not promise a download.~~
  **Superseded (2026-07-29):** the résumé is a same-origin PDF download
  (`Elavarasan_Resume_2026.pdf`), labelled "Download résumé" in the hero and
  "Download PDF · 2 MB" in Contact. See `CLAUDE.md`.
- **Availability wording, verbatim:** "Open to collaborating on frontend architecture, scalable UI platforms, and AI-integrated product experiences." No job-seeking language anywhere.
- **No test framework.** Verification is Playwright MCP browser assertions plus screenshot critique.

### Design decision recorded during planning

The spec calls for the signature strip to resolve "from a failing state to a passing state" but defines no red token. Introducing red would add a fourth hue to a deliberately monochrome page. **The failing state is therefore unlit — `--muted` text, no glow, label `PENDING` — resolving to lit `--signal` with label `PASS`.** It reads as unverified → verified. Do not add a red.

### Progressive enhancement rule

`index.html` ships the signature in its **final** state (`data-state="pass"`). JavaScript demotes it to `pending` and replays the resolve *only* when animation is allowed. This means no-JS and reduced-motion visitors see the finished green state with zero work.

---

### Task 1: Semantic document with all content

Build the complete document with no styling. It must be readable and correctly ordered as raw HTML.

**Files:**
- Create: `frontend-design-sample/index.html`

**Interfaces:**
- Consumes: nothing.
- Produces: the DOM contract every later task depends on —
  - `h1` containing `Elavarasan J`
  - `#tenure` — span holding the static fallback text `12 yrs 2 mos`
  - `.signature[data-state]` — the signature container, shipped as `data-state="pass"`
  - `.state__pending` / `.state__pass` — the two state labels
  - `#specks` — the canvas element for the ambient field
  - `.section` — class on every content `<section>`
  - `.shell` — inner width-constraining wrapper
  - `.hero__portrait` — the headshot `<img>`

- [ ] **Step 1: Write the failing assertions**

These are the assertions this task must satisfy. Record them; they are run in Step 2 and Step 4.

```js
// A1 — heading
() => document.querySelector('h1').textContent.trim()
// expect: "Elavarasan J"

// A2 — no-JS tenure fallback present in the HTML itself
() => document.getElementById('tenure').textContent.trim()
// expect: "12 yrs 2 mos"

// A3 — signature ships in its final state
() => document.querySelector('.signature').dataset.state
// expect: "pass"

// A4 — external links point at the exact approved URLs
() => Array.from(document.querySelectorAll('a[href^="http"], a[href^="mailto"], a[href^="tel"]'))
        .map(a => a.getAttribute('href')).sort()
// expect exactly, sorted:
// [ "https://github.com/Elavarasan-J",
//   "https://www.figma.com/design/ohYIUOGxrrnRZlZihTa7IW/Ela-Resume-v1?t=hBJfygOzq2f4hoAe-0",
//   "https://www.linkedin.com/in/elavarasanj/",
//   "mailto:elavarasan.infotech10@gmail.com",
//   "tel:+918015515823" ]

// A5 — one h1, headings in order, no level skipped
() => {
  const levels = Array.from(document.querySelectorAll('h1,h2,h3'))
    .map(h => Number(h.tagName[1]));
  const h1s = levels.filter(l => l === 1).length;
  let ok = true;
  for (let i = 1; i < levels.length; i++) if (levels[i] - levels[i-1] > 1) ok = false;
  return { h1s, ordered: ok };
}
// expect: { h1s: 1, ordered: true }

// A6 — images have meaningful alt text and intrinsic dimensions
() => Array.from(document.images).map(i => ({
  src: i.getAttribute('src'),
  alt: i.getAttribute('alt'),
  w: i.getAttribute('width'),
  h: i.getAttribute('height'),
  loading: i.getAttribute('loading')
}))
// expect: elavarasan.jpeg has non-empty alt, width="200" height="200";
//         hoc.jpeg has alt naming the award and Ongil.ai, width="1280" height="904",
//         loading="lazy"

// A7 — RETIRED (2026-07-29): the résumé link is no longer a Figma URL, so this
// assertion throws on null and must not be run. It documented the old behaviour
// only. Current equivalent, matching the same-origin PDF download:
// () => document.querySelector('a[href$=".pdf"][download]').textContent.trim()
// expect: "Download résumé"

// A8 — landmarks present
() => ({
  main: !!document.querySelector('main'),
  footer: !!document.querySelector('footer'),
  lang: document.documentElement.lang
})
// expect: { main: true, footer: true, lang: "en" }
```

- [ ] **Step 2: Run the assertions to verify they fail**

```
Tool: mcp__playwright__browser_navigate
url: file:///home/elavarasan/Desktop/Projects/url-shortner/frontend-design-sample/index.html
```

Expected: navigation fails — the file does not exist yet (`ERR_FILE_NOT_FOUND`).

- [ ] **Step 3: Write `index.html`**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Elavarasan J — Staff Engineer, frontend</title>
<meta name="description" content="Elavarasan J, Staff Engineer in Chennai. Building scalable web applications and AI-driven interfaces since 2014, specialising in agentic, test-driven frontend delivery.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,400..800&family=IBM+Plex+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,400..600&display=swap">
<link rel="stylesheet" href="styles.css">
</head>
<body>

<a class="skip" href="#main">Skip to content</a>

<header class="hero">
  <canvas id="specks" class="specks" aria-hidden="true"></canvas>

  <div class="hero__top shell">
    <img class="hero__portrait" src="elavarasan.jpeg" width="200" height="200"
         alt="Elavarasan J">
    <p class="hero__meta">Staff Engineer · <span id="tenure">12 yrs 2 mos</span> · Chennai, India</p>
    <h1 class="hero__name">Elavarasan J</h1>
    <p class="hero__thesis">I build the systems that build interfaces.</p>
    <nav class="hero__actions" aria-label="Contact">
      <a href="mailto:elavarasan.infotech10@gmail.com">Email</a>
      <a href="https://www.linkedin.com/in/elavarasanj/">LinkedIn</a>
      <a href="https://github.com/Elavarasan-J">GitHub</a>
      <a href="https://www.figma.com/design/ohYIUOGxrrnRZlZihTa7IW/Ela-Resume-v1?t=hBJfygOzq2f4hoAe-0">View résumé</a>
    </nav>
  </div>

  <div class="signature" data-state="pass">
    <div class="signature__aura" aria-hidden="true">
      <svg viewBox="0 0 800 300" preserveAspectRatio="none" focusable="false">
        <path d="M-20 300 C 140 190, 210 250, 330 140" />
        <path d="M120 300 C 250 200, 300 120, 470 60" />
        <path d="M380 300 C 470 210, 560 230, 700 110" />
        <path d="M540 300 C 620 240, 700 180, 830 150" />
      </svg>
    </div>
    <div class="shell">
      <h2 class="signature__label">How the work gets made</h2>
      <ol class="pipeline">
        <li class="pipeline__stage">Design</li>
        <li class="pipeline__stage">Structured spec</li>
        <li class="pipeline__stage">Tested component</li>
      </ol>
      <p class="state">
        <span class="state__pending">PENDING</span>
        <span class="state__pass">PASS</span>
      </p>
      <p class="readout">
        <span class="readout__label">Component build time</span>
        <span class="readout__was">1–2 days</span>
        <span class="readout__arrow" aria-hidden="true">▸</span>
        <span class="readout__now">1–2 hours</span>
      </p>
    </div>
  </div>
</header>

<main id="main">

  <section class="section" aria-labelledby="about-h">
    <div class="shell">
      <h2 class="section__head" id="about-h">About</h2>
      <div class="prose">
        <p>Building scalable web applications and AI-driven interfaces since 2014, with React, TypeScript, and visualisation libraries like D3.js.</p>
        <p>The specialism is agentic, AI-driven development: workflows that turn structured inputs into production-ready frontend components, held to a test-driven standard. It accelerates delivery, raises code quality, and cuts rework across complex UI systems.</p>
        <p>The work spans AI-powered dashboards, conversational interfaces, dynamic data visualisation, and reusable component architecture — with a consistent focus on clean code, performance, and maintainability.</p>
        <p>Currently building Xyden, an adaptive leadership maturity assessment platform for senior executives, delivered end to end in two months through an agentic UI pipeline.</p>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="exp-h">
    <div class="shell">
      <h2 class="section__head" id="exp-h">Experience</h2>

      <div class="employer">
        <h3 class="employer__name">Ongil.ai</h3>
        <p class="employer__meta">Full-time · 4 yrs 11 mos</p>
        <div class="role">
          <p class="role__title">Associate Staff Engineer</p>
          <p class="role__meta">Jun 2024 – Present · 2 yrs 2 mos</p>
          <p class="role__clients">Client: Vanguard</p>
        </div>
        <div class="role">
          <p class="role__title">Senior Software Engineer</p>
          <p class="role__meta">Sep 2021 – Jun 2024 · 2 yrs 10 mos · Chennai</p>
          <p class="role__clients">Clients: Capgemini, 3M</p>
          <p class="role__note">Trained interns, led structured code reviews, and established coding guidelines — improving team code quality and accelerating onboarding.</p>
        </div>
      </div>

      <div class="employer">
        <h3 class="employer__name">Gtect Systems</h3>
        <p class="employer__meta">5 yrs 1 mo</p>
        <div class="role">
          <p class="role__title">Senior UI Developer</p>
          <p class="role__meta">Aug 2019 – Aug 2021 · 2 yrs 1 mo · Full-time</p>
          <p class="role__note">Gathered requirements with business analysts and developed use cases for key functionality.</p>
        </div>
        <div class="role">
          <p class="role__title">UI Developer</p>
          <p class="role__meta">Aug 2016 – Aug 2019 · 3 yrs 1 mo · Greater Chennai Area</p>
          <p class="role__note">Built mobile-first responsive websites with HTML, CSS, jQuery, and Bootstrap, with cross-browser compatibility.</p>
        </div>
      </div>

      <div class="employer">
        <h3 class="employer__name">Asareri Technologies</h3>
        <p class="employer__meta">2 yrs 3 mos</p>
        <div class="role">
          <p class="role__title">UI Developer</p>
          <p class="role__meta">May 2014 – Jul 2016 · Greater Chennai Area</p>
          <p class="role__note">Built mobile-first responsive websites and converted PSD designs into pixel-perfect HTML and CSS.</p>
        </div>
      </div>

      <p class="education">Education · Arunai College of Engineering</p>
    </div>
  </section>

  <section class="section" aria-labelledby="work-h">
    <div class="shell">
      <h2 class="section__head" id="work-h">Selected work</h2>

      <article class="work">
        <h3 class="work__name">Recurring Transactions</h3>
        <p class="work__client">Vanguard</p>
        <p class="work__desc">Modernised a micro-frontend application for automated investment and withdrawal plans, integrating an AI chatbot to increase client self-service.</p>
        <p class="work__stack">StencilJS · TypeScript · Jest · Agentic UI Builder</p>
        <p class="work__outcome">Improved application performance and usability.</p>
      </article>

      <article class="work">
        <h3 class="work__name">Agentic UI Builder</h3>
        <p class="work__client">Vanguard</p>
        <p class="work__desc">Contributed to an agentic UI generation workflow that produces production-ready components from structured inputs through a test-driven approach.</p>
        <p class="work__stack">React · Zustand · shadcn/ui · AWS Bedrock</p>
        <p class="work__outcome">Cut component development time from 1–2 days to 1–2 hours.</p>
      </article>

      <article class="work">
        <h3 class="work__name">Figma to JSON Converter</h3>
        <p class="work__client">Vanguard</p>
        <p class="work__desc">Design extraction tool converting Figma files into structured JSON with full component metadata, enabling automated UI generation.</p>
        <p class="work__stack">JavaScript · Tailwind CSS · HTML · CSS</p>
        <p class="work__outcome">Replaced manual design interpretation with an automated design-to-code pipeline.</p>
      </article>

      <article class="work">
        <h3 class="work__name">Wealth Advisor Dashboard with Copilot</h3>
        <p class="work__client">Capgemini</p>
        <p class="work__desc">Dual-mode dashboard with an AI copilot for consumers and advisors, covering portfolio analysis, risk visualisation, and appointment scheduling.</p>
        <p class="work__stack">React · Redux · Material UI · WebSocket</p>
        <p class="work__outcome">Improved investor decision-making and streamlined advisor consultations through personalised, AI-driven insight.</p>
      </article>

      <article class="work">
        <h3 class="work__name">Data Analytics Dashboards</h3>
        <p class="work__client">3M</p>
        <p class="work__desc">High-performance interactive dashboards turning complex datasets into actionable business insight through advanced charting.</p>
        <p class="work__stack">React · Material UI · D3.js · Highcharts</p>
        <p class="work__outcome">Enabled data-driven decisions by transforming raw data into meaningful visualisations.</p>
      </article>

      <article class="work">
        <h3 class="work__name">Xyden <span class="work__flag">In progress</span></h3>
        <p class="work__desc">Adaptive leadership maturity assessment platform for senior executives, delivered end to end in two months.</p>
        <p class="work__stack">Agentic UI pipeline</p>
      </article>

      <p class="stack-list">Agentic AI · Mentoring · React.js · TypeScript · Zustand · Test-driven development</p>
    </div>
  </section>

  <section class="section award" aria-labelledby="award-h">
    <div class="shell">
      <h2 class="section__head" id="award-h">Recognition</h2>
      <figure class="award__figure">
        <img src="hoc.jpeg" width="1280" height="904" loading="lazy"
             alt="Hall of Fame certificate for craftpersonship and collaboration, awarded to Elavarasan J by Ongil.ai">
        <figcaption>
          <p class="award__title">Hall of Fame for Craftpersonship and Collaboration</p>
          <p class="award__org">Ongil.ai</p>
          <blockquote class="award__citation">
            <p>Given for his technical excellence and resilience in handling a complex integration effort spanning several hours without break, collaborating with a team of engineers across Ongil and CapGemini.</p>
          </blockquote>
          <p class="award__signatories">Ajith Sahasranamam, CEO, Ongil.ai · Srinivasan Rengarajan, CTO, Ongil.ai</p>
        </figcaption>
      </figure>
    </div>
  </section>

</main>

<footer class="section contact" aria-labelledby="contact-h">
  <div class="shell">
    <h2 class="section__head" id="contact-h">Contact</h2>
    <p class="contact__availability">Open to collaborating on frontend architecture, scalable UI platforms, and AI-integrated product experiences.</p>
    <ul class="contact__list">
      <li><span class="contact__key">Email</span> <a href="mailto:elavarasan.infotech10@gmail.com">elavarasan.infotech10@gmail.com</a></li>
      <li><span class="contact__key">Phone</span> <a href="tel:+918015515823">+91 8015515823</a></li>
      <li><span class="contact__key">LinkedIn</span> <a href="https://www.linkedin.com/in/elavarasanj/">linkedin.com/in/elavarasanj</a></li>
      <li><span class="contact__key">GitHub</span> <a href="https://github.com/Elavarasan-J">github.com/Elavarasan-J</a></li>
      <li><span class="contact__key">Résumé</span> <a href="https://www.figma.com/design/ohYIUOGxrrnRZlZihTa7IW/Ela-Resume-v1?t=hBJfygOzq2f4hoAe-0">View résumé</a></li>
    </ul>
  </div>
</footer>

<script src="main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Run the assertions to verify they pass**

```
Tool: mcp__playwright__browser_navigate
url: file:///home/elavarasan/Desktop/Projects/url-shortner/frontend-design-sample/index.html
```

Then run each of A1–A8 from Step 1:

```
Tool: mcp__playwright__browser_evaluate
function: <paste the assertion function>
```

Expected: every assertion returns the documented value. `main.js` and `styles.css` will 404 in the console at this point — that is expected and is resolved by Tasks 2 and 6.

- [ ] **Step 5: Commit**

```bash
git add frontend-design-sample/index.html
git commit -m "feat(profile): add semantic document with full content"
```

---

### Task 2: Design tokens, base typography, flat black ground

**Files:**
- Create: `frontend-design-sample/styles.css`

**Interfaces:**
- Consumes: the DOM contract from Task 1.
- Produces: the token layer every later CSS task builds on — custom properties `--void --moss --signal --glow --paper --muted --brass --line --font-display --font-body --font-mono --step-0..--step-4 --space-1..--space-6 --measure --shell`, the single `.section` rhythm rule, the `.shell` wrapper, and the global `:focus-visible` ring.

- [ ] **Step 1: Write the failing assertions**

```js
// B1 — page ground is true black
() => getComputedStyle(document.body).backgroundColor
// expect: "rgb(0, 0, 0)"

// B2 — body prose is paper, not green
() => getComputedStyle(document.querySelector('.prose p')).color
// expect: "rgb(234, 243, 236)"

// B3 — body is the serif at 19px, weight 450
() => {
  const s = getComputedStyle(document.querySelector('.prose p'));
  return { family: s.fontFamily, size: s.fontSize, varSettings: s.fontVariationSettings };
}
// expect: family contains "Newsreader", size "19px", varSettings contains "wght" 450

// B4 — display face on the name, with the width axis engaged
() => {
  const s = getComputedStyle(document.querySelector('.hero__name'));
  return { family: s.fontFamily, varSettings: s.fontVariationSettings };
}
// expect: family contains "Archivo", varSettings contains "wdth"

// B5 — mono is utility only: it must not be the body font
() => getComputedStyle(document.querySelector('.prose p')).fontFamily.includes('Plex')
// expect: false

// B6 — exactly one selector owns section vertical rhythm
() => {
  const sheet = Array.from(document.styleSheets)
    .find(s => s.href && s.href.endsWith('styles.css'));
  return Array.from(sheet.cssRules)
    .filter(r => r.style && r.style.paddingBlock && /section/.test(r.selectorText || ''))
    .map(r => r.selectorText);
}
// expect: [".section"]

// B7 — focus ring uses --glow
() => {
  const a = document.querySelector('.hero__actions a');
  a.focus();
  const s = getComputedStyle(a);
  return { outlineColor: s.outlineColor, outlineWidth: s.outlineWidth };
}
// expect: outlineColor "rgb(124, 255, 168)", outlineWidth "2px"

// B8 — body text contrast against the ground clears 7:1
() => {
  const lum = ([r,g,b]) => {
    const f = v => { v /= 255; return v <= .03928 ? v/12.92 : Math.pow((v+.055)/1.055, 2.4); };
    return .2126*f(r) + .7152*f(g) + .0722*f(b);
  };
  const parse = s => s.match(/\d+/g).slice(0,3).map(Number);
  const fg = lum(parse(getComputedStyle(document.querySelector('.prose p')).color));
  const bg = lum(parse(getComputedStyle(document.body).backgroundColor));
  const [hi, lo] = fg > bg ? [fg, bg] : [bg, fg];
  return Math.round(((hi + .05) / (lo + .05)) * 10) / 10;
}
// expect: >= 7
```

- [ ] **Step 2: Run the assertions to verify they fail**

```
Tool: mcp__playwright__browser_navigate
url: file:///home/elavarasan/Desktop/Projects/url-shortner/frontend-design-sample/index.html
```

Then run B1.

Expected: B1 returns `"rgba(0, 0, 0, 0)"` — the default transparent body background, because `styles.css` does not exist. B6 throws because no stylesheet matches.

- [ ] **Step 3: Write the token and base layer**

```css
/* ==========================================================================
   Elavarasan J — profile site
   Layer order: tokens → reset → base type → rhythm → components
   The black is the ground; the green is the light the work emits.
   ========================================================================== */

/* ---------- tokens ---------- */
:root {
  --void:   #000000;
  --moss:   #0A2A16;
  --signal: #00E24A;
  --glow:   #7CFFA8;
  --paper:  #EAF3EC;
  --muted:  #8FA396;
  --brass:  #C79A3C;

  --line: color-mix(in srgb, var(--paper) 12%, transparent);

  --font-display: 'Archivo', system-ui, -apple-system, sans-serif;
  --font-body:    'Newsreader', Georgia, 'Times New Roman', serif;
  --font-mono:    'IBM Plex Mono', ui-monospace, 'SFMono-Regular', monospace;

  --step-0: 1.1875rem;                    /* 19px body */
  --step-1: 1.375rem;
  --step-2: 1.75rem;
  --step-3: clamp(1.75rem, 3.4vw, 2.5rem);
  --step-4: clamp(2.5rem, 8.6vw, 5.75rem); /* the name */

  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2.5rem;
  --space-5: 4rem;
  --space-6: 6rem;

  --measure: 62ch;
  --shell:   68rem;
  --gutter:  clamp(1.25rem, 5vw, 3rem);
}

/* ---------- reset ---------- */
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; }
h1, h2, h3, p, ol, ul, figure, blockquote { margin: 0; }
ol, ul { padding: 0; list-style: none; }
img, svg, canvas { display: block; max-width: 100%; }

/* ---------- base type ---------- */
body {
  background: var(--void);
  color: var(--paper);
  font-family: var(--font-body);
  font-size: var(--step-0);
  font-variation-settings: 'opsz' 20, 'wght' 450;
  line-height: 1.65;
  overflow-x: hidden;
}

.prose p {
  max-width: var(--measure);
  color: var(--paper);
}
.prose p + p { margin-top: var(--space-3); }

/* Display face. The width axis is the typographic move, not a decoration. */
.hero__name,
.section__head,
.employer__name,
.work__name,
.award__title {
  font-family: var(--font-display);
  font-weight: 700;
  font-variation-settings: 'wdth' 112, 'wght' 700;
  line-height: 1.02;
  letter-spacing: -0.005em;
}

.hero__name {
  font-size: var(--step-4);
  font-variation-settings: 'wdth' 122, 'wght' 700;
  text-transform: uppercase;
}

.section__head {
  font-size: var(--step-3);
  text-transform: uppercase;
  font-variation-settings: 'wdth' 118, 'wght' 600;
}

/* Utility face: labels, dates, stack, readouts. Never body copy. */
.hero__meta,
.hero__actions,
.pipeline,
.state,
.readout,
.employer__meta,
.role__meta,
.role__clients,
.work__client,
.work__stack,
.work__flag,
.education,
.stack-list,
.award__org,
.award__signatories,
.contact__key {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
}

/* ---------- rhythm: this rule is the sole owner of section padding ---------- */
.section {
  padding-block: var(--space-6);
  border-top: 1px solid var(--line);
}
.shell {
  width: 100%;
  max-width: var(--shell);
  margin-inline: auto;
  padding-inline: var(--gutter);
}

/* ---------- links ---------- */
a {
  color: var(--paper);
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--signal) 45%, transparent);
  transition: color .18s ease, border-color .18s ease;
}
a:hover { color: var(--signal); border-bottom-color: var(--signal); }

/* ---------- focus: the only other place --glow appears ---------- */
:focus-visible {
  outline: 2px solid var(--glow);
  outline-offset: 3px;
  border-radius: 2px;
}

.skip {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 10;
  background: var(--signal);
  color: var(--void);
  padding: var(--space-1) var(--space-2);
  border: 0;
  font-family: var(--font-mono);
}
.skip:focus { left: var(--space-2); top: var(--space-2); }
```

- [ ] **Step 4: Run the assertions to verify they pass**

Reload and run B1–B8.

```
Tool: mcp__playwright__browser_navigate
url: file:///home/elavarasan/Desktop/Projects/url-shortner/frontend-design-sample/index.html
```

Expected: B1 `"rgb(0, 0, 0)"`, B2 `"rgb(234, 243, 236)"`, B3 family contains Newsreader / size `19px` / `wght` 450, B4 family contains Archivo and settings contain `wdth`, B5 `false`, B6 `[".section"]`, B7 `rgb(124, 255, 168)` at `2px`, B8 `>= 7`.

If B3 or B4 report a fallback family, the Google Fonts request failed — confirm network access before changing the CSS, because the fallbacks are intentional.

- [ ] **Step 5: Commit**

```bash
git add frontend-design-sample/styles.css
git commit -m "feat(profile): add design tokens and base typography"
```

---

### Task 3: Hero layout and headshot cap

**Files:**
- Modify: `frontend-design-sample/styles.css` (append the hero layer)

**Interfaces:**
- Consumes: tokens and `.shell` from Task 2; `.hero`, `.hero__top`, `.hero__portrait`, `.hero__meta`, `.hero__name`, `.hero__thesis`, `.hero__actions`, `#specks` from Task 1.
- Produces: `.hero` as a full-viewport flex column with the signature pinned to the bottom, and `.specks` positioned as the ambient layer Task 8 draws into.

- [ ] **Step 1: Write the failing assertions**

```js
// C1 — headshot never renders wider than 140px
() => document.querySelector('.hero__portrait').getBoundingClientRect().width
// expect: <= 140

// C2 — hero fills the first viewport
() => {
  const h = document.querySelector('.hero').getBoundingClientRect().height;
  return h >= window.innerHeight * 0.95;
}
// expect: true

// C3 — the signature sits in the lower half of the first screen
() => {
  const t = document.querySelector('.signature').getBoundingClientRect().top;
  return t > window.innerHeight * 0.4;
}
// expect: true

// C4 — speck canvas covers the hero and is decorative
() => {
  const c = document.getElementById('specks');
  const s = getComputedStyle(c);
  return { position: s.position, hidden: c.getAttribute('aria-hidden'), pointer: s.pointerEvents };
}
// expect: { position: "absolute", hidden: "true", pointer: "none" }

// C5 — no horizontal overflow
() => document.documentElement.scrollWidth <= window.innerWidth + 1
// expect: true at 360, 768 and 1440 wide
```

- [ ] **Step 2: Run the assertions to verify they fail**

Reload the page, then run C1 and C2.

Expected: C1 returns `200` — the unstyled image renders at its intrinsic width, exceeding the 140px cap. C2 returns `false`.

- [ ] **Step 3: Append the hero layer to `styles.css`**

```css
/* ---------- hero ---------- */
.hero {
  position: relative;
  isolation: isolate;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-5);
  padding-top: var(--space-5);
  overflow: clip;
}

.specks {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  pointer-events: none;
}

.hero__portrait {
  /* Source is 200x200. Never scale it up — it will go soft. */
  width: 120px;
  height: 120px;
  max-width: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--line);
  margin-bottom: var(--space-4);
}

.hero__meta { margin-bottom: var(--space-2); }

.hero__thesis {
  margin-top: var(--space-3);
  font-size: var(--step-2);
  max-width: 34ch;
  color: var(--paper);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-4);
}
.hero__actions a { border-bottom-width: 1px; }

@media (max-width: 34rem) {
  .hero { min-height: auto; padding-bottom: var(--space-5); }
  .hero__portrait { width: 96px; height: 96px; }
}
```

- [ ] **Step 4: Run the assertions to verify they pass**

Run C1–C4 at the default size, then check C5 at three widths:

```
Tool: mcp__playwright__browser_resize
width: 360
height: 900
```
```
Tool: mcp__playwright__browser_evaluate
function: () => document.documentElement.scrollWidth <= window.innerWidth + 1
```
Expected: `true`. Repeat at `768 × 1024` and `1440 × 900`.

Note: at widths below 34rem the hero drops its `100svh` floor, so C2 is asserted at `1440 × 900` only.

- [ ] **Step 5: Commit**

```bash
git add frontend-design-sample/styles.css
git commit -m "feat(profile): lay out the hero and cap the headshot"
```

---

### Task 4: The signature — pipeline strip and the light from below

The one bold element on the page. Everything after it stays quiet.

**Files:**
- Modify: `frontend-design-sample/styles.css` (append the signature layer)

**Interfaces:**
- Consumes: tokens from Task 2, `.hero` stacking context from Task 3, `.signature[data-state]` / `.pipeline` / `.state` / `.readout` / `.signature__aura` from Task 1.
- Produces: the two visual states keyed off `[data-state="pending"]` and `[data-state="pass"]`, which Task 7 toggles. The aura transition is `opacity`, duration `1.2s`.

- [ ] **Step 1: Write the failing assertions**

```js
// D1 — in the pass state, the label reads PASS and PENDING is hidden
() => {
  const sig = document.querySelector('.signature');
  sig.dataset.state = 'pass';
  return {
    pass: getComputedStyle(sig.querySelector('.state__pass')).display,
    pending: getComputedStyle(sig.querySelector('.state__pending')).display
  };
}
// expect: { pass: "inline", pending: "none" }

// D2 — in the pending state the labels swap
() => {
  const sig = document.querySelector('.signature');
  sig.dataset.state = 'pending';
  const r = {
    pass: getComputedStyle(sig.querySelector('.state__pass')).display,
    pending: getComputedStyle(sig.querySelector('.state__pending')).display
  };
  sig.dataset.state = 'pass';
  return r;
}
// expect: { pass: "none", pending: "inline" }

// D3 — pass state is lit signal green; pending state is unlit muted. No red anywhere.
() => {
  const sig = document.querySelector('.signature');
  const badge = sig.querySelector('.state');
  sig.dataset.state = 'pending';
  const pending = getComputedStyle(badge).color;
  sig.dataset.state = 'pass';
  const passBg = getComputedStyle(badge).backgroundColor;
  return { pending, passBg };
}
// expect: { pending: "rgb(143, 163, 150)", passBg: "rgb(0, 226, 74)" }

// D4 — the aura is lit only in the pass state, and sits behind its own content
() => {
  const sig = document.querySelector('.signature');
  const aura = sig.querySelector('.signature__aura');
  sig.dataset.state = 'pending';
  const off = getComputedStyle(aura).opacity;
  sig.dataset.state = 'pass';
  const on = getComputedStyle(aura).opacity;
  return { off: Number(off), on: Number(on), z: getComputedStyle(aura).zIndex };
}
// expect: { off: 0, on: 0.85, z: "-1" }

// D5 — glow never sits behind prose: every content section is flat black with no filter
() => Array.from(document.querySelectorAll('main .section, footer.section')).map(s => {
  const cs = getComputedStyle(s);
  return { bg: cs.backgroundImage, filter: cs.filter };
})
// expect: every entry { bg: "none", filter: "none" }

// D6 — the readout carries the real numbers
() => ({
  was: document.querySelector('.readout__was').textContent.trim(),
  now: document.querySelector('.readout__now').textContent.trim()
})
// expect: { was: "1–2 days", now: "1–2 hours" }
```

- [ ] **Step 2: Run the assertions to verify they fail**

Reload, then run D1.

Expected: `{ pass: "inline", pending: "inline" }` — both labels show, because no rule hides either yet.

- [ ] **Step 3: Append the signature layer to `styles.css`**

```css
/* ==========================================================================
   Signature: the passing build.
   Green means verified — in TDD, green is the passing state. The light in this
   page rises from the bottom edge because it is emitted by the build going
   green. This is the only place --glow appears outside the focus ring.
   ========================================================================== */
.signature {
  position: relative;
  isolation: isolate;
  padding-top: var(--space-5);
  padding-bottom: var(--space-5);
}

.signature__label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: var(--space-3);
}

.signature__aura {
  position: absolute;
  inset: auto 0 0 0;
  height: 26rem;
  z-index: -1;
  pointer-events: none;
  opacity: 0;
  transition: opacity 1.2s ease;
  background:
    radial-gradient(120% 100% at 50% 125%,
      color-mix(in srgb, var(--signal) 58%, transparent) 0%, transparent 62%),
    radial-gradient(70% 80% at 28% 135%,
      color-mix(in srgb, var(--glow) 30%, transparent) 0%, transparent 55%),
    radial-gradient(95% 95% at 76% 130%, var(--moss) 0%, transparent 62%);
}

.signature__aura svg {
  width: 100%;
  height: 100%;
  filter: blur(14px);
  opacity: 0.75;
}
.signature__aura path {
  fill: none;
  stroke: var(--glow);
  stroke-width: 2;
  stroke-linecap: round;
}
.signature__aura path:nth-child(even) {
  stroke: var(--signal);
  stroke-width: 3;
}

.signature[data-state="pass"] .signature__aura { opacity: 0.85; }

/* ---------- pipeline ---------- */
.pipeline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}
.pipeline__stage {
  color: var(--muted);
  transition: color .5s ease;
}
.pipeline__stage + .pipeline__stage::before {
  content: '→';
  margin-right: var(--space-3);
  color: color-mix(in srgb, var(--paper) 35%, transparent);
}
.signature[data-state="pass"] .pipeline__stage { color: var(--paper); }

/* ---------- state badge ---------- */
.state {
  display: inline-block;
  margin-top: var(--space-3);
  padding: 0.3rem 0.7rem;
  border: 1px solid var(--line);
  color: var(--muted);
  transition: color .4s ease, background-color .4s ease,
              border-color .4s ease, box-shadow .4s ease;
}
.state__pass { display: none; }
.signature[data-state="pass"] .state__pending { display: none; }
.signature[data-state="pass"] .state__pass { display: inline; }
.signature[data-state="pass"] .state {
  color: var(--void);
  background-color: var(--signal);
  border-color: var(--signal);
  box-shadow: 0 0 28px color-mix(in srgb, var(--signal) 55%, transparent);
}

/* ---------- readout ---------- */
.readout {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-2);
  margin-top: var(--space-3);
}
.readout__label { color: var(--muted); }
.readout__was {
  color: var(--muted);
  text-decoration: line-through;
  text-decoration-color: color-mix(in srgb, var(--muted) 60%, transparent);
}
.readout__arrow { color: var(--signal); }
.readout__now {
  color: var(--signal);
  font-weight: 500;
}

@media (prefers-reduced-motion: reduce) {
  .signature__aura,
  .pipeline__stage,
  .state { transition: none; }
}
```

- [ ] **Step 4: Run the assertions to verify they pass**

Reload and run D1–D6.

Expected: exactly the documented values. D5 must return `filter: "none"` and `bg: "none"` for every content section — if any section reports a gradient, the glow has leaked out of the hero and must be pulled back.

- [ ] **Step 5: Commit**

```bash
git add frontend-design-sample/styles.css
git commit -m "feat(profile): add the signature build strip and its glow"
```

---

### Task 5: Content sections

Quiet, disciplined typesetting. No effects below the hero.

**Files:**
- Modify: `frontend-design-sample/styles.css` (append the content layer)

**Interfaces:**
- Consumes: tokens and `.section`/`.shell` from Task 2.
- Produces: styling for `.employer`, `.role`, `.work`, `.award`, `.contact`. Declares no `padding-block` on any section — `.section` from Task 2 remains the sole owner.

- [ ] **Step 1: Write the failing assertions**

```js
// E1 — .section remains the only owner of section padding after all appends
() => {
  const sheet = Array.from(document.styleSheets)
    .find(s => s.href && s.href.endsWith('styles.css'));
  return Array.from(sheet.cssRules)
    .filter(r => r.style &&
      (r.style.paddingBlock || r.style.paddingTop || r.style.paddingBottom) &&
      /\.section|\.award|\.contact/.test(r.selectorText || ''))
    .map(r => r.selectorText);
}
// expect: [".section"]  — .award and .contact must not set their own vertical padding

// E2 — brass appears only inside the award section
() => {
  const inAward = getComputedStyle(document.querySelector('.award__title')).color;
  const outside = Array.from(document.querySelectorAll('main .section:not(.award) *, footer *'))
    .map(el => getComputedStyle(el).color)
    .filter(c => c === 'rgb(199, 154, 60)');
  return { inAward, leaks: outside.length };
}
// expect: { inAward: "rgb(199, 154, 60)", leaks: 0 }

// E3 — the certificate is lazy-loaded and reserves its space
() => {
  const img = document.querySelector('.award__figure img');
  return {
    loading: img.getAttribute('loading'),
    ratio: (img.getBoundingClientRect().width / img.getBoundingClientRect().height).toFixed(2)
  };
}
// expect: { loading: "lazy", ratio: "1.42" }   // 1280/904

// E4 — prose stays within a readable measure
() => document.querySelector('.prose p').getBoundingClientRect().width
// expect: <= 720 at 1440 wide

// E5 — every work block names a stack
() => Array.from(document.querySelectorAll('.work'))
        .every(w => w.querySelector('.work__stack').textContent.trim().length > 0)
// expect: true

// E6 — contact keys and values are on one row each at desktop width
() => {
  const li = document.querySelector('.contact__list li');
  return getComputedStyle(li).display;
}
// expect: "flex"
```

- [ ] **Step 2: Run the assertions to verify they fail**

Reload, then run E2 and E6.

Expected: E2 returns `inAward: "rgb(234, 243, 236)"` — the award title inherits paper because no brass rule exists. E6 returns `"list-item"`.

- [ ] **Step 3: Append the content layer to `styles.css`**

```css
/* ---------- experience ---------- */
.employer + .employer { margin-top: var(--space-5); }
.employer__name {
  font-size: var(--step-1);
  margin-bottom: var(--space-1);
}
.employer__meta { margin-bottom: var(--space-3); }

.role {
  padding-left: var(--space-3);
  border-left: 1px solid var(--line);
}
.role + .role { margin-top: var(--space-4); }
.role__title {
  font-size: var(--step-1);
  font-variation-settings: 'wght' 500;
  margin-bottom: var(--space-1);
}
.role__meta { margin-bottom: var(--space-1); }
.role__clients { color: var(--signal); }
.role__note {
  margin-top: var(--space-2);
  max-width: var(--measure);
  color: var(--paper);
}

.education {
  margin-top: var(--space-5);
  padding-top: var(--space-3);
  border-top: 1px solid var(--line);
}

/* ---------- selected work ---------- */
.work { max-width: var(--measure); }
.work + .work {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--line);
}
.work__name {
  font-size: var(--step-1);
  margin-bottom: var(--space-1);
}
.work__flag {
  display: inline-block;
  margin-left: var(--space-2);
  padding: 0.15rem 0.45rem;
  border: 1px solid color-mix(in srgb, var(--signal) 40%, transparent);
  color: var(--signal);
  vertical-align: middle;
}
.work__client { color: var(--signal); margin-bottom: var(--space-2); }
.work__desc { margin-bottom: var(--space-2); }
.work__stack { margin-bottom: var(--space-1); }
.work__outcome { color: var(--paper); }

.stack-list {
  margin-top: var(--space-5);
  padding-top: var(--space-3);
  border-top: 1px solid var(--line);
  line-height: 2;
}

/* ---------- recognition: the only warm note on the page ---------- */
.award__figure {
  display: grid;
  gap: var(--space-4);
  align-items: start;
}
@media (min-width: 56rem) {
  .award__figure { grid-template-columns: 1.15fr 1fr; }
}
.award__figure img {
  width: 100%;
  height: auto;
  border: 1px solid color-mix(in srgb, var(--brass) 35%, transparent);
  box-shadow: 0 0 40px color-mix(in srgb, var(--brass) 12%, transparent);
}
.award__title {
  font-size: var(--step-1);
  color: var(--brass);
  margin-bottom: var(--space-1);
}
.award__org { margin-bottom: var(--space-3); }
.award__citation {
  padding-left: var(--space-3);
  border-left: 1px solid color-mix(in srgb, var(--brass) 45%, transparent);
  max-width: var(--measure);
}
.award__citation p { font-style: italic; }
.award__signatories { margin-top: var(--space-3); }

/* ---------- contact ---------- */
.contact__availability {
  max-width: var(--measure);
  font-size: var(--step-1);
  margin-bottom: var(--space-4);
}
.contact__list { display: grid; gap: var(--space-2); }
.contact__list li {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: baseline;
}
.contact__key {
  min-width: 7rem;
  flex: 0 0 auto;
}
```

- [ ] **Step 4: Run the assertions to verify they pass**

```
Tool: mcp__playwright__browser_resize
width: 1440
height: 900
```

Reload and run E1–E6. Expected: the documented values, with E1 returning exactly `[".section"]`.

- [ ] **Step 5: Commit**

```bash
git add frontend-design-sample/styles.css
git commit -m "feat(profile): typeset the content sections"
```

---

### Task 6: Tenure computation

The page must never go stale. Tenure is derived from May 2014 at render time.

**Files:**
- Create: `frontend-design-sample/main.js`

**Interfaces:**
- Consumes: `#tenure` from Task 1.
- Produces: `window.__profile` with these exact signatures, relied on by Tasks 7 and 8 —
  - `CAREER_START: Date` — `new Date(2014, 4, 1)`, May 2014
  - `monthsBetween(start: Date, end: Date) -> number`
  - `formatTenure(totalMonths: number) -> string` — e.g. `"12 yrs 2 mos"`, `"12 yrs"`, `"12 yrs 1 mo"`
  - `tenureAt(now: Date) -> string`

- [ ] **Step 1: Write the failing assertions**

```js
// F1 — month arithmetic
() => window.__profile.monthsBetween(new Date(2014, 4, 1), new Date(2026, 6, 28))
// expect: 146

// F2 — formatting, including the singular and zero-month cases
() => {
  const f = window.__profile.formatTenure;
  return [f(146), f(144), f(145), f(13), f(12)];
}
// expect: ["12 yrs 2 mos", "12 yrs", "12 yrs 1 mo", "1 yr 1 mo", "1 yr"]

// F3 — tenure at a fixed clock, so this assertion never goes stale
() => window.__profile.tenureAt(new Date(2026, 6, 28))
// expect: "12 yrs 2 mos"

// F4 — the DOM is actually updated from the live clock
() => {
  const txt = document.getElementById('tenure').textContent.trim();
  return { txt, matchesLive: txt === window.__profile.tenureAt(new Date()) };
}
// expect: matchesLive true, and txt matching /^\d+ yrs?( \d+ mos?)?$/

// F5 — no console errors
// (run via mcp__playwright__browser_console_messages, level "error")
// expect: no entries
```

- [ ] **Step 2: Run the assertions to verify they fail**

Reload, then run F1.

Expected: a `TypeError` — `window.__profile` is undefined because `main.js` does not exist.

- [ ] **Step 3: Write `main.js`**

```js
/* Elavarasan J — profile site
   Presentation-only enhancement. The page is complete without this file.
   Pure functions are exposed on window.__profile as a verification seam. */
(() => {
  'use strict';

  /* ---------- tenure ----------
     The page states a duration, so it must derive it rather than hardcode it.
     Career start: May 2014 (Asareri Technologies). */
  const CAREER_START = new Date(2014, 4, 1);

  function monthsBetween(start, end) {
    return (end.getFullYear() - start.getFullYear()) * 12
         + (end.getMonth() - start.getMonth());
  }

  function formatTenure(totalMonths) {
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    const y = `${years} ${years === 1 ? 'yr' : 'yrs'}`;
    if (months === 0) return y;
    return `${y} ${months} ${months === 1 ? 'mo' : 'mos'}`;
  }

  function tenureAt(now) {
    return formatTenure(monthsBetween(CAREER_START, now));
  }

  function renderTenure() {
    const el = document.getElementById('tenure');
    if (el) el.textContent = tenureAt(new Date());
  }

  renderTenure();

  window.__profile = { CAREER_START, monthsBetween, formatTenure, tenureAt };
})();
```

- [ ] **Step 4: Run the assertions to verify they pass**

Reload and run F1–F4, then:

```
Tool: mcp__playwright__browser_console_messages
level: error
```
Expected: F1 `146`; F2 `["12 yrs 2 mos", "12 yrs", "12 yrs 1 mo", "1 yr 1 mo", "1 yr"]`; F3 `"12 yrs 2 mos"`; F4 `matchesLive: true`; console errors empty.

- [ ] **Step 5: Commit**

```bash
git add frontend-design-sample/main.js
git commit -m "feat(profile): derive tenure from May 2014 so the page cannot go stale"
```

---

### Task 7: The signature load sequence and reduced motion

**Files:**
- Modify: `frontend-design-sample/main.js`

**Interfaces:**
- Consumes: `window.__profile` from Task 6; `.signature[data-state]` from Task 1; the two state styles from Task 4.
- Produces: adds to `window.__profile` —
  - `shouldAnimate(prefersReduced: boolean) -> boolean`
  - `RESOLVE_DELAY_MS: number` — `900`

- [ ] **Step 1: Write the failing assertions**

```js
// G1 — the animation decision is a pure function of the media preference
() => {
  const f = window.__profile.shouldAnimate;
  return [f(true), f(false)];
}
// expect: [false, true]

// G2 — with motion allowed, the strip starts pending and resolves to pass
//      (run immediately after navigation, before RESOLVE_DELAY_MS elapses)
() => document.querySelector('.signature').dataset.state
// expect: "pending"

// G3 — after the delay it has resolved
() => new Promise(r => setTimeout(
        () => r(document.querySelector('.signature').dataset.state),
        window.__profile.RESOLVE_DELAY_MS + 600))
// expect: "pass"

// G4 — with reduced motion, pass is present immediately and never demoted
//      (asserted via page.emulateMedia in Step 4)
```

- [ ] **Step 2: Run the assertions to verify they fail**

Reload, then run G1.

Expected: a `TypeError` — `shouldAnimate` is not a function.

- [ ] **Step 3: Extend `main.js`**

Insert this block immediately before the `window.__profile = ...` line, then update that line as shown.

```js
  /* ---------- signature: the passing build ----------
     The HTML ships data-state="pass" so no-JS and reduced-motion visitors get
     the finished state. Only when motion is welcome do we demote to pending
     and replay the resolve. */
  const RESOLVE_DELAY_MS = 900;

  function shouldAnimate(prefersReduced) {
    return !prefersReduced;
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function playSignature() {
    const sig = document.querySelector('.signature');
    if (!sig) return;
    if (!shouldAnimate(prefersReducedMotion())) return;   // already "pass"

    sig.dataset.state = 'pending';
    window.setTimeout(() => { sig.dataset.state = 'pass'; }, RESOLVE_DELAY_MS);
  }

  playSignature();
```

Replace the export line with:

```js
  window.__profile = {
    CAREER_START, monthsBetween, formatTenure, tenureAt,
    shouldAnimate, RESOLVE_DELAY_MS
  };
```

- [ ] **Step 4: Run the assertions to verify they pass**

Reload and run G1, then G2 promptly, then G3.

Expected: G1 `[false, true]`, G2 `"pending"`, G3 `"pass"`.

Then verify reduced motion with real media emulation:

```
Tool: mcp__playwright__browser_run_code_unsafe
code: async (page) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('file:///home/elavarasan/Desktop/Projects/url-shortner/frontend-design-sample/index.html');
  const immediate = await page.evaluate(() => document.querySelector('.signature').dataset.state);
  const auraTransition = await page.evaluate(() =>
    getComputedStyle(document.querySelector('.signature__aura')).transitionDuration);
  await page.waitForTimeout(1600);
  const later = await page.evaluate(() => document.querySelector('.signature').dataset.state);
  await page.emulateMedia({ reducedMotion: null });
  return { immediate, auraTransition, later };
}
```

Expected: `{ immediate: "pass", auraTransition: "0s", later: "pass" }`.

- [ ] **Step 5: Commit**

```bash
git add frontend-design-sample/main.js
git commit -m "feat(profile): resolve the build strip on load, honouring reduced motion"
```

---

### Task 8: Ambient speck field

**Files:**
- Modify: `frontend-design-sample/main.js`

**Interfaces:**
- Consumes: `#specks` from Task 1, `.specks` positioning from Task 3, `shouldAnimate` from Task 7.
- Produces: adds to `window.__profile` —
  - `SPECK_CAP: number` — `70`
  - `speckCount(width: number) -> number` — `Math.min(SPECK_CAP, Math.round(width / 14))`

- [ ] **Step 1: Write the failing assertions**

```js
// H1 — count scales with width and is hard-capped
() => {
  const f = window.__profile.speckCount;
  return [f(360), f(1440), f(6000), window.__profile.SPECK_CAP];
}
// expect: [26, 70, 70, 70]

// H2 — the canvas is sized to the hero in device pixels
() => {
  const c = document.getElementById('specks');
  const r = c.getBoundingClientRect();
  return { hasBacking: c.width > 0 && c.height > 0, coversHero: r.width > 100 };
}
// expect: { hasBacking: true, coversHero: true }

// H3 — the canvas is decorative and never interactive
() => {
  const c = document.getElementById('specks');
  return { aria: c.getAttribute('aria-hidden'), pe: getComputedStyle(c).pointerEvents };
}
// expect: { aria: "true", pe: "none" }

// H4 — no console errors
// (mcp__playwright__browser_console_messages, level "error") — expect none
```

- [ ] **Step 2: Run the assertions to verify they fail**

Reload, then run H1.

Expected: a `TypeError` — `speckCount` is not a function.

- [ ] **Step 3: Extend `main.js`**

Insert before the `window.__profile = ...` line.

```js
  /* ---------- ambient specks ----------
     Sparse, slow, low-opacity. From the reference image, not a starfield.
     Capped, paused when the tab is hidden, absent under reduced motion. */
  const SPECK_CAP = 70;

  function speckCount(width) {
    return Math.min(SPECK_CAP, Math.round(width / 14));
  }

  function initSpecks() {
    const canvas = document.getElementById('specks');
    if (!canvas || !canvas.getContext) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let specks = [];
    let raf = null;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      specks = Array.from({ length: speckCount(rect.width) }, (_, i) => ({
        x: ((i * 97) % 100) / 100 * canvas.width,
        y: ((i * 61) % 100) / 100 * canvas.height,
        r: (0.6 + ((i % 5) * 0.28)) * dpr,
        a: 0.16 + ((i % 7) * 0.055),
        vy: (0.06 + ((i % 4) * 0.035)) * dpr
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of specks) {
        // Specks nearer the bottom sit inside the light, so they read brighter.
        const depth = s.y / canvas.height;
        ctx.beginPath();
        ctx.fillStyle = `rgba(124, 255, 168, ${s.a * (0.45 + depth * 0.55)})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function step() {
      for (const s of specks) {
        s.y -= s.vy;
        if (s.y < -4) s.y = canvas.height + 4;
      }
      draw();
      raf = window.requestAnimationFrame(step);
    }

    function start() {
      if (raf === null) raf = window.requestAnimationFrame(step);
    }
    function stop() {
      if (raf !== null) { window.cancelAnimationFrame(raf); raf = null; }
    }

    resize();
    draw();

    if (!shouldAnimate(prefersReducedMotion())) return;   // static field only

    start();
    document.addEventListener('visibilitychange',
      () => (document.hidden ? stop() : start()));
    window.addEventListener('resize', () => { resize(); draw(); });
  }

  initSpecks();
```

Replace the export line with:

```js
  window.__profile = {
    CAREER_START, monthsBetween, formatTenure, tenureAt,
    shouldAnimate, RESOLVE_DELAY_MS,
    SPECK_CAP, speckCount
  };
```

- [ ] **Step 4: Run the assertions to verify they pass**

Reload and run H1–H3, then check the console.

Expected: H1 `[26, 70, 70, 70]`, H2 `{ hasBacking: true, coversHero: true }`, H3 `{ aria: "true", pe: "none" }`, no console errors.

Confirm the field is static under reduced motion:

```
Tool: mcp__playwright__browser_run_code_unsafe
code: async (page) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('file:///home/elavarasan/Desktop/Projects/url-shortner/frontend-design-sample/index.html');
  const a = await page.locator('#specks').screenshot();
  await page.waitForTimeout(900);
  const b = await page.locator('#specks').screenshot();
  await page.emulateMedia({ reducedMotion: null });
  return { identical: Buffer.compare(a, b) === 0 };
}
```

Expected: `{ identical: true }` — nothing drifts.

- [ ] **Step 5: Commit**

```bash
git add frontend-design-sample/main.js
git commit -m "feat(profile): add the ambient speck field"
```

---

### Task 9: Responsive, accessibility, and screenshot critique

The quality floor, verified rather than assumed.

**Files:**
- Modify: `frontend-design-sample/styles.css` (only if the sweep finds defects)

**Interfaces:**
- Consumes: everything above.
- Produces: no new interfaces. This task ends with the page verified at three widths and a written critique.

- [ ] **Step 1: Verify no horizontal overflow at all three widths**

For each of `360 × 900`, `768 × 1024`, `1440 × 900`:

```
Tool: mcp__playwright__browser_resize
width: <w>
height: <h>
```
```
Tool: mcp__playwright__browser_evaluate
function: () => ({
  overflow: document.documentElement.scrollWidth - window.innerWidth,
  offenders: Array.from(document.querySelectorAll('body *'))
    .filter(el => el.getBoundingClientRect().right > window.innerWidth + 1)
    .map(el => el.className || el.tagName)
    .slice(0, 5)
})
```
Expected: `{ overflow: <= 1, offenders: [] }` at every width.

- [ ] **Step 2: Verify keyboard reachability and visible focus**

```
Tool: mcp__playwright__browser_run_code_unsafe
code: async (page) => {
  await page.goto('file:///home/elavarasan/Desktop/Projects/url-shortner/frontend-design-sample/index.html');
  const total = await page.evaluate(() =>
    document.querySelectorAll('a[href]').length);
  const seen = [];
  for (let i = 0; i < total + 1; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return {
        tag: el.tagName,
        href: el.getAttribute('href'),
        outlineWidth: s.outlineWidth,
        outlineColor: s.outlineColor
      };
    });
    if (info) seen.push(info);
  }
  return {
    total,
    reached: seen.length,
    allRinged: seen.every(s => s.outlineWidth !== '0px'
      && s.outlineColor === 'rgb(124, 255, 168)')
  };
}
```
Expected: `reached` equals `total` (every link is tabbable, including the skip link), and `allRinged: true`.

- [ ] **Step 3: Verify the console is clean**

```
Tool: mcp__playwright__browser_console_messages
level: error
```
Expected: no entries.

- [ ] **Step 4: Capture screenshots and critique them**

```
Tool: mcp__playwright__browser_resize
width: 1440
height: 900
```
```
Tool: mcp__playwright__browser_take_screenshot
type: png
scale: css
fullPage: true
filename: profile-1440.png
```

Repeat at `768 × 1024` → `profile-768.png` and `360 × 900` → `profile-360.png`.

Read each screenshot back and check it against the art direction. Every item must hold:

- The glow rises from the bottom of the first screen and stops there. No glow behind any prose.
- Content sections below the hero are flat black.
- The headshot is never wider than 140px and does not look upscaled.
- The name reads as expanded display type, not a default sans.
- Body copy is a serif and does not shimmer against the black.
- Green appears on structure and state only — never on a paragraph.
- Brass appears only in Recognition.
- At 360px nothing is clipped, and the certificate stacks above its citation.

Fix any defect in `styles.css`, then re-shoot the affected width before moving on.

- [ ] **Step 5: Commit**

```bash
git add frontend-design-sample/styles.css
git commit -m "fix(profile): resolve defects found in the responsive and a11y sweep"
```

If the sweep found no defects, skip the commit and record that the sweep passed clean.

---

## Self-review

**Spec coverage:**

| Spec requirement | Task |
|---|---|
| Goal, audience, non-goals (no build step, no framework) | Global Constraints |
| Palette, exact tokens | 2 |
| Body prose never green | 2, verified again in the Task 9 critique |
| `--glow` reserved for signature and focus | 2 (focus), 4 (signature) |
| `--brass` in Recognition only | 5 (E2 asserts no leaks) |
| Glow never behind prose | 4 (D5), 9 (critique) |
| Typography: three faces and their roles | 2 (B3, B4, B5) |
| Motion: one orchestrated load moment | 7 |
| Ambient specks | 8 |
| Reduced motion honoured | 7 (real media emulation), 8 (static field) |
| Hero, computed tenure, no-JS fallback | 1 (A2), 3, 6 |
| Signature strip and the real 1–2 days ▸ 1–2 hours number | 1, 4 (D6) |
| About prose | 1 |
| Experience grouped by employer, client lines | 1, 5 |
| Selected work, six blocks, Xyden unlinked | 1 (A4 proves no Xyden URL exists), 5 (E5) |
| Recognition, certificate with citation and signatories | 1, 5 (E3) |
| Contact, exact URLs, "View résumé" label, availability wording | 1 (A4, A7) |
| Headshot capped at 140px | 3 (C1), 9 |
| `hoc.jpeg` lazy-loaded with intrinsic dimensions | 1 (A6), 5 (E3) |
| Single `.section` owner of rhythm | 2 (B6), 5 (E1) |
| Responsive to 360px | 3 (C5), 9 |
| Focus visible in `--glow` | 2 (B7), 9 |
| Contrast ≥ 7:1 for body text | 2 (B8) |
| One h1, ordered headings, landmarks, alt text | 1 (A5, A6, A8) |
| `tel:` and `mailto:` links | 1 (A4) |
| Console free of errors | 6, 8, 9 |
| Screenshot critique at three widths | 9 |

No gaps.

**Placeholder scan:** none. Every code step carries complete, runnable content; every verification step names the exact tool, argument, and expected value.

**Type consistency:** `window.__profile` grows across Tasks 6, 7, and 8 with no renames — `CAREER_START`, `monthsBetween`, `formatTenure`, `tenureAt`, `shouldAnimate`, `RESOLVE_DELAY_MS`, `SPECK_CAP`, `speckCount`. `data-state` takes only `pending` and `pass` in both the CSS (Task 4) and the JS (Task 7). `speckCount` is defined in Task 8 and consumed only there. `shouldAnimate` and `prefersReducedMotion` are defined in Task 7 and reused in Task 8, which is why Task 8 must follow Task 7.

**One resolved spec gap:** the spec required a "failing state" without defining a red token. Recorded above as unlit `--muted` `PENDING` → lit `--signal` `PASS`, keeping the page monochrome.
