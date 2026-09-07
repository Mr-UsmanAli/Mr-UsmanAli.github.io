document.documentElement.classList.add('has-js');

(function () {
  const root = document.documentElement;

  function systemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function currentTheme() {
    return root.getAttribute('data-theme') || 'dark';
  }
  function syncToggle(btn) {
    if (!btn) return;
    const theme = currentTheme();
    btn.setAttribute('aria-pressed', theme === 'dark');
    btn.querySelector('.icon-sun').hidden = theme === 'dark';
    btn.querySelector('.icon-moon').hidden = theme !== 'dark';
  }
  const themeBtn = document.querySelector('.mode-toggle');
  if (themeBtn) {
    syncToggle(themeBtn);
    themeBtn.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncToggle(themeBtn);
    });
  }

  const menuBtn = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (menuBtn && links) {
    menuBtn.addEventListener('click', () => links.classList.toggle('open'));
  }
})();

/* Hero network — federated-learning node graph, canvas 2D */
(function () {
  const canvas = document.querySelector('.hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, dpr;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const HUB_COUNT = 1;
  const NODE_COUNT = 14;
  let nodes = [];
  function initNodes() {
    nodes = [];
    nodes.push({ x: w * 0.5, y: h * 0.5, r: 5, hub: true, vx: 0, vy: 0 });
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 2 + Math.random() * 1.5,
        hub: false,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  const accentColor = () => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#35e0c9';
  const lineColor = () => getComputedStyle(document.documentElement).getPropertyValue('--line-2').trim() || '#24303d';

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, w, h);
    const accent = accentColor();
    const line = lineColor();
    const hub = nodes[0];

    for (let i = 1; i < nodes.length; i++) {
      const n = nodes[i];
      const dx = n.x - hub.x, dy = n.y - hub.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = Math.max(w, h) * 0.55;
      if (dist < maxDist) {
        const pulse = (Math.sin(t * 0.02 + n.phase) + 1) / 2;
        ctx.strokeStyle = accent;
        ctx.globalAlpha = 0.08 + pulse * 0.16;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(hub.x, hub.y);
        ctx.lineTo(n.x, n.y);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      ctx.fillStyle = n.hub ? accent : line;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
      if (n.hub) {
        ctx.strokeStyle = accent;
        ctx.globalAlpha = 0.25;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 6 + Math.sin(t * 0.03) * 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }

  function step() {
    t++;
    for (let i = 1; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }
    draw();
    if (!reduceMotion) requestAnimationFrame(step);
  }

  resize();
  initNodes();
  draw();
  if (!reduceMotion) requestAnimationFrame(step);
  window.addEventListener('resize', () => { resize(); initNodes(); draw(); });
})();

/* Scroll reveal via GSAP (falls back to plain visibility if GSAP failed to load) */
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (typeof gsap === 'undefined') {
    items.forEach((el) => el.style.opacity = 1);
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  items.forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      delay: (i % 4) * 0.06,
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });
})();

/* Interactive research-architecture diagram */
(function () {
  const arch = document.querySelector('.arch');
  if (!arch) return;
  const steps = arch.querySelectorAll('.arch-step');
  const detail = document.querySelector('.arch-detail');
  function select(step) {
    steps.forEach((s) => s.setAttribute('aria-selected', s === step ? 'true' : 'false'));
    if (detail) detail.textContent = step.dataset.detail;
  }
  steps.forEach((step) => step.addEventListener('click', () => select(step)));
  select(steps[0]);
})();
