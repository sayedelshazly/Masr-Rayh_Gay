import { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Reveal from '../../Components/Reveal';
import { useLocale } from '../../i18n/LocaleContext';

export default function AcademyGlyphs({ glyphs, categories }) {
    const { t, locale } = useLocale();
    const page = t('academy.page');
    const pick = (item, field) => item[`${field}_${locale}`] ?? item[`${field}_ar`];

    const [filter, setFilter] = useState('all');
    const [selectedId, setSelectedId] = useState(() => glyphs.find((g) => g.transliteration === 'ankh')?.id ?? glyphs[0]?.id);

    const visible = useMemo(
        () => (filter === 'all' ? glyphs : glyphs.filter((glyph) => glyph.category === filter)),
        [filter, glyphs],
    );
    const selected = glyphs.find((glyph) => glyph.id === selectedId) ?? null;

    const filterButton = (key, label) => (
        <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`font-display rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                filter === key
                    ? 'bg-gold-500 text-ink-900'
                    : 'bg-white/5 text-sand-100/75 ring-1 ring-white/10 hover:ring-gold-500/50'
            }`}
        >
            {label}
        </button>
    );

    return (
        <AppLayout>
            <Head title={page.glyphsMeta} />

            <section className="text-sand-100">
                <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 text-center sm:px-6">
                    <p className="font-display text-sm font-bold tracking-wide text-gold-300">{t('academy.kicker')}</p>
                    <h1 className="font-display mx-auto mt-2 max-w-3xl text-4xl font-extrabold leading-snug text-sand-100 sm:text-5xl">
                        {page.glyphsTitle}
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl leading-loose text-sand-100/75">{page.glyphsSubtitle}</p>
                    <Link href="/academy" className="mt-4 inline-block text-sm font-bold text-gold-300 hover:underline">
                        ← {page.backToAcademy}
                    </Link>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6">
                <Reveal>
                    <div className="flex flex-wrap justify-center gap-2">
                        {filterButton('all', page.categories.all)}
                        {categories.map((category) => filterButton(category, page.categories[category] ?? category))}
                    </div>
                </Reveal>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
                    {/* Chart grid */}
                    <div className="grid grid-cols-3 gap-3 self-start sm:grid-cols-4 md:grid-cols-5">
                        {visible.map((glyph) => (
                            <button
                                key={glyph.id}
                                type="button"
                                onClick={() => setSelectedId(glyph.id)}
                                aria-pressed={selected?.id === glyph.id}
                                className={`rounded-lg p-4 text-center ring-1 transition-all duration-300 ease-stone ${
                                    selected?.id === glyph.id
                                        ? 'bg-gold-500/15 ring-gold-500'
                                        : 'bg-white/5 ring-white/10 hover:-translate-y-0.5 hover:ring-gold-500/60'
                                }`}
                            >
                                <span className="block font-glyph text-4xl text-gold-300" aria-hidden="true">
                                    {glyph.symbol}
                                </span>
                                <span className="mt-2 block text-sm font-extrabold text-sand-100" dir="ltr">
                                    {glyph.transliteration}
                                </span>
                                <span
                                    className={`block truncate text-[11px] ${selected?.id === glyph.id ? 'text-sand-100/75' : 'text-sand-100/55'}`}
                                >
                                    {pick(glyph, 'name')}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Detail card */}
                    <aside className="self-start rounded-lg bg-nile-950/70 p-6 text-sand-100 shadow-lg shadow-black/25 ring-1 ring-white/10 backdrop-blur lg:sticky lg:top-32">
                        {selected ? (
                            <>
                                <div className="flex items-center justify-center rounded-lg border border-gold-500/40 bg-nile-800/40 py-6">
                                    <span className="font-glyph text-8xl text-gold-300" aria-hidden="true">
                                        {selected.symbol}
                                    </span>
                                </div>
                                <h2 className="font-display mt-5 text-2xl font-bold">{pick(selected, 'name')}</h2>
                                <dl className="mt-4 space-y-3 text-sm leading-relaxed">
                                    <div>
                                        <dt className="font-bold text-gold-300">{page.transliteration}</dt>
                                        <dd dir="ltr" className="text-start text-lg font-bold">
                                            {selected.transliteration}
                                        </dd>
                                    </div>
                                    {selected.pronunciation && (
                                        <div>
                                            <dt className="font-bold text-gold-300">{page.pronunciation}</dt>
                                            <dd className="text-sand-100/85">{selected.pronunciation}</dd>
                                        </div>
                                    )}
                                    <div>
                                        <dt className="font-bold text-gold-300">{page.meaning}</dt>
                                        <dd className="text-sand-100/85">{pick(selected, 'meaning')}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-bold text-gold-300">{page.categories[selected.category]}</dt>
                                        <dd className="text-sand-100/60">{page.categories[selected.category]}</dd>
                                    </div>
                                </dl>
                            </>
                        ) : (
                            <p className="text-sand-100/75">{page.selectGlyph}</p>
                        )}
                    </aside>
                </div>
            </section>
        </AppLayout>
    );
}
