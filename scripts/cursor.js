/**
 * Latverian HUD Crosshair Cursor
 * Custom minimalist crosshair with a glowing green core, trailing reticle,
 * and dynamic spark micro-interactions on interactive elements.
 */

class LatverianCursor {
  constructor() {
    // Only initialize on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    this.cursorEl = document.createElement('div');
    this.cursorEl.className = 'latverian-cursor';
    this.cursorEl.innerHTML = `
      <div class="cursor-dot"></div>
      <div class="cursor-reticle">
        <span class="reticle-line top"></span>
        <span class="reticle-line right"></span>
        <span class="reticle-line bottom"></span>
        <span class="reticle-line left"></span>
      </div>
      <div class="cursor-coords">[000, 000]</div>
    `;
    document.body.appendChild(this.cursorEl);

    this.dot = this.cursorEl.querySelector('.cursor-dot');
    this.reticle = this.cursorEl.querySelector('.cursor-reticle');
    this.coords = this.cursorEl.querySelector('.cursor-coords');

    this.mouse = { x: -100, y: -100 };
    this.target = { x: -100, y: -100 };
    this.isHovering = false;
    this.isClicking = false;

    this.initEvents();
    this.render();
  }

  initEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      if (this.coords) {
        const xStr = String(Math.floor(this.mouse.x)).padStart(4, '0');
        const yStr = String(Math.floor(this.mouse.y)).padStart(4, '0');
        this.coords.textContent = `[${xStr}:${yStr}]`;
      }
    });

    window.addEventListener('mousedown', () => {
      this.isClicking = true;
      this.cursorEl.classList.add('cursor-active');
      this.spawnSparks(this.mouse.x, this.mouse.y, 6);
    });

    window.addEventListener('mouseup', () => {
      this.isClicking = false;
      this.cursorEl.classList.remove('cursor-active');
    });

    // Detect interactive targets for lock-on effect
    const interactiveSelector = 'a, button, input, textarea, select, .project-card, .interactive-target, .skill-tag';

    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest(interactiveSelector);
      if (target) {
        this.isHovering = true;
        this.cursorEl.classList.add('cursor-locked');
        
        if (target.classList.contains('project-card')) {
          this.cursorEl.classList.add('cursor-project');
          this.triggerCardSparks(target);
        }
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest(interactiveSelector);
      if (target) {
        this.isHovering = false;
        this.cursorEl.classList.remove('cursor-locked');
        this.cursorEl.classList.remove('cursor-project');
      }
    });
  }

  spawnSparks(x, y, count = 4) {
    for (let i = 0; i < count; i++) {
      const spark = document.createElement('div');
      spark.className = 'cursor-spark';
      document.body.appendChild(spark);

      const angle = Math.random() * Math.PI * 2;
      const velocity = 20 + Math.random() * 35;
      const dx = Math.cos(angle) * velocity;
      const dy = Math.sin(angle) * velocity;

      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.setProperty('--dx', `${dx}px`);
      spark.style.setProperty('--dy', `${dy}px`);

      setTimeout(() => spark.remove(), 550);
    }
  }

  triggerCardSparks(card) {
    const rect = card.getBoundingClientRect();
    // Spawn subtle electric sparks along the titanium border
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const side = Math.floor(Math.random() * 4);
        let sx, sy;
        if (side === 0) { // Top
          sx = rect.left + Math.random() * rect.width;
          sy = rect.top;
        } else if (side === 1) { // Right
          sx = rect.right;
          sy = rect.top + Math.random() * rect.height;
        } else if (side === 2) { // Bottom
          sx = rect.left + Math.random() * rect.width;
          sy = rect.bottom;
        } else { // Left
          sx = rect.left;
          sy = rect.top + Math.random() * rect.height;
        }
        this.spawnSparks(sx, sy, 2);
      }, i * 120);
    }
  }

  render() {
    // Reticle follows mouse with smooth lerp
    this.target.x += (this.mouse.x - this.target.x) * 0.22;
    this.target.y += (this.mouse.y - this.target.y) * 0.22;

    if (this.dot) {
      this.dot.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0)`;
    }

    if (this.reticle) {
      this.reticle.style.transform = `translate3d(${this.target.x}px, ${this.target.y}px, 0)`;
    }

    if (this.coords) {
      this.coords.style.transform = `translate3d(${this.mouse.x + 16}px, ${this.mouse.y + 16}px, 0)`;
    }

    requestAnimationFrame(() => this.render());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new LatverianCursor();
});
