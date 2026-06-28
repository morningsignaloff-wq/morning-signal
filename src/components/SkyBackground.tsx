"use client";

import { useEffect, useRef } from "react";

type RGB = [number, number, number];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const rgb = (c: RGB) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;

// Sky keyframes (top + bottom) across scroll progress: night -> dawn -> daylight
const SKY: { p: number; top: RGB; bottom: RGB }[] = [
  { p: 0, top: [10, 7, 18], bottom: [38, 24, 70] },
  { p: 0.5, top: [49, 30, 92], bottom: [251, 113, 133] },
  { p: 0.78, top: [120, 150, 230], bottom: [253, 186, 116] },
  { p: 1, top: [56, 130, 220], bottom: [183, 219, 252] },
];

function sampleSky(p: number, key: "top" | "bottom"): RGB {
  for (let i = 0; i < SKY.length - 1; i++) {
    const a = SKY[i];
    const b = SKY[i + 1];
    if (p <= b.p) {
      const t = (p - a.p) / (b.p - a.p);
      const ca = a[key];
      const cb = b[key];
      return [lerp(ca[0], cb[0], t), lerp(ca[1], cb[1], t), lerp(ca[2], cb[2], t)];
    }
  }
  return SKY[SKY.length - 1][key];
}

const STARS = Array.from({ length: 110 }, (_, i) => ({
  x: Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1),
  y: Math.abs((Math.sin(i * 78.233) * 12543.123) % 1),
  r: 0.3 + ((Math.sin(i * 3.7) + 1) / 2) * 0.9,
  ph: i * 1.3,
}));

// Soft drifting clouds, each a cluster of overlapping puffs (offset/radius in
// fractions of a base size). x/y are viewport fractions; speed in px/sec.
const CLOUDS = [
  { x: 0.16, y: 0.2, scale: 1.1, speed: 7, alpha: 0.9 },
  { x: 0.74, y: 0.16, scale: 1.4, speed: 5, alpha: 0.8 },
  { x: 0.45, y: 0.32, scale: 0.85, speed: 9, alpha: 0.7 },
  { x: 0.9, y: 0.4, scale: 1.0, speed: 6, alpha: 0.75 },
  { x: 0.3, y: 0.5, scale: 1.25, speed: 4, alpha: 0.6 },
];

const PUFFS: [number, number, number][] = [
  [-1.5, 0.15, 0.85],
  [-0.7, -0.2, 1.05],
  [0.2, -0.05, 1.2],
  [1.1, 0.1, 0.95],
  [0.45, 0.3, 0.8],
];

/**
 * Fixed full-viewport canvas that renders an animated sunrise behind the whole
 * landing page. Progress is driven by how far the hero element (#sky-hero) has
 * been scrolled: it reaches full daylight when the hero is fully scrolled, then
 * stays there (clamped) as the rest of the page scrolls over it.
 */
export function SkyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cssW = 0;
    let cssH = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = canvas.clientWidth;
      cssH = canvas.clientHeight;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const computeProgress = () => {
      const hero = document.getElementById("sky-hero");
      if (!hero) {
        progressRef.current = 0;
        return;
      }
      const total = hero.offsetHeight - window.innerHeight;
      progressRef.current = total > 0 ? clamp(-hero.getBoundingClientRect().top / total) : 1;
    };

    const draw = (time: number) => {
      const p = progressRef.current;
      const W = cssW;
      const H = cssH;
      if (W === 0 || H === 0) return;

      const top = sampleSky(p, "top");
      const bottom = sampleSky(p, "bottom");
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, rgb(top));
      g.addColorStop(1, rgb(bottom));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      const starA = clamp(1 - p * 1.9);
      if (starA > 0.01) {
        ctx.fillStyle = "#fff";
        for (const s of STARS) {
          const tw = 0.55 + 0.45 * Math.sin(time * 0.0015 + s.ph);
          ctx.globalAlpha = starA * tw;
          ctx.beginPath();
          ctx.arc(s.x * W, s.y * H * 0.72, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      const e = easeInOut(p);
      const sunX = W * 0.5;
      const sunY = lerp(H * 1.18, H * 0.36, e);
      const sunR = lerp(H * 0.09, H * 0.15, e);

      // Tight, crisp halo (kept small so the sky stays clean)
      const glow = ctx.createRadialGradient(sunX, sunY, sunR * 0.8, sunX, sunY, sunR * 2.6);
      glow.addColorStop(0, `rgba(255, 236, 196, ${0.4 + 0.3 * e})`);
      glow.addColorStop(1, "rgba(253, 186, 116, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // Rotating sun rays — appear as the day breaks
      const rayAlpha = 0.16 * e;
      if (rayAlpha > 0.01) {
        const rays = 12;
        ctx.save();
        ctx.translate(sunX, sunY);
        ctx.rotate(time * 0.00016);
        ctx.fillStyle = `rgba(255, 224, 165, ${rayAlpha})`;
        for (let i = 0; i < rays; i++) {
          ctx.rotate((Math.PI * 2) / rays);
          ctx.beginPath();
          ctx.moveTo(-sunR * 0.1, -sunR * 1.35);
          ctx.lineTo(0, -sunR * 2.9);
          ctx.lineTo(sunR * 0.1, -sunR * 1.35);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // Crisp sun disc
      const disc = ctx.createRadialGradient(sunX, sunY - sunR * 0.2, 0, sunX, sunY, sunR);
      disc.addColorStop(0, "#fffdf7");
      disc.addColorStop(0.65, "#ffe1a3");
      disc.addColorStop(1, "#fbbf4f");
      ctx.fillStyle = disc;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
      ctx.fill();

      // Drifting clouds — fade in with daylight
      const cloudA = clamp((p - 0.55) / 0.3);
      if (cloudA > 0.01) {
        const base = H * 0.07;
        const span = W + base * 8;
        for (const c of CLOUDS) {
          const drift = (c.x * span + (time / 1000) * c.speed) % span;
          const cx = drift - base * 4;
          const cy = c.y * H;
          const s = base * c.scale;
          for (const [ox, oy, pr] of PUFFS) {
            const px = cx + ox * s;
            const py = cy + oy * s;
            const r = pr * s;
            const grad = ctx.createRadialGradient(px, py, 0, px, py, r);
            grad.addColorStop(0, `rgba(255, 255, 255, ${0.9 * cloudA * c.alpha})`);
            grad.addColorStop(0.7, `rgba(255, 255, 255, ${0.45 * cloudA * c.alpha})`);
            grad.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(px, py, r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    let raf = 0;
    const loop = (time: number) => {
      draw(time);
      raf = requestAnimationFrame(loop);
    };

    resize();
    computeProgress();
    raf = requestAnimationFrame(loop);

    const onScroll = () => computeProgress();
    const onResize = () => {
      resize();
      computeProgress();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="sky-canvas" aria-hidden />;
}
