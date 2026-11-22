/**
 * Design System v0.1 ornament divider (docs/DESIGN_SYSTEM.md §3):
 * a 1px gold line with a small centered ornament. Purely decorative —
 * the ornament is hidden from assistive technology and the rule itself
 * is a presentational <hr>.
 */
export default function OrnamentDivider({ glyph = '𓋹', dark = false, className = '' }) {
    return (
        <div aria-hidden="true" className={`flex items-center gap-4 ${className}`} role="presentation">
            <span className={`h-px flex-1 ${dark ? 'bg-gold-500/40' : 'bg-gold-500/50'}`} />
            <span className={`font-glyph text-base leading-none ${dark ? 'text-gold-300' : 'text-gold-500'}`}>
                {glyph}
            </span>
            <span className={`h-px flex-1 ${dark ? 'bg-gold-500/40' : 'bg-gold-500/50'}`} />
        </div>
    );
}
