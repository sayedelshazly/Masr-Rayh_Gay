import { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Reveal from '../../Components/Reveal';
import { useLocale } from '../../i18n/LocaleContext';

const DIGRAPHS = ['kh', 'sh', 'dj', 'tj'];

/** Greedy longest-match tokenisation: digraphs first, then single letters. */
function tokenize(name, glyphMap) {
    const tokens = [];
    const lower = (name ?? '').toLowerCase();
    let i = 0;

    while (i < lower.length) {
        const char = lower[i];

        if (char === ' ' || char === '-' || char === "'") {
            tokens.push({ text: ' ', glyph: null });
            i += 1;
            continue;
        }

        const pair = lower.slice(i, i + 2);
        if (pair.length === 2 && DIGRAPHS.includes(pair) && glyphMap[pair]) {
            tokens.push({ text: pair, glyph: glyphMap[pair] });
            i += 2;
            continue;
        }

        if (glyphMap[char]) {
            tokens.push({ text: char, glyph: glyphMap[char] });
        }
        i += 1;
    }

    return tokens;
}

export default function AcademyNameTool({ glyphMap }) {
    const { t } = useLocale();
    const page = t('academy.page');
    const [name, setName] = useState('');
    const [copied, setCopied] = useState(false);

    const tokens = useMemo(() => tokenize(name.trim(), glyphMap), [name, glyphMap]);
    const glyphTokens = tokens.filter((token) => token.glyph);
    const glyphString = glyphTokens.map((token) => token.glyph).join('');

    const copy = async () => {
        if (!glyphString) {
            return;
        }
        try {
            await navigator.clipboard.writeText(glyphString);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    return (
        <AppLayout>
            <Head title={page.nameMeta} />

            <section className="text-sand-100">
                <div className="mx-auto max-w-4xl px-4 pb-12 pt-12 text-center sm:px-6">
                    <p className="font-display text-sm font-bold tracking-wide text-gold-300">{t('academy.kicker')}</p>
                    <h1 className="font-display mx-auto mt-2 max-w-3xl text-4xl font-extrabold leading-snug">{page.namePageTitle}</h1>
                    <p className="mx-auto mt-4 max-w-2xl leading-loose text-sand-100/75">{page.namePageSubtitle}</p>
                    <Link href="/academy" className="mt-4 inline-block text-sm font-bold text-gold-300 hover:underline">
                        ← {page.backToAcademy}
                    </Link>

                    <div className="mx-auto mt-8 max-w-xl text-start">
                        <label htmlFor="royal-name" className="text-sm font-medium text-sand-100/85">
                            {page.nameLabel}
                        </label>
                        <input
                            id="royal-name"
                            type="text"
                            dir="ltr"
                            value={name}
                            onChange={(event) => {
                                setName(event.target.value);
                                setCopied(false);
                            }}
                            placeholder={page.namePlaceholder}
                            className="mt-2 w-full rounded-full border border-sand-100/20 bg-white/5 px-5 py-3.5 text-center text-lg text-sand-100 outline-none placeholder:text-sand-100/35 focus:border-gold-500"
                        />
                    </div>
                </div>
            </section>

            <Reveal>
                <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
                    {/* Cartouche rendering: oval ring with the end bar, like royal name rings. */}
                    <h2 className="font-display text-center text-xl font-bold text-sand-100">{page.cartouche}</h2>
                    <div className="mt-5 flex justify-center" dir="ltr">
                        <div className="flex items-stretch">
                            <div className="flex min-h-24 min-w-64 items-center justify-center rounded-full border-4 border-gold-500 bg-nile-950/70 px-8 py-4 shadow-[0_0_45px_rgba(201,162,75,0.25)] ring-1 ring-gold-500/40 backdrop-blur">
                                {glyphString ? (
                                    <span className="font-glyph text-center text-4xl leading-relaxed tracking-wide text-gold-300">
                                        {tokens.map((token, index) =>
                                            token.glyph ? <span key={index}>{token.glyph}</span> : <span key={index} className="mx-2" />,
                                        )}
                                    </span>
                                ) : (
                                    <span className="text-sm text-sand-100/50">{page.nameEmpty}</span>
                                )}
                            </div>
                            <div className="my-1 w-2.5 rounded-full bg-gold-500" aria-hidden="true" />
                        </div>
                    </div>

                    {glyphString && (
                        <div className="mt-6 text-center">
                            <button
                                type="button"
                                onClick={copy}
                                className="font-display rounded-full bg-gold-500 px-6 py-2.5 text-sm font-bold text-ink-900 transition-colors hover:bg-gold-300"
                            >
                                {copied ? `✓ ${page.copied}` : page.copy}
                            </button>
                        </div>
                    )}

                    {glyphTokens.length > 0 && (
                        <div className="mt-10">
                            <h3 className="font-display text-lg font-bold text-sand-100">{page.breakdown}</h3>
                            <div className="mt-4 flex flex-wrap gap-3" dir="ltr">
                                {glyphTokens.map((token, index) => (
                                    <div key={index} className="w-20 rounded-lg bg-white/5 p-3 text-center ring-1 ring-white/10">
                                        <span className="block font-glyph text-3xl text-gold-300" aria-hidden="true">
                                            {token.glyph}
                                        </span>
                                        <span className="mt-1 block text-sm font-extrabold uppercase text-sand-100">{token.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <p className="mt-10 rounded-lg bg-nile-950/70 px-5 py-4 text-sm leading-relaxed text-sand-100/75 shadow-lg shadow-black/25 ring-1 ring-white/10 backdrop-blur">
                        {page.nameNote}
                    </p>
                </section>
            </Reveal>
        </AppLayout>
    );
}
