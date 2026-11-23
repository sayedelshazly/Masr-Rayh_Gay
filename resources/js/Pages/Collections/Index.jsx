import { Head } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import CollectionCard from '../../Components/CollectionCard';
import Reveal from '../../Components/Reveal';
import { useLocale } from '../../i18n/LocaleContext';

export default function CollectionsIndex({ collections = [] }) {
    const { t } = useLocale();

    return (
        <AppLayout>
            <Head title={t('collections.metaTitle')} />
            <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
                <Reveal>
                    <div className="text-center">
                        <p className="font-subhead text-xs font-bold uppercase tracking-[0.3em] text-gold-300">{t('collections.kicker')}</p>
                        <h1 className="font-display mt-3 text-4xl font-bold text-sand-100 sm:text-5xl">{t('collections.title')}</h1>
                        <p className="mx-auto mt-4 max-w-xl leading-loose text-sand-100/70">{t('collections.subtitle')}</p>
                    </div>
                </Reveal>
                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    {collections.map((collection, index) => (
                        <Reveal key={collection.slug} delay={index * 110}>
                            <CollectionCard collection={collection} />
                        </Reveal>
                    ))}
                </div>
            </section>
        </AppLayout>
    );
}
