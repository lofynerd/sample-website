import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import useReducedMotion from '../../../hooks/useReducedMotion.js';

export default function Hero() {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const y = useTransform(scrollYProgress, [0, 1], prefersReduced ? [0, 0] : [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], prefersReduced ? [1, 1] : [1, 1.15]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden bg-ink">
      <motion.div style={{ scale }} className="absolute inset-0">
        <div
          className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/10 to-ink/70"
          aria-hidden="true"
        />
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2400&auto=format&fit=crop"
          alt="Editorial campaign image of the season's collection draped in natural light"
          className="w-full h-full object-cover"
          fetchpriority="high"
        />
      </motion.div>

      <motion.div
        style={{ y, opacity }}
        className="relative h-full flex flex-col items-center justify-center text-center px-6"
      >
        <span className="text-bone/70 text-xs uppercase tracking-widest2 mb-6 animate-fadeIn">
          Maison Delulu
        </span>
        <h1 className="font-display text-hero text-bone text-balance max-w-4xl animate-fadeUp">
          For the Delusionally
          <br />
          Ambitious
        </h1>
        <p className="text-bone/70 max-w-md mt-8 text-sm md:text-base animate-fadeUp" style={{ animationDelay: '0.3s' }}>
          Garments made to outlast the season they were born in.
        </p>
      </motion.div>

      <motion.button
        onClick={() =>
          window.scrollTo({ top: window.innerHeight, behavior: prefersReduced ? 'auto' : 'smooth' })
        }
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-bone/80"
        aria-label="Scroll to content"
        animate={prefersReduced ? {} : { y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={24} strokeWidth={1} />
      </motion.button>
    </section>
  );
}
