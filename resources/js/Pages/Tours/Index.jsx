import { useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Reveal from '../../Components/Reveal';
import TourCard from '../../Components/TourCard';
import { useLocale } from '../../i18n/LocaleContext';
import { formatPrice, localized } from '../../lib/format';

const MAX_PRICE_OPTIONS = ['', 1500, 2000, 4000, 7000, 15000];

const SORT_OPTIONS = ['featured', 'price_asc', 'price_desc', 'rating', 'duration'];

const SORT_LABEL_KEYS = {
    featured: 'tours.sortFeatured',
    price_asc: 'tours.sortPriceAsc',
    price_desc: 'tours.sortPriceDesc',
    rating: 'tours.sortRating',
    duration: 'tours.sortDuration',
};

const inputClass =
    'w-full rounded-md border border-sand-100/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-sand-100 outline-none transition-colors placeholder:text-sand-100/35 focus:border-gold-500 [&>option]:text-ink-900';

export default function ToursIndex({ tours, destinations, types, filters }) {
    const { t, locale } = useLocale();
    const [search, setSearch] = useState(filters.search ?? '');
    const firstRender = useRef(true);

    const apply = (next) => {
        router.get('/tours', next, { preserveState: true, preserveScroll: true, replace: true });
    };

    // Debounced search: re-query the server 400ms after typing stops.
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        const handle = setTimeout(() => {
            apply({ ...filters, search, page: undefined });
        }, 400);

        return () => clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const hasFilters = filters.search || filters.destination || filters.type || filters.max_price;

    return (
        <AppLayout>
            <Head title={t('tours.metaTitle')} />

            <Reveal>
                <section>
                    <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 text-center sm:px-6">
                        <p className="font-display text-sm font-bold tracking-wide text-gold-300">{t('tours.kicker')}</p>
                        <h1 className="font-display mx-auto mt-2 max-w-3xl text-4xl font-extrabold leading-snug text-sand-100 sm:text-5xl">
                            {t('tours.title')}
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl leading-loose text-sand-100/70">{t('tours.subtitle')}</p>
                    </div>
                </section>
            </Reveal>

            <Reveal>
            <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
                {/* Filters — every change re-queries the server (Inertia, state preserved) */}
                <div className="grid gap-3 rounded-lg bg-nile-950/70 p-4 shadow-lg shadow-black/25 ring-1 ring-white/10 backdrop-blur sm:grid-cols-2 lg:grid-cols-5">
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={t('tours.searchPlaceholder')}
                        className={inputClass}
                        aria-label={t('tours.searchPlaceholder')}
                    />
                    <select
                        value={filters.destination ?? ''}
                        onChange={(event) => apply({ ...filters, destination: event.target.value, page: undefined })}
                        className={inputClass}
                        aria-label={t('tours.allDestinations')}
                    >
                        <option value="">{t('tours.allDestinations')}</option>
                        {destinations.map((destination) => (
                            <option key={destination.slug} value={destination.slug}>
                                {localized(destination, 'name', locale)}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filters.type ?? ''}
                        onChange={(event) => apply({ ...filters, type: event.target.value, page: undefined })}
                        className={inputClass}
                        aria-label={t('tours.allTypes')}
                    >
                        <option value="">{t('tours.allTypes')}</option>
                        {types.map((type) => (
                            <option key={type} value={type}>
                                {t(`tours.types.${type}`)}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filters.max_price ?? ''}
                        onChange={(event) => apply({ ...filters, max_price: event.target.value, page: undefined })}
                        className={inputClass}
                        aria-label={t('tours.maxPrice')}
                    >
                        {MAX_PRICE_OPTIONS.map((value) => (
                            <option key={value || 'any'} value={value}>
                                {value === ''
                                    ? `${t('tours.maxPrice')}: ${t('tours.maxPriceAny')}`
                                    : `${t('tours.maxPrice')}: ${formatPrice(value, locale)} ${t('common.currency')}`}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filters.sort ?? 'featured'}
                        onChange={(event) => apply({ ...filters, sort: event.target.value, page: undefined })}
                        className={inputClass}
                        aria-label={t('tours.sortFeatured')}
                    >
                        {SORT_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {t(SORT_LABEL_KEYS[option])}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-medium text-sand-100/55">
                        <span className="font-display text-lg font-bold text-gold-300">{tours.total}</span>{' '}
                        {t('tours.results')}
                    </p>
                    {hasFilters && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                apply({ search: '', destination: '', type: '', max_price: '', sort: filters.sort });
                            }}
                            className="text-sm font-semibold text-gold-300 transition-colors hover:text-gold-500"
                        >
                            {t('tours.resetFilters')}
                        </button>
                    )}
                </div>

                {tours.data.length > 0 ? (
                    <div className="pyramid-grid mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {tours.data.map((tour, i) => (
                            <TourCard key={tour.id} tour={tour} index={i} cols={3} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-6 rounded-lg bg-nile-950/70 p-12 text-center shadow-lg shadow-black/25 ring-1 ring-white/10 backdrop-blur">
                        <p aria-hidden="true" className="font-glyph text-5xl text-gold-500/60">𓂀</p>
                        <h2 className="font-display mt-4 text-2xl font-bold text-sand-100">
                            {t('tours.noResultsTitle')}
                        </h2>
                        <p className="mx-auto mt-2 max-w-md text-sand-100/55">{t('tours.noResultsText')}</p>
                    </div>
                )}

                {tours.last_page > 1 && (
                    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
                        {tours.links.map((link, index) =>
                            link.url ? (
                                <Link
                                    key={index}
                                    href={link.url}
                                    preserveState
                                    preserveScroll
                                    className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                                        link.active
                                            ? 'bg-gold-500 text-ink-900'
                                            : 'bg-white/5 text-sand-100/70 ring-1 ring-white/10 hover:text-gold-300'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    key={index}
                                    className="rounded-md px-4 py-2 text-sm text-sand-100/35"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ),
                        )}
                    </nav>
                )}
            </section>
            </Reveal>
        </AppLayout>
    );
}
