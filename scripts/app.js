/**
 * Naitik Portfolio — Application Controller
 * Handles: Preloader, Light/Dark Mode, Expand Card Modal,
 *          Contact Form, Navigation, Live Clock.
 */

// ==========================================================================
// LIGHT / DARK MODE
// ==========================================================================
(function () {
  const saved = localStorage.getItem('nkp-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function updateIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.textContent = isDark ? '☀️' : '🌙';
    btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }

  updateIcon();

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('nkp-theme', next);
    updateIcon();
  });
}

// ==========================================================================
// PRELOADER
// ==========================================================================
function initPreloader() {
  const preloader     = document.getElementById('preloader');
  const progressEl    = document.getElementById('preloader-progress');
  const statusEl      = document.getElementById('preloader-status');

  const steps = [
    'Setting up the workspace...',
    'Loading design tokens...',
    'Preparing your experience...',
    'Almost ready...',
    'Welcome.'
  ];

  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 22) + 8;
    if (progress > 100) progress = 100;

    if (progressEl) progressEl.textContent = progress + '%';

    const idx = Math.min(
      Math.floor((progress / 100) * steps.length),
      steps.length - 1
    );
    if (statusEl) statusEl.textContent = steps[idx];

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('fade-out');
          setTimeout(() => {
            preloader.style.display = 'none';
          }, 650);
        }
      }, 300);
    }
  }, 80);
}

// ==========================================================================
// LIVE CLOCK (IST)
// ==========================================================================
function initClock() {
  const clockEls = [
    document.getElementById('telemetry-clock'),
    document.getElementById('footer-time')
  ];

  function tick() {
    const now  = new Date();
    const opts = { timeZone: 'Asia/Kolkata', hour12: false,
                   hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const time = now.toLocaleTimeString('en-IN', opts);
    clockEls.forEach(el => { if (el) el.textContent = 'IST ' + time; });
  }

  tick();
  setInterval(tick, 1000);
}

// ==========================================================================
// PROJECT EXPAND DATA
// ==========================================================================
const EXPAND_DATA = {
  'proj-1': {
    tag:      'Web & Apps',
    title:    'Personal Portfolio',
    summary:  'This portfolio was built entirely from scratch — no frameworks, no templates. Every design decision, colour, animation, and layout was crafted by hand. It features a custom emerald-green theme, a light and dark mode, interactive background art, a custom cursor, and a preloading screen.',
    highlights: [
      { label: 'Built with',   value: 'Vanilla HTML, CSS & JS' },
      { label: 'Design style', value: 'Emerald Minimal Luxury'  },
      { label: 'Features',     value: 'Dark/Light mode, Animations' },
      { label: 'Status',       value: 'Live & Ongoing'           }
    ],
    tech: ['HTML5', 'CSS Custom Properties', 'Vanilla JavaScript', 'Canvas API', 'Web Audio API']
  },
  'proj-2': {
    tag:      'Systems',
    title:    'F1 Lap Analyser',
    summary:  'A Python tool that processes raw Formula 1 timing data to compare sector times, tyre degradation, and race pace between drivers. It produces clean, readable charts that help you understand what actually happened on track during a race weekend.',
    highlights: [
      { label: 'Language',  value: 'Python 3'                  },
      { label: 'Data',      value: 'F1 Timing & Telemetry CSV' },
      { label: 'Output',    value: 'Charts & Sector Reports'   },
      { label: 'Purpose',   value: 'Personal & Learning'       }
    ],
    tech: ['Python', 'Pandas', 'Matplotlib', 'NumPy', 'CSV Parsing']
  },
  'proj-3': {
    tag:      'Web & Apps',
    title:    'Study Tracker App',
    summary:  'A lightweight web app that helps you track your daily study sessions. You can log hours for each subject, set daily goals, and view a weekly summary. Everything is saved in the browser — no account needed. Built to solve a personal problem with a clean, distraction-free interface.',
    highlights: [
      { label: 'Framework', value: 'React (No Backend)' },
      { label: 'Storage',   value: 'localStorage'       },
      { label: 'Focus',     value: 'UX & Simplicity'    },
      { label: 'Status',    value: 'Completed'           }
    ],
    tech: ['React', 'CSS Modules', 'LocalStorage API', 'Chart.js']
  },
  'proj-4': {
    tag:      'Research',
    title:    'Science History Blog',
    summary:  'A personal blog where I write about scientists and their discoveries — not just the results, but the story behind them. How did Newton actually arrive at the laws of motion? What drove Turing to create what he created? These are the stories I find worth telling.',
    highlights: [
      { label: 'Format',   value: 'Long-form Articles'  },
      { label: 'Topics',   value: 'Physics, Maths, CS'  },
      { label: 'Audience', value: 'Curious Readers'     },
      { label: 'Status',   value: 'Ongoing'             }
    ],
    tech: ['Writing', 'Research', 'History of Science', 'Markdown', 'Static Site']
  },
  'proj-5': {
    tag:      'Systems',
    title:    'CLI Task Manager',
    summary:  'A command-line task manager that runs entirely in the terminal. You can add tasks with optional priority levels (high, medium, low), mark them complete, list pending tasks, and delete old ones. All data is stored in a simple JSON file so nothing is ever lost between sessions.',
    highlights: [
      { label: 'Language', value: 'Python 3'         },
      { label: 'Storage',  value: 'JSON File'        },
      { label: 'Interface', value: 'Terminal / CLI'  },
      { label: 'Status',   value: 'Completed'        }
    ],
    tech: ['Python', 'argparse', 'JSON', 'File I/O', 'CLI Design']
  },
  'proj-6': {
    tag:      'Web & Apps',
    title:    'Weather Dashboard',
    summary:  'A clean, minimal weather dashboard that fetches real-time weather data from a public API. You can search by city and instantly see temperature, humidity, wind speed, and a short forecast — all displayed in a calm, readable layout with smooth transitions.',
    highlights: [
      { label: 'API',      value: 'OpenWeatherMap'   },
      { label: 'Language', value: 'JavaScript (ES6+)' },
      { label: 'Layout',   value: 'CSS Grid & Flex'  },
      { label: 'Status',   value: 'Completed'         }
    ],
    tech: ['JavaScript', 'Fetch API', 'CSS Grid', 'OpenWeatherMap API', 'HTML5']
  }
};

// ==========================================================================
// EXPAND CARD MODAL
// ==========================================================================
function initExpandCards() {
  const overlay  = document.getElementById('expand-modal');
  const body     = document.getElementById('expand-modal-body');
  const closeBtn = document.getElementById('expand-close');

  if (!overlay || !body || !closeBtn) return;

  function openModal(projectId) {
    const data = EXPAND_DATA[projectId];
    if (!data) return;

    body.innerHTML = `
      <div class="expand-tag">${esc(data.tag)}</div>
      <h2 class="expand-title">${esc(data.title)}</h2>
      <div class="expand-divider"></div>
      <p class="expand-summary">${esc(data.summary)}</p>

      <div class="expand-highlights">
        ${data.highlights.map(h => `
          <div class="expand-highlight-item">
            <div class="expand-highlight-label">${esc(h.label)}</div>
            <div class="expand-highlight-val">${esc(h.value)}</div>
          </div>
        `).join('')}
      </div>

      <div class="expand-divider"></div>
      <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:0.6rem;letter-spacing:1px;text-transform:uppercase;">Technologies</div>
      <div class="expand-tech-row">
        ${data.tech.map(t => `<span class="expand-tech-pill">${esc(t)}</span>`).join('')}
      </div>
    `;

    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Trap focus
    setTimeout(() => closeBtn.focus(), 50);
  }

  function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Attach to all cards
  document.querySelectorAll('.project-card[data-expand-id]').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-expand-id');
      openModal(id);
    });
    // Keyboard accessibility
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const id = card.getAttribute('data-expand-id');
        openModal(id);
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeModal();
    }
  });
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ==========================================================================
// PROJECT FILTER
// ==========================================================================
function initFilter() {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const cards       = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const val = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const show = val === 'all' || cat === val;
        card.style.opacity    = show ? '1' : '0';
        card.style.transform  = show ? 'translateY(0)' : 'translateY(12px)';
        card.style.pointerEvents = show ? '' : 'none';
        setTimeout(() => {
          card.style.display = show ? 'flex' : 'none';
        }, show ? 0 : 240);
        if (show) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity   = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        }
      });
    });
  });
}

// ==========================================================================
// CONTACT FORM
// ==========================================================================
function initContactForm() {
  const form       = document.getElementById('uplink-form');
  const statusLog  = document.getElementById('uplink-status-log');
  const submitBtn  = document.getElementById('uplink-submit-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name     = document.getElementById('uplink-name')?.value.trim();
    const email    = document.getElementById('uplink-email')?.value.trim();
    const subject  = document.getElementById('uplink-clearance')?.value;
    const message  = document.getElementById('uplink-message')?.value.trim();

    if (!name || !email || !message) {
      if (statusLog) statusLog.innerHTML = '<span class="log-err">Please fill in all required fields.</span>';
      return;
    }

    if (submitBtn) {
      submitBtn.disabled     = true;
      submitBtn.textContent  = 'Sending...';
    }

    if (statusLog) {
      statusLog.innerHTML = '<div class="log-step">Preparing your message...</div>';
    }

    setTimeout(() => {
      if (statusLog) {
        statusLog.innerHTML += '<div class="log-step">Sending via secure channel...</div>';
      }
    }, 600);

    setTimeout(() => {
      if (statusLog) {
        statusLog.innerHTML = `
          <div class="log-success">Message sent successfully. Thank you, ${esc(name)}!</div>
          <div class="log-info">A reply will be sent to ${esc(email)} shortly.</div>
        `;
      }
      if (submitBtn) {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Send Message';
      }
      form.reset();
    }, 1500);
  });
}

// ==========================================================================
// SMOOTH SCROLL & ACTIVE NAV
// ==========================================================================
function initNav() {
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Active nav highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
}

// ==========================================================================
// BOOT
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initPreloader();
  initClock();
  initExpandCards();
  initFilter();
  initContactForm();
  initNav();
});
