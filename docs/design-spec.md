# Profile site — Elavarasan J

**Date:** 2026-07-28
**Status:** Approved design, pending implementation plan

## Goal

A single static page that serves as Elavarasan J's permanent, credible professional
presence — the link to drop into emails, applications, and profiles.

**Audience:** recruiters, HR, and business stakeholders. Not engineers. A recruiter
skims it in under a minute; a hiring manager reads the prose.

**The page's one job:** establish, at a glance, that this is a senior frontend
engineer with 12 years of enterprise delivery and one unusual specialism —
automating frontend engineering itself.

### Non-goals

- No job-seeking urgency. Availability is a soft signal only (see Copy below).
- No blog, no CMS, no contact form, no analytics, no build step.
- No React. This is deliberately vanilla so the artefact stays permanent and
  dependency-free, despite the subject's React background.

## Art direction

### Concept

Green is not decoration here. Elavarasan's specialism is TDD-driven agentic UI
generation, and in TDD green *is* the passing state — red becomes green. So on this
page green means verified.

The user's reference image (pure black at the top, luminous green light rising from
the bottom edge, sparse specks throughout) sets the composition: **the light comes
from below, and it is emitted by the passing build.** The name sits on flat black at
the top where text stays crisp. The signature moment sits at the bottom of the first
screen and glows. The page is dark because the concept requires a light source, not
because developer portfolios are dark.

### Palette

| Token | Hex | Role |
|---|---|---|
| `--void` | `#000000` | Page ground. True black, per the reference image. |
| `--moss` | `#0A2A16` | Deep green mid-tone of the glow gradient. |
| `--signal` | `#00E24A` | Luminous green, bright tier. Pass state, `.cta`, top skill pills, client names, key figures. |
| `--signal-dim` | `#00A335` | Same hue at 72% on void. Structural tier: section heads, group labels, `.contact__key`. Added 2026-08-26 — see `CLAUDE.md`. |
| `--glow` | `#7CFFA8` | White-hot core of the light. Focus rings. |
| `--paper` | `#EAF3EC` | Body text. |
| `--muted` | `#8FA396` | Secondary text, dates, meta. |
| `--brass` | `#C79A3C` | Recognition section only. |

**Rules:**

- Body prose is always `--paper`, never green. Green text on black is fatiguing and
  the About section is meant to be read.
- `--glow` is reserved for the signature moment and focus rings. Nowhere else.
- Green runs at **two intensities and never three**. Bright is state, claims and
  figures; dim is structure and labels. Before the split every green on the page sat
  at one value, so nothing read as *the* signal — which was the 2026-08 design
  review's sharpest point.
- `--brass` appears only in the Recognition section, because `hoc.jpeg` is a
  cream-and-gold certificate and needs one warm note to not read as pasted in.
- Glow effects must never sit behind running prose. Reading areas stay flat black.

### Typography

| Face | Role | Notes |
|---|---|---|
| **Archivo Expanded** | Display | Name and section headings. The wide width axis is the typographic move. |
| **Newsreader** | Body | 19px, weight 450 so serif strokes don't shimmer on pure black. A serif is unexpected on a dark engineering page and is the right call for readers who actually read paragraphs. |
| **IBM Plex Mono** | Utility only | Dates, stack lists, labels, the pipeline readout. Never body copy. |

Loaded from Google Fonts with system fallbacks (`system-ui` stack for display and
utility, Georgia for body) so the page degrades gracefully offline.

### Motion

One orchestrated moment, not scattered effects.

- **On load:** the signature strip resolves from a failing state to a passing state,
  and the green bloom rises with it.
- **Ambient:** sparse specks drift slowly. Low opacity, small count.
- **Hover:** links pick up `--signal` underlines. Nothing more.
- `prefers-reduced-motion: reduce` renders the final passing state immediately with
  no animation and no drift, and the page must be fully legible in that state.

## Page structure

### 1 · Hero — flat black

Headshot (`elavarasan.jpeg`) at 120px. The source is only 200×200, so it must never
render larger than 140px.

Name in Archivo Expanded. Meta line in Plex Mono: `Staff Engineer · 12 yrs 2 mos ·
Chennai, India`. The tenure figure is computed in JS from May 2014 so it stays
accurate indefinitely; the HTML ships a static `12 yrs 2 mos` as the no-JS fallback.

Thesis line: **"I build the systems that build interfaces."**

Inline contact actions: email, LinkedIn, GitHub, résumé download.

Sparse drifting specks over the whole hero.

### 2 · Signature — the passing build

Anchored to the bottom of the first viewport, glowing upward. This is the one bold
element on the page; everything below it is quiet.

```
HOW THE WORK GETS MADE

●── Design ──● Structured spec ──● Tested component ──▣ PASS

Component build time
1–2 days ▸ 1–2 hours          ← the figure set large, in the display face
```

The three stages are labelled in plain language, not jargon — a business reader
should understand "design in, tested component out" without reading JSON. The payoff
is the real measured number from the Agentic UI Builder work.

**The stages are nodes on one continuous trace**, terminating in the state badge.
The sequence is a real sequence, so drawing it as a connected run states something
true rather than decorating. The idiom is deliberately the same as `.role` in
Experience — a promotion and a build stage are both junctions on a shared trace —
so the hero borrows the page's own language instead of introducing a second one.
Horizontal from `48rem`, vertical below it, which is `.role` exactly.

An earlier version set the stages inline with `→` glyph separators and stacked the
badge beneath. It was replaced for two reasons: at 360px the row wrapped and left an
arrow at line-start pointing at nothing, and the badge floated free of the pipeline
it is the outcome of, leaving the causal claim undrawn.

**Hierarchy is the point of this section.** Every element here was previously set at
the same 13px mono, so the page's central argument read in the same voice as a date
stamp — and `1–2 hours`, the most persuasive fact on the site, was its smallest text.
The figure now sits at `--step-2` in the display face, matching the hero thesis line:
the thesis makes the claim, the figure proves it. Everything around it stays quiet,
so this is the only promoted element in the strip.

### 3 · Skills

Top skills, surfaced as a compact stack list of five: Agentic AI, React.js,
TypeScript, Test-driven development, Mentoring.

Below them, four groups. A chip earns its place only if a recruiter learns something
from it that the other chips do not already imply — which excludes table stakes
(an editor, a package manager, an editor's version control), anything that pulls
against the current positioning, and anything the five badges above already say.

| Group | Chips |
|---|---|
| Frontend | JavaScript (ES6+) · React · Angular · StencilJS · Redux · Zustand · Micro-frontends |
| UI & visualisation | Tailwind CSS · Material UI · shadcn/ui · D3.js · Highcharts · Figma |
| AI & agentic | Agentic UI generation · Claude Code · GitHub Copilot |
| Engineering practice | Docker · CI/CD · System architecture · Code review |

Twenty chips in four groups, laying out as a 2×2. This replaced an earlier
six-group, thirty-six-chip arrangement that the owner found hard to scan.

Three more chips came out later at the owner's request:

- `AI copilots & chatbots` and `AWS Bedrock` from AI & agentic. Both survive
  elsewhere on the page — Bedrock in the Agentic UI Builder stack line, copilots in
  the Wealth Advisor description — so the claims hold without the chips, and
  `AWS Bedrock` correctly stays in JSON-LD `knowsAbout`.
- `Jest` from Engineering practice. Unlike the other two this leaves no trace in the
  markup, since none of the three remaining works lists it in a stack. Testing is
  carried entirely by the `Test-driven development` featured badge now — which was
  always the stronger claim, the tool being the lesser half of it.
  **Reversed 2026-08-27:** `Jest` and `Vitest` are both back in Engineering
  practice, at the owner's request. The removal left the page's central claim —
  test-driven agentic UI generation — with no tool named anywhere on it, so a
  reader filtering on either name got no match on the one page built to make that
  claim. The badge is still the stronger half; it is no longer the only half.

Dropped on the rule above, across both passes: VS Code, FileZilla, npm/Yarn, JIRA,
Photoshop, WordPress, Bootstrap, Cross-browser, HTML, CSS, Python, WebSocket, Git,
Vite, Nginx, Postman, Agile, Cross-functional collaboration.

A third pass on 2026-08-27 read the owner's full résumé skill list back against the
page. Everything on it was already here, already on a drop list above, or already
carried by a stack line — except two. `LLM integration` was added: it is a distinct
capability from `Agentic UI generation` (wiring models into a product versus
generating the interface), and AI & agentic was the thinnest group on the page while
being the one closest to the positioning. `Prompt engineering` was not added — it
sits beneath both `Agentic AI` and `Agentic UI generation` and dilutes them.
`Jest` and `Vitest` followed on the owner's call (see the reversal note above);
`Vitest` is new to the page and did not appear on either earlier list.

That pass also added, on request: `Accessibility (WCAG 2.1)` to UI & visualisation,
and `API design` · `REST` · `GraphQL` to Engineering practice, kept adjacent so they
read as one competence. The drop list above still stands — do not repopulate it from
the résumé, which is a longer document with a different job.

**JSON-LD `knowsAbout` tracks the page, and drifted behind it during this pass.**
It is now resynced. If you add or remove a chip, update it in the same edit — an
entry that contradicts the visible page is worse than an absent one.

Dropped specifically as duplicates of the featured badges: **TypeScript**,
**Mentoring**, and **Agentic development**. `React` was the last remaining
exception — kept in Frontend because the group read oddly without it — and it went
on 2026-08-26 when the design review flagged the top row as duplicating the grid.
Nothing in the groups repeats a badge now. `Agentic UI generation` stays: it is a
narrower claim than the `Agentic AI` badge, not a restatement of it.

Data visualisation no longer stands alone. Its two chips (D3.js, Highcharts) moved
into UI & visualisation; the 3M signal survives in Selected work, which names the
stack directly.

### 4 · About — flat black, serif, generous measure

Tightened from the subject's own words. Covers: 12+ years building scalable web
applications and AI-driven interfaces with React, TypeScript, and D3.js;
specialisation in agentic AI-driven development workflows with a TDD approach,
accelerating delivery and reducing rework; work spanning AI-powered dashboards,
conversational interfaces, data visualisation, and reusable component architecture.

A fourth paragraph carries the current work: **Xyden**, an adaptive leadership
maturity assessment platform for senior executives — *"a six-month scope delivered
in two through an agentic UI pipeline."* This is the only place on the page that
says what the subject is doing right now, and it is the thesis proven at product
scale where the hero proves it at component scale (`1–2 days ▸ 1–2 hours`). The
six-month figure is the subject's own, from the project-list PDF.

An earlier wording — *"Currently building Xyden … delivered end to end in two
months"* — was replaced because it contradicted itself: building or delivered?
"Currently finishing" resolves the tense, and Xyden is genuinely in final testing.

The section closes with a single `.education` line: **B.Tech, Information
Technology · Arunai College of Engineering**. The degree passes HR screens and
supports the JSON-LD `alumniOf` claim, so it earns its line. The original included
a **75%** mark, dropped on 2026-08-03 — a degree percentage is a fresher's signal
that carries no weight at twelve years and only invites an unwinnable comparison.
Do not reinstate it.

### 5 · Experience

Grouped by employer. Dates in Plex Mono.

> **The role bullets below are stale — do not implement from them.** They still
> carry per-role durations, per-role client lines, and "Greater Chennai Area",
> none of which the page has. `CLAUDE.md` is authoritative. Kept only as a record
> of the original intake.

**Current shipped format.** The employer line carries type, total tenure, and
location (`Full-time · 4 Years 10 Months · Chennai, India`). Each role carries a
title, a **date range with no duration** (`Jun 2024 – Present`), and one note line.
The range implies the span and the employer line gives the total, so a per-role
duration only repeated what was already on screen twice.

Roles at one employer sit on a **single continuous left rule** with a lit node each,
echoing the hero circuit — a promotion is a junction on the same trace, not a new
trace. `.role + .role` uses `padding-top` rather than `margin-top` to achieve this;
margin would fall outside the border box and break the rule into stubs. The line
breaks between employers, which is the distinction worth drawing.

**Ongil.ai** — Full-time, 4 yrs 11 mos

- **Associate Staff Engineer** · Jun 2024 – Present · 2 yrs 2 mos
  Client: Vanguard.
- **Senior Software Engineer** · Sep 2021 – Jun 2024 · 2 yrs 10 mos · Chennai
  Clients: Capgemini, 3M.
  - Also: trained interns, led structured code reviews, and established coding
    guidelines — improving team code quality and accelerating onboarding.

**Gtect Systems** — 5 yrs 1 mo

- **Senior UI Developer** · Aug 2019 – Aug 2021 · 2 yrs 1 mo · Full-time
  Gathered requirements with BAs and developed use cases for key functionality.
- **UI Developer** · Aug 2016 – Aug 2019 · 3 yrs 1 mo · Greater Chennai Area
  Built mobile-first responsive websites with HTML, CSS, jQuery, and Bootstrap,
  with cross-browser compatibility.

**Asareri Technologies**

- **UI Developer** · May 2014 – Jul 2016 · 2 yrs 3 mos · Greater Chennai Area
  Built mobile-first responsive websites and converted PSD designs into
  pixel-perfect HTML/CSS.

**Education:** Arunai College of Engineering.

### 6 · Selected work

Three blocks, each with client, description, stack, and outcome.

| Project | Client | Stack | Outcome |
|---|---|---|---|
| Agentic UI Builder | Vanguard | React, Zustand, shadcn/ui, AWS Bedrock | Contributed to an agentic UI generation workflow producing production-ready components from structured inputs via TDD. Cut component development time from 1–2 days to 1–2 hours. |
| Wealth Advisor Dashboard with Copilot | Capgemini | React, Redux, Material UI, WebSocket | Dual-mode dashboard with an AI copilot for consumers and advisors — portfolio analysis, risk visualisation, appointment scheduling. Improved investor decision-making and streamlined advisor consultations. |
| Data Analytics Dashboards | 3M | React, Material UI, D3.js, Highcharts | High-performance interactive dashboards turning complex datasets into actionable business insight through advanced charting. |

Three works, three clients, three capabilities — agentic tooling, AI product UI,
and data visualisation. Nothing on the list repeats another entry's client or its
point. Agentic UI Builder leads because its outcome is the hero's headline metric.

This replaced an earlier six-block list. Dropped, and now living in the linked
project list instead:

- **Recurring Transactions** (Vanguard) — a second Vanguard entry, and the weakest
  outcome line on the page.
- **Figma to JSON Converter** (Vanguard) — a third Vanguard entry; the Agentic UI
  Builder block already tells the design-to-code story.
- **Xyden** — the only entry with no client and no link. About still says it is
  being built, which is where that belongs.

The section closes with **"Download the full project list · PDF"**, a
`.work__more` paragraph linking `Elavarasan_Projects_2026.pdf` — ten projects,
same-origin, `download`, no `target`. A Google Doc was considered and rejected:
the doc would have lived on an account the subject could lose, and a page whose
premise is that it still opens in ten years should not depend on one. The PDF
sits beside the résumé under the same rule — it must stay tracked in git.

`download` rather than in-tab navigation, because opening a PDF in the tab
replaces the page the reader came for. The label says "Download" because that is
what the control does.

`.work__more` mirrors the `.work + .work` separator — `margin-top` and
`padding-top` at `--space-4` over a `--line` hairline — so the link reads as the
tail of the list rather than a stray element. It is a **direct child of `.shell`**,
required by the rail grid at ≥64rem.

### 7 · Recognition

`hoc.jpeg` framed, with a subtle warm halo, alongside the citation.

**Hall of Fame for Craftpersonship and Collaboration** — Ongil.ai

Citation, quoted verbatim from the certificate: *"given for his technical excellence
and resilience in handling a complex integration effort spanning several hours
without break, collaborating with a team of engineers across Ongil and CapGemini."*

Signatories: Ajith Sahasranamam, CEO, Ongil.ai · Srinivasan Rengarajan, CTO, Ongil.ai.

The image needs descriptive alt text conveying the award name and the awarding
organisation, since the certificate carries real information.

### 8 · Contact

| Channel | Value |
|---|---|
| Email | elavarasan.infotech10@gmail.com |
| Phone | +91 8015515823 |
| LinkedIn | https://www.linkedin.com/in/elavarasanj/ |
| GitHub | https://github.com/Elavarasan-J |
| Résumé | `Elavarasan_Resume_2026.pdf` (same-origin, `download`) |

The résumé is a committed PDF download, at the subject's request — superseding an
earlier Figma link, which must not come back. Because the action *does* download,
it must say so: **"Download résumé"** in the hero, **"Download PDF · 2 MB"** in
Contact. The file size belongs in Contact, where every other row shows its real
destination; the hero stays terse.

Soft availability line, in the subject's own wording: *"Open to collaborating on
frontend architecture, scalable UI platforms, and AI-integrated product
experiences."* No "looking for work" language anywhere.

## Copy rules

- Active voice. Outcomes stated plainly, no selling.
- Every number on the page is one the subject supplied. No invented metrics.
- Site copy avoids third-person pronouns for the subject. The certificate citation is
  quoted verbatim and keeps the certificate's own wording.
- Sentence case throughout. Labels label; they don't editorialise.

## Technical approach

Three files in `frontend-design-sample/`:

| File | Responsibility |
|---|---|
| `index.html` | Semantic document. All content, all copy. Complete and readable with CSS and JS disabled. |
| `styles.css` | Tokens as custom properties, then layout, then components. Glow via layered CSS gradients and blurred SVG. |
| `main.js` | Three isolated concerns: tenure computation, the signature load sequence, the speck field. Presentation only. |

Existing assets, already in place: `elavarasan.jpeg` (200×200), `hoc.jpeg` (1280×904).

**CSS discipline:** a single spacing scale as custom properties, and section padding
owned by one `section` rule rather than per-section overrides, to avoid selector
specificity fights between type-based and element-based rules.

**Performance:** `hoc.jpeg` is 1280×904 and below the fold — lazy-loaded with
explicit `width`/`height` to prevent layout shift. The speck canvas caps its particle
count and stops animating when the tab is hidden or reduced motion is requested.

### Accessibility floor

- Responsive to 360px with no horizontal scroll at any width.
- Keyboard focus visible everywhere, ringed in `--glow`.
- `prefers-reduced-motion: reduce` fully honoured.
- Body text contrast at least 7:1 against `--void` (measures 18.53:1). Green text
  clears AA at every size it is used: `--signal` 11.98:1, `--signal-dim` 6.29:1.
- One `h1`, ordered headings, real landmarks, meaningful alt text.
- Phone and email as `tel:` and `mailto:` links.

## Verification

Playwright-driven browser assertions plus screenshot critique. No test framework is
added — the JS is presentation-only, so browser-level assertions cover what matters,
and the deliverable stays dependency-free.

Assertions:

1. The `h1` renders "Elavarasan J" and the hero meta line shows a tenure figure.
2. Tenure is computed from 2014-05 to the current date and rendered as
   `N yrs M mos` — asserted against the value derived from a fixed clock, so the
   test does not go stale.
3. The signature strip reaches its passing state after load.
4. With `prefers-reduced-motion: reduce` emulated, the passing state is present
   immediately and no animation runs.
5. Keyboard tabbing reaches every link, and focus is visibly styled.
6. No horizontal overflow at 360px, 768px, and 1440px.
7. Every external link points at the exact URLs listed above.
8. Browser console is free of errors.

Screenshots at 360px, 768px, and 1440px, reviewed against the art direction —
specifically that glow never sits behind prose, and that the headshot never exceeds
140px.

## Risks

| Risk | Mitigation |
|---|---|
| Black-and-green reads as a templated developer portfolio to a non-technical audience. | The green is justified by TDD state, the black is justified by the light source, and the distinction is carried by typography and restraint rather than by neon. Serif body copy and a single glowing moment are what separate it. |
| Serif body on pure black can shimmer. | Newsreader at 19px/450, kept off glowing backgrounds. Verified in screenshot review. |
| Glow and specks tip into a gaming aesthetic. | Both confined to the hero and signature. Content sections are flat black with no effects. |
| The 200×200 headshot looks soft if scaled. | Hard cap at 140px, enforced in CSS and checked in verification. |
