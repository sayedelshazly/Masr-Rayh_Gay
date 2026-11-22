import { Link } from '@inertiajs/react';
import { useLocale } from '../i18n/LocaleContext';
import { formatPrice, localized } from '../lib/format';
import { DurationLabel } from './TourCard';

/**
 * Full-bleed image tour card — the same language as the destination
 * panels: the photo IS the card, and everything (title, meta, price)
 * is written on the image over a bottom scrim. No white body, no
 * detached text. Used by the featured-tours coverflow; the classic
 * TourCard still serves the tours index where scanning matters.
 * The whole card links to the tour page.
 */
export default function TourImageCard({ tour }) {
    const { t, locale } = useLocale();
    const destination = tour.destination ?? {};
    const photo = tour.image ?? destination.image ?? null;

    return (
        <Link
            href={`/tours/${tour.slug}`}
            className="group relative block h-full overflow-hidden rounded-lg shadow-2xl shadow-black/40 ring-1 ring-white/10"
        >
            {photo ? (
                <img
                    src={photo}
                    alt={localized(tour, 'title', locale)}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-stone group-hover:scale-105"
                />
            ) : (
                <span
                    aria-hidden="true"
                    className={`absolute inset-0 bg-gradient-to-br ${destination.gradient ?? 'from-nile-800 via-sky-600 to-nile-950'}`}
                />
            )}
            <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-nile-950/95 via-nile-950/30 to-nile-950/15"
            />

            {/* top row: featured badge + rating */}
            <span className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                {tour.is_featured ? (
                    <span className="font-subhead rounded-sm bg-gold-500 px-3 py-1 text-xs font-bold text-ink-900 shadow">
                        {t('common.featured')}
                    </span>
                ) : (
                    <span />
                )}
                <span className="rounded-sm bg-nile-950/70 px-2.5 py-1 text-xs font-semibold text-gold-300 backdrop-blur-sm">
                    ★ {Number(tour.rating).toFixed(1)}
                </span>
            </span>

            {/* everything else lives on the photo, at the bottom */}
            <span className="absolute inset-x-0 bottom-0 block p-5">
                <span aria-hidden="true" className="block h-0.5 w-9 bg-gold-500" />
                <span className="font-display mt-2 block text-2xl font-bold leading-snug text-sand-100 drop-shadow">
                    {localized(tour, 'title', locale)}
                </span>
                <span className="mt-2 flex flex-wrap items-center gap-x-2.5 text-xs font-medium text-sand-100/85">
                    <span>{localized(destination, 'name', locale)}</span>
                    <span aria-hidden="true" className="text-gold-500">•</span>
                    <DurationLabel tour={tour} />
                    <span aria-hidden="true" className="text-gold-500">•</span>
                    <span>{t(`tours.types.${tour.type}`)}</span>
                </span>
                <span className="mt-4 flex items-end justify-between border-t border-sand-100/20 pt-3.5">
                    <span>
                        {tour.old_price && (
                            <span className="me-2 text-xs text-sand-100/60 line-through">
                                {formatPrice(tour.old_price, locale)}
                            </span>
                        )}
                        <span className="font-display text-2xl font-bold text-gold-300">
                            {formatPrice(tour.price, locale)}
                        </span>{' '}
                        <span className="text-xs text-sand-100/70">{t('common.currency')}</span>
                        <span className="block text-[11px] text-sand-100/55">{t('common.perPerson')}</span>
                    </span>
                    <span className="font-subhead inline-flex items-center gap-1.5 rounded-md bg-gold-500 px-4 py-2 text-xs font-bold text-ink-900 transition-colors duration-150 ease-stone group-hover:bg-gold-300">
                        {t('common.viewDetails')}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 rtl:-scale-x-100">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12l-7.5 7.5M21 12H3" />
                        </svg>
                    </span>
                </span>
            </span>
        </Link>
    );
}
