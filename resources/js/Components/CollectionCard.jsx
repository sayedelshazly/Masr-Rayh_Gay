import { Link } from '@inertiajs/react';
import { useLocale } from '../i18n/LocaleContext';
import { formatPrice, localized } from '../lib/format';

/**
 * A ready-package card: full-bleed photo, the collection's glyph
 * and mood line over the scrim, and its size + from-price.
 */
export default function CollectionCard({ collection }) {
    const { t, locale } = useLocale();

    return (
        <Link
            href={`/collections/${collection.slug}`}
            className="group relative block h-80 overflow-hidden rounded-lg shadow-lg shadow-black/25 ring-1 ring-white/10"
        >
            <img
                src={collection.image}
                alt={localized(collection, 'title', locale)}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-stone group-hover:scale-105"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-nile-950/95 via-nile-950/35 to-transparent" />
            <span aria-hidden="true" className="font-glyph absolute end-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-nile-950/60 text-xl text-gold-300 ring-1 ring-gold-500/40 backdrop-blur">
                {collection.glyph}
            </span>
            <span className="absolute inset-x-0 bottom-0 p-5">
                <span className="font-display block text-2xl font-bold text-sand-100 drop-shadow">
                    {localized(collection, 'title', locale)}
                </span>
                <span className="mt-1 block text-sm text-sand-100/75">{localized(collection, 'tagline', locale)}</span>
                <span className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-sand-100/65">
                        {collection.tours_count} {t('collections.toursLabel')}
                        {collection.from_price ? ` · ${t('destinations.from')} ${formatPrice(collection.from_price, locale)} ${t('common.currency')}` : ''}
                    </span>
                    <span className="font-display shrink-0 rounded-md bg-gold-500 px-3.5 py-1.5 text-xs font-bold text-ink-900 transition-colors group-hover:bg-gold-300">
                        {t('collections.explore')}
                    </span>
                </span>
            </span>
        </Link>
    );
}
