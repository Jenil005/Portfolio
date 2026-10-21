(() => {
  const root = document.documentElement;
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
    if (meta) meta.content = theme === 'dark' ? '#0b0e15' : '#e9edf4';
  };
  apply(saved === 'light' || saved === 'dark' ? saved : 'dark');
  document.addEventListener('DOMContentLoaded', () => {
    apply(root.dataset.theme);
    document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
      saved = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('portfolio-theme', saved); } catch {}
      apply(saved);
    });
  });
})();