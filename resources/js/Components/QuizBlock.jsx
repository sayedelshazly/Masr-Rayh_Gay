import { useState } from 'react';
import { useLocale } from '../i18n/LocaleContext';

/**
 * Interactive quiz, graded on the server.
 *
 * The questions arrive without their answers; on submit the browser
 * posts the chosen option indexes to /academy/quiz/check and renders the
 * score and per-question feedback that come back. Nothing about the
 * correct answers exists in the page before that point.
 */
export default function QuizBlock({ questions, lesson = null, best = null }) {
    const { t, locale } = useLocale();
    const quiz = t('academy.page.quiz');
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [failed, setFailed] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    // The visitor's best stored attempt (from the server), kept up to date
    // with whatever the grading response says after each submission.
    const [bestResult, setBestResult] = useState(best);
    const [isRecord, setIsRecord] = useState(false);

    const pick = (item, field) => item?.[`${field}_${locale}`] ?? item?.[`${field}_ar`];
    const answeredCount = Object.keys(answers).length;
    const submitted = result !== null;
    const feedback = submitted ? Object.fromEntries(result.results.map((row) => [row.id, row])) : {};
    const score = result?.score ?? 0;
    const total = result?.total ?? questions.length;

    const submit = async () => {
        if (answeredCount < questions.length) {
            setShowWarning(true);
            return;
        }

        setShowWarning(false);
        setSubmitting(true);
        setFailed(false);

        try {
            const response = await fetch('/academy/quiz/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ lesson, answers }),
            });

            if (!response.ok) {
                throw new Error(`Quiz check failed with ${response.status}`);
            }

            const data = await response.json();
            setResult(data);
            setBestResult(data.best ?? null);
            setIsRecord(Boolean(data.is_record));
        } catch {
            setFailed(true);
        } finally {
            setSubmitting(false);
        }
    };

    const retry = () => {
        setAnswers({});
        setResult(null);
        setIsRecord(false);
        setShowWarning(false);
        setFailed(false);
    };

    const verdict =
        score === total ? quiz.perfect : score >= Math.ceil(total / 2) ? quiz.good : quiz.keepGoing;

    return (
        <div>
            {bestResult && !submitted && (
                <p className="mb-5 flex flex-wrap items-baseline gap-x-2 rounded-md bg-white/5 px-4 py-3 text-sm font-medium text-sand-100/75 ring-1 ring-white/10">
                    <span className="font-bold text-gold-300">{quiz.bestScore}:</span>
                    <span dir="ltr" className="font-display font-bold text-sand-100">
                        {bestResult.score} / {bestResult.total}
                    </span>
                </p>
            )}

            <ol className="space-y-5">
                {questions.map((question, index) => {
                    const options = pick(question, 'options') ?? [];
                    const chosen = answers[question.id];
                    const row = feedback[question.id];
                    const isCorrect = Boolean(row?.is_correct);

                    return (
                        <li key={question.id} className="rounded-lg bg-nile-950/70 p-5 shadow-lg shadow-black/25 ring-1 ring-white/10 backdrop-blur sm:p-6">
                            <p className="font-display text-base font-bold text-sand-100">
                                <span className="text-gold-300">
                                    {index + 1} {quiz.of} {questions.length} —{' '}
                                </span>
                                {pick(question, 'question')}
                            </p>
                            <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                {options.map((option, optionIndex) => {
                                    const isChosen = chosen === optionIndex;
                                    const isAnswer = submitted && row?.correct_index === optionIndex;
                                    let classes =
                                        'border-white/10 bg-white/5 text-sand-100/85 hover:border-gold-500/60 hover:bg-white/10';
                                    if (!submitted && isChosen) {
                                        classes = 'border-gold-500 bg-gold-500/15 text-sand-100 font-bold';
                                    }
                                    if (submitted && isAnswer) {
                                        classes = 'border-teal-400/60 bg-teal-400/10 text-teal-200 font-bold';
                                    } else if (submitted && isChosen) {
                                        classes = 'border-red-400/60 bg-red-400/10 text-red-200 font-bold';
                                    }

                                    return (
                                        <button
                                            key={optionIndex}
                                            type="button"
                                            disabled={submitted || submitting}
                                            onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                                            className={`rounded-md border px-4 py-3 text-start text-sm transition-colors ${classes}`}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                            {submitted && row && (
                                <div className="mt-4 rounded-md bg-white/5 px-4 py-3 ring-1 ring-white/10 text-sm leading-relaxed">
                                    <span className={`font-bold ${isCorrect ? 'text-teal-300' : 'text-red-300'}`}>
                                        {isCorrect ? `✓ ${quiz.correct}` : `✗ ${quiz.wrong}`}
                                    </span>
                                    <span className="mt-1 block text-sand-100/75">
                                        <span className="font-bold text-gold-300">{quiz.explanation}: </span>
                                        {pick(row, 'explanation')}
                                    </span>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ol>

            {showWarning && !submitted && (
                <p className="mt-4 rounded-md bg-gold-500/15 px-4 py-3 text-sm font-bold text-gold-300">{quiz.answerAll}</p>
            )}

            {failed && (
                <p role="alert" className="mt-4 rounded-md bg-red-400/10 px-4 py-3 text-sm font-bold text-red-200 ring-1 ring-red-400/40">
                    {quiz.submitError}
                </p>
            )}

            {submitted ? (
                <div className="mt-6 rounded-lg bg-nile-950/80 p-6 text-center text-sand-100 ring-1 ring-gold-500/40 backdrop-blur">
                    <p className="text-sm text-sand-100/60">{quiz.yourScore}</p>
                    <p className="font-display mt-1 text-4xl font-extrabold text-gold-300" dir="ltr">
                        {score} / {total}
                    </p>
                    <p className="mt-2 text-sand-100/85">{verdict}</p>
                    {isRecord ? (
                        <p className="mt-2 text-sm font-bold text-teal-300">✓ {quiz.newBest}</p>
                    ) : (
                        bestResult &&
                        bestResult.score > score && (
                            <p className="mt-2 text-sm text-sand-100/60">
                                {quiz.bestScore}:{' '}
                                <span dir="ltr" className="font-bold text-sand-100">
                                    {bestResult.score} / {bestResult.total}
                                </span>
                            </p>
                        )
                    )}
                    <button
                        type="button"
                        onClick={retry}
                        className="font-display mt-4 rounded-md bg-gold-500 px-6 py-2.5 text-sm font-bold text-ink-900 transition-colors hover:bg-gold-300"
                    >
                        {quiz.retry}
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={submit}
                    disabled={submitting}
                    className="font-display mt-6 w-full rounded-md bg-gold-500 px-6 py-3.5 font-bold text-ink-900 transition-colors hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                    {quiz.submit} ({answeredCount}/{questions.length})
                </button>
            )}
        </div>
    );
}
