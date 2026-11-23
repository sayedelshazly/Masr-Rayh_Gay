import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import QuizBlock from '../../Components/QuizBlock';
import Reveal from '../../Components/Reveal';
import { useLocale } from '../../i18n/LocaleContext';

export default function AcademyLesson({ lesson, questions, previousLesson, nextLesson }) {
    const { t, locale } = useLocale();
    const page = t('academy.page');
    const pick = (item, field) => item[`${field}_${locale}`] ?? item[`${field}_ar`];
    const sections = pick(lesson, 'content') ?? [];

    return (
        <AppLayout>
            <Head title={`${pick(lesson, 'title')} — ${page.metaTitle}`} />

            <section className="text-sand-100">
                <div className="mx-auto max-w-4xl px-4 pb-10 pt-[185px] sm:px-6">
                    <Link href="/academy" className="text-sm font-bold text-gold-300 hover:underline">
                        ← {page.backToAcademy}
                    </Link>
                    <div className="mt-5 flex items-center gap-2 text-xs font-bold">
                        <span className="rounded-full bg-gold-500 px-3 py-1 text-ink-900">{page.levels[lesson.level] ?? lesson.level}</span>
                        <span className="rounded-full bg-nile-800 px-3 py-1 text-sand-100/85">
                            ⏱ {lesson.estimated_minutes} {page.minutes}
                        </span>
                    </div>
                    <h1 className="font-display mt-4 text-3xl font-extrabold leading-snug sm:text-4xl">{pick(lesson, 'title')}</h1>
                    <p className="mt-3 leading-loose text-sand-100/75">{pick(lesson, 'summary')}</p>
                </div>
            </section>

            <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
                {sections.map((section, index) => (
                    <Reveal key={index}>
                        <section className="mb-9">
                            <h2 className="font-display flex items-baseline gap-3 text-2xl font-bold text-sand-100">
                                <span className="font-glyph text-gold-300" aria-hidden="true">
                                    𓋹
                                </span>
                                {section.heading}
                            </h2>
                            <p className="mt-3 text-[1.05rem] leading-loose text-sand-100/80">{section.body}</p>
                        </section>
                    </Reveal>
                ))}

                {questions.length > 0 && (
                    <Reveal>
                        <section className="mt-12 rounded-lg bg-nile-950/70 p-5 shadow-lg shadow-black/25 ring-1 ring-white/10 backdrop-blur sm:p-7">
                            <h2 className="font-display text-2xl font-extrabold text-sand-100">{page.lessonQuizTitle}</h2>
                            <p className="mt-2 leading-relaxed text-sand-100/75">{page.lessonQuizText}</p>
                            <div className="mt-6">
                                <QuizBlock questions={questions} />
                            </div>
                        </section>
                    </Reveal>
                )}

                <nav className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
                    {previousLesson ? (
                        <Link
                            href={`/academy/lessons/${previousLesson.slug}`}
                            className="font-display rounded-full border border-gold-500/70 px-5 py-2.5 text-sm font-bold text-gold-300 transition-colors hover:bg-gold-500 hover:text-ink-900"
                        >
                            ← {page.prevLesson}: {pick(previousLesson, 'title')}
                        </Link>
                    ) : (
                        <span />
                    )}
                    {nextLesson ? (
                        <Link
                            href={`/academy/lessons/${nextLesson.slug}`}
                            className="font-display rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-ink-900 transition-colors hover:bg-gold-300"
                        >
                            {page.nextLesson}: {pick(nextLesson, 'title')} ←
                        </Link>
                    ) : (
                        <Link
                            href="/academy/quiz"
                            className="font-display rounded-full bg-nile-950 px-5 py-2.5 text-sm font-bold text-gold-300 ring-1 ring-gold-500/50 transition-colors hover:bg-nile-800"
                        >
                            {page.quizTitle} ←
                        </Link>
                    )}
                </nav>
            </article>
        </AppLayout>
    );
}
