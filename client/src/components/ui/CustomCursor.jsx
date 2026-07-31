import { useEffect, useRef } from 'react';
import useReducedMotion from '../../hooks/useReducedMotion.js';

// Minimal custom cursor that trails the pointer, disabled on touch/reduced motion
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    let ringX = 0;
    let ringY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let raf;

    const handleMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) {
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (ring) {
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      raf = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    raf = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(raf);
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[999]" aria-hidden="true">
      <div
        ref={dotRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-ink"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-ink/40"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
}
