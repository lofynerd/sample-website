import clsx from 'clsx';

// Minimal editorial button with primary/ghost/text/light variants
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  as: Component = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-body uppercase tracking-widest2 transition-all duration-500 ease-luxury disabled:opacity-40 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'text-[11px] px-5 py-2.5',
    md: 'text-xs px-8 py-3.5',
    lg: 'text-sm px-10 py-4',
  };

  const variants = {
    primary: 'bg-ink text-bone hover:bg-accent',
    ghost: 'border border-ink text-ink hover:bg-ink hover:text-bone',
    text: 'text-ink border-b border-transparent hover:border-ink pb-1 tracking-wide normal-case text-sm',
    light: 'bg-bone text-ink hover:bg-sand',
  };

  return (
    <Component className={clsx(base, sizes[size], variants[variant], className)} {...props}>
      {children}
    </Component>
  );
}
