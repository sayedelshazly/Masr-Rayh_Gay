const GLYPHS = '𓂀 𓆣 𓅃 𓋹 𓍿 𓄿 𓅓 𓂋 𓈖 𓆑 𓊵 𓏏';

/**
 * Purely decorative band of hieroglyphs — never used to convey meaning,
 * so it is hidden from assistive technology.
 */
export default function HieroglyphStrip({ className = '' }) {
    return (
        <div aria-hidden="true" className={`hieroglyph-strip font-glyph overflow-hidden whitespace-nowrap ${className}`}>
            {GLYPHS} {GLYPHS}
        </div>
    );
}
