import { Link } from '@inertiajs/react';
import { useLocale } from '../i18n/LocaleContext';
import { formatPrice, localized } from '../lib/format';

/** Duration label: "1 day" / "3 days · 2 nights" (localized via common strings). */
export function DurationLabel({ tour, className = '' }) {
    const { t } = useLocale();

    const days = tour.duration_days === 1 ? t('common.day') : `${tour.duration_days} ${t('common.days')}`;
    const nights = tour.duration_nights ? ` · ${tour.duration_nights} ${t('common.nights')}` : '';

    return <span className={className}>{days}{nights}</span>;
}

export default function TourCard({ tour }) {
    const { t, locale } = useLocale();
    const destination = tour.destination ?? {};

    return (
        <article className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-md shadow-ink/5 ring-1 ring-sand transition-shadow hover:shadow-xl">
            {/* Gradient placeholder in place of a photo (real images later) */}
            <div className={`relative flex h-44 items-end bg-gradient-to-br p-4 ${destination.gradient ?? 'from-lapis via-sky-600 to-lapis-deep'}`}>
                <span aria-hidden="true" className="absolute end-4 top-3 text-4xl text-white/70">
                    {destination.glyph ?? '𓂀'}
                </span>
                {tour.is_featured && (
                    <span className="font-display absolute start-4 top-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink shadow">
                        {t('common.featured')}
                    </span>
                )}
                <div className="flex w-full items-end justify-between gap-2">
                    <h3 className="font-display text-lg font-bold leading-snug text-white drop-shadow">
                        {localized(tour, 'title', locale)}
                    </h3>
                    <span className="shrink-0 rounded-full bg-lapis-deep/70 px-2.5 py-1 text-xs font-semibold text-gold-light">
                        ★ {Number(tour.rating).toFixed(1)}
                    </span>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-ink/55">
                    <span>{localized(destination, 'name', locale)}</span>
                    <span aria-hidden="true">•</span>
                    <DurationLabel tour={tour} />
                    <span aria-hidden="true">•</span>
                    <span>{t(`tours.types.${tour.type}`)}</span>
                </div>

                <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-relaxed text-ink/65">
                    {localized(tour, 'summary', locale)}
                </p>

                <div className="mt-4 flex items-end justify-between border-t border-sand pt-4">
                    <p className="text-sm text-ink/60">
                        {tour.old_price && (
                            <span className="me-2 text-xs line-through">
                                {formatPrice(tour.old_price, locale)}
                            </span>
                        )}
                        <span className="font-display text-xl font-bold text-gold-deep">
                            {formatPrice(tour.price, locale)}
                        </span>{' '}
                        {t('common.currency')}
                        <span className="block text-xs text-ink/50">{t('common.perPerson')}</span>
                    </p>
                    <Link
                        href={`/tours/${tour.slug}`}
                        className="font-display rounded-full bg-lapis px-4 py-2 text-sm font-bold text-ivory transition-colors hover:bg-lapis-deep"
                    >
                        {t('common.viewDetails')}
                    </Link>
                </div>
            </div>
        </article>
    );
}
