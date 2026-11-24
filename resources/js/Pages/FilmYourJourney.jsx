import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import Reveal from '../Components/Reveal';
import Button from '../Components/Button';
import { useLocale } from '../i18n/LocaleContext';
import { formatPrice, localized } from '../lib/format';

const inputClass =
    'w-full rounded-sm border border-sand-100/20 bg-white/5 px-3.5 py-2.5 text-sm text-sand-100 placeholder:text-sand-100/35 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30 [&>option]:text-ink-900 [color-scheme:dark]';

/** Perforated film-strip edge, pure CSS dots. */
function FilmStrip() {
    return (
        <div aria-hidden="true" className="flex justify-between px-2 py-2 opacity-40">
            {Array.from({ length: 28 }).map((_, i) => (
                <span key={i} className="h-2.5 w-1.5 shrink-0 rounded-[2px] bg-sand-100/50" />
            ))}
        </div>
    );
}

export default function FilmYourJourney({ packages, tours, initial, submitted }) {
    const { t, locale } = useLocale();
    const form = useForm({
        package: 'film',
        tour_id: initial.tour_id ?? '',
        travel_date: '',
        name: initial.name ?? '',
        phone: '',
        email: initial.email ?? '',
        notes: '',
    });

    const submit = (event) => {
        event.preventDefault();
        form.post('/film-your-journey', { preserveScroll: true });
    };

    const error = (field) => form.errors[field] && <p className="mt-1 text-xs font-semibold text-red-300">{form.errors[field]}</p>;
    const label = (text) => <span className="mb-1.5 block text-sm font-bold text-sand-100">{text}</span>;

    return (
        <AppLayout>
            <Head title={t('film.title')} />

            {/* Cinematic hero: the site montage as a living poster */}
            <section className="mx-auto w-full max-w-7xl px-4 pt-[185px] sm:px-6 lg:px-8">
                <Reveal>
                    <div className="relative overflow-hidden rounded-lg shadow-2xl shadow-black/50 ring-1 ring-white/10">
                        <div className="bg-nile-950">
                            <FilmStrip />
                        </div>
                        <div className="relative h-[380px] sm:h-[440px]">
                            <video
                                className="absolute inset-0 h-full w-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                                poster="/images/destinations/cairo-giza.jpg"
                            >
                                <source src="/videos/egypt-hero.mp4" type="video/mp4" />
                            </video>
                            <img
                                src="/images/destinations/cairo-giza.jpg"
                                alt=""
                                className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-nile-950 via-nile-950/35 to-nile-950/30" />
                            <div className="absolute inset-x-0 bottom-0 p-6 text-center sm:p-10">
                                <p className="font-glyph text-2xl text-gold-300">𓂀 𓋹 𓅃</p>
                                <h1 className="mt-3 font-display text-4xl leading-tight text-sand-100 drop-shadow sm:text-5xl">
                                    {t('film.heading')}
                                </h1>
                                <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-sand-100/85 drop-shadow">
                                    {t('film.intro')}
                                </p>
                            </div>
                        </div>
                        <div className="bg-nile-950">
                            <FilmStrip />
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* Packages */}
            <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <Reveal>
                    <h2 className="text-center font-display text-3xl text-sand-100">{t('film.packagesTitle')}</h2>
                </Reveal>
                <div className="mt-8 grid gap-5 lg:grid-cols-3">
                    {packages.map((pkg, index) => {
                        const royal = pkg.key === 'royal';
                        return (
                            <Reveal key={pkg.key} delay={index * 110}>
                                <div className={
                                    royal
                                        ? 'relative h-full rounded-lg bg-nile-950/80 p-6 shadow-xl shadow-black/40 ring-2 ring-gold-500 backdrop-blur'
                                        : 'relative h-full rounded-lg bg-nile-950/70 p-6 shadow-lg shadow-black/30 ring-1 ring-white/10 backdrop-blur'
                                }>
                                    {royal && (
                                        <span className="absolute -top-3 start-6 rounded-full bg-gold-500 px-3 py-0.5 text-[11px] font-bold text-ink-900 shadow">
                                            {t('film.mostRequested')}
                                        </span>
                                    )}
                                    <p className="font-glyph text-3xl text-gold-300">{pkg.key === 'photo' ? '𓂀' : pkg.key === 'film' ? '𓋹' : '𓅃'}</p>
                                    <h3 className="mt-3 font-display text-2xl text-sand-100">{t(`film.pkg.${pkg.key}.name`)}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-sand-100/70">{t(`film.pkg.${pkg.key}.desc`)}</p>
                                    <ul className="mt-4 space-y-1.5">
                                        {[1, 2, 3].map((n) => (
                                            <li key={n} className="flex items-start gap-2 text-sm text-sand-100/85">
                                                <span className="mt-0.5 text-gold-300">✦</span>
                                                {t(`film.pkg.${pkg.key}.f${n}`)}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="mt-5 border-t border-white/10 pt-4">
                                        <span className="text-2xl font-bold text-gold-300">{formatPrice(pkg.price, locale)}</span>
                                        <span className="ms-2 text-xs text-sand-100/50">{t('film.perTrip')}</span>
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            form.setData('package', pkg.key);
                                            document.getElementById('film-form')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className={
                                            royal
                                                ? 'mt-4 w-full rounded-sm bg-gold-500 px-4 py-2.5 text-sm font-bold text-ink-900 transition hover:bg-gold-300'
                                                : 'mt-4 w-full rounded-sm bg-white/5 px-4 py-2.5 text-sm font-bold text-sand-100 ring-1 ring-gold-500/50 transition hover:bg-gold-500 hover:text-ink-900'
                                        }
                                    >
                                        {t('film.choosePackage')}
                                    </button>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
                <Reveal>
                    <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-sand-100/50">
                        {t('film.permitNote')}
                    </p>
                </Reveal>
            </section>

            {/* How it works + the request form */}
            <section id="film-form" className="mx-auto w-full max-w-7xl scroll-mt-10 px-4 pb-20 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-5">
                    <Reveal className="lg:col-span-2">
                        <h2 className="font-display text-3xl text-sand-100">{t('film.howTitle')}</h2>
                        <ol className="mt-6 space-y-5">
                            {[1, 2, 3].map((n) => (
                                <li key={n} className="flex gap-4">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/15 font-display text-lg font-bold text-gold-300 ring-1 ring-gold-500/50">
                                        {n.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                                    </span>
                                    <span>
                                        <span className="block font-bold text-sand-100">{t(`film.step${n}Title`)}</span>
                                        <span className="mt-1 block text-sm leading-relaxed text-sand-100/65">{t(`film.step${n}Text`)}</span>
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </Reveal>

                    <Reveal delay={120} className="lg:col-span-3">
                        <div className="rounded-lg bg-nile-950/75 p-6 shadow-xl shadow-black/30 ring-1 ring-white/10 backdrop-blur sm:p-8">
                            {submitted ? (
                                <div className="py-8 text-center">
                                    <p className="font-glyph text-5xl text-gold-300">𓋹</p>
                                    <h3 className="mt-4 font-display text-2xl text-sand-100">{t('film.successTitle')}</h3>
                                    <p className="mx-auto mt-2 max-w-md leading-relaxed text-sand-100/70">{t('film.successText')}</p>
                                    <Link href="/tours" className="mt-6 inline-block">
                                        <Button>{t('film.browseTours')}</Button>
                                    </Link>
                                </div>
                            ) : (
                                <form onSubmit={submit} className="space-y-5">
                                    <div>
                                        {label(t('film.package'))}
                                        <div className="grid gap-2 sm:grid-cols-3">
                                            {packages.map((pkg) => (
                                                <button
                                                    key={pkg.key}
                                                    type="button"
                                                    onClick={() => form.setData('package', pkg.key)}
                                                    className={
                                                        form.data.package === pkg.key
                                                            ? 'rounded-md bg-gold-500/15 px-3 py-2.5 text-sm font-bold text-gold-300 ring-2 ring-gold-500'
                                                            : 'rounded-md bg-white/5 px-3 py-2.5 text-sm font-semibold text-sand-100/75 ring-1 ring-white/15 transition hover:ring-gold-500/50'
                                                    }
                                                >
                                                    {t(`film.pkg.${pkg.key}.name`)}
                                                    <span className="mt-0.5 block text-xs opacity-80">{formatPrice(pkg.price, locale)}</span>
                                                </button>
                                            ))}
                                        </div>
                                        {error('package')}
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            {label(t('film.tour'))}
                                            <select value={form.data.tour_id} onChange={(e) => form.setData('tour_id', e.target.value)} className={inputClass}>
                                                <option value="">{t('film.tourAny')}</option>
                                                {tours.map((tour) => (
                                                    <option key={tour.id} value={tour.id}>{localized(tour, 'title', locale)}</option>
                                                ))}
                                            </select>
                                            {error('tour_id')}
                                        </div>
                                        <div>
                                            {label(t('film.date'))}
                                            <input type="date" value={form.data.travel_date} onChange={(e) => form.setData('travel_date', e.target.value)} className={inputClass} />
                                            {error('travel_date')}
                                        </div>
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            {label(t('film.name'))}
                                            <input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} className={inputClass} />
                                            {error('name')}
                                        </div>
                                        <div>
                                            {label(t('film.phone'))}
                                            <input value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} className={inputClass} placeholder="+20 1xx xxx xxxx" />
                                            {error('phone')}
                                        </div>
                                    </div>

                                    <div>
                                        {label(t('film.email'))}
                                        <input type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} className={inputClass} />
                                        {error('email')}
                                    </div>

                                    <div>
                                        {label(t('film.notes'))}
                                        <textarea rows={3} value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} className={inputClass} placeholder={t('film.notesPlaceholder')} />
                                        {error('notes')}
                                    </div>

                                    <Button type="submit" disabled={form.processing} className="w-full sm:w-auto">
                                        {t('film.submit')}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </Reveal>
                </div>
            </section>
        </AppLayout>
    );
}
