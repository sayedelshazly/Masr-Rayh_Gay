import { useMemo, useState } from 'react';
import { useLocale } from '../i18n/LocaleContext';

/**
 * Interactive quiz with instant, client-side scoring.
 *
 * NOTE (stage): questions arrive with their `correct_index` in props and
 * scoring/explanations are handled entirely in the browser — fine for a
 * free learning quiz with no stakes. If scores are ever saved or ranked,
 * grading must move to the server.
 */
export default function QuizBlock({ questions }) {
    const { t, locale } = useLocale();
    const quiz = t('academy.page.quiz');
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    const pick = (item, field) => item[`${field}_${locale}`] ?? item[`${field}_ar`];
    const answeredCount = Object.keys(answers).length;
    const score = useMemo(
        () => questions.reduce((total, q) => total + (answers[q.id] === q.correct_index ? 1 : 0), 0),
        [answers, questions],
    );

    const submit = () => {
        if (answeredCount < questions.length) {
            setShowWarning(true);
            return;
        }
        setShowWarning(false);
        setSubmitted(true);
    };

    const retry = () => {
        setAnswers({});
        setSubmitted(false);
        setShowWarning(false);
    };

    const verdict =
        score === questions.length ? quiz.perfect : score >= Math.ceil(questions.length / 2) ? quiz.good : quiz.keepGoing;

    return (
        <div>
            <ol className="space-y-5">
                {questions.map((question, index) => {
                    const options = pick(question, 'options') ?? [];
                    const chosen = answers[question.id];
                    const isCorrect = submitted && chosen === question.correct_index;

                    return (
                        <li key={question.id} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sand sm:p-6">
                            <p className="font-display text-base font-bold text-lapis-deep">
                                <span className="text-gold-deep">
                                    {index + 1} {quiz.of} {questions.length} —{' '}
                                </span>
                                {pick(question, 'question')}
                            </p>
                            <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                {options.map((option, optionIndex) => {
                                    const isChosen = chosen === optionIndex;
                                    const isAnswer = question.correct_index === optionIndex;
                                    let classes =
                                        'border-sand bg-ivory text-ink/85 hover:border-gold/60 hover:bg-sand';
                                    if (!submitted && isChosen) {
                                        classes = 'border-gold bg-gold/15 text-ink font-bold';
                                    }
                                    if (submitted && isAnswer) {
                                        classes = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                                    } else if (submitted && isChosen) {
                                        classes = 'border-red-400 bg-red-50 text-red-900 font-bold';
                                    }

                                    return (
                                        <button
                                            key={optionIndex}
                                            type="button"
                                            disabled={submitted}
                                            onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                                            className={`rounded-2xl border px-4 py-3 text-start text-sm transition-colors ${classes}`}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                            {submitted && (
                                <div className="mt-4 rounded-2xl bg-sand/70 px-4 py-3 text-sm leading-relaxed">
                                    <span className={`font-bold ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                                        {isCorrect ? `✓ ${quiz.correct}` : `✗ ${quiz.wrong}`}
                                    </span>
                                    <span className="mt-1 block text-ink/75">
                                        <span className="font-bold text-lapis-deep">{quiz.explanation}: </span>
                                        {pick(question, 'explanation')}
                                    </span>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ol>

            {showWarning && !submitted && (
                <p className="mt-4 rounded-2xl bg-gold/15 px-4 py-3 text-sm font-bold text-gold-deep">{quiz.answerAll}</p>
            )}

            {submitted ? (
                <div className="mt-6 rounded-3xl bg-lapis-deep p-6 text-center text-ivory">
                    <p className="text-sm text-ivory/70">{quiz.yourScore}</p>
                    <p className="font-display mt-1 text-4xl font-extrabold text-gold-light" dir="ltr">
                        {score} / {questions.length}
                    </p>
                    <p className="mt-2 text-ivory/85">{verdict}</p>
                    <button
                        type="button"
                        onClick={retry}
                        className="font-display mt-4 rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-gold-light"
                    >
                        {quiz.retry}
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={submit}
                    className="font-display mt-6 w-full rounded-full bg-gold px-6 py-3.5 font-bold text-ink transition-colors hover:bg-gold-deep hover:text-ivory sm:w-auto"
                >
                    {quiz.submit} ({answeredCount}/{questions.length})
                </button>
            )}
        </div>
    );
}
