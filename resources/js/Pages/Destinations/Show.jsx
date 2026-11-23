import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import TourCard from '../../Components/TourCard';
import Reveal from '../../Components/Reveal';
import { useLocale } from '../../i18n/LocaleContext';
import { localized } from '../../lib/format';

export default function DestinationShow({ destination, tours }) {
    const { t, locale } = useLocale();

    return (
        <AppLayout backdrop={destination.image ?? undefined}>
            <Head title={`${localized(destination, 'name', locale)} — ${t('brand.name')}`} />

            {/* Hero band: photo under a dark nile overlay (gradient fallback) */}
            <section className="relative overflow-hidden">
                {destination.image ? (
                    <>
                        <img
                            src={destination.image}
                            alt={localized(destination, 'name', locale)}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-nile-950/80 via-nile-950/55 to-nile-950/85" />
                    </>
                ) : (
                    <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-br ${destination.gradient ?? 'from-nile-800 via-sky-600 to-nile-950'}`} />
                )}
                <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
                    <Link href="/destinations" className="text-sm font-semibold text-white/85 transition-colors hover:text-gold-300">
                        ← {t('destinationPage.title')}
                    </Link>
                    <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
                        <div className="max-w-3xl">
                            <h1 className="font-display text-4xl font-extrabold leading-snug text-white drop-shadow sm:text-5xl">
                                {localized(destination, 'name', locale)}
                            </h1>
                            <p className="font-display mt-3 text-lg font-semibold text-gold-300">
                                {localized(destination, 'tagline', locale)}
                            </p>
                            <p className="mt-4 leading-loose text-white/85">
                                {localized(destination, 'description', locale)}
                            </p>
                            <p className="mt-6 inline-block rounded-sm bg-nile-950/60 px-4 py-2 text-sm font-semibold text-sand-100">
                                {tours.length} {t('destinationPage.toursCount')}
                            </p>
                        </div>
                        {!destination.image && (
                            <span aria-hidden="true" className="font-glyph hidden text-8xl text-white/50 lg:block">
                                {destination.glyph ?? '𓂀'}
                            </span>
                        )}
                    </div>
                </div>
            </section>

            <Reveal>
                <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                    <h2 className="font-display text-2xl font-bold text-sand-100 sm:text-3xl">
                        {t('destinationPage.toursIn')}
                    </h2>

                    {tours.length > 0 ? (
                        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {tours.map((tour) => (
                                <TourCard key={tour.id} tour={tour} />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-6 rounded-lg bg-nile-950/70 p-12 text-center shadow-lg shadow-black/25 ring-1 ring-white/10 backdrop-blur">
                            <p aria-hidden="true" className="font-glyph text-5xl text-gold-500/60">𓂀</p>
                            <p className="mx-auto mt-4 max-w-md text-sand-100/60">{t('destinationPage.noTours')}</p>
                        </div>
                    )}
                </section>
            </Reveal>
        </AppLayout>
    );
}
