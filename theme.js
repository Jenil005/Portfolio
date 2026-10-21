(() => {
  const root = document.documentElement;
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let saved = null;
  try { saved = localStorage.getItem('portfolio-theme'); } catch {}
  const apply = theme => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    const button = document.querySelector('[data-theme-toggle]');
    if (button) {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      button.querySelector('span').textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#0d1523' : '#f4f7fc';
  };
  apply(saved === 'light' || saved === 'dark' ? saved : preference.matches ? 'dark' : 'light');
  document.addEventListener('DOMContentLoaded', () => {
    apply(root.dataset.theme);
    document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
      saved = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('portfolio-theme', saved); } catch {}
      apply(saved);
    });
  });
  preference.addEventListener('change', event => { if (!saved) apply(event.matches ? 'dark' : 'light'); });
})();