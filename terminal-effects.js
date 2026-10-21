(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const progress = document.querySelector('.scroll-progress');
  let queued = false;
  function updateProgress() {
    queued = false;
    const distance = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = 'scaleX(' + (distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0) + ')';
  }
  addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  addEventListener('resize', updateProgress);
  addEventListener('load', updateProgress);
  updateProgress();

  let observer;
  const elements = [...document.querySelectorAll('.project, .credential, .section-heading, .soc-experience, .skills, .education, .resume-paper')];
  function revealAll() {
    observer?.disconnect();
    elements.forEach(el => { el.classList.remove('scroll-reveal'); el.classList.add('is-visible'); });
  }
  if (!reduce.matches && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06 });
    elements.forEach((el, index) => {
      if (el.getBoundingClientRect().top < innerHeight) return;
      el.style.setProperty('--reveal-delay', (index % 2) * 65 + 'ms');
      el.classList.add('scroll-reveal');
      observer.observe(el);
    });
    document.addEventListener('focusin', event => {
      event.target.closest?.('.scroll-reveal')?.classList.add('is-visible');
    });
  }
  let typingTimer;
  const typed = document.querySelector('[data-type-command]');
  if (typed && !reduce.matches) {
    const command = typed.textContent;
    typed.textContent = '';
    let index = 0;
    function type() {
      typed.textContent = command.slice(0, ++index);
      if (index < command.length) typingTimer = setTimeout(type, 110);
    }
    typingTimer = setTimeout(type, 300);
  }
  reduce.addEventListener('change', event => {
    if (!event.matches) return;
    revealAll();
    clearTimeout(typingTimer);
    if (typed) typed.textContent = 'whoami';
  });

  const form = document.querySelector('.command-form');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('command-output');
  const routes = { projects: '#work', experience: '#about', contact: '#contact' };
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const cmd = input.value.trim().toLowerCase();
    input.value = '';
    if (!cmd) return;
    if (cmd === 'help') output.textContent = 'Commands: projects · experience · resume · contact · theme · clear';
    else if (cmd === 'clear') output.textContent = 'Ready. Type help for commands.';
    else if (cmd === 'theme') {
      document.querySelector('[data-theme-toggle]')?.click();
      output.textContent = 'Theme updated.';
    } else if (cmd === 'resume' || cmd === 'résumé') location.assign('/resume');
    else if (routes[cmd]) {
      output.textContent = 'Opening ' + cmd + '…';
      const target = document.querySelector(routes[cmd]);
      target.scrollIntoView({ behavior: reduce.matches ? 'instant' : 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      history.replaceState(null, '', routes[cmd]);
    } else output.textContent = 'Unknown command. Type help to see available commands.';
  });
})();