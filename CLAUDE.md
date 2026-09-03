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
  behaviour (durations, the process run, the circuit); `scroll-effects.js` is
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
| `--panel` | `signal` at 8% on void | The `.payoff` panel ground, and nothing else. Replaced a flat `--moss` `#0A2A16` slab on 2026-09-02; the token went with it. **8% is a measured ceiling** — see the panel rule below. |
| `--signal` | `#00E24A` | Bright tier — state, claims, figures. The `PASS` badge, `.cta`, `.skills__top` pills, `.work__client`, `#tenure`, `.readout__now`, the flags, the **active** rail dot and its label. 11.98:1. |
| `--signal-dim` | `signal` at 72% on void → `#00A335` | Structural tier — labels and chrome. Section heads, `.skills__groups dt`, `.contact__key`, `.payoff__label`, `.pipeline__index` when done, idle rail labels. 6.29:1. |
| `--glow` | `#7CFFA8` | Circuit pulses and focus rings **only**. |
| `--paper` | `#EAF3EC` | Body prose, headings, role notes. |
| `--muted` | `#8FA396` | Mono utility text: dates, durations, locations, stack. |
| `--brass` | `#C79A3C` | Recognition section **only** — the certificate is cream/gold. |
| `--line` | `signal` at 24% | All hairlines: the portrait frame, the pull rules, the work separators, the rail's trace, the panel frame and its internal divider. Green-tinted, not grey. **Not** between sections — see Layout invariants. |

**One hairline carries state, and only one.** The pipeline trace runs `--line`
where the run has not reached and lights to `--signal-dim` behind each passed
stage (2026-09-02). It is the structural tier because a trace is structure — the
lit nodes and the `PASS` badge are what sit in `--signal`. Every other hairline on
the page stays `--line` at all times; if a second one ever wants to light, that is
a sign something is being decorated rather than stated.

**Rules that matter:**

- **Body prose is never green.** Paragraphs, role notes, and the About text stay
  `--paper`. Green on black is tiring to read and the prose is the part people read.
- `--glow` never appears outside the circuit pulses and `:focus-visible`.
- `--brass` never leaks outside `.award`.
- Content sections below the hero are flat `--void` — no gradients, no filters.
  The hero is the only place with atmosphere. **`.payoff` is the one panel**,
  and it holds only the measured number: a section is not a figure, so once the
  process run got a section of its own the frame had nothing left to mark except
  the figure inside it. Do not give a second block a background or a frame — and
  in particular the process stages sit on flat `--void`, not in a panel.
- **The panel is a hairline frame over a drawn substrate, not a colour fill**
  (2026-09-02, on the owner's call that the old ground was wrong and then that
  the frame alone read as plain). The `--moss` slab it replaces marked the figure
  by changing the ground, which made it the one filled, soft-edged thing on a
  page whose whole material is hairlines and type, and it dropped every ratio
  inside it. What marks it now is that material: a 1px `--line` frame — the same
  weight as the portrait frame and the role trace — over `--panel` carrying two
  grids. **Still no shadow**: the frame is an edge, not a lift, and a shadow is
  what would make it a card.
- **The substrate runs on the circuit's own 68px pitch**, major at 68 and minor
  at 68/4, which is what makes the panel read as a slice of the same board the
  hero draws its traces on rather than a box with a texture in it. The pitch is
  the echo and is deliberately the number in `GRID` in `main.js` — if you change
  one, change both. The **phase** is not shared and does not need to be: the
  canvas is anchored to the viewport, the panel's grid to the panel.
- **Every line in the substrate is drawn in `--void`, never in the primary.**
  This is the rule that makes a repeating pattern safe here: the pattern is
  subtractive, so it can only make the ground *darker* than the flat value
  `--panel` was measured at, which means the whole block has one provable
  worst-case background. A lit pattern cannot offer that — a node bright enough
  to see lands behind a glyph eventually, and there is no phase that reliably
  misses text (measured: `--muted` over a node at `signal` 16% falls to 5.63:1,
  and one landed inside "Component build time" in the render that proved it).
  A photographic or raster background was not tried: it would put hues on the
  page that the palette does not have and make the ratios below unpredictable.
- **The ground is capped at 9%, and sits at 8%.** `--muted` on it computes
  7.20:1 and crosses under the page's 7:1 floor between 9% and 10%. It went up
  from 5% when the grid arrived, because lines drawn in the void need something
  to subtract from. **Re-measure the four ratios in the panel before moving it**
  — `.payoff__label`, `.readout__label`, `.readout__was`, `.readout__now`. There
  used to be five; the stage labels left the panel with the section split.

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
| **Space Grotesk** | Display — name, section heads, employer and work names, **role titles**, process stage names (`.pipeline__name`), the five featured skill badges (`.skills__top`) | Mixed case. **Never uppercase.** The owner rejected uppercase display type. |
| **Newsreader** | Body serif — prose, role notes, process stage explanations (`.pipeline__note`) | 19px, weight 450 so strokes hold up on black. `.pipeline__note` is the one serif run set smaller, at `0.9375rem`, because it sits in a 148px column. |
| **IBM Plex Mono** | Utility only — dates, durations, locations, stack, labels, badges, the group skill chips (`.chips`), and `.skills__aside-note` | Uppercase here is correct and intentional, including the group skill chips. Never body copy, with one carve-out below. |

Loaded from Google Fonts with system fallbacks. Keep the fallbacks.

**`.pipeline__sources` is a label list, not prose.** `Spec .md · Design doc ·
Image` sits at `0.75rem` in `--muted` under the first pipeline stage — the same
label-then-qualifier pairing as `.skills__aside-note` and the same sizes. It
**keeps** the mono group's uppercase, unlike that note, because it is three input
kinds listed rather than a sentence. 7.85:1 on the void.

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
`--step-2`, role titles at `--step-1`, notes and prose at `--step-0`. The process
stage names sit **below** all three, at `1rem` — they are five names read across a
band, and at `--step-0` they would be a row of headlines competing with the
section's own head. That is a size below the scale, not a fourth level in it. At `≤34rem`
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
  it lost when the process run moved out of it. The order is set in the
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
- **One section spans both columns, and only one: `#process`.** `.section--band`
  gives its diagram `grid-column: 1 / -1`, because five stages read across need the
  whole shell and column 2 is 704px at its widest. The head stays in the rail; the
  lead paragraph stays in column 2; the band starts on the row below. See the
  Process section for the measurements and for why the sticky head is still safe.
  **Do not reach for this for a second section** — prose belongs in column 2, and a
  page of full-width bands has no spine.
- Section heads are sized down to `--step-1` in the rail — they must fit `14rem` or
  they overlap the content. Check this if you rename a section. Process's head is
  the one that wraps to two lines there, deliberately: it is the only section that
  is an argument rather than a résumé category, and "How a component gets built"
  says what the section is in the way a one-word noun cannot.
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
  developer's section names. Process's rail label is `Process` while its head is
  the full title: `data-nav-label` and `.section__head` are separate on purpose,
  and the rail needs a label that fits one line beside a dot.
- **Section order: Intro, Skills, About, Process, Experience, Selected work,
  Recognition, Contact.** Process sits directly after About because About's
  specialism paragraph makes the claim and Process shows the mechanism; moving it
  after Selected work was considered and rejected as burying the page's most
  distinctive content behind two conventional résumé sections.

## The hero

The hero is now the intro alone — portrait, name, thesis, action row — vertically
centred in `100svh`. The process run that used to fill its bottom half moved into
About on 2026-08-31 and into its own section on 2026-09-03; `justify-content` went
from `space-between` to `center` at the first of those moves,
because with one child there was nothing left to push against.
Keep `min-height`, not `height`: on a short viewport the box must grow rather than
clip its content against the hero's `overflow: clip`.

**The intro assembles itself at load**, since 2026-09-02 — portrait, meta, name,
thesis, actions, 70ms apart. This is the scroll reveal, not a new animation: the
hero was the one section the reveal skipped, and `.hero__top > *` is simply the
first entry in `REVEAL_GROUPS`. Because the hero is in view at load, the observer
fires on the first frame, so "reveal on scroll" and "animate on load" are the same
mechanism pointed at the top of the page. Keep it that way — the motion budget
holds at three only because this reuses one of them. No-JS and reduced-motion
visitors still get the finished hero immediately, for the same reason every other
section does.

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
> the Process section already *is* that diagram, and two of them says the page
> could not decide. That holds more strongly now the diagram is a titled section
> two screens down rather than a strip inside the hero.

> An earlier hero used an aurora glow rising from the bottom. **It was rejected. Do
> not reintroduce it.** The owner wants technology-literal imagery.

## The Process section

`Requirements → Behaviour spec → Tests written → Implementation → Tested component`,
five nodes on one trace terminating in a lit `PASS`, with the real measured payoff
`1–2 days ▸ 1–2 hours` in the panel beneath it.

**It is its own section, `#process`, since 2026-09-03**, sitting immediately after
About. It was an inline figure inside About from 2026-08-31, and the hero's bottom
band before that. Promoting it was considered and **rejected** on 2026-09-02, on the
grounds that detaching the run from the specialism paragraph costs more than the
prominence buys; the owner reversed that when the run grew **a sentence per stage**,
which is content the reading column had no room for. The adjacency the old objection
was protecting survives: About's specialism paragraph claims the acceleration, and
the very next section shows the mechanism and the number.

Two things moved with the promotion:

- **Each stage is a name plus an explanation**, not a label. `01` in mono, the name
  in the display face at `1rem`, then one serif sentence in `--muted`. That sentence
  is why the section exists — the five-word run was legible only to someone who
  already knew the process.
- **The frame came off the block and went round the payoff alone.** A section does
  not need to be marked as a figure; it already is one. So `.payoff` is now the
  page's one panel — see the panel rule in Palette. `.signature` and
  `.signature__label` are gone; the classes are `.process` (state + query
  container), `.pipeline`, `.payoff`.

**The jargon moved into the sentences.** The labels used to pair plain language with
the jargon in the label itself — `Tests written · red`. With a sentence per stage the
pairing happens there instead: the name is the plain half, and `BDD`, `the red
phase` and `turns green` sit in the explanation, where they are actually explained.
Dropping the jargon was rejected then and is still rejected — red/green *is* the
specialism the figure exists to prove. What is **not** allowed is marking those words
in `--signal` inside the sentence: body prose on this page is never green, and the
state colour belongs to the nodes and the badge.

**The three inputs are a mono caption, not icons and not chips.** `Spec .md · Design
doc · Image` under the first node, `--muted` at `0.75rem` against the stage name's
`--paper` — the same label-then-qualifier pairing as `.skills__aside-note`. Icons
were rejected because on this page they mark controls and channels only; chips were
rejected because the badge system has exactly two shapes and neither means "an
input". A caption adds no vocabulary.

The concept holding the whole page together: **green is the TDD passing state.** The
owner's specialism is test-driven agentic UI generation, so green means verified.
That's why the page is black and green rather than because dev portfolios are.

### Layout

- **The section is the page's one `.section--band`: the diagram spans both rail
  columns.** A diagram is not prose, and column 2 is only 704px at the widest the
  `68rem` shell ever gets — five columns out of that leaves 121px each, which will
  not hold `Tested component`, let alone a sentence. Spanning `1 / -1` gives it the
  full 992px at 1440 and 928px at 1024. The head stays in the rail, aligned with
  every other section head; the lead paragraph sits beside it in column 2 and the
  band starts on the row below.
  - The head is **still sticky and cannot reach the band**: a grid item's sticky
    travel is bounded by its grid area, and the head's area is row 1 alone. This was
    checked, not assumed — a sticky head over a full-width diagram would overlap it.
  - The band rule has the **same specificity** as
    `.section > .shell > *:not(.section__head)` (`:not()` takes its argument's), so
    it must stay **after** it in `styles.css`. It wins on source order, not weight.
- **The run is horizontal above a 57rem container and vertical below**, and that is
  the only breakpoint. Five stages across is the arrangement that puts each stage's
  explanation directly under its node; five stages down a rail reads as a build log,
  which is what ships everywhere it does not fit. There is no 2- or 3-column middle
  state: five items in three columns is 3 + 2 and breaks the trace.
- **The threshold is measured: 57rem (912px) of container.** `Tested component` is
  145px at `1rem` in the display face; the badge is a fixed 84px plus a `--space-3`
  connector. Five columns and four 16px gaps out of 912px leaves 148px each, which
  is the tightest width that still holds every name on one line. At 1024 the
  container is 918px and columns are 150px; at 1440, 166px.
- **The column gap is `--space-2`, not `--space-3`, and that is measured too.** At
  24px the columns fell to 143px at 1024 and the fifth name wrapped. The gap to the
  badge stays `--space-3`, because that one is the length of the trace segment
  running into the terminus and has to read as line, not as a column gap.
- **The stages are a subgrid** (`grid-template-rows: subgrid`, four rows: index,
  name, note, sources), so the four registers line up across all five columns even
  when one name wraps and another does not. Without subgrid support the stages just
  stack their own rows — the layout still reads, the notes lose their shared
  baseline. That is the insurance that lets the gate sit at a measured-tight width
  instead of a padded one.
- **A container query, not a media query, and this time it is a preference rather
  than a necessity.** Because the section is a band, the diagram's width tracks the
  shell's inner width at every viewport and *is* monotonic — 927px at 1023, 918px at
  1024, 992px at 1440 — so a media query would work. The container query is still
  right: it asks the question the layout actually has ("is this box wide enough for
  five columns") and re-answers itself for free if the shell, the gutters or the band
  rule change. Contrast the old in-panel figure, where the width was **not**
  monotonic and a container query was the only thing that could express it.
- The payoff panel is a **full-width strip holding one line**, so its padding is
  `--space-3 --space-4` rather than square `--space-4`: at square padding it read as
  a mostly empty box rather than as a readout.

### State and the resolve

- `data-state` lives on **`.process`** and takes exactly two values: `pending` and
  `pass`. It is the **badge's** state and nothing else. The stages carry their own
  state as well, because a five-stage run has to say where it has got to and one
  attribute cannot.
- **The stages carry `data-done` and `data-current`, and nothing else.** Unlit is
  the resting state: `--muted` name, `--muted` index, `--muted` node, `--line`
  trace. `data-done` means passed — `--paper` name, `--signal-dim` index, node lit
  `--signal` with the glow `.role::before` carries, and the trace behind it lit to
  `--signal-dim`. `data-current` means reached and **not** passing: name lit, node
  hollow, badge still `pending`.
- **The explanation stays `--muted` in every state.** The state contrast belongs to
  the name above it; if the sentence lit too, the whole column would flicker.
- **The red phase is drawn without a red, and that is the whole point.** The
  palette has no red and must not gain one — and it turns out never to have needed
  one. Green here means verified, so *not* green already means not-yet-verified,
  which is precisely the red phase. The failing state stays **unlit muted**. Do
  not add a red for the stage whose sentence names the red phase; that stage is the
  one the absence of green is *for*.
- **`data-hold` in the markup marks the stage that waits.** It is reached, marked
  `data-current`, and then lights on the same tick as the stage after it: the node
  named red turns green because green arrived. That pairing is the figure's
  argument, so it lives in the markup rather than a hardcoded index in `main.js`,
  and `lightGroups()` derives the schedule from it. A trailing `data-hold` with no
  stage to pass it lights on its own rather than sitting hollow for good.
- **The hollow node is the page's one ring, and a deliberate exception** to the
  rail's "idle dots are filled dim, with no ring". That rule is about eight
  persistent rings beside labels reading as busy. This is one ring, transient,
  alive only during the replay, and it is the only mark on the page that has to
  say "here, and not passing" — a filled `--muted` node is indistinguishable from
  a stage the run has not reached, which is exactly the distinction the red phase
  is made of. The ring is an inset `box-shadow`, not a `border`, so the node's 7px
  box does not change size and nothing below it moves.
- The markup ships `data-state="pass"` with every stage `data-done`. JS demotes it
  to `pending` and replays the resolve **only** when motion is welcome. That's what
  makes no-JS and reduced-motion visitors see the finished state for free. Preserve
  this shape.
- **The badge swaps its two words with `visibility`, in one grid cell**, so it is
  always as wide as the longer of them. It sizes the run's last column, and
  `PENDING` is 36px wider than `PASS`: with `display: none` the whole grid jumped
  twice during the replay, once on the demote and once on the resolve. `visibility`
  also keeps the hidden word out of the accessibility tree, which `display: none`
  did.
- **The stages are nodes on one continuous trace**, terminating in the state badge —
  the same idiom as `.role` in Experience, and deliberately so: it ties the figure to
  the page's other timeline instead of importing a second visual language. Do **not**
  go back to inline `→` glyph separators; they wrapped at 360px and left an arrow at
  line-start pointing at nothing.
- **The trace reaches the badge, in both directions.** Vertical, the badge is
  indented to the stage names' x and `.state::before` draws an elbow — a left border
  picking the run up at the badge's top edge, where the last stage's rule ends, then
  a bottom border carrying it across. Horizontal, there is no corner to turn: the
  same element becomes a straight top border running the trace into the badge, which
  is centred on the line. The connector lights with the badge it feeds in both cases.
  - **The horizontal centring is `--reveal-offset: translateY(-50%)`, not a plain
    `transform`**, because `.state` is a reveal target and the reveal's
    `transform: none` outranks it. See the Motion rule. Verify by measuring the
    badge's centre against the last stage's `top`: it must be **0** with JS and
    motion on *after the transition settles*, under reduced motion, and with JS
    off. It was 16.5px in the first of those three and 0 in the other two.
- `main.js` touches `.process`'s `dataset.state` and the stages' `data-done` /
  `data-current`, and nothing else — never their text, never the badge, never the
  readout. Keep it there and the section's markup stays free to change around those
  three attributes.
- **The resolve waits until the run is in view.** Below the fold, replaying it at
  load spends the page's one orchestrated moment on an empty screen. `playSignature`
  observes `.process` and fires on first intersection; with no `IntersectionObserver`
  it fires at load as before, because a resolve nobody saw beats one stuck pending.
- **The resolve is a traversal, and it argues rather than decorates.** The run walks
  the trace, holds at the red node with the badge still `pending`, then lights red
  and green together and resolves `PASS` after the last stage. Measured timeline,
  from first intersection: `928ms` Requirements, `1121ms` Behaviour spec, `1328ms`
  red reached and hollow, `1968ms` red **and** green light, `2176ms` Tested
  component, `2368ms` badge `PASS`. `RED_HOLD_MS` is 650 — long enough that the
  hollow node registers as a state rather than a dropped frame. **`PASS` resolves
  after every stage, not at the green one**: it is the outcome of the whole run, and
  the trace ends at the badge.
- The stat now appears in exactly two places: here, and the Agentic UI Builder
  outcome line in Selected work. Do not add a third.

### Contrast and semantics

- Measured 2026-09-03. On the void: stage names when done 18.53:1, the explanation
  and `.pipeline__sources` 7.85:1 (both up from 7.20:1, because they left the panel),
  the `01`–`05` index when done 6.27:1 — the structural tier's own figure, the same
  as every section head, and a 12px label rather than body text. On `--panel`:
  `.payoff__label` 5.76:1, `.readout__label` and the struck `1–2 days` 7.20:1,
  `.readout__now` 10.99:1, and `PASS` on `--signal` 11.98:1.
- Because the substrate is subtractive, **`--panel` is the worst case anywhere in
  the panel**. If the panel value ever changes, re-measure those four — and note
  `getComputedStyle` returns `color(srgb r g b)` with 0–1 floats for `color-mix`
  values and `rgb()` with 0–255 for literals. Feeding the first to a 0–255 contrast
  formula reports a bogus 1.35:1. Read the panel's resolved ground off
  `.payoff`'s computed `background-color`, not off the `--panel` custom property —
  `getPropertyValue` hands back the unresolved `color-mix()` string.
- **`.readout__now` is the one promoted figure on the page**, set in the display face
  at `--step-2` — the size of the hero thesis line. The hero thesis states the claim,
  this proves it. It stays below the name, which is the only thing at `--step-4`. Its
  `text-transform: none` is load-bearing: `.readout` inherits uppercase from the mono
  utility group, and the display face is never uppercase. Keep `1–2 days` small,
  muted and struck; the size contrast is the whole argument.
- **The `<ol>` carries `role="list"`, and it is the only list on the page that
  does.** The reset's `list-style: none` strips list semantics in Safari, the
  printed `01`–`05` are `aria-hidden`, and this is the one list whose *order* is the
  content — without the role a screen reader gets five stages and no sequence. The
  other lists on the page are unordered and do not need it.
- `.pipeline` is **not** in the mono utility selector group; only `.pipeline__index`
  and `.pipeline__sources` are. The group forces uppercase, and the stage names are
  display type and the explanations are serif sentences.

## Motion

The "no scroll animations" rule was lifted on 2026-08-31 on the owner's call, and
replaced with a bounded one. Scroll reveal is now part of the page; parallax,
scroll-driven scrubbing and hover flourishes are still out.

- Three motions total, and that is the budget: the process run resolving, the
  ambient circuit, and the scroll reveal. Don't add a fourth. The hero's on-load cascade
  is not a fourth — it is the reveal, firing on the first frame because the hero
  is already in view. A genuinely new hero animation would be, so if the intro
  ever wants one, it replaces this rather than joining it.
- **The run's five-stage traversal is not a fourth either** — it is the same
  resolve, stepped. It got longer on 2026-09-02 (≈2.4s against 0.9s) and gained
  the red hold, but it is still one motion with one trigger, and it now carries
  meaning instead of decorating. That is the only reason it was allowed to grow:
  a longer animation that says something replaces a shorter one that did not.
- **The reveal is fade plus a 20px rise, 600ms, ease-out, staggered 70ms between
  siblings.** No bounce, no rotation, no scale. It animates `opacity` and
  `transform` only — never a property that costs layout or paint.
- **The rise composes with the element's own transform, through
  `--reveal-offset`.** An element that has to sit somewhere other than its flow
  position declares that property and keeps it across all three reveal states;
  everything else leaves it unset and gets the plain rise. This is not a
  refinement — `transform: none` on `.is-visible` is three classes against one
  and it **silently cancelled** the `PASS` badge's centring on the trace, so the
  run stopped 16.5px short of its own terminus with a stub floating below it
  (found by eye, 2026-09-03). **Never write a bare `transform` on a revealed
  element**; set `--reveal-offset` instead. And note the failure was invisible to
  the obvious test: under reduced motion the reveal never runs, so the gap
  measures a clean 0 — it has to be checked with JS on and motion welcome, after
  the transition settles.
- **It plays once.** The observer unobserves on first reveal; scrolling back up a
  section must not replay it.
- **The run reveals as one cascade, badge included** — `'.pipeline__stage, .state'`
  is a single `REVEAL_GROUPS` entry, so `querySelectorAll` hands them back in
  document order and the five stages rise left to right with the terminus last.
  Two entries would have let the badge appear before the stages it terminates.
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
  when found on 2026-08-26, and **both were stale again on 2026-09-02**
  (`12 Years 3 Months` → `12 Years 4 Months`, `4 Years 11 Months` → `5 Years`);
  JS visitors saw the right figure and no-JS visitors did not. Loading the page
  with JavaScript disabled is the only way this shows up. It has now recurred
  twice: **check it on every pass**, and expect it to be wrong roughly monthly.

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
- **About runs in a fixed order, and it is prose now:**
  1. intro paragraph (2014, React/TypeScript/D3)
  2. specialism paragraph (agentic, test-driven)
  3. "work spans" paragraph
  4. the education line

  One `.prose` block holds the three paragraphs, and the education line follows it.
  It was **two** blocks either side of the process figure until 2026-09-03; when
  the figure left for its own section they collapsed back into one. About is the
  page's one section that is pure reading, and the section directly after it is the
  proof of paragraph 2 — that adjacency is the whole placement argument for
  Process, so **do not reorder them**.
- **The pull-quote is gone** (2026-08-31). It read "workflows that turn structured
  inputs into production-ready frontend components, held to a test-driven standard"
  — which is exactly what the Process section shows, so the page was making the
  same claim twice, once in words and once in a diagram. Do not reinstate it. A
  stat strip was considered and rejected separately: tenure and the `1–2 hours`
  figure already have their one place each.
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
     2026-08-31: Python, PostgreSQL, FastAPI, PHP, and Azure and AWS from
     2026-09-03. The two clouds are **separate chips, not `Azure / AWS`** —
     every entry in every tier names one thing, and a slashed pair reads as
     "one or the other" rather than as two.

  The third tier's note — "Enough to collaborate across the stack, not to own
  it." — **is the point of that block**, not a caption. It is what stops the
  chips from reading as more things owned; if the block ever loses the note, it
  should lose the block. It is the owner's wording, and it is what lets the tier
  grow — Azure and AWS are claims that would need qualifying anywhere else on
  the page, and here the qualifier is already written above them.

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
`lightGroups`, `traceCount`, `buildTraces`, `seeded`, plus `CAREER_START`,
`RESOLVE_DELAY_MS`, `STAGE_STEP_MS`, `RED_HOLD_MS`, and `TRACE_CAP`. Note
`tenureAt` takes only `now` — `CAREER_START` is closed over, so calling it with a
`data-since` string throws `end.getFullYear is not a function`. Assert against these rather than scraping rendered text where you can.

`scroll-effects.js` exposes `window.__scrollEffects`: `sections`, `BAND`,
`REVEAL_GROUPS`, `REVEAL_STEP_MS`, `REVEAL_MAX_STEPS`, and `resolveActive`.

Note `innerText` applies `text-transform`, so most of this page's labels come back
uppercase. Match case-insensitively or you will "lose" text that is present.

**Two measurement traps, both of which reported a clean page that was not**
(2026-09-02):

- **`getClientRects()` on a block or flex container returns one box however its
  content wraps.** Counting those boxes to detect wrapping always reports 1. Walk
  to the leaf text nodes and use `Range.getClientRects()`, the same as the overflow
  check.
- **Two rects on the same line have different `top` values when the text is
  baseline-aligned at different sizes.** `1–2 days` at 13px and `1–2 hours` at
  `--step-2` sit on one line with tops ~15px apart, so counting distinct `top`
  values reported *every* width as wrapped and hid which ones really were. Test
  whether the rects **overlap vertically** instead.

**An element is never its own container query container.** `container-type` and the
`@container` rule on the same selector match at no width, silently — the layout
just never applies. `.process` is the container and the query styles `.pipeline`
and below, which is why no wrapper is needed there; the old panel needed
`.signature__body` because it tried to style the container itself. Assert the
computed `flex-direction` of `.pipeline` at several widths rather than trusting
that the rule fired.

**A `--panel` ratio measured off the custom property is wrong.** `getComputedStyle`
`.getPropertyValue('--panel')` hands back the unresolved `color-mix(...)` string.
Read the ground off `.payoff`'s computed `background-color` instead.

**The browser the MCP server drives caches `index.html` across `page.goto`s even
with `no-store`** — a new section can be missing from the DOM while `curl` shows it
served correctly. Append a changing query string (`?v=7`) when you expect new
markup, or you will debug a selector that is fine.

**Check these after any visual change:**

1. No horizontal overflow at 360, 768, 1440. Measure the text's own client rects,
   not just `scrollWidth` — the hero has `overflow: clip` and it once masked a
   clipped name that the naive check passed.
2. `getComputedStyle` mid-transition returns the animating value, not the target.
   Wait for transitions to settle before asserting colours or opacity.
3. Section heads still fit the rail with no overlaps.
4. Prose and role notes still `rgb(234, 243, 236)`; no brass outside `.award`.
5. Reduced motion: `.process` is `pass` with **all five stages `data-done` and none
   `data-current`**, immediately; circuit frozen, transitions at `0s`,
   no `.js-reveal` class, `scroll-snap-type: none`, nothing below full opacity.
6. Console clean. Every link reachable by keyboard with a visible ring.
7. **Scroll the whole page and assert nothing is left hidden.** The reveal's failure
   mode is invisible content, not a visible glitch. A negative bottom `rootMargin`
   was rejected for exactly this reason: the footer's own bottom padding holds the
   last elements above a trimmed root, so they would never reach their trigger.
8. **The run's horizontal gate, at 1023, 1024 and 1008.** Assert
   `getComputedStyle('.pipeline').flexDirection` is `row` at 1024 and above and
   `column` below the gate, and that every `.pipeline__name` is a single line where
   it is `row` — walk the leaf text nodes, since a name wraps silently. Note the
   viewport is ~10px wider than the container the query sees, because of the
   scrollbar: 1008px of viewport is 902px of container and stacks.
9. **`.readout__was` and `.readout__now` still overlap vertically**, at 360 above
   all — the payoff line wraps silently and takes the figure's argument with it. The
   34rem `.payoff` padding override has to sit **after** the base `.payoff` rule in
   `styles.css`; from the hero's own 34rem block it lost on source order and the
   line wrapped at 360.
10. **The badge must not resize between `pending` and `pass`.** Flip
   `.process` `dataset.state` by hand and assert every `.pipeline__stage` width is
   unchanged — the badge sizes the run's last column and `PENDING` is 36px wider
   than `PASS`.
11. **Snapping must never be enabled on a section that overflows the viewport.**
   Check `#hero` and `#skills` against `innerHeight` at 900×900, 1024×768, 1024×800,
   1366×768 and 1280×800 — 1024×768 is the case that catches a gate set too low.
   **Known open defect as of 2026-09-03, and it predates the Process pass:** Skills
   measures 813px at 1280×800/1366×768 and 903px at 1024×800 while snapping is on
   in both bands, so the measured table in the snap comment below is stale (it says
   741px). Verified identical on the committed `HEAD`, so it is not the band
   layout's doing. Fixing it means raising the height gates and giving up snapping
   on 1366×768, which the owner chose to keep — that trade needs the owner's call.
12. With JavaScript disabled: every section present, both duration fallbacks current,
   `.process` on `pass` with all five stages lit, the horizontal run still working
   (container queries are pure CSS), no rail, and nothing at less than full opacity.
13. Take screenshots and actually look at them. Every real defect in this page was
   found by looking, not by asserting.
