import { useEffect, useRef, useState } from 'react';
import { useLocale } from '../i18n/LocaleContext';
import TourImageCard from './TourImageCard';

/**
 * 3D coverflow carousel for the featured tours — the card in the
 * centre faces you flat and full-size; neighbours swing back in
 * perspective (rotateY + translateZ), dimmed and slightly faded, up to
 * two on each side. Navigate by arrows, dots, clicking a side card,
 * dragging / swiping, or the keyboard arrows when the stage is
 * focused. Auto-advances every 4.5s and pauses while hovered.
 * Only the centred card's links are clickable.
 */
export default function ToursCoverflow({ tours }) {
    const { t } = useLocale();
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const dragX = useRef(null);
    const count = tours.length;

    const goTo = (index) => setActive(((index % count) + count) % count);

    useEffect(() => {
        if (paused || count < 2) {
            return undefined;
        }
        const id = setInterval(() => {
            setActive((value) => (value + 1) % count);
        }, 4500);
        return () => clearInterval(id);
    }, [paused, count]);

    if (!count) {
        return null;
    }

    return (
        <div>
            <div
                role="region"
                aria-label={t('featuredTours.title')}
                tabIndex={0}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onPointerDown={(event) => {
                    dragX.current = event.clientX;
                }}
                onPointerUp={(event) => {
                    if (dragX.current == null) {
                        return;
                    }
                    const dx = event.clientX - dragX.current;
                    dragX.current = null;
                    if (Math.abs(dx) > 42) {
                        goTo(active + (dx < 0 ? 1 : -1));
                    }
                }}
                onKeyDown={(event) => {
                    if (event.key === 'ArrowLeft') {
                        goTo(active - 1);
                    }
                    if (event.key === 'ArrowRight') {
                        goTo(active + 1);
                    }
                }}
                className="relative h-[470px] touch-pan-y overflow-hidden outline-none [perspective:1400px] focus-visible:ring-2 focus-visible:ring-gold-500 sm:h-[500px]"
            >
                {tours.map((tour, index) => {
                    const offset = index - active;
                    const abs = Math.abs(offset);
                    const isActive = offset === 0;

                    return (
                        <div
                            key={tour.id}
                            onClick={() => !isActive && goTo(index)}
                            aria-hidden={!isActive}
                            className="absolute left-1/2 top-0 h-full w-[78vw] max-w-[320px] will-change-transform"
                            style={{
                                transform: `translateX(-50%) translateX(${offset * 62}%) rotateY(${offset * -38}deg) translateZ(${-abs * 170}px)`,
                                zIndex: 100 - abs,
                                opacity: abs > 2 ? 0 : 1 - abs * 0.22,
                                visibility: abs > 2 ? 'hidden' : 'visible',
                                transition: 'transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 700ms ease',
                                cursor: isActive ? 'default' : 'pointer',
                            }}
                        >
                            <div className={`h-full ${isActive ? '' : 'pointer-events-none'}`}>
                                <TourImageCard tour={tour} />
                            </div>
                            {/* dim veil on side cards */}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 rounded-lg bg-nile-950 transition-opacity duration-700"
                                style={{ opacity: isActive ? 0 : 0.25 + abs * 0.15 }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* controls: arrows + progress lines */}
            <div className="mt-6 flex items-center justify-center gap-5" dir="ltr">
                <button
                    type="button"
                    onClick={() => goTo(active - 1)}
                    aria-label="Previous"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-500/60 text-gold-300 transition-colors duration-150 ease-stone hover:bg-gold-500 hover:text-ink-900"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <div className="flex items-center gap-2">
                    {tours.map((tour, index) => (
                        <button
                            key={tour.id}
                            type="button"
                            onClick={() => goTo(index)}
                            aria-label={tour.title_ar ?? `Tour ${index + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-500 ease-stone ${
                                index === active ? 'w-9 bg-gold-500' : 'w-3.5 bg-sand-100/30 hover:bg-sand-100/60'
                            }`}
                        />
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => goTo(active + 1)}
                    aria-label="Next"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-500/60 text-gold-300 transition-colors duration-150 ease-stone hover:bg-gold-500 hover:text-ink-900"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
