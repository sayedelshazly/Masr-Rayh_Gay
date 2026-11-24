import { Head } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import Reveal from '../Components/Reveal';
import { useLocale } from '../i18n/LocaleContext';

export default function Privacy() {
    const { t, strings } = useLocale();
    const rows = strings.privacy.cookieRows ?? [];

    const sections = [
        { title: t('privacy.dataTitle'), text: t('privacy.dataText'), glyph: '𓂀' },
        { title: t('privacy.useTitle'), text: t('privacy.useText'), glyph: '𓋹' },
        { title: t('privacy.rightsTitle'), text: t('privacy.rightsText'), glyph: '𓆣' },
        { title: t('privacy.contactTitle'), text: t('privacy.contactText'), glyph: '𓇋' },
    ];

    return (
        <AppLayout>
            <Head title={t('privacy.metaTitle')} />
            <section className="mx-auto max-w-4xl px-4 pb-20 pt-[185px] sm:px-6">
                <Reveal className="text-center">
                    <p className="font-subhead text-xs font-bold uppercase tracking-[0.3em] text-gold-300">{t('privacy.kicker')}</p>
                    <h1 className="font-display mt-3 text-4xl font-bold text-sand-100 sm:text-5xl">{t('privacy.title')}</h1>
                    <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-sand-100/65">{t('privacy.intro')}</p>
                </Reveal>

                <div className="mt-12 space-y-5">
                    {sections.slice(0, 2).map((section) => (
                        <Reveal key={section.title}>
                            <article className="rounded-lg bg-nile-950/70 p-6 ring-1 ring-white/10 backdrop-blur sm:p-8">
                                <h2 className="font-display flex items-center gap-3 text-xl font-bold text-sand-100">
                                    <span aria-hidden="true" className="font-glyph text-2xl text-gold-400">{section.glyph}</span>
                                    {section.title}
                                </h2>
                                <p className="mt-3 leading-loose text-sand-100/75">{section.text}</p>
                            </article>
                        </Reveal>
                    ))}

                    <Reveal>
                        <article className="rounded-lg bg-nile-950/70 p-6 ring-1 ring-white/10 backdrop-blur sm:p-8">
                            <h2 className="font-display flex items-center gap-3 text-xl font-bold text-sand-100">
                                <span aria-hidden="true" className="font-glyph text-2xl text-gold-400">𓏏</span>
                                {t('privacy.cookiesTitle')}
                            </h2>
                            <p className="mt-3 leading-loose text-sand-100/75">{t('privacy.cookiesText')}</p>
                            <div className="mt-4 divide-y divide-white/5 overflow-hidden rounded-md ring-1 ring-white/10">
                                {rows.map((row) => (
                                    <div key={row.name} className="grid gap-1 bg-white/[0.03] px-4 py-3 sm:grid-cols-[180px_1fr] sm:gap-4">
                                        <p className="text-sm font-bold text-gold-300">{row.name}</p>
                                        <p className="text-sm leading-relaxed text-sand-100/70">{row.purpose}</p>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </Reveal>

                    {sections.slice(2).map((section) => (
                        <Reveal key={section.title}>
                            <article className="rounded-lg bg-nile-950/70 p-6 ring-1 ring-white/10 backdrop-blur sm:p-8">
                                <h2 className="font-display flex items-center gap-3 text-xl font-bold text-sand-100">
                                    <span aria-hidden="true" className="font-glyph text-2xl text-gold-400">{section.glyph}</span>
                                    {section.title}
                                </h2>
                                <p className="mt-3 leading-loose text-sand-100/75">{section.text}</p>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </section>
        </AppLayout>
    );
}
