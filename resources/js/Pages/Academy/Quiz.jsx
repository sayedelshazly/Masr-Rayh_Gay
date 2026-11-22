import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import QuizBlock from '../../Components/QuizBlock';
import { useLocale } from '../../i18n/LocaleContext';

export default function AcademyQuiz({ questions }) {
    const { t } = useLocale();
    const page = t('academy.page');

    return (
        <AppLayout>
            <Head title={page.quizMeta} />

            <section className="bg-gradient-to-b from-sand via-ivory to-ivory">
                <div className="mx-auto max-w-4xl px-4 pb-8 pt-12 text-center sm:px-6">
                    <p className="font-display text-sm font-bold tracking-wide text-gold-deep">{t('academy.kicker')}</p>
                    <h1 className="font-display mx-auto mt-2 max-w-3xl text-4xl font-extrabold leading-snug text-lapis-deep">
                        {page.quizPageTitle}
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl leading-loose text-ink/70">{page.quizPageSubtitle}</p>
                    <Link href="/academy" className="mt-4 inline-block text-sm font-bold text-gold-deep hover:underline">
                        ← {page.backToAcademy}
                    </Link>
                </div>
            </section>

            <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
                <QuizBlock questions={questions} />
            </section>
        </AppLayout>
    );
}
