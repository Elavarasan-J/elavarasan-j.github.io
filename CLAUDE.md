# Profile site — Elavarasan J

A single static page: the permanent professional presence for Elavarasan J, aimed at
recruiters, HR, and business readers. Not a job hunt — availability is a soft signal
only, never "looking for work" language.

Design record: `docs/design-spec.md`
Task breakdown: `docs/implementation-plan.md`

## Hard constraints

- **Three files, zero dependencies, no build step:** `index.html`, `styles.css`,
  `main.js`. Do not add `package.json`, a bundler, a framework, or a CSS library.
  The whole point is that this page still opens in ten years.
- **`index.html` must be complete and readable with CSS and JS disabled.** All
  content lives in the markup. JavaScript only enhances.
- **No invented facts.** Every number, date, client, and claim on this page came
  from the owner. If you need a fact that isn't here, ask — don't infer it.

## Palette

Use these exact values. Do not introduce a new hue — not a red, not a second accent.

| Token | Hex | Where it goes |
|---|---|---|
| `--void` | `#000000` | Page ground. True black. |
| `--moss` | `#0A2A16` | Reserved deep green. Currently unused; available for depth. |
| `--signal` | `#00E24A` | The primary. Structure, state, labels, borders, chips. |
| `--glow` | `#7CFFA8` | Circuit pulses and focus rings **only**. |
| `--paper` | `#EAF3EC` | Body prose, headings, role notes. |
| `--muted` | `#8FA396` | Mono utility text: dates, durations, locations, stack. |
| `--brass` | `#C79A3C` | Recognition section **only** — the certificate is cream/gold. |
| `--line` | `signal` at 24% | All hairlines. Green-tinted, not grey. |

**Rules that matter:**

- **Body prose is never green.** Paragraphs, role notes, and the About text stay
  `--paper`. Green on black is tiring to read and the prose is the part people read.
- `--glow` never appears outside the circuit pulses and `:focus-visible`.
- `--brass` never leaks outside `.award`.
- Content sections below the hero are flat `--void` — no gradients, no filters.
  The hero is the only place with atmosphere.

The owner likes the primary used **generously** — labels, hairlines, chips, badges,
key figures. When in doubt, more green on structure, none on prose.

## Typography

| Face | Role | Notes |
|---|---|---|
| **Space Grotesk** | Display — name, section heads, employer and work names, the five featured skill badges (`.skills__top`) | Mixed case. **Never uppercase.** The owner rejected uppercase display type. |
| **Newsreader** | Body serif — prose, role notes | 19px, weight 450 so strokes hold up on black. |
| **IBM Plex Mono** | Utility only — dates, durations, locations, stack, labels, badges, the group skill chips (`.chips`) | Uppercase here is correct and intentional, including the group skill chips. Never body copy. |

Loaded from Google Fonts with system fallbacks. Keep the fallbacks.

## Layout invariants

- **`.section` is the sole owner of section vertical padding.** Never add
  `padding-block` / `padding-top` / `padding-bottom` to a section, `.award`, or
  `.contact`. This exists to stop specificity fights between class and element
  selectors.
- `.shell` constrains width and gutters. Section content goes inside it.
- **At ≥64rem the section head moves into a sticky left rail** (`14rem`), and every
  other direct child of `.shell` goes to column 2. If you add a new top-level block
  to a section, make it a **direct child of `.shell`** or it will break the grid.
- Section heads are sized down to `--step-1` in the rail — they must fit `14rem` or
  they overlap the content. Check this if you rename a section.
- Prose is capped at `--measure` (62ch). Don't let paragraphs run the full column.

## The hero

Two parts, and both have history — read before changing.

**The circuit** (`#circuit` canvas, drawn in `main.js`): orthogonal green traces on a
coarse grid with glowing pulses travelling along them. Generated from a **seeded**
LCG, not `Math.random`, so the static render is byte-reproducible — this is what
makes the reduced-motion screenshot test possible. Keep it seeded. Masked to fade
out toward the top so the name stays on near-flat black.

> An earlier hero used an aurora glow rising from the bottom. **It was rejected. Do
> not reintroduce it.** The owner wants technology-literal imagery.

**The signature strip**: `design → structured spec → tested component`, resolving to
a lit `PASS`, with the real measured payoff `1–2 days ▸ 1–2 hours`.

The concept holding the whole page together: **green is the TDD passing state.** The
owner's specialism is test-driven agentic UI generation, so green means verified.
That's why the page is black and green rather than because dev portfolios are.

- `data-state` takes exactly two values: `pending` and `pass`.
- The failing state is **unlit muted**, not red. Do not add a red.
- The markup ships `data-state="pass"`. JS demotes it to `pending` and replays the
  resolve **only** when motion is welcome. That's what makes no-JS and
  reduced-motion visitors see the finished state for free. Preserve this shape.

## Motion

- One orchestrated load moment (the strip resolving) plus the ambient circuit.
  Don't add scroll animations, parallax, or hover flourishes.
- `prefers-reduced-motion: reduce` must render the final state immediately, freeze
  the circuit (traces and nodes, no pulses), and run no transitions.
- The circuit pauses on `visibilitychange` when the tab is hidden. Keep that.

## Durations — never hardcode a live one

Every still-running duration carries `data-since="YYYY-MM"` and is recomputed at
load by `renderDurations()`. Closed roles keep fixed figures in the markup.

- Format is **full words**: `12 Years 2 Months`, `2 Years 1 Month`, `5 Years`.
- Convention is **elapsed** months, not LinkedIn's inclusive count — the page reads
  one month lower than LinkedIn for the same role. This is deliberate and approved.
- Career start is May 2014. That's the anchor for the hero tenure figure.
- The markup keeps a static fallback string for no-JS. Update it if you change format.

## Content rules

- **Locations sit on the employer line**, not on individual roles:
  `Full-time · 4 Years 10 Months · Chennai, India`. Always "Chennai, India" — never
  "Greater Chennai Area".
- **No client lines under the Ongil.ai roles.** Clients are named per project in
  Selected work instead. Cleared to name publicly: Vanguard, Capgemini, 3M,
  Xqtiv, Synapse Green, IIT Madras, and Ongil. The last four appear only in the
  project-list PDF, not on the page. Anything not on this list needs the owner's
  say-so before it goes anywhere public.
- **The résumé is a committed, same-origin PDF:** `Elavarasan_Resume_2026.pdf`,
  linked from the hero actions and Contact. Both links carry `download` and no
  `target` — it is same-origin, so the external-link rule does not apply. The file
  must stay tracked in git or the link 404s on Pages. The label promises a download
  because it performs one: "Download résumé" in the hero, "Download PDF · 2 MB" in
  Contact. A **Figma** résumé link was removed on request — do not add that back.
- Contact channels are email, phone, LinkedIn, GitHub, plus the résumé download.
- **The full project list is a second committed, same-origin PDF:**
  `Elavarasan_Projects_2026.pdf`, linked once from the end of Selected work as
  "Download the full project list · PDF". Same rules as the résumé — `download`,
  no `target`, must stay tracked in git. It holds ten projects, including the
  three on the page; keep it that way, since the label promises the *full* list.
  A Google Doc was considered and rejected: it would depend on an account the
  owner could lose. Do not swap this for a hosted-elsewhere link.
- **No school entries.** The degree line under About is the whole education story.
- Xyden has **no public URL** — describe it, never link to the product. It no
  longer has its own Selected work block; the About paragraph is where it lives on
  the page. If it is ever restored to Selected work, it carries an "In progress"
  badge and no link. Note the project-list PDF *does* describe it in depth and
  names its client, Xqtiv — the owner cleared that on 2026-08-03. "Not public"
  now means "no link to a live product", not "do not mention".
- **Selected work holds exactly three blocks**, chosen for breadth: one per client
  (Vanguard, Capgemini, 3M) and one per capability (agentic tooling, AI product UI,
  data visualisation). Agentic UI Builder leads because its outcome is the hero's
  headline figure. The rest of the work lives behind the "See all projects" link at
  the end of the section. Adding a fourth block means dropping one — keep it at three.
- Every role carries a one-line description. Keep that consistent if you add one.
- External links open in a new tab with `rel="noopener"`. `mailto:`, `tel:`, the
  in-page skip link, and the same-origin résumé PDF deliberately do **not** — a new
  tab breaks the first three, and the résumé isn't external.
- The served résumé PDF is known to disagree with the page on three points: job
  title, tenure, and the Asareri Technologies role title. The page is correct and
  authoritative; the résumé is pending an update from the owner. Do not "reconcile"
  the page down to the résumé.

## Copy

- Active voice, sentence case, plain verbs. State outcomes; don't sell them.
- **Avoid third-person pronouns for the owner.** The certificate citation is the one
  exception: it's quoted verbatim and keeps the certificate's own wording.
- Labels label. Nothing does double duty.
- A control names what happens: the label on the action matches the result.

## Accessibility floor

Non-negotiable, and all of it is verified:

- Responsive to 360px with **no horizontal scroll at any width**.
- Visible keyboard focus everywhere, ringed in `--glow`.
- Body text contrast ≥ 7:1 against the ground (currently 18.5:1).
- One `h1`, headings in order, real landmarks, meaningful alt text.
- The headshot source is only 200×200 — **never render it above 140px** or it goes
  soft. The certificate is lazy-loaded with intrinsic dimensions.

## Verifying changes

There is no test framework, by design — the JS is presentation-only, so browser
assertions cover what matters.

**The MCP config blocks the `file:` protocol.** Serve the folder:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
# then drive http://127.0.0.1:8765/index.html with the Playwright MCP tools
```

Stop the server when done, and delete the `.playwright-mcp/` artifact directory it
drops in this folder — it should never be committed.

`main.js` exposes its pure functions on `window.__profile` as a test seam:
`monthsBetween`, `formatTenure`, `tenureAt`, `renderDurations`, `shouldAnimate`,
`traceCount`, `buildTraces`, `seeded`, plus `CAREER_START`, `RESOLVE_DELAY_MS`, and
`TRACE_CAP`. Assert against these rather than scraping rendered text where you can.

**Check these after any visual change:**

1. No horizontal overflow at 360, 768, 1440. Measure the text's own client rects,
   not just `scrollWidth` — the hero has `overflow: clip` and it once masked a
   clipped name that the naive check passed.
2. `getComputedStyle` mid-transition returns the animating value, not the target.
   Wait for transitions to settle before asserting colours or opacity.
3. Section heads still fit the rail with no overlaps.
4. Prose and role notes still `rgb(234, 243, 236)`; no brass outside `.award`.
5. Reduced motion: strip is `pass` immediately, circuit frozen, transitions at `0s`.
6. Console clean. Every link reachable by keyboard with a visible ring.
7. Take screenshots and actually look at them. Every real defect in this page was
   found by looking, not by asserting.
