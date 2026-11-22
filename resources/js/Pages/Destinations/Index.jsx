import { Head } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import DestinationCard from '../../Components/DestinationCard';
import { useLocale } from '../../i18n/LocaleContext';

export default function DestinationsIndex({ destinations }) {
    const { t } = useLocale();

    return (
        <AppLayout>
            <Head title={t('destinationPage.metaTitle')} />

            <section className="bg-gradient-to-b from-sand-300 via-sand-100 to-sand-100">
                <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 text-center sm:px-6">
                    <p className="font-display text-sm font-bold tracking-wide text-gold-deep">
                        {t('destinationPage.kicker')}
                    </p>
                    <h1 className="font-display mx-auto mt-2 max-w-3xl text-4xl font-extrabold leading-snug text-nile-950 sm:text-5xl">
                        {t('destinationPage.title')}
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl leading-loose text-ink-900/70">{t('destinationPage.subtitle')}</p>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {destinations.map((destination) => (
                        <DestinationCard key={destination.id} destination={destination} />
                    ))}
                </div>
            </section>
        </AppLayout>
    );
}
