import { useEffect, useRef, useState } from 'react';
import { useLocale } from '../i18n/LocaleContext';
import { formatPrice, localized } from '../lib/format';
import Button from './Button';

/**
 * Stage + rail browsing for the destinations list: one destination
 * takes the stage while the rest wait in a thumbnail rail below.
 * Switch by clicking a thumbnail, the prev/next arrows, or
 * dragging the stage itself. Nothing moves on its own.
 */
export default function DestinationShowcase({ destinations }) {
    const { t, locale } = useLocale();
    const [active, setActive] = useState(0);
    const railRefs = useRef([]);
    const dragX = useRef(null);

    const destination = destinations[active];

    useEffect(() => {
        // Bring the active thumbnail into view — but only when the
        // rail is already on screen, so mounting the showcase never
        // yanks the page down to it.
        const el = railRefs.current[active];
        const rail = railRef.current;
        if (!el || !rail) return;
        const rect = rail.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
            el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }, [active]);

    if (!destination) {
        return null;
    }

    const go = (dir) => setActive((i) => (i + dir + destinations.length) % destinations.length);

    const onPointerDown = (e) => {
        dragX.current = e.clientX;
    };
    const onPointerUp = (e) => {
        if (dragX.current === null || e.target.closest('a, button')) {
            dragX.current = null;
            return;
        }
        const dx = e.clientX - dragX.current;
        dragX.current = null;
        if (dx <= -40) go(1);
        else if (dx >= 40) go(-1);
    };

    // The rail: no visible scrollbar — it is dragged by hand
    // (mouse), swiped (touch), or paged with the edge arrows.
    const railRef = useRef(null);
    const railDrag = useRef(null);
    const railMoved = useRef(0);

    const scrollRail = (dir) => {
        const rail = railRef.current;
        if (!rail) return;
        const sign = locale === 'ar' ? -1 : 1;
        rail.scrollBy({ left: dir * 340 * sign, behavior: 'smooth' });
    };
    const onRailDown = (e) => {
        if (e.pointerType !== 'mouse') return;
        railDrag.current = { x: e.clientX, scroll: railRef.current?.scrollLeft ?? 0 };
        railMoved.current = 0;
    };
    const onRailMove = (e) => {
        if (!railDrag.current || !railRef.current) return;
        const dx = e.clientX - railDrag.current.x;
        railMoved.current = Math.max(railMoved.current, Math.abs(dx));
        railRef.current.scrollLeft = railDrag.current.scroll - dx;
    };
    const onRailUp = () => {
        railDrag.current = null;
    };
    const onRailClickCapture = (e) => {
        if (railMoved.current > 6) {
            e.preventDefault();
            e.stopPropagation();
            railMoved.current = 0;
        }
    };

    return (
        <div>
            {/* The stage */}
            <div
                className="overflow-hidden rounded-lg bg-nile-950/70 shadow-xl shadow-black/25 ring-1 ring-white/10 backdrop-blur"
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
            >
                <div key={destination.id} className="animate-stage-in grid lg:grid-cols-5">
                    <div className="relative h-64 overflow-hidden sm:h-80 lg:col-span-3 lg:h-[430px]">
                        {destination.image ? (
                            <>
                                <img
                                    src={destination.image}
                                    alt={localized(destination, 'name', locale)}
                                    className="animate-stage-photo absolute inset-0 h-full w-full object-cover"
                                    draggable="false"
                                />
                                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-nile-950/70 via-transparent to-nile-950/10" />
                            </>
                        ) : (
                            <>
                                <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-br ${destination.gradient ?? 'from-nile-800 via-sky-600 to-nile-950'}`} />
                                <span aria-hidden="true" className="font-glyph absolute inset-0 flex items-center justify-center text-8xl text-white/50">
                                    {destination.glyph ?? '𓂀'}
                                </span>
                            </>
                        )}
                        {destination.tours_count != null && (
                            <span className="absolute bottom-4 start-4 rounded-sm bg-nile-950/70 px-2.5 py-1 text-xs font-semibold text-gold-300">
                                {destination.tours_count} {t('destinationPage.toursCount')}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col p-6 sm:p-8 lg:col-span-2">
                        <p className="font-display text-sm font-bold tracking-wide text-gold-300">
                            {t('destinationPage.kicker')}
                        </p>
                        <h2 className="font-display mt-2 text-3xl font-bold leading-snug text-sand-100 sm:text-4xl">
                            {localized(destination, 'name', locale)}
                        </h2>

                        <p className="mt-3 line-clamp-4 leading-relaxed text-sand-100/70">
                            {localized(destination, 'tagline', locale)}
                        </p>

                        <div className="mt-auto pt-6">
                            {destination.from_price != null && (
                                <p className="text-sm text-sand-100/60">
                                    {t('destinations.from')}{' '}
                                    <span className="font-display text-3xl font-bold text-gold-300">
                                        {formatPrice(destination.from_price, locale)}
                                    </span>{' '}
                                    {t('destinations.currency')}
                                </p>
                            )}

                            <div className="mt-4">
                                <Button href={`/destinations/${destination.slug}`} className="w-full px-4">
                                    {t('destinationPage.viewDestination')}
                                </Button>
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => go(-1)}
                                        aria-label="Previous"
                                        className="flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-gold-500/50 text-gold-300 transition hover:bg-gold-500 hover:text-ink-900"
                                    >
                                        <svg viewBox="0 0 24 24" className="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => go(1)}
                                        aria-label="Next"
                                        className="flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-gold-500/50 text-gold-300 transition hover:bg-gold-500 hover:text-ink-900"
                                    >
                                        <svg viewBox="0 0 24 24" className="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                                <p className="font-display text-sm font-bold text-sand-100/60">
                                    {active + 1} <span className="text-gold-500">/</span> {destinations.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* The rail */}
            <div className="relative mt-4">
                <div
                    ref={railRef}
                    onPointerDown={onRailDown}
                    onPointerMove={onRailMove}
                    onPointerUp={onRailUp}
                    onPointerLeave={onRailUp}
                    onClickCapture={onRailClickCapture}
                    className="no-scrollbar flex cursor-grab snap-x gap-3 overflow-x-auto pb-1 select-none active:cursor-grabbing"
                >
                {destinations.map((item, i) => {
                    const isActive = i === active;
                    return (
                        <button
                            key={item.id}
                            ref={(el) => {
                                railRefs.current[i] = el;
                            }}
                            type="button"
                            onClick={() => setActive(i)}
                            aria-current={isActive ? 'true' : undefined}
                            className={`w-40 shrink-0 snap-start overflow-hidden rounded-md bg-nile-950/70 text-start shadow ring-1 backdrop-blur transition duration-300 ease-stone sm:w-44 ${
                                isActive
                                    ? 'opacity-100 ring-2 ring-gold-500'
                                    : 'opacity-55 ring-white/10 hover:opacity-90'
                            }`}
                        >
                            <span className="block h-20 overflow-hidden">
                                {item.image ? (
                                    <img src={item.image} alt="" loading="lazy" className="h-full w-full object-cover" draggable="false" />
                                ) : (
                                    <span className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${item.gradient ?? 'from-nile-800 to-nile-950'}`}>
                                        <span aria-hidden="true" className="font-glyph text-2xl text-white/60">{item.glyph ?? '𓂀'}</span>
                                    </span>
                                )}
                            </span>
                            <span className="block p-2.5">
                                <span className={`line-clamp-1 text-xs font-bold ${isActive ? 'text-gold-300' : 'text-sand-100'}`}>
                                    {localized(item, 'name', locale)}
                                </span>
                                {item.from_price != null && (
                                    <span className="mt-1 block text-[11px] font-semibold text-sand-100/55">
                                        {t('destinations.from')} {formatPrice(item.from_price, locale)} {t('destinations.currency')}
                                    </span>
                                )}
                            </span>
                        </button>
                    );
                })}
                </div>
                <button
                    type="button"
                    onClick={() => scrollRail(-1)}
                    aria-label="Scroll back"
                    className="absolute start-0.5 top-1/2 z-10 flex h-10 w-7 -translate-y-1/2 items-center justify-center text-gold-500/75 drop-shadow-[0_1px_5px_rgba(0,0,0,0.65)] transition hover:text-gold-300"
                >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
                </button>
                <button
                    type="button"
                    onClick={() => scrollRail(1)}
                    aria-label="Scroll forward"
                    className="absolute end-0.5 top-1/2 z-10 flex h-10 w-7 -translate-y-1/2 items-center justify-center text-gold-500/75 drop-shadow-[0_1px_5px_rgba(0,0,0,0.65)] transition hover:text-gold-300"
                >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    );
}
