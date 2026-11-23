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
                                    const isAnswer = question.correct_index === optionIndex;
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
                                            disabled={submitted}
                                            onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                                            className={`rounded-md border px-4 py-3 text-start text-sm transition-colors ${classes}`}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                            {submitted && (
                                <div className="mt-4 rounded-md bg-white/5 px-4 py-3 ring-1 ring-white/10 text-sm leading-relaxed">
                                    <span className={`font-bold ${isCorrect ? 'text-teal-300' : 'text-red-300'}`}>
                                        {isCorrect ? `✓ ${quiz.correct}` : `✗ ${quiz.wrong}`}
                                    </span>
                                    <span className="mt-1 block text-sand-100/75">
                                        <span className="font-bold text-gold-300">{quiz.explanation}: </span>
                                        {pick(question, 'explanation')}
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

            {submitted ? (
                <div className="mt-6 rounded-lg bg-nile-950/80 p-6 text-center text-sand-100 ring-1 ring-gold-500/40 backdrop-blur">
                    <p className="text-sm text-sand-100/60">{quiz.yourScore}</p>
                    <p className="font-display mt-1 text-4xl font-extrabold text-gold-300" dir="ltr">
                        {score} / {questions.length}
                    </p>
                    <p className="mt-2 text-sand-100/85">{verdict}</p>
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
                    className="font-display mt-6 w-full rounded-md bg-gold-500 px-6 py-3.5 font-bold text-ink-900 transition-colors hover:bg-gold-300 sm:w-auto"
                >
                    {quiz.submit} ({answeredCount}/{questions.length})
                </button>
            )}
        </div>
    );
}
