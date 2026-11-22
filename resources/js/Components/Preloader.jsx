import { useEffect, useState } from 'react';
import { useLocale } from '../i18n/LocaleContext';

/**
 * Brand preloader — "the sun goes and returns". A small gold sun
 * travels a thin route line to the far node (رايح), pauses a beat,
 * then comes home (جاي) leaving the route lit gold behind it; as it
 * arrives, the brand name rises in underneath. The whole overlay
 * then lifts like a curtain.
 *
 * Manners: it plays once per full page load (in-app navigation
 * never replays it), it never outstays its welcome — it waits for
 * the window load event but leaves after the 1.5s journey at the
 * earliest and after 2.8s at the very latest — and reduced-motion
 * visitors just get the name, briefly, standing still.
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
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-[560px] max-w-none -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/[0.07] blur-3xl" />

            {/* the route */}
            <div className="relative w-[min(420px,74vw)]">
                <div className="relative h-10">
                    {/* faint track */}
                    <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-sand-100/15" />
                    {/* the lit trail the sun leaves behind */}
                    <div className="animate-trail-fill absolute start-0 top-1/2 h-[2px] -translate-y-1/2 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 shadow-[0_0_10px_rgba(201,162,75,0.55)] rtl:bg-gradient-to-l" />

                    {/* home node */}
                    <span className="absolute start-0 top-1/2 h-[9px] w-[9px] -translate-y-1/2 rounded-full border-2 border-gold-500 bg-nile-950 ltr:-translate-x-1/2 rtl:translate-x-1/2" />
                    {/* destination node + its arrival pulse */}
                    <span className="absolute end-0 top-1/2 flex h-[9px] w-[9px] -translate-y-1/2 items-center justify-center ltr:translate-x-1/2 rtl:-translate-x-1/2">
                        <span className="animate-node-pulse absolute inline-flex h-full w-full rounded-full bg-gold-500" />
                        <span className="relative inline-flex h-[9px] w-[9px] rounded-full bg-gold-500" />
                    </span>

                    {/* the sun */}
                    <span className="animate-sun-journey absolute top-1/2 block h-[15px] w-[15px] -translate-y-1/2">
                        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_35%,#E3C98A,#C9A24B_70%)] shadow-[0_0_18px_rgba(201,162,75,0.95),0_0_42px_rgba(201,162,75,0.45)]" />
                    </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-gold-500/70">
                    <span className="font-glyph text-base leading-none">𓂀</span>
                    <span className="font-glyph text-base leading-none">𓇳</span>
                </div>
            </div>

            {/* the name arrives with the sun */}
            <div className="animate-brand-in mt-9 text-center">
                <p className="font-display text-3xl font-bold text-sand-100 sm:text-4xl">{t('brand.name')}</p>
                <p className="mt-2 text-[11px] font-semibold tracking-[0.35em] text-gold-300">{t('brand.nameLatin')}</p>
            </div>
        </div>
    );
}
