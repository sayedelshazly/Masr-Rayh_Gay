import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useLocale } from '../i18n/LocaleContext';
import { formatPrice, localized } from '../lib/format';
import { DurationLabel } from './TourCard';

/**
 * Awwwards-style index list for the featured tours — no cards at all:
 * just the tour names in big display type, one per row. Hovering a row
 * summons a photo preview that GLIDES after the cursor (lerped
 * follow + a velocity tilt), crossfading between tours; the other
 * rows dim back. The preview exists only on large screens with a
 * mouse — small screens get an honest inline thumbnail per row.
 * Every row is a link to the tour page.
 */
export default function ToursHoverList({ tours }) {
    const { t, locale } = useLocale();
    const [hovered, setHovered] = useState(null);
    const wrapRef = useRef(null);
    const previewRef = useRef(null);
    const target = useRef({ x: 0, y: 0 });
    const pos = useRef({ x: 0, y: 0 });

    // Buttery follow: the preview eases toward the cursor every frame
    // and tilts with the leftover horizontal distance (velocity lean).
    useEffect(() => {
        let raf = 0;
        const loop = () => {
            pos.current.x += (target.current.x - pos.current.x) * 0.11;
            pos.current.y += (target.current.y - pos.current.y) * 0.11;
            const tilt = Math.max(-9, Math.min(9, (target.current.x - pos.current.x) * 0.07));
            if (previewRef.current) {
                previewRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -60%) rotate(${tilt}deg)`;
            }
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, []);

    const trackMouse = (event) => {
        const rect = wrapRef.current?.getBoundingClientRect();
        if (!rect) {
            return;
        }
        target.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    return (
        <div
            ref={wrapRef}
            className="relative"
            onMouseMove={trackMouse}
            onMouseEnter={(event) => {
                trackMouse(event);
                pos.current = { ...target.current };
            }}
            onMouseLeave={() => setHovered(null)}
        >
            {/* floating preview (desktop mouse only) */}
            <div
                ref={previewRef}
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 z-30 hidden h-[230px] w-[330px] lg:block"
            >
                <div
                    className={`relative h-full w-full transition-all duration-300 ease-stone ${
                        hovered !== null ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                    }`}
                >
                    {tours.map((tour, index) => {
                        const photo = tour.image ?? tour.destination?.image ?? null;
                        return photo ? (
                            <img
                                key={tour.id}
                                src={photo}
                                alt=""
                                loading="lazy"
                                className={`absolute inset-0 h-full w-full rounded-lg object-cover shadow-2xl shadow-black/50 ring-1 ring-gold-500/40 transition-all duration-300 ease-stone ${
                                    index === hovered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                                }`}
                            />
                        ) : null;
                    })}
                </div>
            </div>

            <ul className="border-y border-sand-100/12">
                {tours.map((tour, index) => {
                    const destination = tour.destination ?? {};
                    const photo = tour.image ?? destination.image ?? null;
                    const isHovered = hovered === index;
                    const dimmed = hovered !== null && !isHovered;

                    return (
                        <li key={tour.id} className="border-b border-sand-100/12 last:border-b-0">
                            <Link
                                href={`/tours/${tour.slug}`}
                                onMouseEnter={() => setHovered(index)}
                                className={`group flex items-center gap-4 py-5 transition-opacity duration-300 ease-stone sm:gap-6 sm:py-6 ${
                                    dimmed ? 'opacity-35' : 'opacity-100'
                                }`}
                            >
                                <span
                                    aria-hidden="true"
                                    className="font-display w-8 shrink-0 text-sm font-bold tracking-widest text-gold-500/80"
                                    dir="ltr"
                                >
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                {photo && (
                                    <img
                                        src={photo}
                                        alt=""
                                        loading="lazy"
                                        className="h-16 w-24 shrink-0 rounded-md object-cover ring-1 ring-sand-100/20 lg:hidden"
                                    />
                                )}

                                <span
                                    className={`min-w-0 flex-1 transition-transform duration-300 ease-stone ${
                                        isHovered ? 'ltr:lg:translate-x-3 rtl:lg:-translate-x-3' : ''
                                    }`}
                                >
                                    <span
                                        className={`font-display block truncate text-2xl font-bold transition-colors duration-300 sm:text-3xl lg:text-4xl ${
                                            isHovered ? 'text-gold-300' : 'text-sand-100'
                                        }`}
                                    >
                                        {localized(tour, 'title', locale)}
                                    </span>
                                    <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-sand-100/55">
                                        <span>{localized(destination, 'name', locale)}</span>
                                        <span aria-hidden="true" className="text-gold-500">•</span>
                                        <DurationLabel tour={tour} />
                                        <span aria-hidden="true" className="text-gold-500">•</span>
                                        <span className="text-gold-300">★ {Number(tour.rating).toFixed(1)}</span>
                                        <span className="text-gold-300 md:hidden">
                                            {formatPrice(tour.price, locale)} {t('common.currency')}
                                        </span>
                                    </span>
                                </span>

                                <span className="hidden shrink-0 text-end md:block">
                                    <span className="font-display block text-2xl font-bold text-gold-300">
                                        {formatPrice(tour.price, locale)}
                                    </span>
                                    <span className="text-xs text-sand-100/50">
                                        {t('common.currency')} / {t('common.perPerson')}
                                    </span>
                                </span>

                                <span
                                    aria-hidden="true"
                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ease-stone ${
                                        isHovered
                                            ? 'rotate-45 border-gold-500 bg-gold-500 text-ink-900'
                                            : 'border-sand-100/25 text-sand-100/70'
                                    }`}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M8 7h9v9" />
                                    </svg>
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
