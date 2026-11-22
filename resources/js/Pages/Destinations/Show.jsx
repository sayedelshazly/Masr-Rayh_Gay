import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import TourCard from '../../Components/TourCard';
import { useLocale } from '../../i18n/LocaleContext';
import { localized } from '../../lib/format';

export default function DestinationShow({ destination, tours }) {
    const { t, locale } = useLocale();

    return (
        <AppLayout>
            <Head title={`${localized(destination, 'name', locale)} — ${t('brand.name')}`} />

            {/* Hero band */}
            <section className={`bg-gradient-to-br ${destination.gradient ?? 'from-lapis via-sky-600 to-lapis-deep'}`}>
                <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
                    <Link href="/destinations" className="text-sm font-semibold text-white/85 transition-colors hover:text-gold-light">
                        ← {t('destinationPage.title')}
                    </Link>
                    <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
                        <div className="max-w-3xl">
                            <h1 className="font-display text-4xl font-extrabold leading-snug text-white drop-shadow sm:text-5xl">
                                {localized(destination, 'name', locale)}
                            </h1>
                            <p className="font-display mt-3 text-lg font-semibold text-gold-light">
                                {localized(destination, 'tagline', locale)}
                            </p>
                            <p className="mt-4 leading-loose text-white/85">
                                {localized(destination, 'description', locale)}
                            </p>
                            <p className="mt-6 inline-block rounded-full bg-lapis-deep/60 px-4 py-2 text-sm font-semibold text-ivory">
                                {tours.length} {t('destinationPage.toursCount')}
                            </p>
                        </div>
                        <span aria-hidden="true" className="hidden text-8xl text-white/50 lg:block">
                            {destination.glyph ?? '𓂀'}
                        </span>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                <h2 className="font-display text-2xl font-bold text-lapis-deep sm:text-3xl">
                    {t('destinationPage.toursIn')}
                </h2>

                {tours.length > 0 ? (
                    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {tours.map((tour) => (
                            <TourCard key={tour.id} tour={tour} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-6 rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-sand">
                        <p aria-hidden="true" className="text-5xl text-gold/60">𓂀</p>
                        <p className="mx-auto mt-4 max-w-md text-ink/60">{t('destinationPage.noTours')}</p>
                    </div>
                )}
            </section>
        </AppLayout>
    );
}
