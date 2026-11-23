import { Head } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import CollectionCard from '../../Components/CollectionCard';
import TourShowcase from '../../Components/TourShowcase';
import Reveal from '../../Components/Reveal';
import { useLocale } from '../../i18n/LocaleContext';
import { localized } from '../../lib/format';

export default function CollectionShow({ collection, tours = [], others = [] }) {
    const { t, locale } = useLocale();

    return (
        <AppLayout backdrop={collection.image}>
            <Head title={`${localized(collection, 'title', locale)} — ${t('brand.name')}`} />
            <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
                <Reveal>
                    <div className="text-center">
                        <p aria-hidden="true" className="font-glyph text-4xl text-gold-400">{collection.glyph}</p>
                        <h1 className="font-display mt-3 text-4xl font-bold text-sand-100 sm:text-5xl">
                            {localized(collection, 'title', locale)}
                        </h1>
                        <p className="font-display mt-2 text-lg text-gold-300">{localized(collection, 'tagline', locale)}</p>
                        <p className="mx-auto mt-4 max-w-2xl leading-loose text-sand-100/70">
                            {localized(collection, 'description', locale)}
                        </p>
                    </div>
                </Reveal>

                <div className="mt-10">
                    <TourShowcase tours={tours} />
                </div>

                {others.length > 0 && (
                    <div className="mt-20">
                        <h2 className="font-display text-center text-2xl font-bold text-sand-100 sm:text-3xl">{t('collections.othersTitle')}</h2>
                        <div className="mt-8 grid gap-6 md:grid-cols-2">
                            {others.map((other) => (
                                <CollectionCard key={other.slug} collection={other} />
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </AppLayout>
    );
}
