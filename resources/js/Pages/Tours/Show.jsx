import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Reveal from '../../Components/Reveal';
import TourCard, { DurationLabel } from '../../Components/TourCard';
import { useLocale } from '../../i18n/LocaleContext';
import { formatPrice, localized } from '../../lib/format';

function SectionTitle({ children }) {
    return <h2 className="font-display text-2xl font-bold text-sand-100 sm:text-3xl">{children}</h2>;
}

export default function TourShow({ tour, relatedTours }) {
    const { t, locale } = useLocale();
    const destination = tour.destination ?? {};
    const includes = localized(tour, 'includes', locale) || [];
    const itinerary = tour.itinerary_days ?? [];

    // Booking mini-form: date + guests, with a live total preview.
    // Children pay 50% — display only; the server recomputes on submit.
    const [travelDate, setTravelDate] = useState('');
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const price = Number(tour.price ?? 0);
    const liveTotal = price * Math.max(0, Number(adults) || 0) + price * 0.5 * Math.max(0, Number(children) || 0);
    const today = new Date().toISOString().slice(0, 10);

    const bookParams = new URLSearchParams();
    if (travelDate) {
        bookParams.set('travel_date', travelDate);
    }
    bookParams.set('adults', String(adults));
    bookParams.set('children', String(children));
    const bookHref = `/tours/${tour.slug}/book?${bookParams.toString()}`;

    const miniFieldClass =
        'w-full rounded-md border border-sand-100/20 bg-white/5 px-3 py-2 text-sm font-medium text-sand-100 outline-none transition-colors placeholder:text-sand-100/35 focus:border-gold-500 [color-scheme:dark]';
    const miniLabelClass = 'mb-1 block text-xs font-bold text-sand-100/55';

    return (
        <AppLayout backdrop={tour.image ?? undefined}>
            <Head title={`${localized(tour, 'title', locale)} — ${t('brand.name')}`} />

            {/* Hero band: photo under a dark nile overlay (gradient fallback) */}
            <section className="relative overflow-hidden">
                {(tour.image ?? destination.image) ? (
                    <>
                        <img
                            src={tour.image ?? destination.image}
                            alt={localized(tour, 'title', locale)}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-nile-950/80 via-nile-950/55 to-nile-950/85" />
                    </>
                ) : (
                    <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-br ${destination.gradient ?? 'from-nile-800 via-sky-600 to-nile-950'}`} />
                )}
                <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
                    <Link href="/tours" className="text-sm font-semibold text-sand-100/85 transition-colors hover:text-gold-300">
                        ← {t('tours.show.back')}
                    </Link>
                    <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
                        <div className="max-w-3xl">
                            <p className="font-display text-sm font-bold tracking-wide text-gold-300">
                                <Link href={`/destinations/${destination.slug}`} className="hover:underline">
                                    {localized(destination, 'name', locale)}
                                </Link>
                                {' · '}
                                {t(`tours.types.${tour.type}`)}
                            </p>
                            <h1 className="font-display mt-2 text-3xl font-extrabold leading-snug text-sand-100 drop-shadow sm:text-5xl">
                                {localized(tour, 'title', locale)}
                            </h1>
                            <p className="mt-4 leading-loose text-sand-100/85">{localized(tour, 'summary', locale)}</p>
                            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
                                <span className="rounded-sm bg-nile-950/60 px-4 py-2 text-gold-300">
                                    ★ {Number(tour.rating).toFixed(1)} · {tour.reviews_count} {t('common.reviews')}
                                </span>
                                <span className="rounded-sm bg-nile-950/60 px-4 py-2 text-sand-100">
                                    <DurationLabel tour={tour} />
                                </span>
                                {tour.is_featured && (
                                    <span className="rounded-sm bg-gold-500 px-4 py-2 text-ink-900">{t('common.featured')}</span>
                                )}
                            </div>
                        </div>
                        {!(tour.image ?? destination.image) && (
                            <span aria-hidden="true" className="font-glyph hidden text-8xl text-sand-100/50 lg:block">
                                {destination.glyph ?? '𓂀'}
                            </span>
                        )}
                    </div>
                </div>
            </section>

            <Reveal>
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
                    <div>
                        <p className="leading-loose text-sand-100/75">{localized(tour, 'description', locale)}</p>

                        {/* Itinerary */}
                        <div className="mt-12">
                            <SectionTitle>{t('tours.show.itinerary')}</SectionTitle>
                            <ol className="mt-6 space-y-0">
                                {itinerary.map((day, index) => (
                                    <li key={day.id} className="relative flex gap-5 pb-8 last:pb-0">
                                        {index < itinerary.length - 1 && (
                                            <span aria-hidden="true" className="absolute start-[22px] top-12 h-[calc(100%-3rem)] w-0.5 bg-gold-500/40" />
                                        )}
                                        <span className="font-display z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-nile-950/80 text-base font-bold text-gold-300 ring-1 ring-gold-500/60 backdrop-blur">
                                            {day.day_number}
                                        </span>
                                        <div className="pt-1.5">
                                            <h3 className="font-display text-lg font-bold text-sand-100">
                                                {t('tours.show.day')} {day.day_number}: {localized(day, 'title', locale)}
                                            </h3>
                                            <p className="mt-1.5 leading-relaxed text-sand-100/75">
                                                {localized(day, 'description', locale)}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Includes */}
                        {includes.length > 0 && (
                            <div className="mt-12">
                                <SectionTitle>{t('tours.show.includes')}</SectionTitle>
                                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                                    {includes.map((item) => (
                                        <li key={item} className="flex items-start gap-2.5 rounded-lg bg-nile-950/70 px-4 py-3 text-sm text-sand-100/75 shadow-lg shadow-black/25 ring-1 ring-white/10 backdrop-blur">
                                            <span aria-hidden="true" className="mt-0.5 font-bold text-gold-300">✓</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {localized(tour, 'meeting_point', locale) && (
                            <p className="mt-10 rounded-lg bg-nile-950/70 px-5 py-4 text-sm text-sand-100/75 shadow-lg shadow-black/25 ring-1 ring-white/10 backdrop-blur">
                                <span className="font-display font-bold text-sand-100">{t('tours.show.meetingPoint')}: </span>
                                {localized(tour, 'meeting_point', locale)}
                            </p>
                        )}
                    </div>

                    {/* Price card */}
                    <aside className="lg:sticky lg:top-40 lg:self-start">
                        <div className="rounded-lg bg-nile-950/70 p-6 shadow-lg shadow-black/25 ring-1 ring-gold-500/50 backdrop-blur">
                            <p className="text-sm text-sand-100/55">{t('common.perPerson')}</p>
                            <p className="mt-1">
                                {tour.old_price && (
                                    <span className="me-2 align-middle text-base text-sand-100/45 line-through">
                                        {formatPrice(tour.old_price, locale)} {t('common.currency')}
                                    </span>
                                )}
                                <span className="font-display align-middle text-4xl font-extrabold text-gold-300">
                                    {formatPrice(tour.price, locale)}
                                </span>{' '}
                                <span className="font-semibold text-sand-100/70">{t('common.currency')}</span>
                            </p>
                            <div className="mt-5 space-y-2.5 border-t border-white/10 pt-5 text-sm text-sand-100/70">
                                <p className="flex justify-between">
                                    <span>{localized(destination, 'name', locale)}</span>
                                    <span aria-hidden="true">{destination.glyph}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span><DurationLabel tour={tour} /></span>
                                    <span>★ {Number(tour.rating).toFixed(1)} ({tour.reviews_count})</span>
                                </p>
                            </div>
                            {/* Booking mini-form */}
                            <div className="mt-5 border-t border-white/10 pt-5">
                                <div>
                                    <label htmlFor="mini_travel_date" className={miniLabelClass}>{t('booking.travelDate')}</label>
                                    <input
                                        id="mini_travel_date"
                                        type="date"
                                        min={today}
                                        className={miniFieldClass}
                                        value={travelDate}
                                        onChange={(event) => setTravelDate(event.target.value)}
                                    />
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="mini_adults" className={miniLabelClass}>{t('booking.adults')}</label>
                                        <input
                                            id="mini_adults"
                                            type="number"
                                            min="1"
                                            max="30"
                                            className={miniFieldClass}
                                            value={adults}
                                            onChange={(event) => setAdults(event.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="mini_children" className={miniLabelClass}>{t('booking.children')}</label>
                                        <input
                                            id="mini_children"
                                            type="number"
                                            min="0"
                                            max="30"
                                            className={miniFieldClass}
                                            value={children}
                                            onChange={(event) => setChildren(event.target.value)}
                                        />
                                    </div>
                                </div>
                                <p className="mt-1.5 text-[11px] font-medium text-gold-300">{t('booking.childrenHint')}</p>
                                <p className="mt-4 flex items-baseline justify-between">
                                    <span className="font-display text-sm font-bold text-sand-100">{t('booking.total')}</span>
                                    <span className="font-display text-2xl font-extrabold text-gold-300">
                                        {formatPrice(liveTotal, locale)}{' '}
                                        <span className="text-xs font-semibold text-sand-100/70">{t('common.currency')}</span>
                                    </span>
                                </p>
                            </div>
                            <Link
                                href={bookHref}
                                className="font-subhead mt-5 flex min-h-[44px] items-center justify-center rounded-md bg-gold-500 px-6 py-3 text-center font-bold text-ink-900 transition-colors duration-150 ease-stone hover:bg-gold-300"
                            >
                                {t('booking.cta')}
                            </Link>
                            <p className="mt-3 text-center text-xs leading-relaxed text-sand-100/50">{t('tours.show.bookNote')}</p>
                        </div>
                    </aside>
                </div>

                {/* Related tours */}
                {relatedTours.length > 0 && (
                    <div className="mt-16">
                        <SectionTitle>{t('tours.show.related')}</SectionTitle>
                        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedTours.map((related) => (
                                <TourCard key={related.id} tour={related} />
                            ))}
                        </div>
                    </div>
                )}
            </section>
            </Reveal>
        </AppLayout>
    );
}
