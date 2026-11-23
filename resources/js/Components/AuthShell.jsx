import { BrandMark } from './Navbar';
import { useLocale } from '../i18n/LocaleContext';

/**
 * The auth stage: one wide glass card split in two. On one side a
 * slow, calm slideshow of Egypt (three photos crossfading over a
 * 24-second cycle, each breathing in with a barely-there zoom,
 * glyphs drifting in the air); on the other, the form, whose pieces
 * rise in one after another. Nothing jumps — everything settles.
 */
const PHOTOS = [
    '/images/destinations/cairo-giza.jpg',
    '/images/destinations/luxor.jpg',
    '/images/destinations/aswan.jpg',
];

const FLOATING_GLYPHS = [
    { glyph: '𓂀', className: 'start-[12%] top-[16%] text-3xl', delay: '0s', duration: '7s' },
    { glyph: '𓋹', className: 'end-[16%] top-[24%] text-2xl', delay: '1.4s', duration: '8s' },
    { glyph: '𓆣', className: 'start-[24%] top-[46%] text-2xl', delay: '2.2s', duration: '9s' },
    { glyph: '𓅃', className: 'end-[28%] top-[10%] text-xl', delay: '0.8s', duration: '6.5s' },
    { glyph: '𓇳', className: 'end-[10%] top-[52%] text-3xl', delay: '3s', duration: '8.5s' },
];

export default function AuthShell({ children }) {
    const { t } = useLocale();

    return (
        <section>
            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
                <div
                    className="auth-rise grid overflow-hidden rounded-lg bg-nile-950/70 shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur lg:grid-cols-[1.05fr_1fr]"
                    style={{ animationDelay: '0ms' }}
                >
                    {/* Visual side */}
                    <div className="relative h-44 overflow-hidden sm:h-52 lg:h-auto lg:min-h-[580px]">
                        {PHOTOS.map((src, i) => (
                            <div
                                key={src}
                                aria-hidden="true"
                                className="auth-photo absolute inset-0"
                                style={{ animationDelay: `${i * 8}s` }}
                            >
                                <img src={src} alt="" className="auth-zoom h-full w-full object-cover" />
                            </div>
                        ))}
                        <div className="absolute inset-0 bg-gradient-to-t from-nile-950/95 via-nile-950/30 to-nile-950/15" />

                        {FLOATING_GLYPHS.map((item, i) => (
                            <span
                                key={i}
                                aria-hidden="true"
                                className={`font-glyph animate-float-mote pointer-events-none absolute text-gold-300/30 ${item.className}`}
                                style={{ animationDelay: item.delay, animationDuration: item.duration }}
                            >
                                {item.glyph}
                            </span>
                        ))}

                        <div className="pointer-events-none absolute inset-3 border border-gold-500/25" />

                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                            <div className="flex items-center gap-3">
                                <BrandMark className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" />
                                <div>
                                    <p className="font-display text-base font-bold leading-tight text-sand-100 sm:text-lg">
                                        {t('brand.name')}
                                    </p>
                                    <p className="font-subhead text-[10px] uppercase tracking-[0.3em] text-gold-300">
                                        {t('brand.nameLatin')}
                                    </p>
                                </div>
                            </div>
                            <p className="font-display mt-4 hidden text-xl font-bold text-sand-100 sm:block lg:text-2xl">
                                {t('auth.visualTitle')}
                            </p>
                            <p className="mt-1.5 hidden max-w-sm text-sm leading-relaxed text-sand-100/70 lg:block">
                                {t('auth.visualText')}
                            </p>
                        </div>
                    </div>

                    {/* Form side */}
                    <div className="relative p-6 sm:p-9 lg:p-11">{children}</div>
                </div>
            </div>
        </section>
    );
}
