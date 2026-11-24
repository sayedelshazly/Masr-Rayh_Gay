import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Reveal from '../../Components/Reveal';
import Button from '../../Components/Button';
import { useLocale } from '../../i18n/LocaleContext';
import { localized } from '../../lib/format';

export default function GuidesIndex({ guides, totals }) {
    const { t, locale } = useLocale();
    const num = (value) => Number(value).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US');

    return (
        <AppLayout>
            <Head title={t('guides.title')} />

            <section className="mx-auto w-full max-w-7xl px-4 pt-[185px] sm:px-6 lg:px-8">
                <Reveal>
                    <div className="text-center">
                        <p className="font-glyph text-3xl text-gold-300">𓂀 𓋹 𓅃 𓆣</p>
                        <h1 className="mt-4 font-display text-4xl leading-tight text-sand-100 sm:text-5xl">
                            {t('guides.heading')}
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-sand-100/75">
                            {t('guides.intro')}
                        </p>
                        <div className="mt-8 flex flex-wrap items-stretch justify-center gap-3">
                            {[
                                [num(totals.guides), t('guides.statGuides')],
                                [`${num(totals.trips)}+`, t('guides.statTrips')],
                                [num(totals.languages), t('guides.statLanguages')],
                            ].map(([value, labelText]) => (
                                <div key={labelText} className="rounded-md bg-nile-950/70 px-6 py-3 ring-1 ring-white/10 backdrop-blur">
                                    <p className="font-display text-2xl font-bold text-gold-300">{value}</p>
                                    <p className="mt-0.5 text-xs font-semibold text-sand-100/60">{labelText}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>
            </section>

            <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {guides.map((guide, index) => (
                        <Reveal key={guide.slug} delay={(index % 4) * 80}>
                            <article className="group relative h-80 overflow-hidden rounded-lg shadow-lg shadow-black/30 ring-1 ring-white/10 transition hover:ring-gold-500/60">
                                <img
                                    src={guide.image}
                                    alt={localized(guide, 'name', locale)}
                                    loading="lazy"
                                    className="absolute inset-0 h-full w-full object-cover object-top transition duration-500 ease-stone group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-nile-950 via-nile-950/35 to-transparent" />

                                <span className="absolute start-3 top-3 flex items-center gap-1 rounded-full bg-nile-950/80 px-2 py-0.5 text-[11px] font-bold text-gold-300 ring-1 ring-gold-500/40 backdrop-blur">
                                    ★ {guide.rating.toFixed(1)}
                                </span>
                                <span className="absolute end-3 top-2.5 font-glyph text-xl text-gold-300/90 drop-shadow">{guide.glyph}</span>

                                <div className="absolute inset-x-0 bottom-0 p-4">
                                    <h2 className="font-display text-lg leading-snug text-sand-100">{localized(guide, 'name', locale)}</h2>
                                    <p className="mt-0.5 text-xs font-bold text-gold-300">{localized(guide, 'role', locale)}</p>
                                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-sand-100/80">
                                        {localized(guide, 'bio', locale)}
                                    </p>
                                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                                        {guide.languages.map((lang) => (
                                            <span key={lang} className="rounded-full bg-nile-950/60 px-2 py-0.5 text-[10px] font-bold text-sand-100/85 ring-1 ring-white/20 backdrop-blur">
                                                {t(`guides.lang.${lang}`)}
                                            </span>
                                        ))}
                                        <span className="ms-auto text-[11px] font-semibold text-sand-100/70">
                                            {num(guide.years)} {t('guides.years')} · {num(guide.trips)}+ {t('guides.trips')}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        </Reveal>
                    ))}
                </div>

                <Reveal>
                    <div className="mt-12 text-center">
                        <p className="mx-auto max-w-xl leading-relaxed text-sand-100/70">{t('guides.ctaText')}</p>
                        <div className="mt-5 flex flex-wrap justify-center gap-3">
                            <Link href="/tours">
                                <Button>{t('guides.ctaTours')}</Button>
                            </Link>
                            <Link href="/plan-your-trip">
                                <Button variant="secondaryDark">{t('guides.ctaPlan')}</Button>
                            </Link>
                        </div>
                    </div>
                </Reveal>
            </section>
        </AppLayout>
    );
}
