import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export const DynamicParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

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

    // Mouse coordinates tracker (works globally on window)
    const mouse = {
      x: null as number | null,
      y: null as number | null,
      vx: 0,
      vy: 0,
      lastX: null as number | null,
      lastY: null as number | null,
    };

    // Arrays to hold particle entities matching TheMOZZARELLA's architecture
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
      draw: (c: CanvasRenderingContext2D, isDark: boolean) => void;
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
      draw: (c: CanvasRenderingContext2D, isDark: boolean) => void;
    }

    interface RippleItem {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      lineWidth: number;
      update: () => void;
      draw: (c: CanvasRenderingContext2D, isDark: boolean) => void;
      isDone: () => boolean;
    }

    const particles: ParticleItem[] = [];
    const fireworkParticles: ParticleItem[] = [];
    const dustParticles: DustItem[] = [];
    const ripples: RippleItem[] = [];
    const techRipples: RippleItem[] = [];

    // Responsive particle count logic
    const getParticleCount = (width: number, height: number) => {
      if (width < 640) return 35;
      if (width < 1024) return 60;
      if (width < 1600) return 90;
      return 115;
    };

    const getDustCount = (width: number) => {
      return width < 640 ? 60 : 130;
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

        const baseSpeed = isFirework ? Math.random() * 2.8 + 1.2 : Math.random() * 0.45 + 0.25;
        const moveAngle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(moveAngle) * baseSpeed;
        this.vy = Math.sin(moveAngle) * baseSpeed;

        this.size = isFirework ? Math.random() * 2 + 1.8 : Math.random() * 2.5 + 1.2;
        this.alpha = isFirework ? 1 : Math.random() * 0.5 + 0.5;
        this.sizeDirection = Math.random() < 0.5 ? -1 : 1;
        this.trail = [];
      }

      update() {
        if (!this.isFirework) {
          // Magnetism to mouse
          if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distSq = dx * dx + dy * dy;
            const maxDistSq = 28900; // ~170px radius

            if (distSq < maxDistSq && distSq > 4) {
              const dist = Math.sqrt(distSq);
              const force = (maxDistSq - distSq) / maxDistSq;
              this.vx += (dx / dist) * force * 0.08;
              this.vy += (dy / dist) * force * 0.08;
            }
          } else if (autoDrift) {
            this.vx += (Math.random() - 0.5) * 0.025;
            this.vy += (Math.random() - 0.5) * 0.025;
          }

          // Friction damping
          const friction = mouse.x !== null ? 0.99 : 0.997;
          this.vx *= friction;
          this.vy *= friction;
        } else {
          // Firework sparks decay
          this.alpha -= 0.022;
          this.vx *= 0.96;
          this.vy *= 0.96;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundaries
        if (canvas) {
          if (this.x <= 0) {
            this.x = 0;
            this.vx *= -0.9;
          } else if (this.x >= canvas.width) {
            this.x = canvas.width;
            this.vx *= -0.9;
          }
          if (this.y <= 0) {
            this.y = 0;
            this.vy *= -0.9;
          } else if (this.y >= canvas.height) {
            this.y = canvas.height;
            this.vy *= -0.9;
          }
        }

        // Size pulsing
        this.size += this.sizeDirection * 0.06;
        if (this.size > 3.8 || this.size < 1.0) {
          this.sizeDirection *= -1;
        }

        // Motion trail
        if (
          frameCount % 2 === 0 &&
          (Math.abs(this.vx) > 0.15 || Math.abs(this.vy) > 0.15)
        ) {
          this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
          if (this.trail.length > 10) this.trail.shift();
        }
      }

      draw(c: CanvasRenderingContext2D, isDark: boolean) {
        const radius = Math.max(0.5, this.size);
        const grad = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);

        if (isDark) {
          // Pure monochrome: luminous silver-white to translucent charcoal
          grad.addColorStop(0, `rgba(255, 255, 255, ${Math.min(1, this.alpha * 0.95)})`);
          grad.addColorStop(0.5, `rgba(220, 225, 235, ${Math.min(1, this.alpha * 0.6)})`);
          grad.addColorStop(1, `rgba(140, 145, 160, 0)`);
          c.shadowBlur = c.canvas.width > 900 ? 6 : 0;
          c.shadowColor = `rgba(255, 255, 255, ${Math.min(0.6, this.alpha * 0.6)})`;
        } else {
          // Light mode monochrome: sleek charcoal / slate to transparent
          grad.addColorStop(0, `rgba(18, 18, 22, ${Math.min(1, this.alpha * 0.85)})`);
          grad.addColorStop(0.5, `rgba(50, 55, 65, ${Math.min(1, this.alpha * 0.45)})`);
          grad.addColorStop(1, `rgba(100, 105, 115, 0)`);
          c.shadowBlur = 0;
        }

        c.fillStyle = grad;
        c.beginPath();
        c.arc(this.x, this.y, radius, 0, Math.PI * 2);
        c.fill();
        c.shadowBlur = 0;

        // Trails
        if (this.trail.length > 1) {
          c.beginPath();
          c.lineWidth = 1;
          for (let i = 0; i < this.trail.length - 1; i++) {
            const p1 = this.trail[i];
            const p2 = this.trail[i + 1];
            const trailAlpha = (i / this.trail.length) * 0.25 * this.alpha;
            c.strokeStyle = isDark
              ? `rgba(255, 255, 255, ${trailAlpha})`
              : `rgba(20, 20, 25, ${trailAlpha})`;
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
        this.x = Math.random() * (canvas?.width || 1000);
        this.y = Math.random() * (canvas?.height || 800);
        this.size = Math.random() * 1.4 + 0.4;
        this.vx = (Math.random() - 0.5) * 0.06;
        this.vy = (Math.random() - 0.5) * 0.06;
        this.alpha = Math.random() * 0.3 + 0.1;
      }

      update() {
        if (!canvas) return;
        this.x = (this.x + this.vx + canvas.width) % canvas.width;
        this.y = (this.y + this.vy + canvas.height) % canvas.height;
      }

      draw(c: CanvasRenderingContext2D, isDark: boolean) {
        c.fillStyle = isDark
          ? `rgba(255, 255, 255, ${this.alpha * 0.4})`
          : `rgba(0, 0, 0, ${this.alpha * 0.25})`;
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

      constructor(x: number, y: number, maxRadius = 35, lineWidth = 1.2) {
        this.x = x;
        this.y = y;
        this.radius = 2;
        this.maxRadius = maxRadius;
        this.alpha = 0.4;
        this.lineWidth = lineWidth;
      }

      update() {
        this.radius += (this.maxRadius - this.radius) * 0.08 + 0.8;
        this.alpha -= 0.015;
      }

      draw(c: CanvasRenderingContext2D, isDark: boolean) {
        if (this.alpha <= 0) return;
        c.strokeStyle = isDark
          ? `rgba(255, 255, 255, ${Math.max(0, this.alpha * 0.5)})`
          : `rgba(20, 20, 25, ${Math.max(0, this.alpha * 0.35)})`;
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
      if (!canvas) return;
      particles.length = 0;
      dustParticles.length = 0;

      const numParticles = getParticleCount(canvas.width, canvas.height);
      for (let i = 0; i < numParticles; i++) {
        particles.push(
          new Particle(Math.random() * canvas.width, Math.random() * canvas.height)
        );
      }

      const numDust = getDustCount(canvas.width);
      for (let i = 0; i < numDust; i++) {
        dustParticles.push(new DustParticle());
      }
    };

    // Canvas resize handling
    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);

      initParticles();
    };

    // Black and white shifting gradient generator
    const drawMonochromeBackground = (isDark: boolean) => {
      if (!canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Slow revolving linear gradient angle
      angle = (angle + 0.0012) % (Math.PI * 2);
      const x1 = w / 2 + Math.cos(angle) * (w * 0.6);
      const y1 = h / 2 + Math.sin(angle) * (h * 0.6);
      const x2 = w / 2 - Math.cos(angle) * (w * 0.6);
      const y2 = h / 2 - Math.sin(angle) * (h * 0.6);

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);

      if (isDark) {
        // Deep Obsidian -> Charcoal -> Midnight Black monochromatic luxury spectrum
        grad.addColorStop(0, '#070707');
        grad.addColorStop(0.35, '#121214');
        grad.addColorStop(0.7, '#18181B');
        grad.addColorStop(1, '#09090B');
      } else {
        // Clean Ivory -> Pearl Gray -> Soft Mist White monochromatic spectrum
        grad.addColorStop(0, '#FAF7F3');
        grad.addColorStop(0.4, '#F3EFEA');
        grad.addColorStop(0.8, '#E9ECEF');
        grad.addColorStop(1, '#FFFFFF');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    };

    // Spatial network connection lines (spatial grid optimization)
    const connectNearbyParticles = (isDark: boolean) => {
      const maxDistance = 110;
      const maxDistanceSq = maxDistance * maxDistance;
      const count = particles.length;

      ctx.lineWidth = 0.9;
      for (let i = 0; i < count; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < count; j++) {
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistanceSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / maxDistance) * (isDark ? 0.28 : 0.16);
            ctx.strokeStyle = isDark
              ? `rgba(255, 255, 255, ${lineAlpha})`
              : `rgba(20, 20, 25, ${lineAlpha})`;
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

      const isDark = theme === 'dark';
      drawMonochromeBackground(isDark);

      // Dust layer
      for (let i = 0; i < dustParticles.length; i++) {
        dustParticles[i].update();
        dustParticles[i].draw(ctx, isDark);
      }

      // Tech and click ripples
      for (let i = techRipples.length - 1; i >= 0; i--) {
        const r = techRipples[i];
        r.update();
        r.draw(ctx, isDark);
        if (r.isDone()) techRipples.splice(i, 1);
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.update();
        r.draw(ctx, isDark);
        if (r.isDone()) ripples.splice(i, 1);
      }

      // Main particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx, isDark);
      }

      // Firework spark explosion particles
      for (let i = fireworkParticles.length - 1; i >= 0; i--) {
        const fp = fireworkParticles[i];
        fp.update();
        fp.draw(ctx, isDark);
        if (fp.isDead()) fireworkParticles.splice(i, 1);
      }

      // Connect particles
      connectNearbyParticles(isDark);

      frameCount++;
      animationFrameId = requestAnimationFrame(animate);
    };

    // Window event listeners (non-blocking)
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      autoDrift = false;

      // Add delicate cursor ripple on movement every 8 frames
      if (frameCount % 8 === 0) {
        techRipples.push(new Ripple(mouse.x, mouse.y, 25, 0.8));
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

      // Click shockwave ripple
      ripples.push(new Ripple(clickX, clickY, 70, 1.5));

      // Burst of firework sparks in black & white
      const burstCount = 16;
      for (let i = 0; i < burstCount; i++) {
        const spark = new Particle(clickX, clickY, true);
        const burstAngle = (i / burstCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const burstSpeed = Math.random() * 2.8 + 1.2;
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
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
};
