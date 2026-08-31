# Profile site — Elavarasan J

A single static page: the permanent professional presence for Elavarasan J, aimed at
recruiters, HR, and business readers. Not a job hunt — availability is a soft signal
only, never "looking for work" language.

Design record: `docs/design-spec.md`
Task breakdown: `docs/implementation-plan.md`

## Hard constraints

- **Exactly one HTML file: `index.html`.** This is a single-page site, and that is
  the page. A second `.html` file means the site has stopped being what it is —
  don't add one.
- **CSS and JS files are not rationed.** Split them however the work reads best;
  there is no file count to defend. Same for assets — images, PDFs, fonts, icons:
  add what the page needs.
- **Zero dependencies, no build step.** This is the constraint that actually
  matters, and it is not about the number of files. No `package.json`, no bundler,
  no framework, no CSS library, no CDN script. Everything ships as it is written,
  and the page still opens in ten years.
- Keep each file's job obvious from its name. `main.js` is the page's own
  behaviour (durations, the signature strip, the circuit); `scroll-effects.js` is
  the section rail and the scroll reveal, kept separate so the whole behaviour can
  be reviewed or dropped by deleting one `<script>` tag.
- **`index.html` must be complete and readable with CSS and JS disabled.** All
  content lives in the markup. JavaScript only enhances.
- **No invented facts.** Every number, date, client, and claim on this page came
  from the owner. If you need a fact that isn't here, ask — don't infer it.

## Palette

Use these exact values. Do not introduce a new hue — not a red, not a second accent.

| Token | Hex | Where it goes |
|---|---|---|
| `--void` | `#000000` | Page ground. True black. |
| `--moss` | `#0A2A16` | The signature panel ground, and nothing else. Spent 2026-08-31 on the one figure in the reading column. |
| `--signal` | `#00E24A` | Bright tier — state, claims, figures. The `PASS` badge, `.cta`, `.skills__top` pills, `.work__client`, `#tenure`, `.readout__now`, the flags, the **active** rail dot and its label. 11.98:1. |
| `--signal-dim` | `signal` at 72% on void → `#00A335` | Structural tier — labels and chrome. Section heads, `.skills__groups dt`, `.contact__key`, `.signature__label`, idle rail labels. 6.29:1. |
| `--glow` | `#7CFFA8` | Circuit pulses and focus rings **only**. |
| `--paper` | `#EAF3EC` | Body prose, headings, role notes. |
| `--muted` | `#8FA396` | Mono utility text: dates, durations, locations, stack. |
| `--brass` | `#C79A3C` | Recognition section **only** — the certificate is cream/gold. |
| `--line` | `signal` at 24% | All hairlines: the portrait frame, the pull rules, the work separators, the rail's trace. Green-tinted, not grey. **Not** between sections — see Layout invariants. |

**Rules that matter:**

- **Body prose is never green.** Paragraphs, role notes, and the About text stay
  `--paper`. Green on black is tiring to read and the prose is the part people read.
- `--glow` never appears outside the circuit pulses and `:focus-visible`.
- `--brass` never leaks outside `.award`.
- Content sections below the hero are flat `--void` — no gradients, no filters.
  The hero is the only place with atmosphere. **`.signature` is the one panel**
  (`--moss`, 2026-08-31): a section is not a figure, and that block is the only
  figure sitting inside the reading column. Flat colour only — no gradient, no
  border, no shadow. The ground changing is the whole signal; anything more makes
  it a card. Do not give a second block a background.

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
| **IBM Plex Mono** | Utility only — dates, durations, locations, stack, labels, badges, the group skill chips (`.chips`), and `.skills__aside-note` | Uppercase here is correct and intentional, including the group skill chips. Never body copy, with one carve-out below. |

Loaded from Google Fonts with system fallbacks. Keep the fallbacks.

**Mono carries exactly one sentence: `.skills__aside-note`.** The owner's call on
2026-08-31. It qualifies the label above it rather than being read as prose, and
at one short line the usual objection to mono body copy does not apply. Two things
keep it from becoming a licence for mono paragraphs:

- It stays **out of the mono utility selector group**, because that group forces
  uppercase and a whole sentence in caps shouts. Sentence case, deliberately.
- It sits one step below its head (`0.75rem` against `0.8125rem`) and in `--muted`
  against the head's `--signal-dim`, so the pair reads as label then caveat rather
  than as two labels.

Any other sentence on this page goes in the reading serif.

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
- The rail's dots are **not** a third badge shape. They are trace nodes, the same
  circle as `.role::before` and `.pipeline__stage::before`, which predate this rule
  — a node marks a position on a line, a badge labels a thing. Keep them distinct.
- The flags run one size down (`0.2rem 0.5rem` vs `.state`'s `0.3rem 0.7rem`)
  because they sit inline inside a heading. Same family, not a third treatment.
- The two pill tiers run at two sizes on purpose: `.skills__top` at `1rem`,
  `.chips` at `0.75rem` — one step below the mono utility default so the four
  groups hold more skills per row. **The rule is the gap, not the numbers.** Do
  not "unify" them to one size; the gap is what makes the top row read as
  highlights rather than a repeat.
- `.skills__top` came down from `--step-1` to `1rem` on 2026-08-31 to make room
  for more entries. The owner asked for "half" — taken as intent, not arithmetic:
  a literal 11px would put the highlights *below* the group chips and invert the
  tiers. Whatever this size becomes next, it stays above `.chips`.
- **The skill group heads carry no rule under them.** A hairline was tried on
  2026-08-26 and removed the same day on the owner's call. The `--space-5` row gap
  between groups and the dim tier on the head do that job.
- `.cta` is the filled rect: one per region at most. The hero has exactly one
  (the resume) and Contact has exactly one (the mailto). Four equal buttons in the
  hero action row flattens it into a nav bar and says nothing about which matters.
- **The hero's CTA leads its own row, with the three channels under it**, since
  2026-08-31. In one row it read as a fourth link that happened to be boxed;
  above them it is plainly the action, and the hero picks up some of the height
  it lost when the signature strip moved to About. The order is set in the
  **markup, not with flex `order`**, so the keyboard and the screen reader meet
  the button first too — tab order runs Download Resume, Email, LinkedIn, GitHub.
  The two rows are `--space-4` apart against the `--space-3` inside the channel
  row, so they read as two groups rather than one list.

## Icons

Added 2026-08-31. One inline `<svg class="sprite">` at the top of `<body>` holds
every `<symbol>`; each use is `<svg class="icon"><use href="#i-…"></svg>`.

- **Line icons on a 24 grid, stroke only, never fill.** They carry the same
  hairline weight as every rule on the page and take `currentColor`, so a mark
  is always the colour of the text beside it. A filled icon set would be the one
  solid illustrative thing on a page made of hairlines and type.
- **No icon font, no CDN, no SVG file.** The sprite costs no request and works
  with JS off, which is why it is a sprite and not eleven copies of each path.
- The sprite carries `width="0" height="0"` **as attributes**, not only in CSS —
  with CSS disabled it would otherwise reserve an SVG's default 300×150 and open
  a blank gap above the page.
- **Every use is `aria-hidden="true"` and keeps its text label.** No icon is ever
  the only way to know what a control does, and no accessible name is doubled.
  Nothing gets `tabindex`; `focusable="false"` is on the sprite for old IE-era
  behaviour.
- Sized in `em` and aligned with `vertical-align`, **not flex**. These sit inside
  links whose text must stay wrappable and an `inline-flex` link will not break —
  the email address is 31 characters and does break at 375px.
- The reset sets `svg { display: block }`, so `.icon` has to restate
  `inline-block`.
- Where they go: the three hero channels, the hero CTA, every Contact key, the
  Contact mailto CTA, and the project-list download. Links and actions only —
  **not** section heads, not decoration. If a new icon does not mark a control or
  a channel, it does not belong.
- The LinkedIn and GitHub marks are **generic line interpretations, not the
  companies' logos.** That keeps them consistent with the set and steers clear of
  reproducing trademarks — the same instinct as the rejected client logo marks,
  though that rule was about clients.

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
- **No rule between sections.** The full-bleed hairline on `.section` was removed
  on 2026-08-31 on the owner's call — a hard line across the page every screen.
  What separates sections now is `--space-6` top and bottom, which is 12rem of
  quiet between one and the next. Don't put the border back to "help" the rhythm;
  if sections read as running together, the fix is space.
- **Every top-level section carries an `id` and a `data-nav-label`.** That pair is
  what `scroll-effects.js` discovers — the rail and the reveal are generated from
  whatever matches `[id][data-nav-label]`, in document order, never from a list in
  the JS. Add a section with both attributes and it gets a dot and a reveal pass
  for free; omit them and it silently gets neither. The label is the visible text
  in the rail, so keep it short enough to sit in one line beside a dot.
- The hero is `Intro` in the rail, not "Hero" — the visitor is not reading a
  developer's section names.

## The hero

The hero is now the intro alone — portrait, name, thesis, action row — vertically
centred in `100svh`. The signature strip that used to fill its bottom half moved
into About on 2026-08-31; `justify-content` went from `space-between` to `center`
at the same time, because with one child there was nothing left to push against.
Keep `min-height`, not `height`: on a short viewport the box must grow rather than
clip its content against the hero's `overflow: clip`.

The circuit stays, and has history — read before changing.

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

## The signature strip — now in About

`design → structured spec → tested component`, resolving to a lit `PASS`, with the
real measured payoff `1–2 days ▸ 1–2 hours`. It sits in About directly under the
specialism paragraph, as the figure that illustrates it — **not** in the hero, and
not as a section of its own. It was the hero's bottom band until 2026-08-31.

Space sets it apart, not a border: `--space-5` above and below, and it is a direct
child of `.shell` rather than a child of `.prose`, because `.prose p` would repaint
its label and readout in `--paper`.

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
- **The panel costs contrast, and the label is where it shows.** Every ratio in
  the block is measured against `--moss`, not the void: stage labels 13.67:1,
  `.readout__now` 8.84:1, the `--muted` readout label and struck days 5.79:1 (down
  from 7.85 on the void), and `.signature__label` 5.28:1. That last one is why the
  label mixes its dim tier **against `--moss` rather than the void** — at 72% of
  the void it computed 4.63:1 and was the weakest thing in the block. It stays in
  the structural tier; promoting it to `--signal` was rejected because that tier
  belongs to state and figures, which here means the `PASS` badge and the
  `1–2 hours`. If the panel ever changes value, **re-measure all five** — and note
  `getComputedStyle` returns `color(srgb r g b)` with 0–1 floats for `color-mix`
  values and `rgb()` with 0–255 for literals. Feeding the first to a 0–255
  contrast formula reports a bogus 1.35:1.
- Darker mixes of `--moss` were measured and rejected: at 70% the panel reads
  1.20:1 against the void, which is too close to no panel at all to be worth
  doing. Full `--moss` is 1.36:1.
- **`.readout__now` is the one promoted figure on the page**, set in the display face
  at `--step-2` — the size of the hero thesis line. The hero thesis states the claim,
  this proves it, and it now does so from inside About. It stays below the name,
  which is the only thing at `--step-4`. Its
  `text-transform: none` is load-bearing: `.readout` inherits uppercase from the mono
  utility group, and the display face is never uppercase. Keep `1–2 days` small,
  muted and struck; the size contrast is the whole argument.
- `main.js` only ever touches `.signature` and its `dataset.state` — never the inner
  elements. Keep it that way and the strip's markup stays free to change.
- **The resolve waits until the strip is in view.** Below the fold, replaying it at
  load spends the page's one orchestrated moment on an empty screen. `playSignature`
  observes the strip and fires on first intersection; with no `IntersectionObserver`
  it fires at load as before, because a resolve nobody saw beats one stuck pending.
- The stat now appears in exactly two places: here, and the Agentic UI Builder
  outcome line in Selected work. Do not add a third.

## Motion

The "no scroll animations" rule was lifted on 2026-08-31 on the owner's call, and
replaced with a bounded one. Scroll reveal is now part of the page; parallax,
scroll-driven scrubbing and hover flourishes are still out.

- Three motions total, and that is the budget: the strip resolving, the ambient
  circuit, and the scroll reveal. Don't add a fourth.
- **The reveal is fade plus a 20px rise, 600ms, ease-out, staggered 70ms between
  siblings.** No bounce, no rotation, no scale. It animates `opacity` and
  `transform` only — never a property that costs layout or paint.
- **It plays once.** The observer unobserves on first reveal; scrolling back up a
  section must not replay it.
- **The hidden state is scoped to `.js-reveal` on `<html>`, set only from
  `scroll-effects.js`.** With the script absent, blocked, or motion unwelcome the
  rule never matches and everything is simply visible. Never put the hidden state
  in the markup or on a bare selector — that is one failed request away from a
  blank page.
- `prefers-reduced-motion: reduce` must render the final state immediately, freeze
  the circuit (traces and nodes, no pulses), disable snapping, skip the reveal
  entirely, and run no transitions.
- The circuit pauses on `visibilitychange` when the tab is hidden. Keep that.

## The section rail and soft snap

- **The rail is chrome, not content**, so `scroll-effects.js` builds it and the
  markup ships without it. Every label it shows is already a heading further down
  the page, so a visitor without JS loses nothing.
- It is **one more trace**: a hairline in `--line` with a lit node per section, the
  same idiom as `.role` and `.pipeline`. The active dot takes `--signal` with the
  same glow as `.role::before` — it means the same thing, so it looks the same.
  Don't restyle it into a generic widget.
- Desktop only, `≥900px`. Below that there is no room beside the content.
- **Idle dots are filled dim, with no ring** (2026-08-31). Once the labels are up
  the dots are the quiet half of the rail, and a 9px ring beside text read as busy.
- **The active dot scales, it does not resize.** `transform: scale(1.35)` — a
  width change would move every dot below it.
- The label is **absolutely positioned** off the dot. In flow it would widen the
  rail to fit "Selected work" and push every dot away from the edge.
- **Labels stay up only at `≥80rem`; below that they are hover- and focus-only.**
  This is a measured limit, not a preference. At 1024px the longest label crosses
  the reading column by 88px and even the single active one crosses it by 48px,
  because the rail has just claimed 14rem of the width; the collisions clear
  entirely at 1280. The dots themselves never collide at any width — only the
  labels do. **Re-measure before lowering this gate**, and measure the text, not
  the boxes: block elements span the whole column, so a box test reports
  collisions that are not there and misses none that are. Use `Range`
  `getClientRects()` over leaf text nodes, and require overlap on both axes.
- Idle labels sit at `--muted` (7.85:1), the active one at `--signal` (11.98:1),
  one step larger. Both clear the 7:1 floor.
- The active section is resolved by **measuring on each observer crossing**, not by
  taking the last element to intersect. Two sections sit in the band at a boundary,
  and near the foot of the page the last one may never reach it at all.
- The **scrollbar** is styled to the palette: track on `--void`, thumb at the
  primary mixed to 38%. Firefox takes `scrollbar-color`/`scrollbar-width`, WebKit
  and Blink need the `::-webkit-scrollbar-*` pseudo-elements, so both are
  declared. The thumb's transparent border plus `background-clip: padding-box` is
  what insets it — WebKit has no padding there.
- **Snap is `proximity`, never `mandatory`**, and only `#hero` and `#skills` carry
  an alignment. Everything else is taller than a laptop viewport. It is gated on
  height as well as width, in two bands, because Skills is not one height — see the
  measured table in `styles.css`. It peaks at 781px just above `64rem`, where the
  rail claims `14rem` and the chips reflow. **Re-measure before widening the gate**;
  a snap point you cannot rest on is a nudge in the wrong direction.

## Durations — never hardcode a live one

Every still-running duration carries `data-since="YYYY-MM"` and is recomputed at
load by `renderDurations()`. Only two remain: the hero tenure (`2014-05`) and the
Ongil.ai employer line (`2021-09`).

**Individual roles carry a date range and no duration** — `Jun 2024 – Present`, not
`Jun 2024 – Present · 2 Years 2 Months`. The range already implies the span, the
employer line above already gives total tenure, and the role's job is to show *when
the promotion happened*. All three roles follow this; do not add a duration to one.
The Early Career role carries no date range either — the years sit on the block's
own meta line, and repeating them on the single role beneath it says nothing.

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
  because it performs one: "Download Resume" in the hero, "Download PDF · 2 MB" in
  Contact. A **Figma** resume link was removed on request — do not add that back.
- **"Resume" is spelled without accents**, everywhere it appears as a label — the
  hero button, the Contact key. The owner asked for the plain word on 2026-08-31.
  The file name `Elavarasan_Resume_2026.pdf` already matched.
- Contact channels are email, phone, LinkedIn, GitHub, plus the résumé download.
- **The full project list is a second committed, same-origin PDF:**
  `Elavarasan_Projects_2026.pdf`, linked once from the end of Selected work as
  "Download the full project list · PDF". Same rules as the résumé — `download`,
  no `target`, must stay tracked in git. It holds ten projects, including the
  three on the page; keep it that way, since the label promises the *full* list.
  A Google Doc was considered and rejected: it would depend on an account the
  owner could lose. Do not swap this for a hosted-elsewhere link.
- **No school entries.** The degree line under About is the whole education story.
- **About runs in a fixed order**, and the middle item is a figure, not prose:
  1. intro paragraph (2014, React/TypeScript/D3)
  2. specialism paragraph (agentic, test-driven)
  3. the signature strip — the figure that illustrates 2
  4. "work spans" paragraph
  5. the education line

  The two prose runs are **separate `.prose` blocks** either side of the strip, so
  each stays a direct child of `.shell` and lands in column 2 of the rail grid.
- **The pull-quote is gone** (2026-08-31). It read "workflows that turn structured
  inputs into production-ready frontend components, held to a test-driven standard"
  — which is exactly what the process visual now shows, so the page was making the
  same claim twice, once in words and once in a diagram. Do not reinstate it
  alongside the strip. A stat strip was considered and rejected separately: tenure
  and the `1–2 hours` figure already have their one place each.
- **Contact carries a standing-state flag** (`Open to collaboration`) in the rect
  badge family. That is the soft signal — it is not "available for work" and must
  not become that. The sentence under it was rewritten so the badge is not just
  the sentence's first three words repeated.
- **A contact form is impossible here** — static, no backend, no dependencies. The
  mailto `.cta` is the honest version and is what the review's "button-style CTA"
  becomes on this page. Do not add a third-party form service.
- **Skills runs in three tiers, and each one is a weaker claim than the last:**
  1. `.skills__top` — the five filled pills. The highlights, not a duplicate of
     the grid. Only `React` was ever an exact duplicate and it was dropped from
     the Frontend group. `Agentic UI generation` stays in the AI group: it is a
     narrower claim than the `Agentic AI` pill, and the group's most distinctive
     entry.
  2. `.skills__groups` — the four categories. The working set.
  3. `.skills__aside` — "Hands-on experience". The rest of the stack, added
     2026-08-31: Python, PostgreSQL, FastAPI, PHP.

  The third tier's note — "Enough to collaborate across the stack, not to own
  it." — **is the point of that block**, not a caption. It is what stops four
  more chips from reading as four more things owned; if the block ever loses the
  note, it should lose the block. It is the owner's wording.

  It is set in **mono at `0.75rem` in `--muted`, sentence case** — see the
  carve-out in Typography. It ran as `--step-0` body serif for a few hours on
  2026-08-31 and the owner asked for the label's face, smaller: at 19px serif it
  was the largest thing in the section and pulled the eye straight to the
  weakest claim.
- Separated by `--space-5` and no rule, like the skill group heads. Its head is
  an `h3` in the mono utility group with `font-weight: 400` — an `h3` defaults to
  bold and the `dt` heads above it are not.
- **Client logo marks were rejected.** The clearance list covers naming these
  clients, not reproducing their trademarks. The green caps already carry the
  trust signal.
- Xyden has **no public URL** — describe it, never link to the product. As of
  2026-08-31 it is **off the page entirely**: its About paragraph came out to make
  room for the process visual, on the owner's call that it was the weakest,
  least-proven claim in the section. It lives in the project-list PDF only, which
  *does* describe it in depth and names its client, Xqtiv — the owner cleared that
  on 2026-08-03. If it is ever restored to Selected work, it carries an "In
  progress" badge and no link. "Not public" means "no link to a live product", not
  "do not mention".
- **Selected work holds exactly three blocks**, chosen for breadth: one per client
  (Vanguard, Capgemini, 3M) and one per capability (agentic tooling, AI product UI,
  data visualisation). Agentic UI Builder leads because its outcome is the hero's
  headline figure. The rest of the work lives behind the "See all projects" link at
  the end of the section. Adding a fourth block means dropping one — keep it at three.
- **Experience holds exactly two blocks**: Ongil.ai with its two roles, then a
  single `Early Career` block covering Gtect Systems and Asareri Technologies as
  `UI Developer → Senior UI Developer`, `2014–2021`. Collapsed from three employers
  and five roles on 2026-08-31 — the early years were four role entries of
  diminishing relevance, and the weight belongs on the Ongil.ai years. It is still
  a plain `.employer` / `.role` pair, so the trace idiom and every spacing rule
  hold unchanged. **Its meta line carries no location**, deliberately: two cities'
  worth of employers on one line is a list, not a location. That is the one
  exception to the locations rule above, and it is the owner's call.
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

**The MCP config blocks the `file:` protocol.** Serve the folder — and serve it
`no-store`, or you will spend a while testing a cached stylesheet and believing the
page is broken:

```python
# scratch file, then run it in the background
import http.server, os
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()
os.chdir('/path/to/this/folder')
http.server.ThreadingHTTPServer(('127.0.0.1', 8766), H).serve_forever()
```

Two traps that cost time on 2026-08-31: `pkill -f "http.server"` matches the shell
running it and kills your own command, and `page.goto` to a URL you have already
visited restores the previous scroll position — which looks exactly like elements
revealing before they should.

Stop the server when done, and delete the `.playwright-mcp/` artifact directory it
drops in this folder — it should never be committed.

`main.js` exposes its pure functions on `window.__profile` as a test seam:
`monthsBetween`, `formatTenure`, `tenureAt`, `renderDurations`, `shouldAnimate`,
`traceCount`, `buildTraces`, `seeded`, plus `CAREER_START`, `RESOLVE_DELAY_MS`, and
`TRACE_CAP`. Assert against these rather than scraping rendered text where you can.

`scroll-effects.js` exposes `window.__scrollEffects`: `sections`, `BAND`,
`REVEAL_GROUPS`, `REVEAL_STEP_MS`, `REVEAL_MAX_STEPS`, and `resolveActive`.

Note `innerText` applies `text-transform`, so most of this page's labels come back
uppercase. Match case-insensitively or you will "lose" text that is present.

**Check these after any visual change:**

1. No horizontal overflow at 360, 768, 1440. Measure the text's own client rects,
   not just `scrollWidth` — the hero has `overflow: clip` and it once masked a
   clipped name that the naive check passed.
2. `getComputedStyle` mid-transition returns the animating value, not the target.
   Wait for transitions to settle before asserting colours or opacity.
3. Section heads still fit the rail with no overlaps.
4. Prose and role notes still `rgb(234, 243, 236)`; no brass outside `.award`.
5. Reduced motion: strip is `pass` immediately, circuit frozen, transitions at `0s`,
   no `.js-reveal` class, `scroll-snap-type: none`, nothing below full opacity.
6. Console clean. Every link reachable by keyboard with a visible ring.
7. **Scroll the whole page and assert nothing is left hidden.** The reveal's failure
   mode is invisible content, not a visible glitch. A negative bottom `rootMargin`
   was rejected for exactly this reason: the footer's own bottom padding holds the
   last elements above a trimmed root, so they would never reach their trigger.
8. **Snapping must never be enabled on a section that overflows the viewport.**
   Check `#hero` and `#skills` against `innerHeight` at 900×900, 1024×768, 1024×800,
   1366×768 and 1280×800 — 1024×768 is the case that catches a gate set too low.
9. With JavaScript disabled: every section present, both duration fallbacks current,
   the strip on `pass`, no rail, and nothing at less than full opacity.
10. Take screenshots and actually look at them. Every real defect in this page was
   found by looking, not by asserting.
