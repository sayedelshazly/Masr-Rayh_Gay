import { Head, Link, useForm, usePage} from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import Reveal from '../Components/Reveal';
import { useLocale } from '../i18n/LocaleContext';
import { localized } from '../lib/format';

const INTEREST_KEYS = ['history', 'beach', 'adventure', 'food', 'family', 'luxury'];
const BUDGET_KEYS = ['any', 'under_3000', '3000_7000', '7000_15000', 'over_15000'];

const inputClass =
    'w-full rounded-md border border-sand-100/20 bg-white/5 px-4 py-3 text-sm font-medium text-sand-100 outline-none transition-colors placeholder:text-sand-100/35 focus:border-gold-500 [color-scheme:dark]';
const labelClass = 'block text-sm font-bold text-sand-100/85';
const errorClass = 'mt-1.5 text-xs font-medium text-red-300';

function Chip({ active, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`min-h-[42px] rounded-full px-4 py-2 text-sm font-bold transition ${
                active
                    ? 'bg-gold-500 text-ink-900 shadow-[0_6px_20px_rgba(201,162,75,0.35)]'
                    : 'bg-white/5 text-sand-100/75 ring-1 ring-white/15 hover:ring-gold-500/50'
            }`}
        >
            {children}
        </button>
    );
}

function Stepper({ label, value, onChange, min, max }) {
    const btn =
        'flex h-10 w-10 items-center justify-center rounded-md bg-white/5 text-lg font-bold text-gold-300 ring-1 ring-white/15 transition hover:ring-gold-500/60 disabled:opacity-30';
    return (
        <div>
            <span className={labelClass}>{label}</span>
            <div className="mt-1.5 flex items-center gap-3">
                <button type="button" className={btn} disabled={value <= min} onClick={() => onChange(value - 1)} aria-label="-">−</button>
                <span className="font-display w-8 text-center text-lg font-bold text-sand-100">{value}</span>
                <button type="button" className={btn} disabled={value >= max} onClick={() => onChange(value + 1)} aria-label="+">+</button>
            </div>
        </div>
    );
}

/**
 * "Design your trip" — the tailor-made request form. The traveller
 * picks destinations and interests as chips, sketches the party and
 * budget, and the team answers with a fitted itinerary.
 */
export default function PlanTrip({ destinations = [], submitted = false, prefill = null }) {
    const { t, locale } = useLocale();
    const planEnabled = usePage().props.site?.features?.plan !== false;

    const form = useForm({
        name: prefill?.name ?? '',
        email: prefill?.email ?? '',
        phone: '',
        destinations: [],
        start_date: '',
        days: 3,
        adults: 2,
        children: 0,
        budget: 'any',
        interests: [],
        notes: '',
        locale,
    });

    const toggle = (field, value) => {
        const current = form.data[field];
        form.setData(field, current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
    };

    const submit = (event) => {
        event.preventDefault();
        form.post('/plan-your-trip', { preserveScroll: true });
    };

    return (
        <AppLayout>
            <Head title={t('planTrip.metaTitle')} />

            <section>
                <div className="mx-auto max-w-3xl px-4 pt-[185px] text-center sm:px-6">
                    <Reveal>
                        <p className="font-subhead text-xs font-bold uppercase tracking-[0.3em] text-gold-300">{t('planTrip.kicker')}</p>
                        <h1 className="font-display mt-3 text-4xl font-bold text-sand-100 sm:text-5xl">{t('planTrip.title')}</h1>
                        <p className="mx-auto mt-4 max-w-xl leading-loose text-sand-100/70">{t('planTrip.subtitle')}</p>
                    </Reveal>
                </div>

                <div className="mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6">
                    {!planEnabled ? (
                        <Reveal>
                            <div className="rounded-lg bg-nile-950/70 p-8 text-center shadow-lg shadow-black/25 ring-1 ring-white/10 backdrop-blur sm:p-10">
                                <p aria-hidden="true" className="font-glyph text-5xl text-gold-400">𓂀</p>
                                <p className="mx-auto mt-4 max-w-md leading-loose text-sand-100/70">{t('common.featureClosed')}</p>
                            </div>
                        </Reveal>
                    ) : submitted ? (
                        <Reveal>
                            <div className="rounded-lg bg-nile-950/70 p-8 text-center shadow-lg shadow-black/25 ring-1 ring-gold-500/30 backdrop-blur sm:p-10">
                                <p aria-hidden="true" className="font-glyph text-5xl text-gold-400">𓂀</p>
                                <h2 className="font-display mt-4 text-2xl font-bold text-sand-100">{t('planTrip.successTitle')}</h2>
                                <p className="mx-auto mt-3 max-w-md leading-loose text-sand-100/70">{t('planTrip.successText')}</p>
                                <Link href="/plan-your-trip" className="font-display mt-6 inline-block font-bold text-gold-300 underline decoration-gold-500/40 underline-offset-4 hover:text-gold-500">
                                    {t('planTrip.successAgain')}
                                </Link>
                            </div>
                        </Reveal>
                    ) : (
                        <Reveal>
                            <form onSubmit={submit} className="rounded-lg bg-nile-950/70 p-6 shadow-lg shadow-black/25 ring-1 ring-white/10 backdrop-blur sm:p-8">
                                <span className={labelClass}>{t('planTrip.destinationsLabel')}</span>
                                <div className="mt-2.5 flex flex-wrap gap-2">
                                    {destinations.map((destination) => (
                                        <Chip
                                            key={destination.slug}
                                            active={form.data.destinations.includes(destination.slug)}
                                            onClick={() => toggle('destinations', destination.slug)}
                                        >
                                            {localized(destination, 'name', locale)}
                                        </Chip>
                                    ))}
                                </div>
                                {form.errors.destinations && <p className={errorClass}>{form.errors.destinations}</p>}

                                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="plan_start" className={labelClass}>{t('planTrip.startDate')}</label>
                                        <input id="plan_start" type="date" className={`${inputClass} mt-1.5`} value={form.data.start_date} onChange={(e) => form.setData('start_date', e.target.value)} />
                                        {form.errors.start_date && <p className={errorClass}>{form.errors.start_date}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="plan_days" className={labelClass}>{t('planTrip.days')}</label>
                                        <input id="plan_days" type="number" min="1" max="60" className={`${inputClass} mt-1.5`} value={form.data.days} onChange={(e) => form.setData('days', Number(e.target.value))} />
                                        {form.errors.days && <p className={errorClass}>{form.errors.days}</p>}
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-x-10 gap-y-5">
                                    <Stepper label={t('planTrip.adults')} value={form.data.adults} min={1} max={50} onChange={(v) => form.setData('adults', v)} />
                                    <Stepper label={t('planTrip.children')} value={form.data.children} min={0} max={50} onChange={(v) => form.setData('children', v)} />
                                </div>

                                <div className="mt-6">
                                    <label htmlFor="plan_budget" className={labelClass}>{t('planTrip.budget')}</label>
                                    <select id="plan_budget" className={`${inputClass} mt-1.5 [&>option]:text-ink-900`} value={form.data.budget} onChange={(e) => form.setData('budget', e.target.value)}>
                                        {BUDGET_KEYS.map((key) => (
                                            <option key={key} value={key}>{t(`planTrip.budgets.${key}`)}</option>
                                        ))}
                                    </select>
                                </div>

                                <span className={`${labelClass} mt-6 block`}>{t('planTrip.interestsLabel')}</span>
                                <div className="mt-2.5 flex flex-wrap gap-2">
                                    {INTEREST_KEYS.map((key) => (
                                        <Chip key={key} active={form.data.interests.includes(key)} onClick={() => toggle('interests', key)}>
                                            {t(`planTrip.interests.${key}`)}
                                        </Chip>
                                    ))}
                                </div>

                                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="plan_name" className={labelClass}>{t('planTrip.name')}</label>
                                        <input id="plan_name" type="text" className={`${inputClass} mt-1.5`} value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                                        {form.errors.name && <p className={errorClass}>{form.errors.name}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="plan_phone" className={labelClass}>{t('planTrip.phone')}</label>
                                        <input id="plan_phone" type="tel" className={`${inputClass} mt-1.5`} value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} />
                                        {form.errors.phone && <p className={errorClass}>{form.errors.phone}</p>}
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <label htmlFor="plan_email" className={labelClass}>{t('planTrip.email')}</label>
                                    <input id="plan_email" type="email" className={`${inputClass} mt-1.5`} value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />
                                    {form.errors.email && <p className={errorClass}>{form.errors.email}</p>}
                                </div>

                                <div className="mt-5">
                                    <label htmlFor="plan_notes" className={labelClass}>{t('planTrip.notes')}</label>
                                    <textarea id="plan_notes" rows="3" className={`${inputClass} mt-1.5`} placeholder={t('planTrip.notesPlaceholder')} value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} />
                                    {form.errors.notes && <p className={errorClass}>{form.errors.notes}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="font-subhead mt-7 min-h-[50px] w-full rounded-md bg-gold-500 px-6 py-3 font-bold text-ink-900 shadow-[0_10px_35px_rgba(201,162,75,0.35)] transition-colors hover:bg-gold-300 disabled:opacity-60"
                                >
                                    {t('planTrip.submit')}
                                </button>
                            </form>
                        </Reveal>
                    )}
                </div>
            </section>
        </AppLayout>
    );
}
