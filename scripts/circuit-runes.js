/**
 * Circuit-Runes Canvas Engine
 * Renders faint, low-opacity line art combining rigid, angular circuit board lines
 * on the left morphing into circular, glowing magical sigils (runes) on the right.
 */

class CircuitRunesBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
    this.time = 0;
    this.particles = [];
    this.circuits = [];
    this.sigils = [];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
    });

    this.createCircuits();
    this.createSigils();
    this.createParticles();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.createCircuits();
    this.createSigils();
  }

  createCircuits() {
    this.circuits = [];
    const count = Math.floor(this.height / 35);
    const midX = this.width * 0.55;

    for (let i = 0; i < count; i++) {
      const startY = (i * 35) + (Math.random() * 15);
      const points = [{ x: 0, y: startY }];
      let currentX = 0;
      let currentY = startY;

      // Create angular paths moving toward center
      const segments = 3 + Math.floor(Math.random() * 4);
      for (let s = 0; s < segments; s++) {
        currentX += (midX / segments) * (0.7 + Math.random() * 0.6);
        if (currentX > midX) currentX = midX;

        // 45 degree turn or horizontal
        if (Math.random() > 0.4) {
          const dy = (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 30);
          currentY += dy;
        }
        points.push({ x: currentX, y: currentY });
      }

      this.circuits.push({
        points,
        speed: 0.8 + Math.random() * 1.4,
        pulseOffset: Math.random() * 100,
        hasNode: Math.random() > 0.4,
        width: Math.random() > 0.8 ? 1.5 : 1
      });
    }
  }

  createSigils() {
    this.sigils = [];
    const centerX = this.width * 0.78;
    const centerY = this.height * 0.48;
    const baseRadius = Math.min(this.width, this.height) * 0.38;

    // Outer concentric rune rings
    this.sigils.push({
      cx: centerX,
      cy: centerY,
      radius: baseRadius,
      rotSpeed: 0.0008,
      type: 'outer-ring',
      segments: 24
    });

    this.sigils.push({
      cx: centerX,
      cy: centerY,
      radius: baseRadius * 0.82,
      rotSpeed: -0.0012,
      type: 'runic-inscriptions',
      segments: 16
    });

    this.sigils.push({
      cx: centerX,
      cy: centerY,
      radius: baseRadius * 0.62,
      rotSpeed: 0.0016,
      type: 'pentagram-core'
    });

    this.sigils.push({
      cx: centerX,
      cy: centerY,
      radius: baseRadius * 0.38,
      rotSpeed: -0.002,
      type: 'inner-gear-lattice'
    });

    // Secondary smaller mystic nodes
    this.sigils.push({
      cx: this.width * 0.62,
      cy: this.height * 0.22,
      radius: baseRadius * 0.22,
      rotSpeed: 0.0025,
      type: 'satellite'
    });

    this.sigils.push({
      cx: this.width * 0.88,
      cy: this.height * 0.78,
      radius: baseRadius * 0.28,
      rotSpeed: -0.0018,
      type: 'satellite'
    });
  }

  createParticles() {
    this.particles = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.2) * 0.6,
        vy: -0.3 - Math.random() * 0.5,
        size: 1 + Math.random() * 2,
        alpha: 0.15 + Math.random() * 0.45,
        life: Math.random() * 100,
        maxLife: 80 + Math.random() * 100
      });
    }
  }

  drawCircuits() {
    const ctx = this.ctx;

    this.circuits.forEach((c, idx) => {
      ctx.beginPath();
      ctx.lineWidth = c.width;
      ctx.strokeStyle = 'rgba(135, 134, 129, 0.12)'; // Brushed Titanium faint trace

      const pts = c.points;
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.stroke();

      // Terminal circuit pad
      const last = pts[pts.length - 1];
      ctx.beginPath();
      ctx.arc(last.x, last.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(135, 134, 129, 0.25)';
      ctx.fill();

      // Flowing data pulse along the circuit (Mystic Green)
      const totalDist = pts.length - 1;
      const progress = ((this.time * c.speed * 0.2 + c.pulseOffset) % 100) / 100;
      const segIndex = Math.min(Math.floor(progress * totalDist), totalDist - 1);
      const subT = (progress * totalDist) - segIndex;

      const p1 = pts[segIndex];
      const p2 = pts[segIndex + 1];
      if (p1 && p2) {
        const px = p1.x + (p2.x - p1.x) * subT;
        const py = p1.y + (p2.y - p1.y) * subT;

        // Glowing pulse head
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(57, 255, 20, 0.6)';
        ctx.shadowColor = '#39FF14';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
    });

    // Bridge lines connecting circuits to right sigils
    const bridgeStartX = this.width * 0.52;
    const bridgeEndX = this.width * 0.68;
    ctx.strokeStyle = 'rgba(27, 77, 62, 0.2)'; // Latverian Emerald faint bridge
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const y = this.height * (0.25 + i * 0.1);
      ctx.beginPath();
      ctx.moveTo(bridgeStartX, y);
      ctx.bezierCurveTo(
        bridgeStartX + 60, y + (i % 2 === 0 ? 30 : -30),
        bridgeEndX - 60, y + (i % 2 === 0 ? -20 : 20),
        bridgeEndX, y
      );
      ctx.stroke();
    }
  }

  drawSigil(sigil) {
    const ctx = this.ctx;
    const { cx, cy, radius, rotSpeed, type } = sigil;
    const angle = this.time * rotSpeed;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    if (type === 'outer-ring') {
      // Outer boundary circle
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(27, 77, 62, 0.28)'; // Emerald
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Tick marks on perimeter
      const ticks = 36;
      for (let i = 0; i < ticks; i++) {
        const a = (i * Math.PI * 2) / ticks;
        const r1 = radius - (i % 4 === 0 ? 8 : 4);
        const r2 = radius;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
        ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
        ctx.strokeStyle = i % 4 === 0 ? 'rgba(57, 255, 20, 0.3)' : 'rgba(135, 134, 129, 0.2)';
        ctx.stroke();
      }
    } else if (type === 'runic-inscriptions') {
      // Runic glyph geometric shapes
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(135, 134, 129, 0.18)';
      ctx.setLineDash([8, 12]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Angular triangular rune glyphs
      const glyphs = 8;
      for (let i = 0; i < glyphs; i++) {
        const a = (i * Math.PI * 2) / glyphs;
        const gx = Math.cos(a) * radius;
        const gy = Math.sin(a) * radius;

        ctx.save();
        ctx.translate(gx, gy);
        ctx.rotate(a + Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(-6, -6);
        ctx.lineTo(0, 6);
        ctx.lineTo(6, -6);
        ctx.closePath();
        ctx.strokeStyle = 'rgba(57, 255, 20, 0.25)';
        ctx.stroke();
        ctx.restore();
      }
    } else if (type === 'pentagram-core') {
      // Arcane pentagram star geometry
      const points = 5;
      const step = 2; // Star skip
      const starPts = [];
      for (let i = 0; i < points; i++) {
        const a = (i * Math.PI * 2) / points - Math.PI / 2;
        starPts.push({ x: Math.cos(a) * radius, y: Math.sin(a) * radius });
      }

      ctx.beginPath();
      for (let i = 0; i < points; i++) {
        const nextIdx = (i * step) % points;
        if (i === 0) ctx.moveTo(starPts[nextIdx].x, starPts[nextIdx].y);
        else ctx.lineTo(starPts[nextIdx].x, starPts[nextIdx].y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(27, 77, 62, 0.35)'; // Latverian emerald
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Glowing nodes at vertices
      starPts.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(57, 255, 20, 0.4)';
        ctx.shadowColor = '#39FF14';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    } else if (type === 'inner-gear-lattice') {
      // Mechanical Gear inner mesh (Latverian engineering)
      const teeth = 12;
      const rInner = radius * 0.82;
      const rOuter = radius;
      ctx.beginPath();
      for (let i = 0; i < teeth; i++) {
        const a0 = (i * 2 * Math.PI) / teeth;
        const a1 = a0 + (Math.PI / teeth) * 0.4;
        const a2 = a0 + (Math.PI / teeth) * 0.8;
        const a3 = ((i + 1) * 2 * Math.PI) / teeth;

        if (i === 0) ctx.moveTo(Math.cos(a0) * rInner, Math.sin(a0) * rInner);
        ctx.lineTo(Math.cos(a1) * rOuter, Math.sin(a1) * rOuter);
        ctx.lineTo(Math.cos(a2) * rOuter, Math.sin(a2) * rOuter);
        ctx.lineTo(Math.cos(a3) * rInner, Math.sin(a3) * rInner);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(135, 134, 129, 0.3)'; // Titanium
      ctx.stroke();

      // Center ring
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(57, 255, 20, 0.3)';
      ctx.stroke();
    } else if (type === 'satellite') {
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(27, 77, 62, 0.2)';
      ctx.stroke();

      // Triangle
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const a = (i * Math.PI * 2) / 3;
        const px = Math.cos(a) * radius;
        const py = Math.sin(a) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(135, 134, 129, 0.18)';
      ctx.stroke();
    }

    ctx.restore();
  }

  drawParticles() {
    const ctx = this.ctx;
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      if (p.life > p.maxLife || p.y < -10 || p.x < -10 || p.x > this.width + 10) {
        p.x = Math.random() * this.width;
        p.y = this.height + 10;
        p.life = 0;
      }

      const alphaProgress = Math.sin((p.life / p.maxLife) * Math.PI);
      const alpha = p.alpha * alphaProgress;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(57, 255, 20, ${alpha * 0.4})`;
      ctx.fill();
    });
  }

  animate() {
    this.time++;

    // Smooth mouse interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Render components
    this.drawCircuits();
    this.sigils.forEach(sigil => this.drawSigil(sigil));
    this.drawParticles();

    // Subtle interactive light beam near mouse
    if (this.mouse.x > 0 && this.mouse.y > 0) {
      const grad = this.ctx.createRadialGradient(
        this.mouse.x, this.mouse.y, 0,
        this.mouse.x, this.mouse.y, 350
      );
      grad.addColorStop(0, 'rgba(27, 77, 62, 0.07)');
      grad.addColorStop(0.5, 'rgba(57, 255, 20, 0.02)');
      grad.addColorStop(1, 'rgba(10, 10, 10, 0)');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CircuitRunesBackground('circuit-runes-canvas');
});

