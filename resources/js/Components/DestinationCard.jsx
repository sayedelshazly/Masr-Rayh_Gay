import { Link } from '@inertiajs/react';
import { useLocale } from '../i18n/LocaleContext';
import { formatPrice, localized } from '../lib/format';

export default function DestinationCard({ destination }) {
    const { t, locale } = useLocale();

    return (
        <article className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-md shadow-ink-900/5 ring-1 ring-sand-300 transition-shadow hover:shadow-xl">
            {/* Photo header; gradient + glyph fallback when no photo exists */}
            <div className="relative flex h-44 items-end overflow-hidden p-4">
                {destination.image ? (
                    <>
                        <img
                            src={destination.image}
                            alt={localized(destination, 'name', locale)}
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
                <h3 className="font-display relative z-10 text-xl font-bold text-white drop-shadow">
                    {localized(destination, 'name', locale)}
                </h3>
            </div>
            <div className="flex flex-1 flex-col p-5">
                <p className="min-h-12 text-sm leading-relaxed text-ink-900/65">
                    {localized(destination, 'tagline', locale)}
                </p>
                <div className="mt-4 flex items-center justify-between">
                    {destination.from_price != null ? (
                        <p className="text-sm text-ink-900/60">
                            {t('destinations.from')}{' '}
                            <span className="font-display text-lg font-bold text-gold-deep">
                                {formatPrice(destination.from_price, locale)}
                            </span>{' '}
                            {t('destinations.currency')}
                        </p>
                    ) : (
                        <span />
                    )}
                    <Link
                        href={`/destinations/${destination.slug}`}
                        className="text-sm font-semibold text-lapis-600 transition-colors hover:text-gold-deep"
                    >
                        {t('destinationPage.viewDestination')} ←
                    </Link>
                </div>
                {destination.tours_count != null && (
                    <p className="mt-2 text-xs text-ink-900/50">
                        {destination.tours_count} {t('destinationPage.toursCount')}
                    </p>
                )}
            </div>
        </article>
    );
}
