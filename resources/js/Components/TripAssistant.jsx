import { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { useLocale } from '../i18n/LocaleContext';
import { formatPrice, localized } from '../lib/format';

const QUESTIONS = [
    {
        key: 'group',
        textKey: 'assistant.qDestination',
        options: [
            ['giza', 'assistant.optGiza'],
            ['luxor', 'assistant.optLuxor'],
            ['aswan', 'assistant.optAswan'],
            ['redsea', 'assistant.optRedsea'],
            ['oasis', 'assistant.optOasis'],
            ['alex', 'assistant.optAlex'],
            ['any', 'assistant.optAnywhere'],
        ],
    },
    {
        key: 'budget',
        textKey: 'assistant.qBudget',
        options: [
            ['under_2000', 'assistant.budgetUnder2000'],
            ['2000_5000', 'assistant.budget2000'],
            ['5000_10000', 'assistant.budget5000'],
            ['over_10000', 'assistant.budgetOver'],
            ['any', 'assistant.budgetAny'],
        ],
    },
    {
        key: 'length',
        textKey: 'assistant.qLength',
        options: [
            ['day', 'assistant.lenDay'],
            ['short', 'assistant.lenShort'],
            ['long', 'assistant.lenLong'],
            ['any', 'assistant.lenAny'],
        ],
    },
];

/**
 * The trip assistant: a small rule-based chat that asks three
 * questions and recommends catalogue tours, served by
 * POST /assistant/recommend. Lives at the bottom-START corner;
 * the WhatsApp float keeps the bottom-end corner.
 */
export default function TripAssistant() {
    const { t, locale } = useLocale();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [thinking, setThinking] = useState(false);
    const [done, setDone] = useState(false);
    const [teaser, setTeaser] = useState(0);
    const scrollRef = useRef(null);

    // Attention teaser: a speech bubble over the pill that cycles
    // three invitations, starting a few seconds after the page
    // settles. It retires for good once the assistant is opened.
    useEffect(() => {
        if (window.localStorage.getItem('masr-assistant-opened')) return undefined;
        const timers = [
            setTimeout(() => setTeaser(1), 7000),
            setTimeout(() => setTeaser(2), 11500),
            setTimeout(() => setTeaser(3), 16000),
            setTimeout(() => setTeaser(0), 21500),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    const openAssistant = () => {
        window.localStorage.setItem('masr-assistant-opened', '1');
        setTeaser(0);
        setOpen(true);
    };

    const startConversation = () => {
        setMessages([
            { from: 'bot', text: t('assistant.greeting') },
            { from: 'bot', text: t(QUESTIONS[0].textKey) },
        ]);
        setStep(0);
        setAnswers({});
        setDone(false);
        setThinking(false);
    };

    useEffect(() => {
        if (open && messages.length === 0) {
            startConversation();
        }
    }, [open ]);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, thinking, open]);

    const finish = async (finalAnswers) => {
        setThinking(true);
        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.content;
            const response = await fetch('/assistant/recommend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ...(token ? { 'X-CSRF-TOKEN': token } : {}),
                },
                body: JSON.stringify(finalAnswers),
            });
            const data = await response.json();
            const botMessages = [
                { from: 'bot', text: data.relaxed ? t('assistant.resultsRelaxed') : t('assistant.resultsIntro') },
            ];
            if (data.tours.length === 0) {
                botMessages.push({ from: 'bot', text: t('assistant.noResults') });
            }
            setMessages((prev) => [...prev, ...botMessages, ...(data.tours.length ? [{ from: 'results', tours: data.tours }] : [])]);
        } catch {
            setMessages((prev) => [...prev, { from: 'bot', text: t('assistant.error') }]);
        } finally {
            setThinking(false);
            setDone(true);
        }
    };

    const choose = (question, [value, labelKey]) => {
        const nextAnswers = { ...answers, [question.key]: value };
        setAnswers(nextAnswers);
        const userMessage = { from: 'user', text: t(labelKey) };
        const nextStep = step + 1;

        if (nextStep < QUESTIONS.length) {
            setMessages((prev) => [...prev, userMessage]);
            setThinking(true);
            setTimeout(() => {
                setThinking(false);
                setMessages((prev) => [...prev, { from: 'bot', text: t(QUESTIONS[nextStep].textKey) }]);
            }, 450);
            setStep(nextStep);
        } else {
            setMessages((prev) => [...prev, userMessage]);
            setStep(nextStep);
            setTimeout(() => finish(nextAnswers), 350);
        }
    };

    const current = !done && step < QUESTIONS.length ? QUESTIONS[step] : null;

    return (
        <>
            {teaser > 0 && !open && (
                <div className="animate-popup-in fixed bottom-[4.7rem] start-5 z-40 max-w-[248px]">
                    <button
                        type="button"
                        onClick={openAssistant}
                        className="relative block w-full rounded-lg bg-nile-950/95 px-4 py-3 text-start shadow-xl shadow-black/40 ring-1 ring-gold-500/60 backdrop-blur transition hover:ring-gold-300"
                    >
                        <span key={teaser} className="animate-quote-in block text-[13px] font-semibold leading-relaxed text-sand-100">
                            {t(`assistant.teaser${teaser}`)}
                        </span>
                        <span aria-hidden="true" className="absolute -bottom-[5px] start-7 h-2.5 w-2.5 rotate-45 bg-nile-950" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setTeaser(0)}
                        aria-label={t('assistant.close')}
                        className="absolute -top-2 end-2 flex h-5 w-5 items-center justify-center rounded-full bg-nile-950 text-[10px] text-sand-100/80 ring-1 ring-white/25 transition hover:text-sand-100"
                    >
                        ✕
                    </button>
                </div>
            )}

            <button
                type="button"
                onClick={() => (open ? setOpen(false) : openAssistant())}
                aria-label={t('assistant.title')}
                className="fixed bottom-5 start-5 z-40 flex items-center gap-2 rounded-full bg-nile-950/90 py-2.5 pe-4 ps-3 shadow-lg shadow-black/30 ring-1 ring-gold-500/60 backdrop-blur transition hover:bg-gold-500 hover:text-ink-900 hover:ring-gold-500"
            >
                <span className={`font-glyph text-xl leading-none text-gold-300 transition group-hover:text-ink-900 ${open ? '' : 'animate-beckon'}`}>𓂀</span>
                <span className="text-xs font-bold text-sand-100">{t('assistant.button')}</span>
            </button>

            {open && (
                <div className="animate-popup-in fixed bottom-24 start-5 z-50 flex max-h-[70vh] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-lg bg-nile-950/95 shadow-2xl shadow-black/50 ring-1 ring-gold-500/40 backdrop-blur">
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                        <p className="flex items-center gap-2 text-sm font-bold text-sand-100">
                            <span className="font-glyph text-lg text-gold-300">𓂀</span>
                            {t('assistant.title')}
                        </p>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label={t('assistant.close')}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-sand-100/70 transition hover:bg-white/10 hover:text-sand-100"
                        >
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                        </button>
                    </div>

                    <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                        {messages.map((message, index) => {
                            if (message.from === 'results') {
                                return (
                                    <div key={index} className="space-y-2">
                                        {message.tours.map((tour) => (
                                            <Link
                                                key={tour.slug}
                                                href={tour.url}
                                                className="flex gap-3 rounded-md bg-white/5 p-2 ring-1 ring-white/10 transition hover:ring-gold-500/60"
                                            >
                                                {tour.image && <img src={tour.image} alt="" className="h-16 w-20 shrink-0 rounded-sm object-cover" loading="lazy" />}
                                                <span className="min-w-0">
                                                    <span className="block truncate text-sm font-bold text-sand-100">{localized(tour, 'title', locale)}</span>
                                                    <span className="mt-0.5 block text-[11px] text-sand-100/60">
                                                        {localized(tour, 'destination', locale)} · {tour.duration_days} {t('assistant.days')} · ★ {tour.rating.toFixed(1)}
                                                    </span>
                                                    <span className="mt-1 block text-sm font-bold text-gold-300">{formatPrice(tour.price, locale)}</span>
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                );
                            }
                            return (
                                <div key={index} className={message.from === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                                    <p className={
                                        message.from === 'user'
                                            ? 'max-w-[85%] rounded-lg rounded-ee-sm bg-gold-500 px-3 py-2 text-sm font-semibold text-ink-900'
                                            : 'max-w-[85%] rounded-lg rounded-es-sm bg-white/8 px-3 py-2 text-sm leading-relaxed text-sand-100 ring-1 ring-white/10'
                                    }>
                                        {message.text}
                                    </p>
                                </div>
                            );
                        })}
                        {thinking && (
                            <div className="flex justify-start">
                                <p className="flex gap-1 rounded-lg rounded-es-sm bg-white/8 px-3 py-2.5 ring-1 ring-white/10">
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold-300 [animation-delay:0ms]" />
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold-300 [animation-delay:150ms]" />
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold-300 [animation-delay:300ms]" />
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-white/10 px-4 py-3">
                        {current && !thinking ? (
                            <div className="flex flex-wrap gap-1.5">
                                {current.options.map((option) => (
                                    <button
                                        key={option[0]}
                                        type="button"
                                        onClick={() => choose(current, option)}
                                        className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-sand-100 ring-1 ring-gold-500/40 transition hover:bg-gold-500 hover:text-ink-900"
                                    >
                                        {t(option[1])}
                                    </button>
                                ))}
                            </div>
                        ) : done ? (
                            <div className="flex flex-wrap gap-1.5">
                                <button
                                    type="button"
                                    onClick={startConversation}
                                    className="rounded-full bg-gold-500 px-3 py-1.5 text-xs font-bold text-ink-900 transition hover:bg-gold-300"
                                >
                                    {t('assistant.restart')}
                                </button>
                                <Link
                                    href="/tours"
                                    className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-sand-100 ring-1 ring-white/15 transition hover:ring-gold-500/60"
                                >
                                    {t('assistant.browseAll')}
                                </Link>
                            </div>
                        ) : (
                            <p className="text-center text-[11px] text-sand-100/40">{t('assistant.thinking')}</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
