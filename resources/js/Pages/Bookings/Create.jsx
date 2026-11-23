import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Reveal from '../../Components/Reveal';
import { DurationLabel } from '../../Components/TourCard';
import { useLocale } from '../../i18n/LocaleContext';
import { formatPrice, formatShortDate, formatTimeLabel, localized } from '../../lib/format';

const fieldClass =
    'w-full rounded-md border border-sand-100/20 bg-white/5 px-4 py-3 text-sm font-medium text-sand-100 outline-none transition-colors placeholder:text-sand-100/35 focus:border-gold-500';
const labelClass = 'font-display mb-1.5 block text-sm font-bold text-sand-100/80';

function FieldError({ message }) {
    if (!message) {
        return null;
    }

    return <p className="mt-1.5 text-xs font-medium text-red-300">{message}</p>;
}

export default function BookingCreate({ tour, initial, departures = [] }) {
    const { t, locale } = useLocale();
    const destination = tour.destination ?? {};
    const basePrice = Number(tour.price ?? 0);

    const { data, setData, post, processing, errors, transform } = useForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        travel_date: initial?.travel_date ?? '',
        departure_id: initial?.departure_id ?? '',
        adults: initial?.adults ?? 2,
        children: initial?.children ?? 0,
        notes: '',
        locale,
    });

    transform((formData) => ({ ...formData, locale }));

    const adults = Math.max(0, Number(data.adults) || 0);
    const childrenCount = Math.max(0, Number(data.children) || 0);
    const selectedDeparture = departures.find((departure) => String(departure.id) === String(data.departure_id)) ?? null;
    const price = selectedDeparture?.price != null ? Number(selectedDeparture.price) : basePrice;
    const childPrice = price * 0.5;
    const total = price * adults + childPrice * childrenCount;
    const today = new Date().toISOString().slice(0, 10);

    const submit = (event) => {
        event.preventDefault();
        post(`/tours/${tour.slug}/bookings`);
    };

    return (
        <AppLayout backdrop={tour.image ?? undefined}>
            <Head title={`${t('booking.metaTitle')}`} />

            {/* Hero band */}
            <section className="border-b border-white/10">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                    <Reveal>
                        <Link href={`/tours/${tour.slug}`} className="text-sm font-semibold text-gold-300 transition-colors hover:text-gold-500">
                            ← {t('booking.backToTour')}
                        </Link>
                        <h1 className="font-display mt-4 text-3xl font-extrabold text-sand-100 sm:text-4xl">{t('booking.title')}</h1>
                        <p className="mt-3 max-w-2xl leading-loose text-sand-100/75">{t('booking.subtitle')}</p>
                    </Reveal>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                <form onSubmit={submit} noValidate>
                    <div className="grid items-start gap-10 lg:grid-cols-[1fr_340px]">
                        {/* Booking form */}
                        <div className="rounded-lg bg-nile-950/70 p-6 shadow-lg shadow-black/25 ring-1 ring-white/10 backdrop-blur sm:p-8">
                            <h2 className="font-display text-xl font-bold text-sand-100">{t('booking.formTitle')}</h2>

                            <div className="mt-6 grid gap-5 sm:grid-cols-3">
                                {departures.length > 0 ? (
                                    <div>
                                        <label htmlFor="departure_id" className={labelClass}>{t('booking.chooseDeparture')}</label>
                                        <select
                                            id="departure_id"
                                            className={fieldClass}
                                            value={data.departure_id}
                                            onChange={(event) => setData('departure_id', event.target.value)}
                                        >
                                            <option value="" className="text-ink-900">{t('booking.chooseDeparture')}</option>
                                            {departures.map((departure) => (
                                                <option key={departure.id} value={departure.id} disabled={departure.sold_out} className="text-ink-900">
                                                    {formatShortDate(departure.date, locale)}
                                                    {departure.time ? ` · ${formatTimeLabel(departure.time, locale)}` : ''}
                                                    {' · '}
                                                    {departure.sold_out
                                                        ? t('booking.soldOut')
                                                        : `${departure.seats_remaining} ${t('booking.seatsLeft')}`}
                                                </option>
                                            ))}
                                        </select>
                                        <FieldError message={errors.departure_id} />
                                        {selectedDeparture && <p className="mt-1.5 text-xs leading-relaxed text-sand-100/55">{t('booking.holdNote')}</p>}
                                    </div>
                                ) : (
                                    <div>
                                        <label htmlFor="travel_date" className={labelClass}>{t('booking.travelDate')}</label>
                                        <input
                                            id="travel_date"
                                            type="date"
                                            min={today}
                                            className={`${fieldClass} [color-scheme:dark]`}
                                            value={data.travel_date}
                                            onChange={(event) => setData('travel_date', event.target.value)}
                                        />
                                        <FieldError message={errors.travel_date} />
                                    </div>
                                )}
                                <div>
                                    <label htmlFor="adults" className={labelClass}>{t('booking.adults')}</label>
                                    <input
                                        id="adults"
                                        type="number"
                                        min="1"
                                        max="30"
                                        className={fieldClass}
                                        value={data.adults}
                                        onChange={(event) => setData('adults', event.target.value)}
                                    />
                                    <FieldError message={errors.adults} />
                                </div>
                                <div>
                                    <label htmlFor="children" className={labelClass}>{t('booking.children')}</label>
                                    <input
                                        id="children"
                                        type="number"
                                        min="0"
                                        max="30"
                                        className={fieldClass}
                                        value={data.children}
                                        onChange={(event) => setData('children', event.target.value)}
                                    />
                                    <p className="mt-1.5 text-xs font-medium text-sand-100/55">{t('booking.childrenHint')}</p>
                                    <FieldError message={errors.children} />
                                </div>
                            </div>

                            <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="customer_name" className={labelClass}>{t('booking.name')}</label>
                                    <input
                                        id="customer_name"
                                        type="text"
                                        className={fieldClass}
                                        placeholder={t('booking.namePlaceholder')}
                                        value={data.customer_name}
                                        onChange={(event) => setData('customer_name', event.target.value)}
                                    />
                                    <FieldError message={errors.customer_name} />
                                </div>
                                <div>
                                    <label htmlFor="customer_phone" className={labelClass}>{t('booking.phone')}</label>
                                    <input
                                        id="customer_phone"
                                        type="tel"
                                        className={fieldClass}
                                        placeholder={t('booking.phonePlaceholder')}
                                        value={data.customer_phone}
                                        onChange={(event) => setData('customer_phone', event.target.value)}
                                    />
                                    <FieldError message={errors.customer_phone} />
                                </div>
                            </div>

                            <div className="mt-5">
                                <label htmlFor="customer_email" className={labelClass}>{t('booking.email')}</label>
                                <input
                                    id="customer_email"
                                    type="email"
                                    className={fieldClass}
                                    placeholder={t('booking.emailPlaceholder')}
                                    value={data.customer_email}
                                    onChange={(event) => setData('customer_email', event.target.value)}
                                />
                                <FieldError message={errors.customer_email} />
                            </div>

                            <div className="mt-5">
                                <label htmlFor="notes" className={labelClass}>{t('booking.notes')}</label>
                                <textarea
                                    id="notes"
                                    rows="3"
                                    className={fieldClass}
                                    placeholder={t('booking.notesPlaceholder')}
                                    value={data.notes}
                                    onChange={(event) => setData('notes', event.target.value)}
                                />
                                <FieldError message={errors.notes} />
                            </div>
                        </div>

                        {/* Tour summary */}
                        <aside className="rounded-lg bg-nile-950/70 p-6 shadow-lg shadow-black/25 ring-1 ring-white/10 backdrop-blur lg:sticky lg:top-40">
                            <h2 className="font-display text-lg font-bold text-sand-100">{t('booking.summary')}</h2>
                            <p className="font-display mt-3 text-xl font-bold leading-snug text-sand-100">{localized(tour, 'title', locale)}</p>
                            <div className="mt-3 space-y-2 text-sm text-sand-100/60">
                                <p className="font-semibold text-sand-100">{localized(destination, 'name', locale)}</p>
                                <p className="flex justify-between">
                                    <span><DurationLabel tour={tour} /></span>
                                    <span className="text-sand-100">★ {Number(tour.rating).toFixed(1)} ({tour.reviews_count})</span>
                                </p>
                            </div>

                            <div className="mt-5 space-y-2.5 border-t border-white/10 pt-5 text-sm text-sand-100/60">
                                <p className="flex justify-between">
                                    <span>{adults} × {t('booking.perAdult')}</span>
                                    <span className="font-semibold text-sand-100">{formatPrice(price * adults, locale)} {t('common.currency')}</span>
                                </p>
                                {childrenCount > 0 && (
                                    <p className="flex justify-between">
                                        <span>{childrenCount} × {t('booking.perChild')}</span>
                                        <span className="font-semibold text-sand-100">{formatPrice(childPrice * childrenCount, locale)} {t('common.currency')}</span>
                                    </p>
                                )}
                                <p className="flex justify-between border-t border-white/10 pt-3 text-base">
                                    <span className="font-display font-bold text-sand-100">{t('booking.total')}</span>
                                    <span className="font-display text-2xl font-extrabold text-gold-300">
                                        {formatPrice(total, locale)} <span className="text-sm font-semibold text-sand-100/60">{t('common.currency')}</span>
                                    </span>
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="font-subhead mt-6 block min-h-[44px] w-full rounded-md bg-gold-500 px-6 py-3 text-center font-bold text-ink-900 transition-colors duration-150 ease-stone hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? t('booking.processing') : t('booking.confirm')}
                            </button>
                            <p className="mt-3 text-center text-xs leading-relaxed text-sand-100/55">{t('booking.payLaterNote')}</p>
                        </aside>
                    </div>
                </form>
            </section>
        </AppLayout>
    );
}
