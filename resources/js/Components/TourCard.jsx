import { useLocale } from '../i18n/LocaleContext';
import { formatPrice, localized } from '../lib/format';
import Button from './Button';
import StepReveal from './StepReveal';

/** Duration label: "1 day" / "3 days · 2 nights" (localized via common strings). */
export function DurationLabel({ tour, className = '' }) {
    const { t } = useLocale();

    const days = tour.duration_days === 1 ? t('common.day') : `${tour.duration_days} ${t('common.days')}`;
    const nights = tour.duration_nights ? ` · ${tour.duration_nights} ${t('common.nights')}` : '';

    return <span className={className}>{days}{nights}</span>;
}

export default function TourCard({ tour, index = 0, cols = 3 }) {
    const { t, locale } = useLocale();
    const destination = tour.destination ?? {};
    const photo = tour.image ?? destination.image ?? null;

    return (
        <StepReveal index={index} cols={cols} className="h-full">
        <article
            className={`group flex h-full flex-col overflow-hidden rounded-lg bg-nile-950/70 shadow-lg shadow-black/25 backdrop-blur transition duration-300 ease-stone hover:-translate-y-1 hover:shadow-2xl ${
                tour.is_featured ? 'border border-gold-500 ring-1 ring-gold-500' : 'ring-1 ring-white/10'
            }`}
        >
            {/* Photo header; gradient + glyph fallback when no photo exists */}
            <div className="relative flex h-44 items-end overflow-hidden p-4">
                {photo ? (
                    <>
                        <img
                            src={photo}
                            alt={localized(tour, 'title', locale)}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-stone group-hover:scale-105"
                        />
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-nile-950/85 via-nile-950/25 to-transparent" />
                    </>
                ) : (
                    <>
                        <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-br ${destination.gradient ?? 'from-nile-800 via-sky-600 to-nile-950'}`} />
                        <span aria-hidden="true" className="font-glyph absolute end-4 top-3 text-4xl text-white/70">
                            {destination.glyph ?? '𓂀'}
                        </span>
                    </>
                )}
                {tour.is_featured && (
                    <span className="font-subhead absolute start-4 top-3 z-10 rounded-sm bg-gold-500 px-3 py-1 text-xs font-bold text-ink-900 shadow">
                        {t('common.featured')}
                    </span>
                )}
                <div className="relative z-10 flex w-full items-end justify-between gap-2">
                    <h3 className="font-display text-lg font-bold leading-snug text-white drop-shadow">
                        {localized(tour, 'title', locale)}
                    </h3>
                    <span className="shrink-0 rounded-sm bg-nile-950/70 px-2.5 py-1 text-xs font-semibold text-gold-300">
                        ★ {Number(tour.rating).toFixed(1)}
                    </span>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-sand-100/55">
                    <span>{localized(destination, 'name', locale)}</span>
                    <span aria-hidden="true">•</span>
                    <DurationLabel tour={tour} />
                    <span aria-hidden="true">•</span>
                    <span>{t(`tours.types.${tour.type}`)}</span>
                </div>

                <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-relaxed text-sand-100/70">
                    {localized(tour, 'summary', locale)}
                </p>

                <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-4">
                    <p className="text-sm text-sand-100/60">
                        {tour.old_price && (
                            <span className="me-2 text-xs line-through">
                                {formatPrice(tour.old_price, locale)}
                            </span>
                        )}
                        <span className="font-display text-xl font-bold text-gold-300">
                            {formatPrice(tour.price, locale)}
                        </span>{' '}
                        {t('common.currency')}
                        <span className="block text-xs text-sand-100/50">{t('common.perPerson')}</span>
                    </p>
                    <Button href={`/tours/${tour.slug}`} className="px-4">
                        {t('common.viewDetails')}
                    </Button>
                </div>
            </div>
        </article>
        </StepReveal>
    );
}
