(() => {
  const intro = document.getElementById("intro");
  const canvas = document.getElementById("intro-canvas");
  const skipBtn = document.getElementById("intro-skip");
  if (!intro || !(canvas instanceof HTMLCanvasElement)) return;

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const DURATION_MS = prefersReducedMotion ? 150 : 3000;
  const FADE_MS = 820;

  document.body.classList.add("no-scroll");

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  function hexToRgb(hex) {
    const raw = hex.replace("#", "").trim();
    if (raw.length === 3) {
      const r = parseInt(raw[0] + raw[0], 16);
      const g = parseInt(raw[1] + raw[1], 16);
      const b = parseInt(raw[2] + raw[2], 16);
      return { r, g, b };
    }
    if (raw.length === 6) {
      const r = parseInt(raw.slice(0, 2), 16);
      const g = parseInt(raw.slice(2, 4), 16);
      const b = parseInt(raw.slice(4, 6), 16);
      return { r, g, b };
    }
    return null;
  }

  function easeOutCubic(t) {
    const p = 1 - t;
    return 1 - p * p * p;
  }

  function resize() {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const rect = intro.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const rootStyle = getComputedStyle(document.documentElement);
  const accentHex = rootStyle.getPropertyValue("--color-accent").trim() || "#7a9ab5";
  const bgHex = rootStyle.getPropertyValue("--color-bg").trim() || "#f7f9fc";
  const accentRgb = hexToRgb(accentHex) || { r: 122, g: 154, b: 181 };

  function fillBackground() {
    const w = intro.clientWidth;
    const h = intro.clientHeight;
    ctx.clearRect(0, 0, w, h);

    const grd = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, Math.max(w, h) * 0.9);
    grd.addColorStop(0, bgHex);
    grd.addColorStop(1, "#e7eef6");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);
  }

  let finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    intro.classList.add("is-hidden");
    window.setTimeout(() => {
      intro.remove();
      document.body.classList.remove("no-scroll");
    }, FADE_MS);
  }

  skipBtn?.addEventListener("click", finish);
  intro.addEventListener("click", finish);

  window.addEventListener("resize", resize, { passive: true });
  resize();

  if (prefersReducedMotion) {
    fillBackground();
    window.setTimeout(finish, 50);
    return;
  }

  const start = performance.now();
  const rippleCount = 7;
  const rippleGap = 0.14;
  const seeds = Array.from({ length: rippleCount }, (_, i) => ({
    a: 0.8 + i * 0.37,
    b: 1.6 + i * 0.29,
    p1: i * 1.7,
    p2: i * 2.3,
  }));

  function clamp01(x) {
    return Math.min(1, Math.max(0, x));
  }

  function drawWavyRing(cx, cy, radius, amp, phase, alpha, lineWidth, seed) {
    const steps = 160;
    const twoPi = Math.PI * 2;
    ctx.beginPath();

    for (let s = 0; s <= steps; s++) {
      const a = (s / steps) * twoPi;
      const wobble =
        amp *
        (0.62 * Math.sin(a * (3.2 + seed.a) + phase + seed.p1) +
          0.38 * Math.sin(a * (7.1 + seed.b) - phase * 0.75 + seed.p2));
      const r = radius + wobble;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, ${alpha})`;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  function draw(now) {
    if (finished) return;
    const t = Math.min(1, (now - start) / DURATION_MS);
    const eased = easeOutCubic(t);

    fillBackground();

    const w = intro.clientWidth;
    const h = intro.clientHeight;
    const cx = w / 2;
    const cy = h / 2;
    const maxR = Math.hypot(w, h) * 0.58;
    const time = (now - start) / 1000;

    for (let i = 0; i < rippleCount; i++) {
      const local = clamp01((eased - i * rippleGap) / (1 - i * rippleGap));
      if (local <= 0) continue;

      const r = maxR * local;
      const fade = 1 - local;
      const amp = Math.max(0.8, (10 - i * 1.25) * fade);
      const alpha = (0.26 - i * 0.022) * fade;
      const line = Math.max(0.9, 2.4 - local * 1.9);
      const phase = time * (2.6 - i * 0.12);

      // main ring
      drawWavyRing(cx, cy, r, amp, phase, alpha, line, seeds[i]);

      // secondary faint ring for “water thickness”
      drawWavyRing(
        cx,
        cy,
        r + 6 * fade,
        amp * 0.6,
        phase + 0.8,
        alpha * 0.55,
        Math.max(0.7, line * 0.65),
        seeds[i]
      );
    }

    // soft center shimmer
    const shimmer = 1 - eased;
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 140);
    glow.addColorStop(0, `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, ${0.14 * shimmer})`);
    glow.addColorStop(1, `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0)`);
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    if (t >= 1) {
      finish();
      return;
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();

