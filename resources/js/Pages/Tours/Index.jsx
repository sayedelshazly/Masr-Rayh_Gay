import { useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
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
    'w-full rounded-md border border-gold-500/40 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 outline-none transition-colors focus:border-gold-deep';

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

            <section className="bg-gradient-to-b from-sand-300 via-sand-100 to-sand-100">
                <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 text-center sm:px-6">
                    <p className="font-display text-sm font-bold tracking-wide text-gold-deep">{t('tours.kicker')}</p>
                    <h1 className="font-display mx-auto mt-2 max-w-3xl text-4xl font-extrabold leading-snug text-nile-950 sm:text-5xl">
                        {t('tours.title')}
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl leading-loose text-ink-900/70">{t('tours.subtitle')}</p>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
                {/* Filters — every change re-queries the server (Inertia, state preserved) */}
                <div className="grid gap-3 rounded-lg border border-gold-500/40 bg-white/80 p-4 shadow-lg shadow-ink-900/5 backdrop-blur sm:grid-cols-2 lg:grid-cols-5">
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
                    <p className="text-sm font-medium text-ink-900/60">
                        <span className="font-display text-lg font-bold text-gold-deep">{tours.total}</span>{' '}
                        {t('tours.results')}
                    </p>
                    {hasFilters && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                apply({ search: '', destination: '', type: '', max_price: '', sort: filters.sort });
                            }}
                            className="text-sm font-semibold text-lapis-600 transition-colors hover:text-gold-deep"
                        >
                            {t('tours.resetFilters')}
                        </button>
                    )}
                </div>

                {tours.data.length > 0 ? (
                    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {tours.data.map((tour) => (
                            <TourCard key={tour.id} tour={tour} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-6 rounded-lg bg-white p-12 text-center shadow-sm ring-1 ring-sand-300">
                        <p aria-hidden="true" className="font-glyph text-5xl text-gold-500/60">𓂀</p>
                        <h2 className="font-display mt-4 text-2xl font-bold text-nile-950">
                            {t('tours.noResultsTitle')}
                        </h2>
                        <p className="mx-auto mt-2 max-w-md text-ink-900/60">{t('tours.noResultsText')}</p>
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
                                            ? 'bg-nile-800 text-sand-100'
                                            : 'bg-white text-ink-900/70 ring-1 ring-sand-300 hover:text-gold-deep'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    key={index}
                                    className="rounded-md px-4 py-2 text-sm text-ink-900/35"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ),
                        )}
                    </nav>
                )}
            </section>
        </AppLayout>
    );
}
