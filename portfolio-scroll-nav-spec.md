# Portfolio Enhancement Spec: Scroll Navigation & Animations

## Context

Site: https://elavarasan-j.github.io/
Style: Dark theme (background `#000000`), minimal, single-page.
**New** section list (after restructure below): Hero, Skills, About, Experience, Selected work, Recognition, Contact — 6 dot-nav entries once Recognition/Experience decision is finalized (see note under section 0).

Goal: Make the site feel more polished and guided while scrolling — without breaking the denser content sections (Experience, Selected work). Do NOT implement hard full-page scroll-snap (one scroll = one section jump). Content sections here are too dense for that and it will feel cramped or require janky internal scrolling.

---

## 0. Content Restructure (do this FIRST, before nav/animation work)

**A. Remove "How the work gets made" as a standalone section.**
Merge its content (the 3-step visual: Design → Structured spec → Tested component, plus the "1–2 days → 1–2 hours" stat) into the **About** section, placed directly after the "specialism" paragraph (the one about agentic, test-driven workflows) — it visually illustrates that paragraph, so it should sit immediately after it, not at the top of the page.

**B. Remove the Xyden project teaser paragraph from About** to make room (the paragraph starting "Currently finishing Xyden..."). It's a weaker, unproven claim compared to the rest of About's content and isn't needed once the process visual is in place.

**Resulting About section order:**
1. Intro paragraph (2014, React/TypeScript/D3 experience)
2. Specialism paragraph (agentic, test-driven workflows)
3. Process visual (Design → Structured spec → Tested component + stat) — inline, illustrating point 2
4. "Work spans" paragraph (dashboards, conversational interfaces, visualization, component architecture)
5. Education line

**C. Hero section: re-center vertically.**
With the process block removed from below the hero, the hero content (photo, name, title/meta line, tagline, link row) should be **vertically centered in the viewport** (`display: flex; align-items: center; min-height: 100vh` or equivalent) rather than top-anchored. It's now the only content in that section, so it should read as a calm, centered intro rather than pinned to the top.

**D. Stat deduplication.**
The "1–2 days → 1–2 hours" stat should now appear in exactly two places: the About process visual (step 3 above) and the "Agentic UI Builder" project card under Selected work. Remove it from anywhere else if it appears again.

**E. Recognition section — leave as-is for now** (noted as thin in review, but no content available to expand it yet; revisit later). Do not merge into Experience unless explicitly requested in a future pass.

**F. Condense Experience section — merge Gtect Systems and Asareri Technologies into one "Early Career" block.**

Currently Experience has 3 companies / 6 role entries:
- Ongil.ai — Associate Staff Engineer (Jun 2024–Present), Senior Software Engineer (Sep 2021–Jun 2024)
- Gtect Systems — Senior UI Developer (Aug 2019–Aug 2021), UI Developer (Aug 2016–Aug 2019)
- Asareri Technologies — UI Developer (May 2014–Jul 2016)

Keep the two Ongil.ai roles exactly as-is (most relevant, most recent, matches current AI/agentic positioning). Collapse Gtect Systems + Asareri Technologies into a single condensed block:

```
Early Career — UI Developer → Senior UI Developer
Gtect Systems · Asareri Technologies · 2014–2021

Built responsive, pixel-perfect interfaces from PSD designs and
business requirements — the foundation for the AI-driven frontend
work that followed.
```

Resulting Experience section: 2 blocks total (Ongil.ai with its 2 roles, then the single Early Career block) instead of 3 company blocks / 6 role entries. This is a content-only change — no résumé or LinkedIn update needed, those remain separate and unaffected. Note in HTML/component structure: the Early Career block should still be a valid semantic entry (e.g. its own `<div>`/list item) so it doesn't break any existing Experience-section styling or spacing assumptions the animation/nav code relies on.

Once A–D are done, the page has 7 top-level sections for nav purposes: **Hero, Skills, About, Experience, Selected work, Recognition, Contact**. This is one fewer than the original 8 (Process is no longer standalone). Build the dot-nav to **auto-generate from whatever `<section>` elements with an `id` and `data-nav-label` exist in the DOM**, rather than hardcoding a count or list — so future section changes don't require touching nav code.

---

Implement three features next, in this priority order:

---

## 1. Vertical Dot Navigator (side rail)

**What it is:** A fixed vertical nav on the right edge of the viewport (desktop only — hide on mobile/tablet, e.g. below 900px width) with one dot per top-level section. It stays visible the whole time the user is on the page.

**Requirements:**
- Fixed position, vertically centered, right side, small margin from edge (e.g. `right: 32px`)
- One dot per section: Hero, Skills, About, Experience, Selected work, Recognition, Contact
  (skip "How the work gets made" if it's treated as a sub-block of Hero — decide based on whether it has its own `<section id="...">`)
- Active dot is visually distinct (larger, filled, or accent color) and shows the section's short label on hover or persistently next to it (small text label, fades in/out, doesn't push layout)
- Clicking a dot smooth-scrolls to that section (`scrollIntoView({ behavior: 'smooth', block: 'start' })` or equivalent)
- Active section is detected via `IntersectionObserver` watching each `<section>`, threshold tuned so a section is marked "active" once it's roughly centered/dominant in the viewport (e.g. `rootMargin: '-40% 0px -40% 0px'`)
- Keyboard accessible: dots are real `<button>` or `<a>` elements with `aria-label` per section, visible focus ring
- No layout shift, no interference with existing hero content on the right side — check existing hero right-side spacing before placing this

**Visual style:** Match existing dark/minimal aesthetic. Small circular dots (~8-10px), subtle default state (low-opacity white/gray), accent/full-opacity on active. Thin connecting line between dots is optional — nice touch if it doesn't look cluttered.

---

## 2. Scroll-Reveal Animations

**What it is:** As each section (or sub-elements within a section, e.g. skill chips, project cards, experience entries) enters the viewport, animate it in — rather than everything just being static.

**Requirements:**
- Use `IntersectionObserver` (same instance can double up with the nav's observer, or separate — implementer's choice) to add a class like `.is-visible` when an element enters the viewport (~15-20% visible)
- Animation: subtle fade + upward translate (e.g. `opacity: 0 → 1`, `translateY(20px) → 0`), duration ~500-700ms, ease-out
- Stagger children within a section (skill chips, project cards, experience items) by ~60-100ms each so they cascade in rather than popping simultaneously
- Animate **once** — don't re-trigger every time the user scrolls back up past a section (unobserve after first reveal, or use a `.animated` flag)
- Respect `prefers-reduced-motion: reduce` — if set, skip animations entirely and show content immediately (no opacity/transform transition)
- Keep it subtle — this should feel refined, not like a slideshow. No bounce, no rotation, no scale-pop effects.

---

## 3. Soft Scroll-Snap (short sections only)

**What it is:** Gentle scroll-snap applied ONLY to short, single-viewport-friendly sections: Hero, Skills, Recognition (adjust list based on actual rendered height at common viewport sizes — anything that reliably fits in one screen without scrolling internally).

**Requirements:**
- Use CSS `scroll-snap-type: y proximity` on the scroll container (NOT `mandatory` — proximity is a soft nudge, not a hard lock, so it won't fight the user or trap them if content is taller than expected)
- Apply `scroll-snap-align: start` only to the eligible short sections
- Do NOT apply scroll-snap-align to Experience, Selected work, About, or Contact — let those scroll naturally
- Test at common breakpoints (1920×1080, 1440×900, 1366×768, and a laptop like 1280×800) to confirm "short" sections actually fit in viewport height without internal overflow. If a section doesn't reliably fit, exclude it from snapping.

---

## General Implementation Notes

- Vanilla JS + CSS preferred (no new framework dependency) unless the existing site already uses one — check current stack first (looks like static HTML/CSS/JS based on the deployed structure)
- All new JS should be modular/isolated (e.g. a single `scroll-effects.js`) so it can be reviewed/removed easily
- Test with keyboard-only navigation and screen reader (VoiceOver/NVDA) to confirm the dot nav doesn't break accessibility
- Test on mobile: dot nav hidden, scroll-reveal still works (mobile scroll is naturally continuous, no snap needed there), no jank on lower-end devices (avoid animating `box-shadow`/expensive properties — stick to `opacity`/`transform`)
- Performance: `IntersectionObserver` over scroll-event polling; unobserve elements once animated
- Don't break existing anchor links, resume PDF download, or mailto/tel links

## Acceptance Criteria

- [ ] Right-side dot nav visible on desktop, correctly highlights active section while scrolling
- [ ] Clicking any dot smooth-scrolls to that section
- [ ] Sections/elements fade+slide into view once, on first scroll into viewport
- [ ] Hero, Skills, Recognition sections softly snap into place; Experience/Work/About/Contact scroll freely
- [ ] `prefers-reduced-motion` respected
- [ ] No layout shift, no broken existing links, no console errors
- [ ] Works at 1920×1080 down to mobile (375px width), dot nav hidden below 900px
