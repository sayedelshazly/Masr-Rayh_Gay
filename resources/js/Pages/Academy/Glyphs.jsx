import { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
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
                filter === key ? 'bg-lapis-deep text-gold-light' : 'bg-white text-ink/75 ring-1 ring-sand hover:bg-sand'
            }`}
        >
            {label}
        </button>
    );

    return (
        <AppLayout>
            <Head title={page.glyphsMeta} />

            <section className="bg-gradient-to-b from-sand via-ivory to-ivory">
                <div className="mx-auto max-w-7xl px-4 pb-8 pt-12 text-center sm:px-6">
                    <p className="font-display text-sm font-bold tracking-wide text-gold-deep">{t('academy.kicker')}</p>
                    <h1 className="font-display mx-auto mt-2 max-w-3xl text-4xl font-extrabold leading-snug text-lapis-deep sm:text-5xl">
                        {page.glyphsTitle}
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl leading-loose text-ink/70">{page.glyphsSubtitle}</p>
                    <Link href="/academy" className="mt-4 inline-block text-sm font-bold text-gold-deep hover:underline">
                        ← {page.backToAcademy}
                    </Link>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
                <div className="flex flex-wrap justify-center gap-2">
                    {filterButton('all', page.categories.all)}
                    {categories.map((category) => filterButton(category, page.categories[category] ?? category))}
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
                    {/* Chart grid */}
                    <div className="grid grid-cols-3 gap-3 self-start sm:grid-cols-4 md:grid-cols-5">
                        {visible.map((glyph) => (
                            <button
                                key={glyph.id}
                                type="button"
                                onClick={() => setSelectedId(glyph.id)}
                                aria-pressed={selected?.id === glyph.id}
                                className={`rounded-3xl p-4 text-center shadow-sm ring-1 transition-all ${
                                    selected?.id === glyph.id
                                        ? 'bg-lapis-deep ring-gold'
                                        : 'bg-white ring-sand hover:ring-gold/60'
                                }`}
                            >
                                <span
                                    className={`block font-glyph text-4xl ${selected?.id === glyph.id ? 'text-gold-light' : 'text-lapis'}`}
                                    aria-hidden="true"
                                >
                                    {glyph.symbol}
                                </span>
                                <span
                                    className={`mt-2 block text-sm font-extrabold ${selected?.id === glyph.id ? 'text-ivory' : 'text-lapis-deep'}`}
                                    dir="ltr"
                                >
                                    {glyph.transliteration}
                                </span>
                                <span
                                    className={`block truncate text-[11px] ${selected?.id === glyph.id ? 'text-ivory/65' : 'text-ink/55'}`}
                                >
                                    {pick(glyph, 'name')}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Detail card */}
                    <aside className="self-start rounded-3xl bg-lapis-deep p-6 text-ivory lg:sticky lg:top-32">
                        {selected ? (
                            <>
                                <div className="flex items-center justify-center rounded-3xl border border-gold/40 bg-lapis/40 py-6">
                                    <span className="font-glyph text-8xl text-gold-light" aria-hidden="true">
                                        {selected.symbol}
                                    </span>
                                </div>
                                <h2 className="font-display mt-5 text-2xl font-bold">{pick(selected, 'name')}</h2>
                                <dl className="mt-4 space-y-3 text-sm leading-relaxed">
                                    <div>
                                        <dt className="font-bold text-gold-light">{page.transliteration}</dt>
                                        <dd dir="ltr" className="text-start text-lg font-bold">
                                            {selected.transliteration}
                                        </dd>
                                    </div>
                                    {selected.pronunciation && (
                                        <div>
                                            <dt className="font-bold text-gold-light">{page.pronunciation}</dt>
                                            <dd className="text-ivory/85">{selected.pronunciation}</dd>
                                        </div>
                                    )}
                                    <div>
                                        <dt className="font-bold text-gold-light">{page.meaning}</dt>
                                        <dd className="text-ivory/85">{pick(selected, 'meaning')}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-bold text-gold-light">{page.categories[selected.category]}</dt>
                                        <dd className="text-ivory/60">{page.categories[selected.category]}</dd>
                                    </div>
                                </dl>
                            </>
                        ) : (
                            <p className="text-ivory/75">{page.selectGlyph}</p>
                        )}
                    </aside>
                </div>
            </section>
        </AppLayout>
    );
}
