"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/Logo";
import { PillCTA } from "@/components/PillCTA";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/context";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export function ScrollStory() {
  const { t } = useLanguage();
  const wrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);

  const scenes = t.story.scenes;
  // Visibility windows per scene [start, end]; each scene fully fades out
  // before the next fades in, so headings never overlap.
  const sceneWindows = [
    [-1, 0.13],
    [0.26, 0.37],
    [0.5, 0.61],
    [0.73, 0.84],
    [0.95, 2],
  ];

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const update = () => {
      const total = wrap.offsetHeight - window.innerHeight;
      const p = total > 0 ? clamp(-wrap.getBoundingClientRect().top / total) : 0;

      const fade = 0.06;
      sceneRefs.current.forEach((el, i) => {
        if (!el) return;
        const [start, end] = sceneWindows[i];
        const inLeft = clamp((p - (start - fade)) / fade);
        const inRight = clamp((end + fade - p) / fade);
        const o = Math.min(inLeft, inRight);
        el.style.opacity = String(o);
        el.style.transform = `translateY(calc(-50% + ${(1 - o) * 26}px))`;
        el.style.pointerEvents = o > 0.6 ? "auto" : "none";
      });

      if (hintRef.current) {
        hintRef.current.style.opacity = String(clamp(1 - p / 0.06));
      }

      // Fade out the legibility scrim as the story ends so there's no visible
      // seam where the hero meets the content below.
      if (overlayRef.current) {
        overlayRef.current.style.setProperty("--scrim", String(clamp((0.9 - p) / 0.15)));
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenes.length]);

  return (
    <div id="sky-hero" ref={wrapRef} className="scroll-story">
      <div className="scroll-story__sticky">
        <header className="scroll-story__nav">
          <Logo variant="dark" size="lg" showMark={false} />
          <div className="flex items-center gap-3 sm:gap-5">
            <LanguageSwitcher />
            <Link href="#integrations" className="cine-nav-link hidden sm:block">
              {t.nav.integrations}
            </Link>
            <Link href="#tarifs" className="cine-nav-link hidden sm:block">
              {t.nav.pricing}
            </Link>
            <PillCTA href="/signup" variant="ghost">
              {t.nav.earlyAccess}
            </PillCTA>
          </div>
        </header>

        <div className="scroll-story__overlay" ref={overlayRef}>
          <div className="scroll-story__inner">
            {scenes.map((s, i) => (
              <div
                key={i}
                ref={(el) => {
                  sceneRefs.current[i] = el;
                }}
                className="scroll-story__scene"
              >
                <span className="cine-badge">
                  <span className="cine-badge__dot" />
                  {s.kicker}
                </span>
                <h2 className="cine-heading mt-7">
                  {s.title} <span className="serif-italic">{s.titleItalic}</span>
                </h2>
                <p className="cine-subtitle mt-6 max-w-xl">{s.text}</p>
                {i === scenes.length - 1 && (
                  <div className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <PillCTA href="/signup">{t.hero.cta}</PillCTA>
                    <span className="text-sm text-white/60">{t.hero.trust}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div ref={hintRef} className="scroll-story__hint">
          <span className="scroll-hint">
            <span className="scroll-hint__mouse">
              <span className="scroll-hint__dot" />
            </span>
            {t.hero.scroll}
          </span>
        </div>
      </div>
    </div>
  );
}
