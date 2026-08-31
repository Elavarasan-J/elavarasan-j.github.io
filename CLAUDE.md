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
| `--signal` | `#00E24A` | Bright tier — state, claims, figures. The `PASS` badge, `.cta`, `.skills__top` pills, `.work__client`, `#tenure`, `.readout__now`, the flags. 11.98:1. |
| `--signal-dim` | `signal` at 72% on void → `#00A335` | Structural tier — labels and chrome. Section heads, `.skills__groups dt`, `.contact__key`, `.signature__label`. 6.29:1. |
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

**Two intensities, one hue.** The primary is still used **generously** — labels,
hairlines, chips, badges, key figures. The 2026-08 design review's complaint was
never that there was too much green; it was that at a single intensity nothing read
as *the* signal. So green stays everywhere it was, split across two tiers:
`--signal` for state, claims and figures; `--signal-dim` for structure and labels.

- **Never a third tier and never a second hue.** If something needs to stand out
  more, it moves up a tier — you do not mix a new value.
- When in doubt, more green on structure, none on prose.
- `--signal-dim` is derived from `--signal` with `color-mix`, not written as a
  literal. Change the primary and the dim tier follows.

## Typography

| Face | Role | Notes |
|---|---|---|
| **Space Grotesk** | Display — name, section heads, employer and work names, **role titles**, the five featured skill badges (`.skills__top`) | Mixed case. **Never uppercase.** The owner rejected uppercase display type. |
| **Newsreader** | Body serif — prose, role notes | 19px, weight 450 so strokes hold up on black. |
| **IBM Plex Mono** | Utility only — dates, durations, locations, stack, labels, badges, the group skill chips (`.chips`) | Uppercase here is correct and intentional, including the group skill chips. Never body copy. |

Loaded from Google Fonts with system fallbacks. Keep the fallbacks.

**`.role__title` is display, not serif.** It sat in the body serif until 2026-08
and was the page's one genuine typography break — every other name-level heading
is Space Grotesk. The design review read this as "Selected work switches to sans";
it was Experience that was the odd one out. Do not move it back.

**Three heading levels, and they stay three.** Employer and work names at
`--step-2`, role titles at `--step-1`, notes and prose at `--step-0`. At `≤34rem`
all three step down one notch, because the name itself steps down there and at
`--step-2` the item names sat within 10px of it. That media block lives **after**
the `.employer__name` / `.work__name` rules in `styles.css` — at equal specificity
the later rule wins, and placed in the hero's `34rem` block it silently did
nothing. Verified by measuring computed `font-size`, not by eye.

## The badge system — two shapes, and only two

The page carried four treatments for two ideas, which is most of why nothing read
as the signal. Consolidated 2026-08:

| Shape | Means | Filled | Outlined |
|---|---|---|---|
| Pill (`999px`) | a skill | `.skills__top` — the highlights tier | `.chips` — the group tier |
| Rect (`0`) | a state, or a primary action | `.state` on pass, `.cta` | `.state` pending, `.employer__flag`, `.work__flag`, `.contact__flag` |

- **Do not add a third shape.** A new badge picks one of these two and a fill.
- The flags run one size down (`0.2rem 0.5rem` vs `.state`'s `0.3rem 0.7rem`)
  because they sit inline inside a heading. Same family, not a third treatment.
- The two pill tiers also run at two sizes on purpose: `.skills__top` at
  `--step-1`, `.chips` at `0.75rem` — one step below the mono utility default so
  the four groups hold more skills per row. Do not "unify" them to one size; the
  size gap is what makes the top row read as highlights rather than a repeat.
- **The skill group heads carry no rule under them.** A hairline was tried on
  2026-08-26 and removed the same day on the owner's call. The `--space-5` row gap
  between groups and the dim tier on the head do that job.
- `.cta` is the filled rect: one per region at most. The hero has exactly one
  (the résumé) and Contact has exactly one (the mailto). Four equal buttons in the
  hero action row flattens it into a nav bar and says nothing about which matters.

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

> Alphas were pulled down on 2026-08 — traces `.22 → .13`, nodes `.5 → .3`, pulses
> `.95 → .8` — because at the old strength it competed with the content instead of
> sitting behind it. **Do not push them back up.** The review's other suggestion,
> redrawing the circuit as the Design → Spec → Component pipeline, was rejected:
> the signature strip directly beneath it already *is* that diagram, and two of
> them says the page could not decide.

> An earlier hero used an aurora glow rising from the bottom. **It was rejected. Do
> not reintroduce it.** The owner wants technology-literal imagery.

**The signature strip**: `design → structured spec → tested component`, resolving to
a lit `PASS`, with the real measured payoff `1–2 days ▸ 1–2 hours`.

The concept holding the whole page together: **green is the TDD passing state.** The
owner's specialism is test-driven agentic UI generation, so green means verified.
That's why the page is black and green rather than because dev portfolios are.

- `data-state` takes exactly two values: `pending` and `pass`.
- The failing state is **unlit muted**, not red. Do not add a red. This covers the
  stage labels, their nodes, and the badge — in `pending` all three sit at `--muted`
  with no glow.
- The markup ships `data-state="pass"`. JS demotes it to `pending` and replays the
  resolve **only** when motion is welcome. That's what makes no-JS and
  reduced-motion visitors see the finished state for free. Preserve this shape.
- **The stages are nodes on one continuous trace**, terminating in the state badge —
  the same idiom as `.role` in Experience, and deliberately so: it ties the hero to
  the page's other timeline instead of importing a second visual language. Vertical
  below `48rem`, horizontal above. Do **not** go back to inline `→` glyph separators;
  they wrapped at 360px and left an arrow at line-start pointing at nothing.
- **`.readout__now` is the one promoted figure on the page**, set in the display face
  at `--step-2` — the size of the hero thesis line. The thesis states the claim, this
  proves it. It stays below the name, which is the only thing at `--step-4`. Its
  `text-transform: none` is load-bearing: `.readout` inherits uppercase from the mono
  utility group, and the display face is never uppercase. Keep `1–2 days` small,
  muted and struck; the size contrast is the whole argument.
- `main.js` only ever touches `.signature` and its `dataset.state` — never the inner
  elements. Keep it that way and the strip's markup stays free to change.

## Motion

- One orchestrated load moment (the strip resolving) plus the ambient circuit.
  Don't add scroll animations, parallax, or hover flourishes.
- `prefers-reduced-motion: reduce` must render the final state immediately, freeze
  the circuit (traces and nodes, no pulses), and run no transitions.
- The circuit pauses on `visibilitychange` when the tab is hidden. Keep that.

## Durations — never hardcode a live one

Every still-running duration carries `data-since="YYYY-MM"` and is recomputed at
load by `renderDurations()`. Only two remain: the hero tenure (`2014-05`) and the
Ongil.ai employer line (`2021-09`).

**Individual roles carry a date range and no duration** — `Jun 2024 – Present`, not
`Jun 2024 – Present · 2 Years 2 Months`. The range already implies the span, the
employer line above already gives total tenure, and the role's job is to show *when
the promotion happened*. All five roles follow this; do not add a duration to one.

- Format is **full words**: `12 Years 2 Months`, `2 Years 1 Month`, `5 Years`.
- Convention is **elapsed** months, not LinkedIn's inclusive count — the page reads
  one month lower than LinkedIn for the same role. This is deliberate and approved.
- Career start is May 2014. That's the anchor for the hero tenure figure.
- The markup keeps a static fallback string for no-JS. Update it if you change
  format — **and check it is still current**. Both fallbacks were a month stale
  when found on 2026-08-26; JS visitors saw the right figure and no-JS visitors
  did not. Loading the page with JavaScript disabled is the only way this shows up.

## Content rules

- **Locations sit on the employer line**, not on individual roles:
  `Full-time · 4 Years 10 Months · Chennai, India`. Always "Chennai, India" — never
  "Greater Chennai Area".
- **The role trace is continuous within an employer.** `.role` draws a left rule
  with a lit node per role, echoing the hero circuit — each role is a junction on
  the same trace. `.role + .role` therefore uses `padding-top`, **not**
  `margin-top`: margin sits outside the border box and would break the rule into
  one stub per role, which reads as separate jobs rather than promotions. Roles at
  different employers aren't siblings, so the line breaks between companies — that
  break is meaningful, keep it.
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
- **About carries exactly one pull-quote** (`.prose .pull`), and it is a sentence
  *promoted out of* the paragraph above it, not new copy — the no-invented-facts
  rule covers pull-quotes too. It stays in the reading serif rather than switching
  face, because it is the owner's own line and not a quotation. Its measure is
  `38ch`: at `46ch` and `--step-2` it computed *wider* than the 62ch prose at
  `--step-0` and sat outside the reading column. A stat strip was considered and
  rejected — tenure and the `1–2 hours` figure already live in the hero, and
  repeating them there dilutes the one place they matter.
- **Contact carries a standing-state flag** (`Open to collaboration`) in the rect
  badge family. That is the soft signal — it is not "available for work" and must
  not become that. The sentence under it was rewritten so the badge is not just
  the sentence's first three words repeated.
- **A contact form is impossible here** — static, no backend, no dependencies. The
  mailto `.cta` is the honest version and is what the review's "button-style CTA"
  becomes on this page. Do not add a third-party form service.
- **The Skills top row is the highlights tier**, not a duplicate of the grid. Only
  `React` was ever an exact duplicate and it was dropped from the Frontend group.
  `Agentic UI generation` stays in the AI group: it is a narrower claim than the
  `Agentic AI` pill, and it is the group's most distinctive entry.
- **Client logo marks were rejected.** The clearance list covers naming these
  clients, not reproducing their trademarks. The green caps already carry the
  trust signal.
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
  soft. A genuinely larger, editorial portrait needs a **new source above 200×200**;
  ask the owner rather than scaling this file up.
- The portrait carries a **hairline frame in `--line`**, not the lit 2px ring and
  bloom it had until 2026-08 — at 120px those read as a webcam overlay. Do not
  restore the ring. Removing the frame *entirely* is also wrong: with no edge at
  all the source's pale office background reads as a grey disc pasted on black,
  which is why the radial mask was pulled in to `48% / 80%`. Both were found by
  looking at a screenshot, not by asserting.
- The certificate is lazy-loaded with intrinsic dimensions, capped at `30rem`, and
  sits on a **dark brass-tinted mat** (padding on the `img`, so no extra markup).
  It read as a pasted-in JPG on flat void before that. Its citation text is real
  markup in the `figcaption`, so nothing is locked inside the image — a lightbox
  was considered and rejected, since it would add non-presentational JS to show
  text the page already has.

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
