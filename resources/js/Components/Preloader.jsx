import { useEffect, useState } from 'react';
import { useLocale } from '../i18n/LocaleContext';

/**
 * Brand preloader — the Eye of Horus wakes. On the dark Nile
 * background the logo's own linework draws itself in gold (ring,
 * brow, eye, teardrop, cheek curl — staggered like a hand sketching
 * it), then the iris pops open with a bloom of gold light and the
 * brand name rises underneath. The overlay then lifts like a
 * curtain. Same artwork as the navbar BrandMark, drawn large.
 *
 * Manners: it plays once per full page load (in-app navigation
 * never replays it), waits for the window load event but leaves
 * after the draw at the earliest and after 2.8s at the very latest,
 * and reduced-motion visitors just get the name, briefly.
 */
export default function Preloader() {
    const { t } = useLocale();
    const [leaving, setLeaving] = useState(false);
    const [removed, setRemoved] = useState(false);

    useEffect(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const minDisplay = reduced ? 400 : 1550;
        const startedAt = Date.now();
        let loaded = document.readyState === 'complete';
        const onLoad = () => {
            loaded = true;
        };
        window.addEventListener('load', onLoad);

        document.documentElement.style.overflow = 'hidden';

        let exitTimer = 0;
        const exit = () => {
            setLeaving(true);
            exitTimer = window.setTimeout(() => setRemoved(true), 720);
        };
        const checker = window.setInterval(() => {
            const elapsed = Date.now() - startedAt;
            if ((loaded && elapsed >= minDisplay) || elapsed >= 2800) {
                window.clearInterval(checker);
                exit();
            }
        }, 100);

        return () => {
            window.removeEventListener('load', onLoad);
            window.clearInterval(checker);
            window.clearTimeout(exitTimer);
            document.documentElement.style.overflow = '';
        };
    }, []);

    useEffect(() => {
        if (leaving) {
            document.documentElement.style.overflow = '';
        }
    }, [leaving]);

    if (removed) {
        return null;
    }

    return (
        <div
            aria-hidden="true"
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-nile-950 transition-transform duration-700 ease-stone ${
                leaving ? '-translate-y-full' : 'translate-y-0'
            }`}
        >
            <div className="relative">
                {/* the bloom of light when the eye opens */}
                <div
                    aria-hidden="true"
                    className="animate-glow-in pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/15 blur-3xl"
                />
                <svg
                    viewBox="0 0 48 48"
                    className="relative h-32 w-32 drop-shadow-[0_0_14px_rgba(201,162,75,0.35)] sm:h-40 sm:w-40"
                    role="img"
                    aria-label="Masr Rayh Gay"
                >
                    <circle
                        cx="24"
                        cy="24"
                        r="21"
                        fill="none"
                        stroke="#C9A24B"
                        strokeWidth="1.1"
                        pathLength={100}
                        className="eye-ring"
                        transform="rotate(-90 24 24)"
                    />
                    <g stroke="#C9A24B" strokeWidth="2.1" strokeLinecap="round" fill="none">
                        <path d="M7.5 15.5 Q24 6.5 40.5 15.5" pathLength={100} className="eye-path" style={{ animationDelay: '0.3s' }} />
                        <path d="M8.5 24.5 Q24 13.5 39.5 24.5 Q24 33.5 8.5 24.5 Z" pathLength={100} className="eye-path" style={{ animationDelay: '0.45s' }} />
                        <path d="M17 30.5 L17 38.5" pathLength={100} className="eye-path" style={{ animationDelay: '0.9s' }} />
                        <path d="M28.5 30 Q38 30.5 37 35.5 Q36.2 39 32.5 38" pathLength={100} className="eye-path" style={{ animationDelay: '1s' }} />
                    </g>
                    <circle cx="24" cy="24" r="4.4" fill="#C9A24B" className="eye-iris" />
                </svg>
            </div>

            {/* the name arrives as the eye opens */}
            <div className="animate-brand-in mt-8 text-center">
                <p className="font-display text-3xl font-bold text-sand-100 sm:text-4xl">{t('brand.name')}</p>
                <p className="mt-2 text-[11px] font-semibold tracking-[0.35em] text-gold-300">{t('brand.nameLatin')}</p>
            </div>
        </div>
    );
}
