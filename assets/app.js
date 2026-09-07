(function () {
  const root = document.documentElement;

  function systemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function currentTheme() {
    return root.getAttribute('data-theme') || systemTheme();
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
