import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { useLocale } from '../i18n/LocaleContext';
import { formatPrice, localized } from '../lib/format';

/**
 * Expanding-panels gallery for the home "Where to" section — the
 * award-site pattern: destinations stand side by side as slim slices
 * (desaturated photo, name written vertically); hovering / tapping one
 * stretches it open with a long stone-eased flex transition while the
 * rest shrink, the photo blooms into full colour, and the tagline,
 * meta and explore link fade up. On mobile the stack turns vertical
 * and expands by tap. The first panel starts open so the section never
 * renders collapsed.
 */
export default function DestinationPanels({ destinations }) {
    const { t, locale } = useLocale();
    const [active, setActive] = useState(0);

    return (
        <div className="flex h-[620px] flex-col gap-2 sm:gap-3 lg:h-[520px] lg:flex-row">
            {destinations.map((destination, index) => {
                const isActive = index === active;
                const name = localized(destination, 'name', locale);

                return (
                    <article
                        key={destination.id}
                        onMouseEnter={() => setActive(index)}
                        onClick={() => setActive(index)}
                        className="group relative min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-lg shadow-lg shadow-black/30 ring-1 ring-white/10 transition-all duration-700 ease-stone"
                        style={{ flexGrow: isActive ? 5 : 1, flexBasis: 0 }}
                    >
                        {destination.image ? (
                            <img
                                src={destination.image}
                                alt={name}
                                loading="lazy"
                                className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-stone ${
                                    isActive ? 'scale-100 grayscale-0' : 'scale-110 grayscale-[45%]'
                                }`}
                            />
                        ) : (
                            <div
                                aria-hidden="true"
                                className={`absolute inset-0 bg-gradient-to-br ${destination.gradient ?? 'from-nile-800 via-sky-600 to-nile-950'}`}
                            />
                        )}
                        <div
                            aria-hidden="true"
                            className={`absolute inset-0 transition-colors duration-700 ${
                                isActive
                                    ? 'bg-gradient-to-t from-nile-950/90 via-nile-950/20 to-transparent'
                                    : 'bg-nile-950/45'
                            }`}
                        />

                        {/* ghost index */}
                        <span
                            aria-hidden="true"
                            className="font-display absolute end-3 top-3 text-sm font-bold tracking-widest text-sand-100/50"
                            dir="ltr"
                        >
                            {String(index + 1).padStart(2, '0')}
                        </span>

                        {/* collapsed label — vertical on desktop */}
                        <span
                            aria-hidden="true"
                            className={`font-display absolute bottom-5 left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-lg font-bold tracking-wide text-sand-100 transition-opacity duration-300 [writing-mode:vertical-rl] lg:block ${
                                isActive ? 'opacity-0' : 'opacity-100'
                            }`}
                        >
                            {name}
                        </span>
                        {/* collapsed label — horizontal strip on mobile */}
                        <span
                            aria-hidden="true"
                            className={`font-display absolute inset-y-0 start-4 flex items-center text-base font-bold text-sand-100 transition-opacity duration-300 lg:hidden ${
                                isActive ? 'opacity-0' : 'opacity-100'
                            }`}
                        >
                            {name}
                        </span>

                        {/* expanded content */}
                        <div
                            className={`absolute inset-x-0 bottom-0 p-5 transition-all delay-150 duration-500 ease-stone sm:p-6 ${
                                isActive ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-5 opacity-0'
                            }`}
                        >
                            <span aria-hidden="true" className="block h-0.5 w-10 bg-gold-500" />
                            <h3 className="font-display mt-2 text-3xl font-bold text-sand-100 drop-shadow sm:text-4xl">
                                {name}
                            </h3>
                            <p className="mt-2 line-clamp-2 max-w-md text-sm leading-relaxed text-sand-100/85">
                                {localized(destination, 'tagline', locale)}
                            </p>
                            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                                <p className="flex flex-wrap items-center gap-x-2 text-sm text-sand-100/85">
                                    {destination.tours_count != null && (
                                        <span>
                                            {destination.tours_count} {t('destinationPage.toursCount')}
                                        </span>
                                    )}
                                    {destination.from_price != null && (
                                        <>
                                            <span aria-hidden="true" className="text-gold-500">•</span>
                                            <span>
                                                {t('destinations.from')}{' '}
                                                <span className="font-display text-lg font-bold text-gold-300">
                                                    {formatPrice(destination.from_price, locale)}
                                                </span>{' '}
                                                {t('destinations.currency')}
                                            </span>
                                        </>
                                    )}
                                </p>
                                <Link
                                    href={`/destinations/${destination.slug}`}
                                    tabIndex={isActive ? 0 : -1}
                                    className="font-subhead inline-flex min-h-[44px] items-center rounded-md bg-gold-500 px-6 py-2.5 text-sm font-bold text-ink-900 transition-colors duration-150 ease-stone hover:bg-gold-300"
                                >
                                    {t('destinationPage.viewDestination')}
                                </Link>
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
