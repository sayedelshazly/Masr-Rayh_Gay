import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import QuizBlock from '../../Components/QuizBlock';
import { useLocale } from '../../i18n/LocaleContext';

export default function AcademyLesson({ lesson, questions, previousLesson, nextLesson }) {
    const { t, locale } = useLocale();
    const page = t('academy.page');
    const pick = (item, field) => item[`${field}_${locale}`] ?? item[`${field}_ar`];
    const sections = pick(lesson, 'content') ?? [];

    return (
        <AppLayout>
            <Head title={`${pick(lesson, 'title')} — ${page.metaTitle}`} />

            <section className="bg-lapis-deep text-ivory">
                <div className="mx-auto max-w-4xl px-4 pb-10 pt-12 sm:px-6">
                    <Link href="/academy" className="text-sm font-bold text-gold-light hover:underline">
                        ← {page.backToAcademy}
                    </Link>
                    <div className="mt-5 flex items-center gap-2 text-xs font-bold">
                        <span className="rounded-full bg-gold px-3 py-1 text-ink">{page.levels[lesson.level] ?? lesson.level}</span>
                        <span className="rounded-full bg-lapis px-3 py-1 text-ivory/85">
                            ⏱ {lesson.estimated_minutes} {page.minutes}
                        </span>
                    </div>
                    <h1 className="font-display mt-4 text-3xl font-extrabold leading-snug sm:text-4xl">{pick(lesson, 'title')}</h1>
                    <p className="mt-3 leading-loose text-ivory/75">{pick(lesson, 'summary')}</p>
                </div>
            </section>

            <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
                {sections.map((section, index) => (
                    <section key={index} className="mb-9">
                        <h2 className="font-display flex items-baseline gap-3 text-2xl font-bold text-lapis-deep">
                            <span className="text-gold-deep" aria-hidden="true">
                                𓋹
                            </span>
                            {section.heading}
                        </h2>
                        <p className="mt-3 text-[1.05rem] leading-loose text-ink/80">{section.body}</p>
                    </section>
                ))}

                {questions.length > 0 && (
                    <section className="mt-12 rounded-[2rem] bg-sand/60 p-5 sm:p-7">
                        <h2 className="font-display text-2xl font-extrabold text-lapis-deep">{page.lessonQuizTitle}</h2>
                        <p className="mt-2 leading-relaxed text-ink/70">{page.lessonQuizText}</p>
                        <div className="mt-6">
                            <QuizBlock questions={questions} />
                        </div>
                    </section>
                )}

                <nav className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-sand pt-6">
                    {previousLesson ? (
                        <Link
                            href={`/academy/lessons/${previousLesson.slug}`}
                            className="font-display rounded-full border border-gold/70 px-5 py-2.5 text-sm font-bold text-gold-deep transition-colors hover:bg-gold hover:text-ink"
                        >
                            ← {page.prevLesson}: {pick(previousLesson, 'title')}
                        </Link>
                    ) : (
                        <span />
                    )}
                    {nextLesson ? (
                        <Link
                            href={`/academy/lessons/${nextLesson.slug}`}
                            className="font-display rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-gold-deep hover:text-ivory"
                        >
                            {page.nextLesson}: {pick(nextLesson, 'title')} ←
                        </Link>
                    ) : (
                        <Link
                            href="/academy/quiz"
                            className="font-display rounded-full bg-lapis-deep px-5 py-2.5 text-sm font-bold text-gold-light transition-colors hover:bg-lapis"
                        >
                            {page.quizTitle} ←
                        </Link>
                    )}
                </nav>
            </article>
        </AppLayout>
    );
}
