import { useEffect, useState } from 'react';
import { useLocale } from '../i18n/LocaleContext';
import { formatPrice, localized } from '../lib/format';
import Button from './Button';

/**
 * Interactive map of Egypt — a stylised golden outline (with the Nile
 * drawn in turquoise) carrying the eight destinations as pulsing
 * pins. Selecting a pin (tap, click, or the slow auto-tour that runs
 * until the visitor takes over) fills the side panel with that
 * destination's photo, tagline and explore link. Pin positions are
 * real lat/lng projected onto the outline's viewBox.
 */
const PIN_POSITIONS = {
    alexandria: { x: 42, y: 6.5 },
    'cairo-giza': { x: 51.8, y: 18.3 },
    fayoum: { x: 49, y: 25.2 },
    siwa: { x: 7.5, y: 25.7 },
    luxor: { x: 64, y: 61.7 },
    aswan: { x: 66, y: 77.8 },
    hurghada: { x: 73.8, y: 45.2 },
    'sharm-el-sheikh': { x: 77.8, y: 38.7, labelLeft: true },
};

const EGYPT_OUTLINE =
    'M 2,12 L 62,17 L 128,21 L 166,27 L 198,10 L 230,15 L 248,25 L 296,28 L 330,56 L 336,104 L 312,180 L 284,124 L 263,87 L 251,58 L 267,114 L 283,156 L 296,210 L 316,268 L 333,314 L 358,384 L 386,446 L 384,456 L 2,456 Z';

export default function EgyptMap({ destinations }) {
    const { t, locale } = useLocale();
    const pinned = destinations.filter((destination) => PIN_POSITIONS[destination.slug]);
    const [activeSlug, setActiveSlug] = useState(pinned[0]?.slug);
    const [auto, setAuto] = useState(true);

    // A slow guided tour of the pins until the visitor picks one.
    useEffect(() => {
        if (!auto || pinned.length < 2) {
            return undefined;
        }
        const id = setInterval(() => {
            setActiveSlug((current) => {
                const index = pinned.findIndex((destination) => destination.slug === current);
                return pinned[(index + 1) % pinned.length].slug;
            });
        }, 4200);
        return () => clearInterval(id);
    }, [auto, pinned]);

    const active = pinned.find((destination) => destination.slug === activeSlug) ?? pinned[0];

    if (!active) {
        return null;
    }

    const select = (slug) => {
        setAuto(false);
        setActiveSlug(slug);
    };

    return (
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
            {/* ——— the map ——— */}
            <div className="relative mx-auto aspect-[400/460] w-full max-w-[430px]">
                <svg
                    viewBox="0 0 400 460"
                    className="absolute inset-0 h-full w-full [filter:drop-shadow(0_0_28px_rgba(201,162,75,0.14))]"
                    aria-hidden="true"
                >
                    <path d={EGYPT_OUTLINE} className="fill-nile-800/45 stroke-gold-500/60" strokeWidth="1.6" strokeLinejoin="round" />
                    {/* the Nile */}
                    <path
                        d="M 264,442 C 258,380 252,330 246,288 C 240,244 228,180 214,128"
                        fill="none"
                        className="stroke-turquoise-600"
                        strokeWidth="3"
                        strokeLinecap="round"
                        opacity="0.55"
                    />
                    <path d="M 214,128 C 206,96 196,66 188,38 M 214,128 C 220,98 228,70 238,44" fill="none" className="stroke-turquoise-600" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
                    <ellipse cx="270" cy="402" rx="9" ry="20" transform="rotate(12 270 402)" className="fill-turquoise-600" opacity="0.3" />
                </svg>

                {pinned.map((destination) => {
                    const pos = PIN_POSITIONS[destination.slug];
                    const isActive = destination.slug === active.slug;
                    const name = localized(destination, 'name', locale);

                    return (
                        <button
                            key={destination.id}
                            type="button"
                            onClick={() => select(destination.slug)}
                            onMouseEnter={() => select(destination.slug)}
                            aria-pressed={isActive}
                            aria-label={name}
                            className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                        >
                            <span className="relative flex h-7 w-7 items-center justify-center">
                                {isActive && (
                                    <span aria-hidden="true" className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-500/45" />
                                )}
                                <span
                                    aria-hidden="true"
                                    className={`relative inline-flex rounded-full ring-2 transition-all duration-300 ${
                                        isActive
                                            ? 'h-4 w-4 bg-gold-300 ring-gold-300/60'
                                            : 'h-3 w-3 bg-gold-500 ring-gold-500/40 group-hover:scale-125'
                                    }`}
                                />
                            </span>
                            <span
                                className={`font-display pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] font-bold drop-shadow transition-all duration-300 ${
                                    pos.labelLeft ? 'right-full me-1' : 'left-full ms-1'
                                } ${isActive ? 'text-gold-300' : 'text-sand-100/75'} ${isActive ? '' : 'hidden sm:block'}`}
                            >
                                {name}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* ——— the panel ——— */}
            <div
                key={active.slug}
                className="animate-quote-in overflow-hidden rounded-lg bg-nile-950/70 shadow-xl shadow-black/30 ring-1 ring-gold-500/25 backdrop-blur-sm"
            >
                <div className="relative h-48 sm:h-56">
                    {active.image ? (
                        <img src={active.image} alt={localized(active, 'name', locale)} className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                        <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-br ${active.gradient ?? 'from-nile-800 via-sky-600 to-nile-950'}`} />
                    )}
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-nile-950/85 via-transparent to-transparent" />
                    <span aria-hidden="true" className="font-glyph absolute bottom-3 end-4 text-3xl text-gold-500/80">
                        {active.glyph ?? '𓂀'}
                    </span>
                </div>
                <div className="p-6">
                    <h3 className="font-display text-2xl font-bold text-sand-100">{localized(active, 'name', locale)}</h3>
                    <p className="mt-2 line-clamp-3 leading-relaxed text-sand-100/70">{localized(active, 'tagline', locale)}</p>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-sand-100/12 pt-4">
                        <p className="flex flex-wrap items-center gap-x-2 text-sm text-sand-100/70">
                            {active.tours_count != null && (
                                <span>
                                    {active.tours_count} {t('destinationPage.toursCount')}
                                </span>
                            )}
                            {active.from_price != null && (
                                <>
                                    <span aria-hidden="true" className="text-gold-500">•</span>
                                    <span>
                                        {t('destinations.from')}{' '}
                                        <span className="font-display text-lg font-bold text-gold-300">
                                            {formatPrice(active.from_price, locale)}
                                        </span>{' '}
                                        {t('destinations.currency')}
                                    </span>
                                </>
                            )}
                        </p>
                        <Button href={`/destinations/${active.slug}`} className="px-5">
                            {t('destinationPage.viewDestination')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
