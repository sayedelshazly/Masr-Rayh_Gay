import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { useLocale } from '../i18n/LocaleContext';
import { formatPrice, localized } from '../lib/format';

/**
 * Flip gallery tile for the home "Where to" mosaic — deliberately NOT a
 * normal card: the front is a pure full-bleed photo with only the name
 * and a whisper of meta written on the image itself (bottom scrim), and
 * the whole tile flips in 3D (rotateY) to reveal a nile-night back with
 * the tagline and the explore link.
 *
 * Flip triggers: hover on pointer devices, tap/click anywhere on the
 * tile, and Enter/Space when focused — so it works on touch too.
 * `spanClass` carries the mosaic spans from the parent grid; `large`
 * marks the hero tile (bigger type on both faces).
 */
export default function DestinationFlipCard({ destination, spanClass = '', large = false }) {
    const { t, locale } = useLocale();
    const [flipped, setFlipped] = useState(false);

    const toggle = () => setFlipped((value) => !value);

    return (
        <article
            role="button"
            tabIndex={0}
            aria-pressed={flipped}
            aria-label={localized(destination, 'name', locale)}
            onClick={toggle}
            onMouseEnter={() => setFlipped(true)}
            onMouseLeave={() => setFlipped(false)}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggle();
                }
            }}
            className={`group cursor-pointer rounded-lg [perspective:1400px] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${spanClass}`}
        >
            <div
                className="relative h-full w-full transition-transform duration-700 ease-stone [transform-style:preserve-3d]"
                style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
                {/* ——— Front: the photo, with the words ON it ——— */}
                <div className="absolute inset-0 overflow-hidden rounded-lg shadow-lg shadow-black/30 [backface-visibility:hidden]">
                    {destination.image ? (
                        <img
                            src={destination.image}
                            alt={localized(destination, 'name', locale)}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-stone group-hover:scale-110"
                        />
                    ) : (
                        <div
                            aria-hidden="true"
                            className={`absolute inset-0 bg-gradient-to-br ${destination.gradient ?? 'from-nile-800 via-sky-600 to-nile-950'}`}
                        />
                    )}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-nile-950/90 via-nile-950/20 to-nile-950/10"
                    />
                    {/* flip hint */}
                    <span
                        aria-hidden="true"
                        className="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-nile-950/45 text-sand-100 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-0"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                        <span aria-hidden="true" className="block h-0.5 w-9 bg-gold-500" />
                        <h3
                            className={`font-display mt-2 font-bold text-sand-100 drop-shadow ${
                                large ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'
                            }`}
                        >
                            {localized(destination, 'name', locale)}
                        </h3>
                        <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-sand-100/85 sm:text-sm">
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
                                        <span className="font-bold text-gold-300">
                                            {formatPrice(destination.from_price, locale)}
                                        </span>{' '}
                                        {t('destinations.currency')}
                                    </span>
                                </>
                            )}
                        </p>
                    </div>
                </div>

                {/* ——— Back: nile night, tagline + explore ——— */}
                <div className="absolute inset-0 overflow-hidden rounded-lg bg-gradient-to-br from-nile-800 via-nile-950 to-nile-950 shadow-lg shadow-black/30 ring-1 ring-gold-500/40 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className={`flex h-full flex-col items-center justify-center text-center ${large ? 'p-7' : 'p-4'}`}>
                        <span aria-hidden="true" className={`font-glyph text-gold-500 ${large ? 'text-4xl' : 'text-2xl'}`}>
                            {destination.glyph ?? '𓂀'}
                        </span>
                        <h3 className={`font-display mt-2 font-bold text-sand-100 ${large ? 'text-3xl' : 'text-lg'}`}>
                            {localized(destination, 'name', locale)}
                        </h3>
                        <p
                            className={`mt-2 leading-relaxed text-sand-100/75 ${
                                large ? 'line-clamp-3 text-sm' : 'line-clamp-2 text-xs'
                            }`}
                        >
                            {localized(destination, 'tagline', locale)}
                        </p>
                        <Link
                            href={`/destinations/${destination.slug}`}
                            onClick={(event) => event.stopPropagation()}
                            className={`font-subhead mt-4 inline-flex items-center rounded-md bg-gold-500 font-bold text-ink-900 transition-colors duration-150 ease-stone hover:bg-gold-300 ${
                                large ? 'min-h-[44px] px-6 py-2.5 text-sm' : 'px-4 py-2 text-xs'
                            }`}
                        >
                            {t('destinationPage.viewDestination')}
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
