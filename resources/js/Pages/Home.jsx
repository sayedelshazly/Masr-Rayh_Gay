import { useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import HieroglyphStrip from '../Components/HieroglyphStrip';
import DestinationPanels from '../Components/DestinationPanels';
import ToursCoverflow from '../Components/ToursCoverflow';
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
            <DestinationPanels destinations={destinations} />
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
            <ToursCoverflow tours={tours} />
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
    const trackRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const items = strings.why.items;

    // The golden route draws itself as the section travels through the
    // viewport: progress 0→1 maps to the fill height of the centre line,
    // and each station lights up when the fill reaches it.
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setProgress(1);
            return undefined;
        }

        let raf = 0;
        const update = () => {
            raf = 0;
            const el = trackRef.current;
            if (!el) {
                return;
            }
            const rect = el.getBoundingClientRect();
            const anchor = window.innerHeight * 0.72;
            const value = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
            setProgress(value);
        };
        const onScroll = () => {
            if (!raf) {
                raf = requestAnimationFrame(update);
            }
        };

        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (raf) {
                cancelAnimationFrame(raf);
            }
        };
    }, []);

    return (
        <section>
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
                <SectionHeading dark kicker={strings.why.kicker} title={strings.why.title} subtitle={strings.why.subtitle} />

                <div ref={trackRef} className="relative mx-auto max-w-5xl">
                    {/* the route: faint track + golden fill + travelling sun */}
                    <div aria-hidden="true" className="absolute bottom-2 start-6 top-2 w-px bg-sand-100/15 lg:start-1/2">
                        <div
                            className="w-[2px] bg-gradient-to-b from-gold-300 via-gold-500 to-gold-500 shadow-[0_0_12px_rgba(201,162,75,0.65)]"
                            style={{ height: `${progress * 100}%`, marginInlineStart: '-0.5px' }}
                        />
                        <span
                            className="absolute flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 shadow-[0_0_16px_rgba(201,162,75,0.9)] ring-4 ring-gold-500/25"
                            style={{ top: `${progress * 100}%`, insetInlineStart: '-7.5px', transform: 'translateY(-50%)' }}
                        />
                    </div>

                    <div className="flex flex-col gap-10 lg:gap-4">
                        {items.map((item, index) => {
                            const reached = progress >= (index + 0.5) / items.length;
                            const startSide = index % 2 === 0;

                            return (
                                <div key={item.title} className="relative ps-16 lg:ps-0">
                                    {/* station node on the line */}
                                    <span
                                        aria-hidden="true"
                                        className={`font-glyph absolute start-6 top-8 z-10 flex h-12 w-12 items-center justify-center rounded-full border text-2xl transition-all duration-500 ease-stone ltr:-translate-x-1/2 rtl:translate-x-1/2 lg:start-1/2 ${
                                            reached
                                                ? 'scale-110 border-gold-300 bg-gold-500 text-ink-900 shadow-[0_0_22px_rgba(201,162,75,0.55)]'
                                                : 'border-gold-500/40 bg-nile-950 text-gold-500/60'
                                        }`}
                                    >
                                        {WHY_ICONS[index % WHY_ICONS.length]}
                                    </span>

                                    <div
                                        className={`transition-all duration-700 ease-stone lg:w-[calc(50%-3.5rem)] ${
                                            startSide ? 'lg:self-start lg:me-auto' : 'lg:self-end lg:ms-auto'
                                        } flex flex-col ${startSide ? 'lg:items-start' : ''} ${
                                            reached ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                        }`}
                                        style={{ transitionDelay: reached ? '80ms' : '0ms' }}
                                    >
                                        <div className="relative w-full overflow-hidden rounded-lg bg-nile-950/70 p-6 shadow-lg shadow-black/25 ring-1 ring-gold-500/25 backdrop-blur-sm">
                                            <span
                                                aria-hidden="true"
                                                className="font-display pointer-events-none absolute -top-3 end-3 text-6xl font-black text-sand-100/8"
                                                dir="ltr"
                                            >
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <p className="font-display text-xs font-bold tracking-[0.25em] text-gold-300" dir="ltr">
                                                {String(index + 1).padStart(2, '0')}
                                            </p>
                                            <h3 className="font-display mt-2 text-xl font-bold text-sand-100">{item.title}</h3>
                                            <p className="mt-2 text-sm leading-relaxed text-sand-100/70">{item.text}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

const CARTOUCHE_SAMPLES = ['Nefertiti', 'Ramses', 'Cleopatra', 'Sayed'];
const GOLD_MOTES = [
    { left: '6%', top: '18%', size: 5, delay: '0s' },
    { left: '14%', top: '72%', size: 4, delay: '1.2s' },
    { left: '88%', top: '24%', size: 6, delay: '0.6s' },
    { left: '93%', top: '66%', size: 4, delay: '2s' },
    { left: '76%', top: '8%', size: 3, delay: '1.6s' },
    { left: '28%', top: '4%', size: 4, delay: '2.6s' },
];

function AcademyTeaser() {
    const { t } = useLocale();
    const [name, setName] = useState('');
    const [sampleIndex, setSampleIndex] = useState(0);

    // While the visitor hasn't typed, the cartouche performs on its
    // own: royal names cycle through it every few seconds.
    useEffect(() => {
        if (name.trim() !== '') {
            return undefined;
        }
        const id = setInterval(() => {
            setSampleIndex((value) => (value + 1) % CARTOUCHE_SAMPLES.length);
        }, 3600);
        return () => clearInterval(id);
    }, [name]);

    const isDemo = name.trim() === '';
    const shownName = isDemo ? CARTOUCHE_SAMPLES[sampleIndex] : name.trim();
    const glyphChars = useMemo(() => Array.from(toHieroglyphs(shownName)), [shownName]);

    return (
        <section id="academy" className="relative scroll-mt-32 overflow-hidden bg-nile-950">
            {/* ambient temple glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[820px] max-w-none -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/10 blur-3xl"
            />
            <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
                <SectionHeading
                    dark
                    kicker={t('academy.kicker')}
                    title={t('academy.title')}
                    subtitle={t('academy.subtitle')}
                />

                {/* ——— the cartouche stage ——— */}
                <div className="relative mx-auto max-w-2xl">
                    {GOLD_MOTES.map((mote, index) => (
                        <span
                            key={index}
                            aria-hidden="true"
                            className="animate-float-mote absolute rounded-full bg-gold-300 shadow-[0_0_10px_rgba(227,201,138,0.9)]"
                            style={{
                                left: mote.left,
                                top: mote.top,
                                width: mote.size,
                                height: mote.size,
                                animationDelay: mote.delay,
                            }}
                        />
                    ))}

                    <div className="relative rounded-[999px] border-2 border-gold-500/70 px-6 py-9 shadow-[0_0_55px_rgba(201,162,75,0.28),inset_0_0_35px_rgba(201,162,75,0.08)] sm:px-12">
                        {/* the cartouche's end bar */}
                        <span aria-hidden="true" className="absolute end-4 top-1/2 h-14 w-1.5 -translate-y-1/2 rounded bg-gold-500 sm:end-6" />
                        <div aria-live="polite" className="flex min-h-20 flex-wrap items-center justify-center gap-x-1.5 px-2" dir="ltr">
                            {glyphChars.length > 0 ? (
                                glyphChars.map((glyph, index) => (
                                    <span
                                        key={`${shownName}-${index}`}
                                        className="animate-glyph-in font-glyph text-gold-shine text-5xl leading-none sm:text-6xl"
                                        style={{ animationDelay: `${index * 95}ms` }}
                                    >
                                        {glyph}
                                    </span>
                                ))
                            ) : (
                                <span aria-hidden="true" className="font-glyph text-4xl text-gold-500/35">
                                    𓄿 𓃀 𓂧
                                </span>
                            )}
                        </div>
                    </div>

                    <p className="mt-4 h-5 text-center text-sm text-gold-300/90" dir="auto">
                        {isDemo && (
                            <>
                                {t('academy.demoShowing')}{' '}
                                <span className="font-display font-bold" dir="ltr">
                                    {shownName}
                                </span>
                            </>
                        )}
                    </p>
                </div>

                {/* ——— one simple line to write on ——— */}
                <div className="mx-auto mt-6 max-w-md text-center">
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
                        className="mt-2 w-full border-0 border-b-2 border-gold-500/50 bg-transparent px-4 py-3 text-center font-display text-xl tracking-wide text-sand-100 placeholder:text-sand-100/35 focus:border-gold-400 focus:outline-none"
                    />
                    <p className="mt-4 text-xs leading-relaxed text-sand-100/55">{t('academy.demoHint')}</p>
                    <a
                        href="/academy"
                        className="font-subhead mt-6 inline-flex min-h-[44px] items-center rounded-md bg-gold-500 px-8 py-3 font-bold text-ink-900 shadow-[0_8px_30px_rgba(201,162,75,0.35)] transition-all duration-150 ease-stone hover:bg-gold-300"
                    >
                        {t('academy.cta')}
                    </a>
                </div>
            </div>
            <HieroglyphStrip className="relative pb-5 text-center text-sm text-gold-500/50" />
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
