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
| `--signal` | `#00E24A` | Luminous green. Filaments, pass state, links, structural accents. |
| `--glow` | `#7CFFA8` | White-hot core of the light. Focus rings. |
| `--paper` | `#EAF3EC` | Body text. |
| `--muted` | `#8FA396` | Secondary text, dates, meta. |
| `--brass` | `#C79A3C` | Recognition section only. |

**Rules:**

- Body prose is always `--paper`, never green. Green text on black is fatiguing and
  the About section is meant to be read.
- `--glow` is reserved for the signature moment and focus rings. Nowhere else.
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

Inline contact actions: email, LinkedIn, GitHub, resume.

Sparse drifting specks over the whole hero.

### 2 · Signature — the passing build

Anchored to the bottom of the first viewport, glowing upward. This is the one bold
element on the page; everything below it is quiet.

```
design ──▶ structured spec ──▶ component            ✓ PASS
component build time            1–2 days ▸ 1–2 hours
```

The three stages are labelled in plain language, not jargon — a business reader
should understand "design in, tested component out" without reading JSON. The payoff
is the real measured number from the Agentic UI Builder work.

### 3 · About — flat black, serif, generous measure

Tightened from the subject's own words. Covers: 12+ years building scalable web
applications and AI-driven interfaces with React, TypeScript, and D3.js;
specialisation in agentic AI-driven development workflows with a TDD approach,
accelerating delivery and reducing rework; work spanning AI-powered dashboards,
conversational interfaces, data visualisation, and reusable component architecture.

### 4 · Experience

Grouped by employer. Each role shows title, dates, duration, location, and a single
compact line naming the clients served in that role — full project detail lives in
Selected work, so Experience stays skimmable. Dates and durations in Plex Mono.
Client names are used openly (confirmed by the subject; they are already public on
their LinkedIn).

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

### 5 · Selected work

Six blocks, each with client, description, stack, and outcome.

| Project | Client | Stack | Outcome |
|---|---|---|---|
| Recurring Transactions | Vanguard | StencilJS, TypeScript, Jest, Agentic UI Builder | Modernised a micro-frontend app for automated investment and withdrawal plans, integrating an AI chatbot to increase client self-service. Improved performance and usability. |
| Agentic UI Builder | Vanguard | React, Zustand, shadcn/ui, AWS Bedrock | Contributed to an agentic UI generation workflow producing production-ready components from structured inputs via TDD. Cut component development time from 1–2 days to 1–2 hours. |
| Figma to JSON Converter | Vanguard | JavaScript, Tailwind CSS, HTML, CSS | Design extraction tool converting Figma files into structured JSON with full component metadata. Replaced manual design interpretation with an automated design-to-code pipeline. |
| Wealth Advisor Dashboard with Copilot | Capgemini | React, Redux, Material UI, WebSocket | Dual-mode dashboard with an AI copilot for consumers and advisors — portfolio analysis, risk visualisation, appointment scheduling. Improved investor decision-making and streamlined advisor consultations. |
| Data Analytics Dashboards | 3M | React, Material UI, D3.js, Highcharts | High-performance interactive dashboards turning complex datasets into actionable business insight through advanced charting. |
| Xyden | — | Agentic UI pipeline | Adaptive leadership maturity assessment platform for senior executives, delivered end-to-end in 2 months. **In progress, not public — described with no link.** |

Top skills, surfaced as a compact stack list: Agentic AI, Mentoring, React.js,
TypeScript, Zustand, Test-Driven Development.

### 6 · Recognition

`hoc.jpeg` framed, with a subtle warm halo, alongside the citation.

**Hall of Fame for Craftpersonship and Collaboration** — Ongil.ai

Citation, quoted verbatim from the certificate: *"given for his technical excellence
and resilience in handling a complex integration effort spanning several hours
without break, collaborating with a team of engineers across Ongil and CapGemini."*

Signatories: Ajith Sahasranamam, CEO, Ongil.ai · Srinivasan Rengarajan, CTO, Ongil.ai.

The image needs descriptive alt text conveying the award name and the awarding
organisation, since the certificate carries real information.

### 7 · Contact

| Channel | Value |
|---|---|
| Email | elavarasan.infotech10@gmail.com |
| Phone | +91 8015515823 |
| LinkedIn | https://www.linkedin.com/in/elavarasanj/ |
| GitHub | https://github.com/Elavarasan-J |
| Résumé | https://www.figma.com/design/ohYIUOGxrrnRZlZihTa7IW/Ela-Resume-v1?t=hBJfygOzq2f4hoAe-0 |

The résumé is a Figma link, not a PDF download, at the subject's request. The action
is labelled **"View résumé"** — it opens Figma, so it must not promise a download.

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
- Body text contrast at least 7:1 against `--void`; `--signal` used for text only at
  large sizes where it clears 4.5:1.
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
