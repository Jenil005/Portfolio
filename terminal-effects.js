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
  if (!form || !input || !output) return;
  const commandHistory = [];
  let historyIndex = 0;
  let draft = '';
  const commands = ['help', 'ls', 'whoami', 'pwd', 'projects', 'experience', 'resume', 'contact', 'theme', 'clear', 'cd projects', 'cd experience', 'cd contact', 'cat profile.json', 'cat security-tools.txt'];
  function print(text, command = false) {
    const row = document.createElement('p');
    row.textContent = command ? '$ ' + text : text;
    if (command) row.className = 'command-echo';
    output.append(row);
    while (output.children.length > 24) output.firstElementChild.remove();
    output.scrollTop = output.scrollHeight;
  }
  input.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      if (!commandHistory.length) return;
      event.preventDefault();
      if (historyIndex === commandHistory.length) draft = input.value;
      historyIndex = Math.max(0, Math.min(commandHistory.length, historyIndex + (event.key === 'ArrowUp' ? -1 : 1)));
      input.value = historyIndex === commandHistory.length ? draft : commandHistory[historyIndex];
      input.setSelectionRange(input.value.length, input.value.length);
    } else if (event.key === 'Tab' && !event.shiftKey && input.value.trim()) {
      const matches = commands.filter(cmd => cmd.startsWith(input.value.trim().toLowerCase()));
      if (!matches.length || (matches.length === 1 && matches[0] === input.value)) return;
      event.preventDefault();
      if (matches.length === 1) input.value = matches[0];
      else print(matches.join('  ·  '));
    }
  });
  const routes = { projects: '#work', experience: '#about', contact: '#contact' };
  const aliases = { 'cd projects': 'projects', 'cd ~/projects': 'projects', 'cd experience': 'experience', 'cd contact': 'contact', 'cd resume': 'resume', 'résumé': 'resume' };
  form.addEventListener('submit', event => {
    event.preventDefault();
    const raw = input.value.trim();
    if (!raw) return;
    const normalized = raw.toLowerCase().replace(/\s+/g, ' ');
    const cmd = aliases[normalized] || normalized;
    commandHistory.push(raw);
    if (commandHistory.length > 40) commandHistory.shift();
    historyIndex = commandHistory.length;
    draft = '';
    input.value = '';
    if (cmd === 'clear') { output.replaceChildren(); return; }
    print(raw, true);
    if (cmd === 'help') print('Browse: ls · projects · experience · resume · contact\nProfile: whoami · pwd · cat profile.json · cat security-tools.txt\nControls: theme · clear | ↑/↓ history · Tab completion');
    else if (cmd === 'ls') print('projects/   experience/   resume/   contact/\nprofile.json   security-tools.txt\nUse cd projects, or choose a section above.');
    else if (cmd === 'pwd') print('/home/jenil/portfolio');
    else if (cmd === 'whoami') print('Jenil Patel\nAssistant Cybersecurity Engineer · SIEGE CyberOps\nB.S. Cybersecurity · Augusta University · May 2027');
    else if (cmd === 'cat profile.json') {
      document.getElementById('profile-tab')?.click();
      print('profile.json opened above.');
    } else if (cmd === 'cat security-tools.txt') {
      document.getElementById('stack-tab')?.click();
      print('security-tools.txt opened above.');
    } else if (cmd === 'theme') {
      document.querySelector('[data-theme-toggle]')?.click();
      print('Theme: ' + document.documentElement.dataset.theme);
    } else if (cmd === 'resume') location.assign('/resume');
    else if (routes[cmd]) {
      print('Opening ' + cmd + '/…');
      const target = document.querySelector(routes[cmd]);
      target.scrollIntoView({ behavior: reduce.matches ? 'instant' : 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      history.replaceState(null, '', routes[cmd]);
    } else print('Command not found. This portfolio shell supports the commands in help.');
  });
})();