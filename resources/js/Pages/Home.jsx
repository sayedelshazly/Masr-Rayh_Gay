import { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import HieroglyphStrip from '../Components/HieroglyphStrip';
import DestinationCard from '../Components/DestinationCard';
import TourCard from '../Components/TourCard';
import Button from '../Components/Button';
import OrnamentDivider from '../Components/OrnamentDivider';
import Reveal from '../Components/Reveal';
import { useLocale } from '../i18n/LocaleContext';
import { localized } from '../lib/format';
import { stats, toHieroglyphs } from '../data/home';

function SectionHeading({ kicker, title, subtitle, dark = false }) {
    return (
        <div className="mx-auto mb-10 max-w-2xl text-center">
            <span aria-hidden="true" className="mx-auto mb-3 block h-px w-10 bg-gold-500" />
            <p className={`font-display text-sm font-bold tracking-wide ${dark ? 'text-gold-300' : 'text-gold-deep'}`}>
                {kicker}
            </p>
            <h2 className={`font-display mt-2 text-3xl font-bold sm:text-4xl ${dark ? 'text-sand-100' : 'text-nile-950'}`}>
                {title}
            </h2>
            {subtitle && (
                <p className={`mt-3 leading-relaxed ${dark ? 'text-sand-100/75' : 'text-ink-900/65'}`}>{subtitle}</p>
            )}
        </div>
    );
}

function Hero({ destinations }) {
    const { t, locale } = useLocale();
    const [destination, setDestination] = useState('');

    return (
        <section className="relative flex min-h-[100vh] flex-col overflow-hidden bg-nile-950">
            {/* Promotional video background (Pexels, see docs/IMAGE_CREDITS.md).
                Reduced-motion visitors get the still poster instead. */}
            <img
                src="/images/destinations/cairo-giza.jpg"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
            />
            <video
                className="animate-kenburns absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
                autoPlay
                muted
                loop
                playsInline
                poster="/images/destinations/cairo-giza.jpg"
                aria-hidden="true"
            >
                <source src="/videos/egypt-hero.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-nile-950/85 via-nile-950/55 to-nile-950" aria-hidden="true" />
            <HieroglyphStrip className="relative pt-[92px] text-center text-lg text-gold-500/40" />
            <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 pb-16 pt-10 text-center sm:px-6">
                <p className="font-display flex items-center justify-center gap-3 text-sm font-bold tracking-[0.2em] text-gold-300">
                    <span aria-hidden="true" className="h-px w-8 bg-gold-500/70" />
                    {t('hero.kicker')}
                    <span aria-hidden="true" className="h-px w-8 bg-gold-500/70" />
                </p>
                <h1 className="font-display mx-auto mt-5 max-w-4xl text-5xl font-extrabold leading-snug text-sand-100 sm:text-6xl lg:text-7xl">
                    {t('hero.title')}
                </h1>
                <p className="mx-auto mt-5 max-w-2xl leading-loose text-sand-100/75 sm:text-lg">{t('hero.subtitle')}</p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    <a
                        href="#booking"
                        className="font-subhead inline-flex min-h-[44px] items-center rounded-md bg-gold-500 px-7 py-3 font-bold text-ink-900 shadow-md transition-colors duration-150 ease-stone hover:bg-gold-300"
                    >
                        {t('hero.bookTrip')}
                    </a>
                    <Link
                        href="/tours"
                        className="font-subhead inline-flex min-h-[44px] items-center rounded-md border border-gold-500 px-7 py-3 font-bold text-gold-300 transition-colors duration-150 ease-stone hover:bg-gold-500/10"
                    >
                        {t('hero.exploreTours')}
                    </Link>
                </div>

                {/* Search bar — the destination choice jumps to the filtered tours page */}
                <form
                    id="booking"
                    onSubmit={(event) => {
                        event.preventDefault();
                        router.get('/tours', destination ? { destination } : {});
                    }}
                    className="mx-auto mt-12 grid w-full max-w-4xl gap-3 rounded-lg border border-sand-100/25 bg-sand-100/10 p-4 text-start shadow-lg shadow-ink-900/10 backdrop-blur-md sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:py-3 lg:ps-6"
                >
                    <label className="block px-2">
                        <span className="text-xs font-semibold text-gold-300">{t('search.destination')}</span>
                        <select
                            className="mt-1 w-full bg-transparent text-sm font-medium text-sand-100 outline-none [&>option]:text-ink-900"
                            value={destination}
                            onChange={(event) => setDestination(event.target.value)}
                        >
                            <option value="" disabled>
                                {t('search.destinationPlaceholder')}
                            </option>
                            {destinations.map((item) => (
                                <option key={item.slug} value={item.slug}>
                                    {localized(item, 'name', locale)}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="block px-2">
                        <span className="text-xs font-semibold text-gold-300">{t('search.date')}</span>
                        <input type="date" className="mt-1 w-full bg-transparent text-sm font-medium text-sand-100 outline-none [color-scheme:dark]" />
                    </label>
                    <label className="block px-2">
                        <span className="text-xs font-semibold text-gold-300">{t('search.travelers')}</span>
                        <select className="mt-1 w-full bg-transparent text-sm font-medium text-sand-100 outline-none [&>option]:text-ink-900" defaultValue="2">
                            <option value="1">{t('search.travelersOne')}</option>
                            <option value="2">{t('search.travelersTwo')}</option>
                            <option value="3-4">{t('search.travelersThreeFour')}</option>
                            <option value="group">{t('search.travelersGroup')}</option>
                        </select>
                    </label>
                    <button
                        type="submit"
                        className="font-subhead min-h-[44px] rounded-md bg-gold-500 px-6 py-3 font-bold text-ink-900 transition-colors duration-150 ease-stone hover:bg-gold-300"
                    >
                        {t('search.button')}
                    </button>
                </form>
            </div>

            {/* Scroll cue */}
            <a
                href="#destinations"
                aria-label={t('destinations.title')}
                className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-gold-300/70 transition-colors hover:text-gold-300"
            >
                <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M5 9l7 7 7-7" />
                </svg>
            </a>
        </section>
    );
}

function StatsStrip() {
    const { t } = useLocale();

    return (
        <section className="border-y-2 border-gold-500/60 bg-nile-950">
            <div className="mx-auto grid max-w-7xl grid-cols-2 divide-sand-300/10 px-4 sm:px-6 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.key} className="py-7 text-center">
                        <p className="font-display text-3xl font-bold text-gold-500" dir="ltr">
                            {stat.value}
                        </p>
                        <p className="mt-1 text-sm text-sand-100/80">{t(`stats.${stat.key}`)}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function FeaturedDestinations({ destinations }) {
    const { t } = useLocale();

    return (
        <section id="destinations" className="mx-auto max-w-7xl scroll-mt-32 px-4 py-16 sm:px-6">
            <SectionHeading
                dark
                kicker={t('destinations.kicker')}
                title={t('destinations.title')}
                subtitle={t('destinations.subtitle')}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {destinations.map((destination) => (
                    <DestinationCard key={destination.id} destination={destination} />
                ))}
            </div>
            <div className="mt-8 text-center">
                <Button href="/destinations" variant="secondaryDark" className="px-7">
                    {t('destinations.viewAll')}
                </Button>
            </div>
        </section>
    );
}

function FeaturedTours({ tours }) {
    const { t } = useLocale();

    if (!tours?.length) {
        return null;
    }

    return (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
            <SectionHeading
                dark
                kicker={t('featuredTours.kicker')}
                title={t('featuredTours.title')}
                subtitle={t('featuredTours.subtitle')}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                ))}
            </div>
            <div className="mt-8 text-center">
                <Button href="/tours" className="px-7">
                    {t('featuredTours.viewAll')}
                </Button>
            </div>
        </section>
    );
}

const WHY_ICONS = ['𓂀', '𓋹', '𓍿', '𓅃'];

function WhyUs() {
    const { strings } = useLocale();

    return (
        <section>
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
                <SectionHeading dark kicker={strings.why.kicker} title={strings.why.title} subtitle={strings.why.subtitle} />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {strings.why.items.map((item, index) => (
                        <div key={item.title} className="rounded-lg bg-sand-100 p-6 shadow-sm ring-1 ring-gold-500/25">
                            <span
                                aria-hidden="true"
                                className="font-glyph flex h-12 w-12 items-center justify-center rounded-full bg-nile-950 text-2xl text-gold-500"
                            >
                                {WHY_ICONS[index % WHY_ICONS.length]}
                            </span>
                            <h3 className="font-display mt-4 text-lg font-bold text-nile-950">{item.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-ink-900/65">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function AcademyTeaser() {
    const { t } = useLocale();
    const [name, setName] = useState('');
    const glyphs = useMemo(() => toHieroglyphs(name.trim()), [name]);

    return (
        <section id="academy" className="scroll-mt-32 bg-nile-950">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
                <SectionHeading
                    dark
                    kicker={t('academy.kicker')}
                    title={t('academy.title')}
                    subtitle={t('academy.subtitle')}
                />
                <div className="mx-auto max-w-xl rounded-lg border border-gold-500/40 bg-nile-800/40 p-6 text-center">
                    <label htmlFor="glyph-name" className="text-sm font-medium text-sand-100/85">
                        {t('academy.demoLabel')}
                    </label>
                    <input
                        id="glyph-name"
                        type="text"
                        dir="ltr"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder={t('academy.demoPlaceholder')}
                        className="mt-3 w-full rounded-md border border-gold-500/50 bg-nile-950 px-5 py-3 text-center text-lg text-sand-100 placeholder:text-sand-100/40 focus:border-gold-500 focus:outline-none"
                    />
                    <div aria-live="polite" className="flex min-h-16 items-center justify-center px-2 py-4">
                        {glyphs ? (
                            <span className="font-glyph text-4xl leading-relaxed text-gold-300">{glyphs}</span>
                        ) : (
                            <span aria-hidden="true" className="font-glyph text-3xl text-gold-500/35">
                                𓄿 𓃀 𓂧
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-sand-100/60">{t('academy.demoHint')}</p>
                    <a
                        href="/academy"
                        className="font-subhead mt-5 inline-flex min-h-[44px] items-center rounded-md bg-gold-500 px-7 py-3 font-bold text-ink-900 transition-colors duration-150 ease-stone hover:bg-gold-300"
                    >
                        {t('academy.cta')}
                    </a>
                </div>
            </div>
            <HieroglyphStrip className="pb-5 text-center text-sm text-gold-500/50" />
        </section>
    );
}

function Testimonials() {
    const { strings } = useLocale();

    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <SectionHeading dark kicker={strings.testimonials.kicker} title={strings.testimonials.title} />
            <div className="grid gap-6 md:grid-cols-3">
                {strings.testimonials.items.map((item) => (
                    <figure key={item.name} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-sand-300">
                        <div aria-hidden="true" className="text-gold-500">
                            ★★★★★
                        </div>
                        <blockquote className="mt-3 leading-relaxed text-ink-900/75">“{item.quote}”</blockquote>
                        <figcaption className="mt-4">
                            <p className="font-display font-bold text-nile-950">{item.name}</p>
                            <p className="text-xs text-ink-900/55">{item.trip}</p>
                        </figcaption>
                    </figure>
                ))}
            </div>
        </section>
    );
}

function CtaBanner() {
    const { t } = useLocale();

    return (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
            <div className="rounded-lg bg-gradient-to-br from-gold-300 via-gold-500 to-gold-deep px-6 py-12 text-center shadow-lg">
                <h2 className="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">{t('cta.title')}</h2>
                <p className="mx-auto mt-3 max-w-xl text-ink-900/75">{t('cta.subtitle')}</p>
                <Link
                    href="/tours"
                    className="font-subhead mt-7 inline-flex min-h-[44px] items-center rounded-md bg-nile-950 px-8 py-3 font-bold text-sand-100 transition-colors duration-150 ease-stone hover:bg-nile-800"
                >
                    {t('cta.button')}
                </Link>
            </div>
        </section>
    );
}

export default function Home({ destinations = [], featuredDestinations = [], featuredTours = [] }) {
    const { t } = useLocale();

    return (
        <AppLayout>
            <Head title={t('meta.homeTitle')} />
            <Hero destinations={destinations} />
            <StatsStrip />
            <Reveal>
                <FeaturedDestinations destinations={featuredDestinations} />
            </Reveal>
            <Reveal>
                <FeaturedTours tours={featuredTours} />
            </Reveal>
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <OrnamentDivider />
            </div>
            <Reveal>
                <WhyUs />
            </Reveal>
            <Reveal>
                <AcademyTeaser />
            </Reveal>
            <Reveal>
                <Testimonials />
            </Reveal>
            <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
                <OrnamentDivider />
            </div>
            <Reveal>
                <CtaBanner />
            </Reveal>
        </AppLayout>
    );
}
