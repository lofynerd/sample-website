import { motion } from 'framer-motion';

// Scroll-triggered fade/slide-up wrapper used across editorial sections
export default function Reveal({
  children,
  delay = 0,
  duration = 1,
  y = 32,
  className = '',
  as: Component = motion.div,
  once = true,
}) {
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-10% 0px -10% 0px' }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}
