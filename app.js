const projects = {
  "homelab": {
    "category": "01 / MAY 2026",
    "title": "Home Security Lab – Proxmox Homelab and Media Server",
    "intro": "",
    "details": [
      "Deployed and configured a Proxmox VE hypervisor on dedicated hardware, managing virtual machines and containers to simulate enterprise-grade infrastructure and support cybersecurity experimentation.",
      "Installed Tailscale VPN on the Proxmox host to enable secure remote access to the management interface from any location without requiring physical presence.",
      "Spun up a Jellyfin media server as a self-hosted streaming solution, accessible remotely via Tailscale and locally via Samba file shares."
    ],
    "tags": [
      "Proxmox",
      "Tailscale",
      "Jellyfin",
      "Samba"
    ]
  },
  "ncae": {
    "category": "02 / FEB 2026",
    "title": "NCAE Cyber Games",
    "intro": "Team Member – CTF Competitor",
    "details": [
      "Contributed to a team that placed fifth regionally in a Capture The Flag (CTF) competition, solving advanced challenges in cryptography, web exploitation, and dark web investigations using the Tor Browser to access and analyze onion services.",
      "Performed web application exploitation by identifying vulnerabilities in HTTP requests/responses and conducted reverse engineering on corrupted Java files to recover functionality and extract hidden data.",
      "Analyzed security logs using Splunk and CrowdStrike to identify indicators of compromise, investigate malicious activity, and support decision-making on incident response."
    ],
    "tags": [
      "Splunk",
      "CrowdStrike",
      "Tor Browser",
      "Java"
    ]
  },
  "cptc": {
    "category": "03 / NOV 2025",
    "title": "Collegiate Penetration Testing Competition (CPTC)",
    "intro": "Team Member",
    "details": [
      "Conducted authorized penetration testing in a competitive team environment, identifying and exploiting vulnerabilities in Windows and Linux systems, web applications, and network services.",
      "Performed reconnaissance and vulnerability analysis using tools such as Nmap, Burp Suite, Metasploit, and Wireshark, documenting findings and validating exploit impact.",
      "Produced professional-style reports detailing attack paths, risk severity, and remediation recommendations, while collaborating with teammates to prioritize targets and improve the testing methodology."
    ],
    "tags": [
      "Nmap",
      "Burp Suite",
      "Metasploit",
      "Wireshark"
    ]
  },
  "ccdc": {
    "category": "04 / FEB 2025",
    "title": "Collegiate Cyber Defense Competition (CCDC)",
    "intro": "Team Member - SSH Admin",
    "details": [
      "Defended a production-like enterprise network against live cyber attacks while maintaining system uptime",
      "Implemented and tuned Fail2Ban, rkhunter, and ClamAV for intrusion detection and host protection",
      "Conducted system hardening, patching, and continuous monitoring under active threat conditions",
      "Investigated suspicious activity and documented incidents with remediation recommendations"
    ],
    "tags": [
      "Fail2Ban",
      "rkhunter",
      "ClamAV",
      "SSH"
    ]
  }
};
const dialog = document.getElementById('project-dialog');
const closeButton = dialog.querySelector('.dialog-close');
let activeTrigger = null;
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    if (!project) return;
    activeTrigger = button;
    document.getElementById('dialog-category').textContent = project.category;
    document.getElementById('dialog-title').textContent = project.title;
    document.getElementById('dialog-intro').textContent = project.intro;
    document.getElementById('dialog-intro').hidden = !project.intro;
    const details = document.getElementById('dialog-details');
    details.replaceChildren();
    project.details.forEach(copy => {
      const li = document.createElement('li'); li.textContent = copy;
      details.append(li);
    });
    const tags = document.getElementById('dialog-tags');
    tags.replaceChildren(...project.tags.map(tag => { const span = document.createElement('span'); span.textContent = tag; return span; }));
    dialog.showModal(); dialog.scrollTop = 0;
    document.body.classList.add('modal-open');
    closeButton.focus({preventScroll:true});
  });
});
closeButton.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  activeTrigger?.focus({preventScroll:true});
});
if ('IntersectionObserver' in window) {
  const navLinks = [...document.querySelectorAll('nav a')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = navLinks.find(item => item.hash === '#' + entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(item => item.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'location');
      } else link.removeAttribute('aria-current');
    });
  }, {rootMargin: '-20% 0px -55% 0px'});
  document.querySelectorAll('main section').forEach(section => observer.observe(section));
}

// The terminal presents resume facts; tab controls support keyboard navigation.
const terminalTabs = [...document.querySelectorAll('[data-terminal]')];
function selectTerminalTab(tab, focus = false) {
  terminalTabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
  if (focus) tab.focus();
}
terminalTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTerminalTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % terminalTabs.length;
    if (event.key === 'ArrowLeft') next = (index + terminalTabs.length - 1) % terminalTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = terminalTabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectTerminalTab(terminalTabs[next], true);
  });
});
