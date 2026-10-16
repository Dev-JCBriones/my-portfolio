import React, { useEffect, useRef } from 'react';

export const DynamicParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let isTabVisible = true;
    let angle = 0;
    let frameCount = 0;
    let autoDrift = true;

    // Mouse coordinates tracker
    const mouse = {
      x: null as number | null,
      y: null as number | null,
      vx: 0,
      vy: 0,
    };

    interface ParticleItem {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      sizeDirection: number;
      isFirework: boolean;
      trail: Array<{ x: number; y: number; alpha: number }>;
      update: () => void;
      draw: (c: CanvasRenderingContext2D) => void;
      isDead: () => boolean;
    }

    interface DustItem {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      alpha: number;
      update: () => void;
      draw: (c: CanvasRenderingContext2D) => void;
    }

    interface RippleItem {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      lineWidth: number;
      update: () => void;
      draw: (c: CanvasRenderingContext2D) => void;
      isDone: () => boolean;
    }

    const particles: ParticleItem[] = [];
    const fireworkParticles: ParticleItem[] = [];
    const dustParticles: DustItem[] = [];
    const ripples: RippleItem[] = [];
    const techRipples: RippleItem[] = [];

    // Hardware-conscious responsive particle counts
    const getParticleCount = (width: number) => {
      if (width < 640) return 24;
      if (width < 1024) return 45;
      return 70;
    };

    const getDustCount = (width: number) => {
      if (width < 640) return 30;
      if (width < 1024) return 55;
      return 85;
    };

    const getConnectionDistance = (width: number) => {
      return width < 640 ? 75 : 105;
    };

    // Particle Factory
    class Particle implements ParticleItem {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      sizeDirection: number;
      isFirework: boolean;
      trail: Array<{ x: number; y: number; alpha: number }>;

      constructor(x: number, y: number, isFirework = false) {
        this.isFirework = isFirework;
        this.x = x;
        this.y = y;

        const baseSpeed = isFirework ? Math.random() * 2.5 + 1.2 : Math.random() * 0.4 + 0.2;
        const moveAngle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(moveAngle) * baseSpeed;
        this.vy = Math.sin(moveAngle) * baseSpeed;

        this.size = isFirework ? Math.random() * 1.8 + 1.4 : Math.random() * 2.2 + 1.2;
        this.alpha = isFirework ? 1 : Math.random() * 0.45 + 0.5;
        this.sizeDirection = Math.random() < 0.5 ? -1 : 1;
        this.trail = [];
      }

      update() {
        if (!this.isFirework) {
          // Magnetism to cursor
          if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distSq = dx * dx + dy * dy;
            const maxDistSq = 25600; // 160px radius

            if (distSq < maxDistSq && distSq > 4) {
              const dist = Math.sqrt(distSq);
              const force = (maxDistSq - distSq) / maxDistSq;
              this.vx += (dx / dist) * force * 0.07;
              this.vy += (dy / dist) * force * 0.07;
            }
          } else if (autoDrift) {
            this.vx += (Math.random() - 0.5) * 0.02;
            this.vy += (Math.random() - 0.5) * 0.02;
          }

          // Friction damping
          const friction = mouse.x !== null ? 0.99 : 0.997;
          this.vx *= friction;
          this.vy *= friction;
        } else {
          // Firework sparks decay
          this.alpha -= 0.025;
          this.vx *= 0.95;
          this.vy *= 0.95;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundaries
        if (canvas) {
          if (this.x <= 0) {
            this.x = 0;
            this.vx *= -0.85;
          } else if (this.x >= window.innerWidth) {
            this.x = window.innerWidth;
            this.vx *= -0.85;
          }
          if (this.y <= 0) {
            this.y = 0;
            this.vy *= -0.85;
          } else if (this.y >= window.innerHeight) {
            this.y = window.innerHeight;
            this.vy *= -0.85;
          }
        }

        // Gentle size pulsing
        this.size += this.sizeDirection * 0.04;
        if (this.size > 3.4 || this.size < 1.0) {
          this.sizeDirection *= -1;
        }

        // Lightweight motion trail (capped to 6 points)
        if (frameCount % 3 === 0 && (Math.abs(this.vx) > 0.2 || Math.abs(this.vy) > 0.2)) {
          this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
          if (this.trail.length > 6) this.trail.shift();
        }
      }

      draw(c: CanvasRenderingContext2D) {
        const radius = Math.max(0.6, this.size);
        const grad = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius * 1.5);

        // Luminous silver-white to translucent charcoal
        grad.addColorStop(0, `rgba(255, 255, 255, ${Math.min(1, this.alpha * 0.95)})`);
        grad.addColorStop(0.45, `rgba(220, 225, 235, ${Math.min(1, this.alpha * 0.55)})`);
        grad.addColorStop(1, `rgba(140, 145, 160, 0)`);

        c.fillStyle = grad;
        c.beginPath();
        c.arc(this.x, this.y, radius * 1.5, 0, Math.PI * 2);
        c.fill();

        // Trails
        if (this.trail.length > 1) {
          c.beginPath();
          c.lineWidth = 0.8;
          for (let i = 0; i < this.trail.length - 1; i++) {
            const p1 = this.trail[i];
            const p2 = this.trail[i + 1];
            const trailAlpha = (i / this.trail.length) * 0.22 * this.alpha;
            c.strokeStyle = `rgba(255, 255, 255, ${trailAlpha})`;
            c.moveTo(p1.x, p1.y);
            c.lineTo(p2.x, p2.y);
          }
          c.stroke();
        }
      }

      isDead() {
        return this.isFirework && this.alpha <= 0;
      }
    }

    // Ambient Dust Class
    class DustParticle implements DustItem {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      alpha: number;

      constructor() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 1.3 + 0.4;
        this.vx = (Math.random() - 0.5) * 0.05;
        this.vy = (Math.random() - 0.5) * 0.05;
        this.alpha = Math.random() * 0.3 + 0.1;
      }

      update() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.x = (this.x + this.vx + w) % w;
        this.y = (this.y + this.vy + h) % h;
      }

      draw(c: CanvasRenderingContext2D) {
        c.fillStyle = `rgba(255, 255, 255, ${this.alpha * 0.35})`;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
      }
    }

    // Ripple Class
    class Ripple implements RippleItem {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      lineWidth: number;

      constructor(x: number, y: number, maxRadius = 32, lineWidth = 1.0) {
        this.x = x;
        this.y = y;
        this.radius = 2;
        this.maxRadius = maxRadius;
        this.alpha = 0.35;
        this.lineWidth = lineWidth;
      }

      update() {
        this.radius += (this.maxRadius - this.radius) * 0.08 + 0.7;
        this.alpha -= 0.016;
      }

      draw(c: CanvasRenderingContext2D) {
        if (this.alpha <= 0) return;
        c.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, this.alpha * 0.45)})`;
        c.lineWidth = this.lineWidth;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.stroke();
      }

      isDone() {
        return this.alpha <= 0 || this.radius >= this.maxRadius;
      }
    }

    // Initialize all particles
    const initParticles = () => {
      particles.length = 0;
      dustParticles.length = 0;
      const w = window.innerWidth;
      const h = window.innerHeight;

      const numParticles = getParticleCount(w);
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(Math.random() * w, Math.random() * h));
      }

      const numDust = getDustCount(w);
      for (let i = 0; i < numDust; i++) {
        dustParticles.push(new DustParticle());
      }
    };

    // Canvas resize handling with capped DPR (max 1.5) for silky smooth performance
    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initParticles();
    };

    // Black and obsidian shifting gradient generator
    const drawMonochromeBackground = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Slow revolving linear gradient angle
      angle = (angle + 0.001) % (Math.PI * 2);
      const x1 = w / 2 + Math.cos(angle) * (w * 0.55);
      const y1 = h / 2 + Math.sin(angle) * (h * 0.55);
      const x2 = w / 2 - Math.cos(angle) * (w * 0.55);
      const y2 = h / 2 - Math.sin(angle) * (h * 0.55);

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, '#060608');
      grad.addColorStop(0.35, '#101114');
      grad.addColorStop(0.7, '#16171B');
      grad.addColorStop(1, '#08080A');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    };

    // Spatial network connection lines
    const connectNearbyParticles = () => {
      const maxDistance = getConnectionDistance(window.innerWidth);
      const maxDistanceSq = maxDistance * maxDistance;
      const count = particles.length;

      ctx.lineWidth = 0.8;
      for (let i = 0; i < count; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < count; j++) {
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          // Early exit if horizontal distance alone exceeds maxDistance
          if (Math.abs(dx) > maxDistance) continue;
          const dy = p2.y - p1.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistanceSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / maxDistance) * 0.24;
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    };

    // Main animation loop
    const animate = () => {
      if (!isTabVisible) return;

      drawMonochromeBackground();

      // Dust layer
      for (let i = 0; i < dustParticles.length; i++) {
        dustParticles[i].update();
        dustParticles[i].draw(ctx);
      }

      // Tech ripples
      for (let i = techRipples.length - 1; i >= 0; i--) {
        const r = techRipples[i];
        r.update();
        r.draw(ctx);
        if (r.isDone()) techRipples.splice(i, 1);
      }

      // Click shockwaves
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.update();
        r.draw(ctx);
        if (r.isDone()) ripples.splice(i, 1);
      }

      // Main particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
      }

      // Firework spark explosion particles
      for (let i = fireworkParticles.length - 1; i >= 0; i--) {
        const fp = fireworkParticles[i];
        fp.update();
        fp.draw(ctx);
        if (fp.isDead()) fireworkParticles.splice(i, 1);
      }

      // Connect particles
      connectNearbyParticles();

      frameCount++;
      animationFrameId = requestAnimationFrame(animate);
    };

    // Window event listeners (non-blocking)
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      autoDrift = false;

      // Add delicate cursor ripple every 10 frames
      if (frameCount % 10 === 0 && techRipples.length < 5) {
        techRipples.push(new Ripple(mouse.x, mouse.y, 22, 0.7));
      }
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
      autoDrift = true;
    };

    const handleClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;

      if (ripples.length < 4) {
        ripples.push(new Ripple(clickX, clickY, 65, 1.2));
      }

      // Burst of firework sparks in black & white
      const burstCount = window.innerWidth < 640 ? 10 : 16;
      for (let i = 0; i < burstCount; i++) {
        const spark = new Particle(clickX, clickY, true);
        const burstAngle = (i / burstCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const burstSpeed = Math.random() * 2.5 + 1.2;
        spark.vx = Math.cos(burstAngle) * burstSpeed;
        spark.vy = Math.sin(burstAngle) * burstSpeed;
        fireworkParticles.push(spark);
      }
    };

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 150);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    resizeCanvas();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
