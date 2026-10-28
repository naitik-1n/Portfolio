/**
 * Latverian Core Application Controller
 * Handles Preloader, SFX Synthesizer, Uplink Form, Blueprint Modal, and HUD Telemetry.
 */

class LatverianAudio {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.playBeep(880, 0.05, 'sine');
    }
    return this.enabled;
  }

  playBeep(freq = 440, duration = 0.08, type = 'sine', volume = 0.06) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio fallback
    }
  }

  playGlitch() {
    if (!this.enabled || !this.ctx) return;
    try {
      const duration = 0.06;
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch (e) {}
  }
}

// Project Details Data for Blueprint Modal
const PROJECT_BLUEPRINTS = {
  'vortex-f1': {
    title: 'VORTEX-F1 // AERO-TELEMETRY PIPELINE',
    tag: 'AERODYNAMICS & SIMULATION',
    specs: [
      { label: 'THROUGHPUT', value: '120,000 pts/sec' },
      { label: 'LATENCY', value: '< 2.4ms per frame' },
      { label: 'COMPUTE', value: 'CUDA & WebGPU Shaders' },
      { label: 'ARCHITECTURE', value: 'Zero-Copy Ring Buffer' }
    ],
    summary: 'A sub-millisecond telemetry ingestion and aerodynamic visualization suite designed for high-downforce single-seaters. Simulates real-time computational fluid dynamics (CFD) streamlines over front-wing cascades and diffuser venturi tunnels.',
    technologies: ['C++20', 'WebGPU', 'GLSL', 'Python Telemetry Engine', 'FastAPI', 'High-Speed WebSockets'],
    architecture: `
[PIT-WALL TELEMETRY SENSORS]
             │ (CAN-Bus / UDP stream)
             ▼
[ZERO-COPY RING BUFFER INGESTION]
             │
   ┌─────────┴──────────┐
   ▼                    ▼
[CFD RUNTIME]   [DOWNFORCE VECTOR SOLVER]
   │                    │
   └─────────┬──────────┘
             ▼
[WEBGPU VOLUMETRIC STREAMLINE SHADER]
    `
  },
  'latveria-os': {
    title: 'LATVERIA-OS // DETERMINISTIC MICROKERNEL RUNTIME',
    tag: 'SYSTEMS & LOW-LEVEL',
    specs: [
      { label: 'SCHEDULING', value: 'Hard Real-Time EDF' },
      { label: 'MEMORY OVERHEAD', value: '64KB Base Footprint' },
      { label: 'CONTEXT SWITCH', value: '42 nanoseconds' },
      { label: 'FORMAL PROOF', value: 'TLA+ Model Checked' }
    ],
    summary: 'A ruthless, low-overhead microkernel architecture designed with Latverian architectural discipline. Implements capability-based security, lock-free IPC channels, and deterministic interrupt handling without dynamic allocation.',
    technologies: ['Rust', 'x86_64 Assembly', 'Bare-Metal C', 'QEMU', 'GDB Telemetry', 'TLA+'],
    architecture: `
[USER PRIVILEGED CAPABILITIES]
             │ (Lock-free IPC Doorbell)
             ▼
[LATVERIAN MICROKERNEL CORE]
 ├── Deterministic EDF Scheduler
 ├── Zero-Alloc Paging Table
 └── Isolated Hardware MMIO Driver Ring
    `
  },
  'arcanum-neural': {
    title: 'ARCANUM-NEURAL // SYMBOLIC-NUMERIC ENGINE',
    tag: 'ARCANE WEB & AI',
    specs: [
      { label: 'FORMAL LOGIC', value: 'First-Order Proofs' },
      { label: 'TENSOR ENGINE', value: 'Sparse Graph BLAS' },
      { label: 'CONVERGENCE', value: 'Exact Symbolic Invariants' },
      { label: 'ENERGY EFFICIENCY', value: '+42% vs standard Transformers' }
    ],
    summary: 'Merging ancient mathematical treatises with high-dimensional neural architectures. Enforces hard physical and mathematical laws as immutable boundary constraints during neural gradient descent, preventing catastrophic hallucinations.',
    technologies: ['PyTorch', 'Rust Bindings', 'Z3 Theorem Prover', 'Symbolic Mathematics', 'ONNX Runtime'],
    architecture: `
[RAW SCIENTIFIC DATASET]
             │
             ▼
[NEURAL FEATURE EXTRACTOR] ◄───► [ARCANUM SYMBOLIC PROVER]
             │                    (Z3 SMT Invariant Verification)
             ▼
[CONVERGED THEOREM & HIGH-SPEED PREDICTOR]
    `
  },
  'titanium-trace': {
    title: 'TITANIUM-TRACE // HIGH-FREQUENCY LEDGER',
    tag: 'SYSTEMS & LOW-LEVEL',
    specs: [
      { label: 'CONSENSUS', value: 'Raft / Latverian Quorum' },
      { label: 'DISK DISPATCH', value: 'io_uring Zero-Copy' },
      { label: 'TPS', value: '450,000 trans/sec' },
      { label: 'JITTER (P99.9)', value: '< 18 microseconds' }
    ],
    summary: 'A high-frequency memory-mapped state machine replication engine. Eliminates heap allocations and garbage collection stops, leveraging Linux io_uring and kernel bypass networking for instant transactional durability.',
    technologies: ['Go 1.23', 'Linux io_uring', 'eBPF Probes', 'FlatBuffers', 'Prometheus'],
    architecture: `
[INCOMING NETWORK TRANSACTIONS]
             │ (Kernel Bypass eBPF / XDP)
             ▼
[CIRCULAR MMAP TRANSACTION LOG]
             │ (io_uring Async Storage Sync)
             ▼
[TITANIUM CONSENSUS REPLICATION BUS]
    `
  },
  'apex-sim': {
    title: 'APEX-SIM // F1 LAP STRATEGY & DEGRADATION NEURAL MODEL',
    tag: 'AERODYNAMICS & SIMULATION',
    specs: [
      { label: 'MONTE CARLO RUNS', value: '500,000 / race sec' },
      { label: 'ACCURACY', value: '99.4% pit-window prediction' },
      { label: 'WEATHER MODEL', value: 'Track micro-climate radar' },
      { label: 'INPUT FACTORS', value: '38 tire & wing variables' }
    ],
    summary: 'Formula 1 strategic command engine that models tire rubber crystallization, brake thermal dissipation, and aero wake dirty air impact across multi-car battle intervals. Calculates optimal pit undercut windows under safety car deltas.',
    technologies: ['Python', 'NumPy / Numba', 'Next.js', 'Tailwind', 'Canvas 2D Telemetry', 'Docker'],
    architecture: `
[LIVE TRACK SECTOR TIMING DATA]
             │
             ▼
[MONTE CARLO COMBINATORIAL ENGINE]
 ├── Track Temperature Decay Solver
 ├── Dirty Air Aero Wake Penalty Matrix
 └── Safety Car Stochastic Trigger
             │
             ▼
[OPTIMAL STRATEGY COMMAND RECOMMENDATION]
    `
  },
  'chronos-sigil': {
    title: 'CHRONOS-SIGIL // ARCANE COMPUTE RUNTIME',
    tag: 'ARCANE WEB & AI',
    specs: [
      { label: 'RENDERING', value: 'Procedural GLSL Shaders' },
      { label: 'FRAME TIMING', value: 'Locked 120 FPS' },
      { label: 'AUDIO SYNTH', value: 'Web Audio Modular Synthesizer' },
      { label: 'FILE SIZE', value: '18 KB Zero-Dependency' }
    ],
    summary: 'An experimental web experience combining procedural geometry, runic cryptographic puzzles, and generative soundscapes. Built with pure mathematics and raw WebGL shaders without external dependencies.',
    technologies: ['WebGL 2.0', 'Raw GLSL', 'Web Audio API', 'TypeScript', 'Vite'],
    architecture: `
[USER RUNIC INTERACTION]
             │
             ▼
[RAYMARCHING FRAGMENT SHADER]
 ├── Quaternion Arcane Fractals
 └── Dynamic Volumetric Green Fog
             │
             ▼
[SYNCHRONIZED WEB AUDIO SYNTHESIZER]
    `
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const audio = new LatverianAudio();

  // 1. Preloader Logic
  const preloader = document.getElementById('preloader');
  const preloaderProgress = document.getElementById('preloader-progress');
  const preloaderStatus = document.getElementById('preloader-status');

  const statusMessages = [
    'SYNCHRONIZING OBSIDIAN CORES...',
    'CALIBRATING TITANIUM ALLOY...',
    'INVOKING RUNIC FREQUENCIES...',
    'OPTIMIZING AERODYNAMIC FLOW...',
    'LATVERIAN INTERFACE READY.'
  ];

  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 18) + 6;
    if (progress > 100) progress = 100;

    if (preloaderProgress) {
      preloaderProgress.textContent = `${String(progress).padStart(2, '0')}%`;
    }

    const msgIndex = Math.min(Math.floor((progress / 100) * statusMessages.length), statusMessages.length - 1);
    if (preloaderStatus) {
      preloaderStatus.textContent = `[ ${statusMessages[msgIndex]} ]`;
    }

    if (progress === 100) {
      clearInterval(progressInterval);
      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('fade-out');
          setTimeout(() => {
            preloader.style.display = 'none';
          }, 600);
        }
      }, 350);
    }
  }, 75);

  // 2. Audio SFX Toggle
  const audioToggle = document.getElementById('audio-toggle');
  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      const isEnabled = audio.toggle();
      audioToggle.textContent = isEnabled ? '[SFX: ACTIVE]' : '[SFX: MUTED]';
      audioToggle.classList.toggle('active', isEnabled);
    });
  }

  // Audio interaction triggers
  document.querySelectorAll('a, button, .project-card, .tab-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      audio.playBeep(1200, 0.03, 'sine', 0.02);
      if (el.classList.contains('project-card')) {
        audio.playGlitch();
      }
    });

    el.addEventListener('click', () => {
      audio.playBeep(700, 0.06, 'triangle', 0.05);
    });
  });

  // 3. Live Latveria Standard Time Telemetry
  const telemetryTime = document.getElementById('telemetry-clock');
  function updateTelemetryClock() {
    if (!telemetryTime) return;
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMins = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSecs = String(now.getUTCSeconds()).padStart(2, '0');
    const ms = String(Math.floor(now.getUTCMilliseconds() / 10)).padStart(2, '0');
    telemetryTime.textContent = `LATVERIA // ${utcHours}:${utcMins}:${utcSecs}.${ms} UTC`;
  }
  setInterval(updateTelemetryClock, 40);

  // 4. Project Category Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 5. Blueprint Modal
  const modal = document.getElementById('blueprint-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body');

  function openBlueprintModal(projectId) {
    const data = PROJECT_BLUEPRINTS[projectId];
    if (!data || !modal || !modalBody) return;

    modalBody.innerHTML = `
      <div class="blueprint-header">
        <div class="blueprint-tag">[ ${data.tag} ]</div>
        <h2 class="blueprint-title">${data.title}</h2>
      </div>

      <div class="blueprint-summary">
        <p>${data.summary}</p>
      </div>

      <div class="blueprint-specs-grid">
        ${data.specs.map(spec => `
          <div class="blueprint-spec-item">
            <span class="spec-label">${spec.label}</span>
            <span class="spec-val">[${spec.value}]</span>
          </div>
        `).join('')}
      </div>

      <div class="blueprint-section-title">
        <span class="accent-slash">//</span> SYSTEM ARCHITECTURE FLOW
      </div>
      <pre class="blueprint-ascii">${data.architecture}</pre>

      <div class="blueprint-section-title">
        <span class="accent-slash">//</span> CORE TECHNOLOGIES & RUNTIME
      </div>
      <div class="blueprint-tech-tags">
        ${data.technologies.map(t => `<span class="blueprint-pill">[ ${t} ]</span>`).join('')}
      </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeBlueprintModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-blueprint-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.project-card');
      if (card) {
        const id = card.getAttribute('data-project-id');
        openBlueprintModal(id);
      }
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeBlueprintModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeBlueprintModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeBlueprintModal();
    }
  });

  // 6. Diplomatic Uplink Form
  const uplinkForm = document.getElementById('uplink-form');
  const uplinkStatusLog = document.getElementById('uplink-status-log');
  const uplinkBtn = document.getElementById('uplink-submit-btn');

  if (uplinkForm) {
    uplinkForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('uplink-name')?.value.trim();
      const email = document.getElementById('uplink-email')?.value.trim();
      const clearance = document.getElementById('uplink-clearance')?.value;
      const message = document.getElementById('uplink-message')?.value.trim();

      if (!name || !email || !message) {
        if (uplinkStatusLog) {
          uplinkStatusLog.innerHTML = `<span class="log-err">[ERROR // PARAMETERS INCOMPLETE. ALL CHANNELS REQUIRED.]</span>`;
        }
        return;
      }

      if (uplinkBtn) {
        uplinkBtn.disabled = true;
        uplinkBtn.innerHTML = `<span>[ TRANSMITTING VIA RELAY... ]</span>`;
      }

      if (uplinkStatusLog) {
        uplinkStatusLog.innerHTML = `
          <div class="log-step">> ENCRYPTING PAYLOAD WITH 4096-BIT LATVERIAN CIPHER...</div>
        `;
      }

      setTimeout(() => {
        if (uplinkStatusLog) {
          uplinkStatusLog.innerHTML += `
            <div class="log-step">> ROUTING THROUGH SECURE SATELLITE NODE [LAT-ORBIT-44]...</div>
          `;
        }
      }, 700);

      setTimeout(() => {
        if (uplinkStatusLog) {
          uplinkStatusLog.innerHTML += `
            <div class="log-step log-success">> TRANSMISSION VERIFIED. DISPATCH RECORDED IN THE ARCHIVES.</div>
            <div class="log-info">> [ORIGIN: ${escapeHtml(name)}] // [CLEARANCE: ${escapeHtml(clearance)}]</div>
            <div class="log-info">> AWAIT LATVERIAN DIPLOMATIC RESPONSE AT: ${escapeHtml(email)}</div>
          `;
        }

        if (uplinkBtn) {
          uplinkBtn.disabled = false;
          uplinkBtn.innerHTML = `<span>[ TRANSMISSION DISPATCHED // STAND BY ]</span>`;
          audio.playBeep(980, 0.15, 'triangle', 0.08);
        }

        uplinkForm.reset();
      }, 1500);
    });
  }

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
      }[s];
    });
  }

  // 7. Smooth Scroll Navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // 8. Active Nav Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
