/* Elavarasan J — profile site: scroll effects
   Section rail, scroll reveal, and the active-section state. Kept in its own
   file so the whole behaviour can be reviewed or removed by deleting one
   <script> tag — nothing else on the page reads from it. Presentation only:
   the rail carries no content the page does not already have, and the reveal
   state is applied from here so the markup is never dependent on it.

   Soft scroll-snap is pure CSS and lives in styles.css.

   Pure values are exposed on window.__scrollEffects as a verification seam. */
(() => {
  'use strict';

  /* Sections are discovered, never listed: anything with an id and a
     data-nav-label gets a dot and a reveal pass, so adding or reordering a
     section is a markup change alone. Document order is DOM order, which is
     also the order the rail has to run in. */
  const sections = Array.from(document.querySelectorAll('[id][data-nav-label]'));

  /* The middle 20% of the viewport is the band that decides which section is
     current — 40% trimmed off the top and bottom. A section becomes active
     once it dominates the screen rather than the moment it appears. */
  const BAND = 0.4;

  const REVEAL_STEP_MS = 70;   // gap between siblings in one cascade
  const REVEAL_MAX_STEPS = 5;  // cap, so a long list never waits on itself

  /* Each entry is one cascade, resolved *within* each section, so a stagger
     never runs across a section boundary and the list needs no per-section
     duplication. Sections matching none of these (the hero) simply get no
     reveal, which is right: it is above the fold and already has the circuit.

     .employer is here rather than .role on purpose — .role draws the
     continuous left trace through an employer's promotions, and transforming
     each role separately would break that rule into one stub per role for the
     length of the animation. The employer block moves as one piece. */
  const REVEAL_GROUPS = [
    '.section__head',
    '.skills__top li',
    '.skills__group',
    '.skills__aside',
    '.prose',
    '.signature',
    '.education',
    '.employer',
    '.work',
    '.work__more',
    '.award__figure',
    '.contact__status',
    '.contact__availability',
    '.contact__list li',
    '.contact__cta'
  ];

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  const observable = 'IntersectionObserver' in window;

  /* ---------- the rail ----------
     Built here rather than shipped in the markup: it is chrome, not content,
     and every label it shows is already a heading further down the page. */
  function buildRail() {
    const nav = document.createElement('nav');
    nav.className = 'dotnav';
    nav.setAttribute('aria-label', 'Sections');

    const list = document.createElement('ul');
    list.className = 'dotnav__list';

    const links = sections.map(section => {
      const name = section.dataset.navLabel;

      const link = document.createElement('a');
      link.className = 'dotnav__link';
      link.href = '#' + section.id;
      link.setAttribute('aria-label', name);

      const label = document.createElement('span');
      label.className = 'dotnav__label';
      label.textContent = name;

      const dot = document.createElement('span');
      dot.className = 'dotnav__dot';
      dot.setAttribute('aria-hidden', 'true');

      link.append(label, dot);

      const item = document.createElement('li');
      item.append(link);
      list.append(item);

      /* The href stays a real fragment so the link works if this handler ever
         does not, and so it survives being opened in a new tab. The handler
         only upgrades the jump to a smooth one; the hash is deliberately left
         alone, since writing it would put one history entry per dot between
         the visitor and the page they came from. */
      link.addEventListener('click', event => {
        event.preventDefault();
        section.scrollIntoView({
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
          block: 'start'
        });
      });

      return link;
    });

    nav.append(list);
    document.body.append(nav);
    return links;
  }

  /* ---------- active section ----------
     The observer is the trigger, not the answer. Two things make a plain
     "last one to intersect wins" wrong: at a boundary two sections sit in the
     band at once, and near the foot of the page the final section may never
     reach it at all. So each crossing prompts a measurement — one rect per
     section, only when a boundary is actually crossed — and the answer is the
     last section whose top has passed the band's upper edge. */
  function trackActive(links) {
    let current = -1;

    function setActive(index) {
      if (index === current) return;
      current = index;
      links.forEach((link, i) => {
        if (i === index) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }

    function resolveActive() {
      const line = window.innerHeight * BAND;
      let index = 0;
      sections.forEach((section, i) => {
        if (section.getBoundingClientRect().top <= line) index = i;
      });
      setActive(index);
    }

    const margin = BAND * 100;
    const io = new IntersectionObserver(resolveActive, {
      rootMargin: `-${margin}% 0px -${margin}% 0px`
    });
    sections.forEach(section => io.observe(section));

    // The band is a fraction of the viewport, so a resize moves it.
    window.addEventListener('resize', resolveActive, { passive: true });

    resolveActive();
    return resolveActive;
  }

  /* ---------- scroll reveal ----------
     Reveals once and unobserves: scrolling back up must not replay it. The
     hidden state is scoped to .js-reveal on <html>, set only from here, so
     with this file absent or motion unwelcome the content is simply visible.
     Only opacity and transform animate — nothing that costs a layout. */
  function initReveal() {
    const cascades = [];
    sections.forEach(section => {
      REVEAL_GROUPS.forEach(selector => {
        const items = Array.from(section.querySelectorAll(selector));
        if (items.length) cascades.push(items);
      });
    });
    if (!cascades.length) return;

    document.documentElement.classList.add('js-reveal');

    /* Threshold alone, with no negative rootMargin: a trimmed root cannot be
       reached by the last elements on the page — the footer's own bottom
       padding holds them above it — and an element that never crosses its
       trigger would stay invisible for good. */
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    cascades.forEach(items => {
      items.forEach((item, i) => {
        item.classList.add('reveal');
        const step = Math.min(i, REVEAL_MAX_STEPS);
        if (step) {
          item.style.setProperty('--reveal-delay', step * REVEAL_STEP_MS + 'ms');
        }
        io.observe(item);
      });
    });
  }

  let resolveActive = null;

  if (sections.length && observable) {
    resolveActive = trackActive(buildRail());
    if (!prefersReducedMotion()) initReveal();
  }

  window.__scrollEffects = {
    sections, BAND, REVEAL_GROUPS, REVEAL_STEP_MS, REVEAL_MAX_STEPS,
    resolveActive
  };
})();
