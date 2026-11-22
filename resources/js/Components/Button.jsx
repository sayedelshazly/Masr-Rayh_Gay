import { Link } from '@inertiajs/react';

/**
 * Design System v0.1 buttons (docs/DESIGN_SYSTEM.md §3).
 * Variants: primary (gold-500, ink-900 text), secondary (1px gold frame),
 * ghost, danger (carnelian). Stone radius (4px), 44px minimum touch target,
 * stone easing on transitions. Renders an Inertia <Link> when `href` is
 * given, otherwise a <button>.
 */
const VARIANTS = {
    primary:
        'bg-gold-500 text-ink-900 shadow-sm hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-60',
    secondary:
        'border border-gold-500 bg-transparent text-gold-deep hover:bg-gold-500/10 disabled:cursor-not-allowed disabled:opacity-60',
    ghost: 'bg-transparent text-ink-900 hover:bg-sand-300/70 disabled:cursor-not-allowed disabled:opacity-60',
    danger:
        'bg-carnelian-600 text-sand-100 hover:bg-carnelian-600/90 disabled:cursor-not-allowed disabled:opacity-60',
};

const BASE =
    'font-subhead inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md px-6 py-2.5 text-sm font-bold transition-colors duration-150 ease-stone';

export default function Button({ variant = 'primary', href, className = '', children, ...props }) {
    const classes = `${BASE} ${VARIANTS[variant] ?? VARIANTS.primary} ${className}`;

    if (href) {
        return (
            <Link href={href} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button type="button" className={classes} {...props}>
            {children}
        </button>
    );
}
