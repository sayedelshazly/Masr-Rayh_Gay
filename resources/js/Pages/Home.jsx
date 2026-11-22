import { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import HieroglyphStrip from '../Components/HieroglyphStrip';
import DestinationCard from '../Components/DestinationCard';
import TourCard from '../Components/TourCard';
import { useLocale } from '../i18n/LocaleContext';
import { localized } from '../lib/format';
import { stats, toHieroglyphs } from '../data/home';

function SectionHeading({ kicker, title, subtitle, dark = false }) {
    return (
        <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className={`font-display text-sm font-bold tracking-wide ${dark ? 'text-gold-light' : 'text-gold-deep'}`}>
                {kicker}
            </p>
            <h2 className={`font-display mt-2 text-3xl font-bold sm:text-4xl ${dark ? 'text-ivory' : 'text-lapis-deep'}`}>
                {title}
            </h2>
            {subtitle && (
                <p className={`mt-3 leading-relaxed ${dark ? 'text-ivory/75' : 'text-ink/65'}`}>{subtitle}</p>
            )}
        </div>
    );
}

function Hero({ destinations }) {
    const { t, locale } = useLocale();
    const [destination, setDestination] = useState('');

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-sand via-ivory to-ivory">
            <HieroglyphStrip className="pt-4 text-center text-lg text-gold/40" />
            <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 text-center sm:px-6">
                <p className="font-display text-sm font-bold tracking-wide text-gold-deep">{t('hero.kicker')}</p>
                <h1 className="font-display mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-snug text-lapis-deep sm:text-5xl lg:text-6xl">
                    {t('hero.title')}
                </h1>
                <p className="mx-auto mt-5 max-w-2xl leading-loose text-ink/70">{t('hero.subtitle')}</p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href="/tours"
                        className="font-display rounded-full bg-lapis px-7 py-3 font-bold text-ivory shadow-md transition-colors hover:bg-lapis-deep"
                    >
                        {t('hero.exploreTours')}
                    </Link>
                    <a
                        href="#booking"
                        className="font-display rounded-full bg-gold px-7 py-3 font-bold text-ink shadow-md transition-colors hover:bg-gold-deep hover:text-ivory"
                    >
                        {t('hero.bookTrip')}
                    </a>
                </div>

                {/* Search bar — the destination choice jumps to the filtered tours page */}
                <form
                    id="booking"
                    onSubmit={(event) => {
                        event.preventDefault();
                        router.get('/tours', destination ? { destination } : {});
                    }}
                    className="mx-auto mt-12 grid max-w-4xl gap-3 rounded-3xl border border-gold/40 bg-white/80 p-4 text-start shadow-xl shadow-ink/5 backdrop-blur sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:rounded-full lg:py-3 lg:ps-6"
                >
                    <label className="block px-2">
                        <span className="text-xs font-semibold text-gold-deep">{t('search.destination')}</span>
                        <select
                            className="mt-1 w-full bg-transparent text-sm font-medium text-ink outline-none"
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
                        <span className="text-xs font-semibold text-gold-deep">{t('search.date')}</span>
                        <input type="date" className="mt-1 w-full bg-transparent text-sm font-medium text-ink outline-none" />
                    </label>
                    <label className="block px-2">
                        <span className="text-xs font-semibold text-gold-deep">{t('search.travelers')}</span>
                        <select className="mt-1 w-full bg-transparent text-sm font-medium text-ink outline-none" defaultValue="2">
                            <option value="1">{t('search.travelersOne')}</option>
                            <option value="2">{t('search.travelersTwo')}</option>
                            <option value="3-4">{t('search.travelersThreeFour')}</option>
                            <option value="group">{t('search.travelersGroup')}</option>
                        </select>
                    </label>
                    <button
                        type="submit"
                        className="font-display rounded-full bg-gold px-6 py-3 font-bold text-ink transition-colors hover:bg-gold-deep hover:text-ivory"
                    >
                        {t('search.button')}
                    </button>
                </form>
            </div>
        </section>
    );
}

function StatsStrip() {
    const { t } = useLocale();

    return (
        <section className="border-y-2 border-gold/60 bg-lapis-deep">
            <div className="mx-auto grid max-w-7xl grid-cols-2 divide-sand/10 px-4 sm:px-6 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.key} className="py-7 text-center">
                        <p className="font-display text-3xl font-bold text-gold" dir="ltr">
                            {stat.value}
                        </p>
                        <p className="mt-1 text-sm text-ivory/80">{t(`stats.${stat.key}`)}</p>
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
                <Link
                    href="/destinations"
                    className="font-display inline-block rounded-full bg-lapis px-7 py-3 font-bold text-ivory transition-colors hover:bg-lapis-deep"
                >
                    {t('destinations.viewAll')}
                </Link>
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
                <Link
                    href="/tours"
                    className="font-display inline-block rounded-full bg-gold px-7 py-3 font-bold text-ink transition-colors hover:bg-gold-deep hover:text-ivory"
                >
                    {t('featuredTours.viewAll')}
                </Link>
            </div>
        </section>
    );
}

const WHY_ICONS = ['𓂀', '𓋹', '𓍿', '𓅃'];

function WhyUs() {
    const { strings } = useLocale();

    return (
        <section className="bg-sand/60">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
                <SectionHeading kicker={strings.why.kicker} title={strings.why.title} subtitle={strings.why.subtitle} />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {strings.why.items.map((item, index) => (
                        <div key={item.title} className="rounded-3xl bg-ivory p-6 shadow-sm ring-1 ring-gold/25">
                            <span
                                aria-hidden="true"
                                className="font-display flex h-12 w-12 items-center justify-center rounded-full bg-lapis-deep text-2xl text-gold"
                            >
                                {WHY_ICONS[index % WHY_ICONS.length]}
                            </span>
                            <h3 className="font-display mt-4 text-lg font-bold text-lapis-deep">{item.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-ink/65">{item.text}</p>
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
        <section id="academy" className="scroll-mt-32 bg-lapis-deep">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
                <SectionHeading
                    dark
                    kicker={t('academy.kicker')}
                    title={t('academy.title')}
                    subtitle={t('academy.subtitle')}
                />
                <div className="mx-auto max-w-xl rounded-3xl border border-gold/40 bg-lapis/40 p-6 text-center">
                    <label htmlFor="glyph-name" className="text-sm font-medium text-ivory/85">
                        {t('academy.demoLabel')}
                    </label>
                    <input
                        id="glyph-name"
                        type="text"
                        dir="ltr"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder={t('academy.demoPlaceholder')}
                        className="mt-3 w-full rounded-full border border-gold/50 bg-lapis-deep px-5 py-3 text-center text-lg text-ivory placeholder:text-ivory/40 focus:border-gold focus:outline-none"
                    />
                    <div aria-live="polite" className="flex min-h-16 items-center justify-center px-2 py-4">
                        {glyphs ? (
                            <span className="text-4xl leading-relaxed text-gold-light">{glyphs}</span>
                        ) : (
                            <span aria-hidden="true" className="text-3xl text-gold/35">
                                𓄿 𓃀 𓂧
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-ivory/60">{t('academy.demoHint')}</p>
                    <a
                        href="/academy"
                        className="font-display mt-5 inline-block rounded-full bg-gold px-7 py-3 font-bold text-ink transition-colors hover:bg-gold-light"
                    >
                        {t('academy.cta')}
                    </a>
                </div>
            </div>
            <HieroglyphStrip className="pb-5 text-center text-sm text-gold/50" />
        </section>
    );
}

function Testimonials() {
    const { strings } = useLocale();

    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <SectionHeading kicker={strings.testimonials.kicker} title={strings.testimonials.title} />
            <div className="grid gap-6 md:grid-cols-3">
                {strings.testimonials.items.map((item) => (
                    <figure key={item.name} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sand">
                        <div aria-hidden="true" className="text-gold">
                            ★★★★★
                        </div>
                        <blockquote className="mt-3 leading-relaxed text-ink/75">“{item.quote}”</blockquote>
                        <figcaption className="mt-4">
                            <p className="font-display font-bold text-lapis-deep">{item.name}</p>
                            <p className="text-xs text-ink/55">{item.trip}</p>
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
            <div className="rounded-[2rem] bg-gradient-to-br from-gold-light via-gold to-gold-deep px-6 py-12 text-center shadow-lg">
                <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">{t('cta.title')}</h2>
                <p className="mx-auto mt-3 max-w-xl text-ink/75">{t('cta.subtitle')}</p>
                <Link
                    href="/tours"
                    className="font-display mt-7 inline-block rounded-full bg-lapis-deep px-8 py-3 font-bold text-ivory transition-colors hover:bg-lapis"
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
            <FeaturedDestinations destinations={featuredDestinations} />
            <FeaturedTours tours={featuredTours} />
            <WhyUs />
            <AcademyTeaser />
            <Testimonials />
            <CtaBanner />
        </AppLayout>
    );
}
