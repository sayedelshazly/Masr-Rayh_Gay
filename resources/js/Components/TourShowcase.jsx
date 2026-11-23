import { useEffect, useRef, useState } from 'react';
import { useLocale } from '../i18n/LocaleContext';
import { formatPrice, localized } from '../lib/format';
import { DurationLabel } from './TourCard';
import Button from './Button';

/**
 * Stage + rail browsing for the tours list: one tour takes the
 * stage in full detail while the rest wait in a thumbnail rail
 * below. Switch by clicking a thumbnail, the prev/next arrows,
 * or dragging the stage itself. Nothing moves on its own.
 */
export default function TourShowcase({ tours }) {
    const { t, locale } = useLocale();
    const [active, setActive] = useState(0);
    const railRefs = useRef([]);
    const dragX = useRef(null);

    const tour = tours[active];
    const destination = tour?.destination ?? {};
    const photo = tour?.image ?? destination.image ?? null;

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

    if (!tour) {
        return null;
    }

    const go = (dir) => setActive((i) => (i + dir + tours.length) % tours.length);

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
                <div key={tour.id} className="animate-stage-in grid lg:grid-cols-5">
                    <div className="relative h-64 overflow-hidden sm:h-80 lg:col-span-3 lg:h-[430px]">
                        {photo ? (
                            <>
                                <img
                                    src={photo}
                                    alt={localized(tour, 'title', locale)}
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
                        {tour.is_featured && (
                            <span className="font-subhead absolute start-4 top-4 rounded-sm bg-gold-500 px-3 py-1 text-xs font-bold text-ink-900 shadow">
                                {t('common.featured')}
                            </span>
                        )}
                        <span className="absolute bottom-4 start-4 rounded-sm bg-nile-950/70 px-2.5 py-1 text-xs font-semibold text-gold-300">
                            ★ {Number(tour.rating).toFixed(1)}
                        </span>
                    </div>

                    <div className="flex flex-col p-6 sm:p-8 lg:col-span-2">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-sand-100/55">
                            <span>{localized(destination, 'name', locale)}</span>
                            <span aria-hidden="true">•</span>
                            <DurationLabel tour={tour} />
                            <span aria-hidden="true">•</span>
                            <span>{t(`tours.types.${tour.type}`)}</span>
                        </div>

                        <h2 className="font-display mt-3 text-2xl font-bold leading-snug text-sand-100 sm:text-3xl">
                            {localized(tour, 'title', locale)}
                        </h2>

                        <p className="mt-3 line-clamp-4 leading-relaxed text-sand-100/70">
                            {localized(tour, 'summary', locale)}
                        </p>

                        <div className="mt-auto pt-6">
                            <p className="text-sm text-sand-100/60">
                                {tour.old_price && (
                                    <span className="me-2 text-xs line-through">
                                        {formatPrice(tour.old_price, locale)}
                                    </span>
                                )}
                                <span className="font-display text-3xl font-bold text-gold-300">
                                    {formatPrice(tour.price, locale)}
                                </span>{' '}
                                {t('common.currency')}
                                <span className="ms-1 text-xs text-sand-100/50">{t('common.perPerson')}</span>
                            </p>

                            <div className="mt-4 flex items-center gap-3">
                                <Button href={`/tours/${tour.slug}`} className="flex-1 px-4">
                                    {t('common.viewDetails')}
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
                                    {active + 1} <span className="text-gold-500">/</span> {tours.length}
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
                {tours.map((item, i) => {
                    const itemPhoto = item.image ?? item.destination?.image ?? null;
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
                                {itemPhoto ? (
                                    <img src={itemPhoto} alt="" loading="lazy" className="h-full w-full object-cover" draggable="false" />
                                ) : (
                                    <span className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${item.destination?.gradient ?? 'from-nile-800 to-nile-950'}`}>
                                        <span aria-hidden="true" className="font-glyph text-2xl text-white/60">{item.destination?.glyph ?? '𓂀'}</span>
                                    </span>
                                )}
                            </span>
                            <span className="block p-2.5">
                                <span className={`line-clamp-2 min-h-8 text-xs font-bold leading-snug ${isActive ? 'text-gold-300' : 'text-sand-100'}`}>
                                    {localized(item, 'title', locale)}
                                </span>
                                <span className="mt-1 block text-[11px] font-semibold text-sand-100/55">
                                    {formatPrice(item.price, locale)} {t('common.currency')}
                                </span>
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
