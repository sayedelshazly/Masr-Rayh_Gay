import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import HieroglyphStrip from '../../Components/HieroglyphStrip';
import { useLocale } from '../../i18n/LocaleContext';

export default function AcademyIndex({ lessons, featuredGlyphs, glyphOfDay, glyphCount }) {
    const { t, locale } = useLocale();
    const page = t('academy.page');
    const pick = (item, field) => item[`${field}_${locale}`] ?? item[`${field}_ar`];

    const tools = [
        { href: '/academy/glyphs', glyph: '𓂀', title: page.chartTitle, text: page.chartText, cta: page.openTool },
        { href: '/academy/name', glyph: '𓋹', title: page.nameTitle, text: page.nameText, cta: page.openTool },
        { href: '/academy/quiz', glyph: '𓆣', title: page.quizTitle, text: page.quizText, cta: page.startQuiz },
    ];

    return (
        <AppLayout>
            <Head title={page.metaTitle} />

            {/* Hero */}
            <section className="bg-lapis-deep text-ivory">
                <div className="mx-auto max-w-7xl px-4 pb-14 pt-14 text-center sm:px-6">
                    <p className="font-display text-sm font-bold tracking-wide text-gold-light">{t('academy.kicker')}</p>
                    <h1 className="font-display mx-auto mt-3 max-w-3xl text-4xl font-extrabold leading-snug sm:text-5xl">
                        {page.heroTitle}
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl leading-loose text-ivory/75">{page.heroSubtitle}</p>

                    {glyphOfDay && (
                        <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-5 rounded-3xl border border-gold/40 bg-lapis/40 px-6 py-4">
                            <span className="font-glyph text-6xl text-gold-light" aria-hidden="true">
                                {glyphOfDay.symbol}
                            </span>
                            <span className="text-start">
                                <span className="block text-xs font-bold uppercase tracking-wide text-gold-light">
                                    {page.glyphOfDay}
                                </span>
                                <span className="font-display block text-lg font-bold">{pick(glyphOfDay, 'name')}</span>
                                <span className="block text-sm text-ivory/70">
                                    {page.transliteration}: <span dir="ltr">{glyphOfDay.transliteration}</span>
                                    {glyphOfDay.pronunciation ? ` — ${glyphOfDay.pronunciation}` : ''}
                                </span>
                            </span>
                        </div>
                    )}
                </div>
                <HieroglyphStrip className="pb-5 text-center text-sm text-gold/50" />
            </section>

            {/* Lessons */}
            <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
                <div className="text-center">
                    <h2 className="font-display text-3xl font-extrabold text-lapis-deep">{page.lessonsTitle}</h2>
                    <p className="mx-auto mt-3 max-w-2xl leading-loose text-ink/70">{page.lessonsSubtitle}</p>
                </div>
                <div className="mt-9 grid gap-6 sm:grid-cols-2">
                    {lessons.map((lesson, index) => (
                        <Link
                            key={lesson.id}
                            href={`/academy/lessons/${lesson.slug}`}
                            className="group rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sand transition-shadow hover:shadow-md"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <span className="font-display flex h-11 w-11 items-center justify-center rounded-full bg-lapis-deep text-lg font-extrabold text-gold-light">
                                    {index + 1}
                                </span>
                                <span className="flex items-center gap-2 text-xs font-bold">
                                    <span className="rounded-full bg-gold/15 px-3 py-1 text-gold-deep">
                                        {page.levels[lesson.level] ?? lesson.level}
                                    </span>
                                    <span className="rounded-full bg-sand px-3 py-1 text-ink/70">
                                        ⏱ {lesson.estimated_minutes} {page.minutes}
                                    </span>
                                </span>
                            </div>
                            <h3 className="font-display mt-4 text-xl font-bold text-lapis-deep group-hover:text-gold-deep">
                                {pick(lesson, 'title')}
                            </h3>
                            <p className="mt-2 leading-relaxed text-ink/70">{pick(lesson, 'summary')}</p>
                            <span className="font-display mt-4 inline-block text-sm font-bold text-gold-deep">
                                {page.startLesson} ←
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured symbols */}
            {featuredGlyphs.length > 0 && (
                <section className="bg-sand/60">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <h2 className="font-display text-2xl font-extrabold text-lapis-deep">{page.featuredTitle}</h2>
                                <p className="mt-1 text-ink/70">{page.featuredText}</p>
                            </div>
                            <Link
                                href="/academy/glyphs"
                                className="font-display rounded-full border border-gold/70 px-5 py-2 text-sm font-bold text-gold-deep transition-colors hover:bg-gold hover:text-ink"
                            >
                                {page.viewChart} ({glyphCount})
                            </Link>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
                            {featuredGlyphs.map((glyph) => (
                                <Link
                                    key={glyph.id}
                                    href="/academy/glyphs"
                                    className="rounded-3xl bg-white p-4 text-center shadow-sm ring-1 ring-sand transition-shadow hover:shadow-md"
                                    title={pick(glyph, 'meaning')}
                                >
                                    <span className="block font-glyph text-4xl text-lapis" aria-hidden="true">
                                        {glyph.symbol}
                                    </span>
                                    <span className="mt-2 block truncate text-xs font-bold text-ink/80">
                                        {pick(glyph, 'name')}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Tools */}
            <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
                <h2 className="font-display text-center text-3xl font-extrabold text-lapis-deep">{page.toolsTitle}</h2>
                <div className="mt-9 grid gap-6 md:grid-cols-3">
                    {tools.map((tool) => (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            className="group rounded-3xl bg-lapis-deep p-6 text-ivory transition-shadow hover:shadow-lg"
                        >
                            <span className="font-glyph text-5xl text-gold-light" aria-hidden="true">
                                {tool.glyph}
                            </span>
                            <h3 className="font-display mt-4 text-xl font-bold">{tool.title}</h3>
                            <p className="mt-2 leading-relaxed text-ivory/75">{tool.text}</p>
                            <span className="font-display mt-4 inline-block rounded-full bg-gold px-5 py-2 text-sm font-bold text-ink transition-colors group-hover:bg-gold-light">
                                {tool.cta}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </AppLayout>
    );
}
