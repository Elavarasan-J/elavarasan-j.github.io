/* Elavarasan J — profile site
   Presentation-only enhancement. The page is complete without this file.
   Pure functions are exposed on window.__profile as a verification seam. */
(() => {
  'use strict';

  /* ---------- tenure ----------
     The page states a duration, so it must derive it rather than hardcode it.
     Career start: May 2014 (Asareri Technologies). */
  const CAREER_START = new Date(2014, 4, 1);

  function monthsBetween(start, end) {
    return (end.getFullYear() - start.getFullYear()) * 12
         + (end.getMonth() - start.getMonth());
  }

  function formatTenure(totalMonths) {
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    const m = `${months} ${months === 1 ? 'Month' : 'Months'}`;
    if (years === 0) return m;
    const y = `${years} ${years === 1 ? 'Year' : 'Years'}`;
    return months === 0 ? y : `${y} ${m}`;
  }

  function tenureAt(now) {
    return formatTenure(monthsBetween(CAREER_START, now));
  }

  /* Every still-running duration on the page carries data-since="YYYY-MM" and is
     recomputed at load, so nothing goes stale as the months tick over. Closed
     roles keep their fixed figures in the markup. */
  function renderDurations(now) {
    document.querySelectorAll('[data-since]').forEach(el => {
      const [year, month] = el.dataset.since.split('-').map(Number);
      const start = new Date(year, month - 1, 1);
      el.textContent = formatTenure(monthsBetween(start, now));
    });
  }

  renderDurations(new Date());

  /* ---------- signature: the passing build ----------
     The HTML ships data-state="pass" so no-JS and reduced-motion visitors get
     the finished state. Only when motion is welcome do we demote to pending
     and replay the resolve.

     The strip moved out of the hero and into About on 2026-08-31, which put it
     below the fold: replaying at load would spend the page's one orchestrated
     moment on an empty screen. So the replay waits until the strip is actually
     in view. Without IntersectionObserver it fires at load as before — a
     resolve nobody saw beats a strip stuck on pending. */
  const RESOLVE_DELAY_MS = 900;

  function shouldAnimate(prefersReduced) {
    return !prefersReduced;
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function playSignature() {
    const sig = document.querySelector('.signature');
    if (!sig) return;
    if (!shouldAnimate(prefersReducedMotion())) return;   // already "pass"

    /* Only ever .signature and its dataset.state — the inner markup stays free
       to change without touching this file. */
    function resolve() {
      sig.dataset.state = 'pending';
      window.setTimeout(() => { sig.dataset.state = 'pass'; }, RESOLVE_DELAY_MS);
    }

    if (!('IntersectionObserver' in window)) { resolve(); return; }

    const io = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.disconnect();
        resolve();
      }
    }, { rootMargin: '0px 0px -15% 0px' });
    io.observe(sig);
  }

  playSignature();

  /* ---------- circuit ----------
     Orthogonal traces across a coarse grid with data pulses running along them:
     the substrate the components are assembled on. Seeded rather than random,
     so the static (reduced-motion) render is reproducible. Capped, paused when
     the tab is hidden, pulse-free under reduced motion.

     Alphas were pulled down (traces .22 -> .13, nodes .5 -> .3, pulses
     .95 -> .8) so the substrate recedes behind the content instead of
     competing with it, which is what it read as at the old strength. */
  const TRACE_CAP = 16;
  const GRID = 68;          // css px between grid nodes

  function traceCount(width) {
    return Math.max(5, Math.min(TRACE_CAP, Math.round(width / 110)));
  }

  // Deterministic generator — same layout every render, no Math.random.
  function seeded(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function buildTraces(cols, rows, count, rand) {
    const traces = [];
    for (let t = 0; t < count; t++) {
      let cx = Math.floor(rand() * cols);
      let cy = Math.floor(rand() * rows);
      const points = [[cx, cy]];
      const legs = 3 + Math.floor(rand() * 4);
      let horizontal = rand() < 0.5;
      for (let l = 0; l < legs; l++) {
        const span = 1 + Math.floor(rand() * 3);
        const dir = rand() < 0.5 ? -1 : 1;
        if (horizontal) cx = Math.max(0, Math.min(cols, cx + span * dir));
        else cy = Math.max(0, Math.min(rows, cy + span * dir));
        points.push([cx, cy]);
        horizontal = !horizontal;
      }
      traces.push({ points, phase: rand(), speed: 0.05 + rand() * 0.09 });
    }
    return traces;
  }

  function initCircuit() {
    const canvas = document.getElementById('circuit');
    if (!canvas || !canvas.getContext) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let traces = [];
    let cell = GRID * dpr;
    let raf = null;
    let last = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      cell = GRID * dpr;
      const cols = Math.floor(canvas.width / cell);
      const rows = Math.floor(canvas.height / cell);
      traces = buildTraces(cols, rows, traceCount(rect.width), seeded(20140501));
    }

    // Walk a trace's polyline and return the point at fraction f of its length.
    function pointAt(points, f) {
      const segs = [];
      let total = 0;
      for (let i = 1; i < points.length; i++) {
        const len = Math.abs(points[i][0] - points[i - 1][0])
                  + Math.abs(points[i][1] - points[i - 1][1]);
        segs.push(len);
        total += len;
      }
      if (total === 0) return [points[0][0] * cell, points[0][1] * cell];
      let travel = f * total;
      for (let i = 0; i < segs.length; i++) {
        if (travel <= segs[i]) {
          const r = segs[i] === 0 ? 0 : travel / segs[i];
          const [ax, ay] = points[i];
          const [bx, by] = points[i + 1];
          return [(ax + (bx - ax) * r) * cell, (ay + (by - ay) * r) * cell];
        }
        travel -= segs[i];
      }
      const endPoint = points[points.length - 1];
      return [endPoint[0] * cell, endPoint[1] * cell];
    }

    function draw(withPulses) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // traces
      ctx.lineWidth = Math.max(1, dpr);
      ctx.strokeStyle = 'rgba(0, 226, 74, 0.13)';
      ctx.lineJoin = 'round';
      for (const tr of traces) {
        ctx.beginPath();
        tr.points.forEach(([cx, cy], i) => {
          const x = cx * cell, y = cy * cell;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }

      // junction nodes
      const r = 1.6 * dpr;
      for (const tr of traces) {
        for (const [cx, cy] of tr.points) {
          ctx.beginPath();
          ctx.fillStyle = 'rgba(0, 226, 74, 0.3)';
          ctx.arc(cx * cell, cy * cell, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!withPulses) return;

      // data pulses
      for (const tr of traces) {
        const [px, py] = pointAt(tr.points, tr.phase);
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 7 * dpr);
        grad.addColorStop(0, 'rgba(124, 255, 168, 0.8)');
        grad.addColorStop(1, 'rgba(124, 255, 168, 0)');
        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(px, py, 7 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function step(now) {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      for (const tr of traces) {
        tr.phase += tr.speed * dt;
        if (tr.phase > 1) tr.phase -= 1;
      }
      draw(true);
      raf = window.requestAnimationFrame(step);
    }

    function start() {
      if (raf === null) { last = 0; raf = window.requestAnimationFrame(step); }
    }
    function stop() {
      if (raf !== null) { window.cancelAnimationFrame(raf); raf = null; }
    }

    resize();

    if (!shouldAnimate(prefersReducedMotion())) {
      draw(false);           // traces and nodes only
      return;
    }

    draw(true);
    start();
    document.addEventListener('visibilitychange',
      () => (document.hidden ? stop() : start()));
    window.addEventListener('resize', () => { resize(); draw(true); });
  }

  initCircuit();

  window.__profile = {
    CAREER_START, monthsBetween, formatTenure, tenureAt, renderDurations,
    shouldAnimate, RESOLVE_DELAY_MS,
    TRACE_CAP, traceCount, buildTraces, seeded
  };
})();
