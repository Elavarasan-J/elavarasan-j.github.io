# Résumé download and skills refresh — design

Date: 2026-07-29
Status: approved

Two independent changes to `index.html`, plus rule updates in `CLAUDE.md` and
`docs/design-spec.md`. No CSS changes. No JS changes.

## Scope

1. Add a résumé PDF download link, in the hero and in Contact.
2. Rebuild the Skills groups from the résumé's skill section, curated.

Out of scope, decided explicitly:

- The résumé says "Associate Staff Engineer, 10+ years"; the site says "Staff
  Engineer, 12 Years 2 Months". The owner will reconcile this in the résumé
  later. **The site does not change.** Do not touch the hero meta line, the
  Experience role titles, or the tenure figure.
- The featured skill badges (`.skills__top`) do not change.
- No résumé content beyond the skill section informs this change.

## 1 · Résumé download

### The file

`Elavarasan_Resume_2026.pdf` (2 MB) sits at the repo root and **must be
committed**. `.gitignore` does not exclude it. Without the commit the link 404s
on GitHub Pages.

### Hero

`index.html`, the `.hero__actions` nav. Two edits:

- `aria-label` changes from `"Contact"` to `"Contact and résumé"`. A download is
  not contact; leaving it as "Contact" mislabels the landmark.
- A fourth link is appended after GitHub:

```html
<a href="Elavarasan_Resume_2026.pdf" download>Download résumé</a>
```

### Contact

`index.html`, `.contact__list`. A fifth `li` appended after GitHub:

```html
<li><span class="contact__key">Résumé</span> <a href="Elavarasan_Resume_2026.pdf" download>Download PDF · 2 MB</a></li>
```

### Why these four choices

- **`download` attribute, no `target="_blank"` and no `rel="noopener"`.** The PDF
  is same-origin, so the external-link rule in `CLAUDE.md` does not apply.
  `download` is what makes the click save the file rather than open a browser
  preview, which is what was asked for.
- **The label reads "Download résumé", not "Résumé".** `CLAUDE.md`: *a control
  names what happens*. `docs/design-spec.md` records the inverse case — the old
  Figma résumé link was forced to read "View résumé" precisely because it did
  **not** download. That constraint inverts here; it does not disappear.
- **The file size appears in Contact, not the hero.** Every other Contact row
  shows its real destination (the address, the profile URL), so the size belongs
  in that column. The hero stays terse.
- **"Résumé" carries its accents.** It matches the page's register
  ("visualisation", "specialising").

### Rule updates this requires

Both of these must change or the next reader reverts the work:

- `CLAUDE.md`, Content rules: the line *"No résumé link anywhere. A Figma résumé
  link was removed on request — do not add it back."* Rewrite it to permit the
  same-origin PDF download while still prohibiting a Figma link, and state that
  the label must promise a download because it performs one.
- `docs/design-spec.md` §7 Contact, the résumé row and the two lines below it
  describing the Figma link and the "View résumé" label. Replace with the PDF
  download and the "Download résumé" label, keeping the reasoning.

## 2 · Skills

### Curation rule

A chip earns its place if a recruiter learns something from it that the other
chips do not already imply. This removes two categories: table stakes, and
items that pull against the 2026 positioning.

### Dropped from the résumé's list

| Dropped | Reason |
|---|---|
| VS Code, FileZilla | An editor is not a skill; FileZilla dates the whole list. |
| npm/Yarn | Table stakes. No signal beside Docker and CI/CD. |
| JIRA | Process, not skill. `Agile` in Practice covers it. |
| Photoshop | Superseded by Figma, which stays. |
| WordPress, Bootstrap | Real Gtect-era work, but they read as a downgrade beside Tailwind, shadcn/ui, and agentic tooling. The Gtect role note still names jQuery and Bootstrap, so the era stays honestly on the page. |

Also dropped, from the site's current list: **Cross-browser** — not a
differentiator in 2026.

Postman is **kept**: API-contract work is a real claim.

### Added from the résumé

Angular, Python, Git, Docker, Vite, CI/CD, Nginx, Postman, Claude Code, GitHub
Copilot, System architecture, Cross-functional collaboration.

### Final groups

Six groups, replacing the current four. Chip order within each group is as
listed — it is deliberate, not alphabetical.

| Group (`dt`) | Chips (`dd > ul.chips > li`) |
|---|---|
| Core | JavaScript (ES6+) · TypeScript · HTML · CSS · Python |
| Frameworks & UI | React · Angular · StencilJS · Redux · Zustand · Material UI · shadcn/ui · Tailwind CSS · Micro-frontends · WebSocket |
| Data visualisation | D3.js · Highcharts |
| AI & agentic | Agentic UI generation · AI copilots & chatbots · Claude Code · GitHub Copilot · AWS Bedrock |
| Tooling & delivery | Jest · Git · Docker · Vite · CI/CD · Nginx · Postman · Figma |
| Practice | Agentic development · System architecture · Mentoring · Code review · Agile · Cross-functional collaboration |

Notes on the shape:

- Three of the four existing group names survive. `AI engineering` becomes
  `AI & agentic` (it now holds products *and* tools, so "engineering" no longer
  fits); `Testing & practice` splits into `Tooling & delivery` and `Practice`.
- **Data visualisation stays its own group** even at two chips. It is the 3M
  signal, and it already renders at that size today.
- Overlap between the featured badges and the groups is fine and already exists
  (React appears in both today). TypeScript and Agentic AI likewise.
- **`Jest` sits under Tooling & delivery, not a testing group.** Testing as a
  *practice* is already the `Test-driven development` featured badge, which
  outranks any group. Jest is then just the tool that implements it. A separate
  testing group would say the same thing twice, more weakly.
- Spellings follow the site, not the résumé: `StencilJS` not `Stencil.js`,
  `shadcn/ui` not `ShadcnUI`, `WebSocket` not `Websocket`.

### Markup

Keep the existing structure exactly: `dl.skills__groups` containing one
`div.skills__group` per group, each with a `dt` and a `dd > ul.chips`.

### CSS

**None.** `.skills__groups` is a two-column grid at ≥40rem, so six groups flow
as an even 2×3. `.chips` already wraps. `.hero__actions` already wraps. Do not
add rules for this change.

## JSON-LD

In the `Person` block's `knowsAbout`, add `Python`, `Angular`, and `Docker` so
the structured data does not contradict the visible page. Leave every other
field alone.

## Verification

Serve the folder and drive it with Playwright per `CLAUDE.md`:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Then, in addition to the standing checklist in `CLAUDE.md`:

1. **No horizontal overflow at 360, 768, 1440.** Measure the elements' own
   client rects, not just `scrollWidth`. The hero has `overflow: clip` and has
   masked a clipped name before, and "Download résumé" is now the longest hero
   action by a wide margin — 360px is the case that matters.
2. **The hero action count is 4 and they wrap without clipping** at 360px.
3. **`Elavarasan_Resume_2026.pdf` returns 200** from the served folder, and both
   links carry the `download` attribute and no `target`.
4. **Six `.skills__group` elements**, with the `dt` text and chip counts above.
5. **No chip overflows its column** at 360px — Frameworks & UI is the longest
   group at ten chips.
6. **Section heads still fit the 14rem rail** at ≥64rem with no overlap.
7. **No brass outside `.award`**; prose and role notes still `rgb(234, 243, 236)`.
8. **Reduced motion** still renders the strip as `pass` immediately with the
   circuit frozen — this change should not touch it, so this is a regression check.
9. **Console clean**; every link, including both résumé links, reachable by
   keyboard with a visible `--glow` ring.
10. **Screenshot the Skills section and the hero at 360 and 1440, and look at
    them.** The chip count in Skills roughly doubles; assertions will not tell
    you if it now reads as a wall.

Stop the server afterwards and delete `.playwright-mcp/`.
