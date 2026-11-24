import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Reveal from '../../Components/Reveal';
import { useLocale } from '../../i18n/LocaleContext';
import { localized } from '../../lib/format';

export default function GalleryIndex({ photos = [] }) {
    const { t, locale } = useLocale();

    return (
        <AppLayout>
            <Head title={t('gallery.metaTitle')} />
            <section className="mx-auto max-w-7xl px-4 pb-20 pt-[185px] sm:px-6">
                <Reveal className="text-center">
                    <p className="font-subhead text-xs font-bold uppercase tracking-[0.3em] text-gold-300">{t('gallery.kicker')}</p>
                    <h1 className="font-display mt-3 text-4xl font-bold text-sand-100 sm:text-5xl">{t('gallery.title')}</h1>
                    <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-sand-100/65">{t('gallery.subtitle')}</p>
                    {photos.length > 0 && (
                        <p className="mt-3 text-sm font-bold text-gold-300">
                            {photos.length} {t('gallery.photosCount')}
                        </p>
                    )}
                </Reveal>

                {photos.length === 0 ? (
                    <Reveal className="mx-auto mt-12 max-w-xl rounded-lg bg-nile-950/70 p-10 text-center ring-1 ring-white/10 backdrop-blur">
                        <p aria-hidden="true" className="font-glyph text-5xl text-gold-500/60">𓂀</p>
                        <h2 className="font-display mt-4 text-xl font-bold text-sand-100">{t('gallery.emptyTitle')}</h2>
                        <p className="mt-2 text-sm leading-relaxed text-sand-100/60">{t('gallery.emptyText')}</p>
                    </Reveal>
                ) : (
                    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {photos.map((photo, index) => (
                            <Reveal key={photo.id} delay={Math.min(index % 3, 2) * 90}>
                                <figure className="group relative h-80 overflow-hidden rounded-lg ring-1 ring-white/10">
                                    <img
                                        src={photo.url}
                                        alt={photo.caption ?? photo.tour?.[`title_${locale}`] ?? ''}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition duration-500 ease-stone group-hover:scale-105"
                                    />
                                    <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-nile-950/90 via-nile-950/10 to-transparent" />
                                    <figcaption className="absolute inset-x-0 bottom-0 p-4">
                                        {photo.caption && <p className="font-display text-[15px] font-bold leading-snug text-sand-100">{photo.caption}</p>}
                                        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs text-sand-100/70">
                                            <span className="font-bold text-gold-300">{photo.traveller}</span>
                                            <span aria-hidden="true" className="text-gold-500">•</span>
                                            <Link href={`/tours/${photo.tour.slug}`} className="transition hover:text-gold-300">
                                                {localized(photo.tour, 'title', locale)}
                                            </Link>
                                        </p>
                                    </figcaption>
                                </figure>
                            </Reveal>
                        ))}
                    </div>
                )}
            </section>
        </AppLayout>
    );
}
