# Elavarasan J — portfolio

A single static page: Staff Engineer, 12+ years in enterprise frontend, specialising
in agentic, test-driven UI generation.

No framework, no build step, no dependencies. Four source files, two images, and
two PDFs.

## Run it

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
# http://127.0.0.1:8765/index.html
```

A server is only needed for tooling that blocks the `file:` protocol — the page
itself works fine opened straight from disk.

## Structure

| Path | What it is |
|---|---|
| `index.html` | All content. Readable with CSS and JS disabled. |
| `styles.css` | Design tokens, then layout, then components. |
| `main.js` | Progressive enhancement only: live durations, the process run, the hero circuit. |
| `scroll-effects.js` | The section rail and the scroll reveal. Separate so the whole behaviour can be dropped by deleting one `<script>` tag. |
| `elavarasan.jpeg` | Headshot, 200×200. |
| `hoc.jpeg` | Hall of Fame certificate. |
| `Elavarasan_Resume_2026.pdf` | Résumé, linked from the hero and Contact. Must stay tracked in git or the download link 404s on Pages. |
| `Elavarasan_Projects_2026.pdf` | Full project list — ten projects, linked from the end of Selected work. Same rule: must stay tracked or the link 404s. |
| `.gitattributes` | Marks PDFs binary so updating one is a single blob change, not a 28,000-line diff. |
| `CLAUDE.md` | The design system and its rules. Read before changing anything visual. |
| `docs/` | The design spec and the implementation plan it was built from. |

## Deploying to GitHub Pages

Settings → Pages → Deploy from a branch → `main` / root. The page is already at the
repository root, so nothing needs moving.

**After deploying, check the absolute URLs.** `index.html` has a `canonical` link,
Open Graph / Twitter tags, and a JSON-LD block that all assume
`https://elavarasan-j.github.io/`. If you use a custom domain,
update them — a canonical pointing at the wrong URL is worse than having none.

## Notes

- Durations are computed at page load from `data-since` attributes, so the tenure
  figures never go stale. Never hardcode a duration for a role that is ongoing.
- The design has a concept behind it: green is the test-passing state, because
  test-driven agentic UI generation is the specialism the page is about. `CLAUDE.md`
  explains what that means for the palette.
