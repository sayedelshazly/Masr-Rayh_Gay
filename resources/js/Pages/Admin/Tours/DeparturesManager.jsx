import { router, useForm } from '@inertiajs/react';
import { useLocale } from '../../../i18n/LocaleContext';
import { formatPrice, formatShortDate, formatTimeLabel } from '../../../lib/format';

const inputCls =
    'w-full rounded-lg border border-sand bg-ivory px-3 py-2 text-sm outline-none focus:border-gold';
const labelCls = 'mb-1 block text-xs font-bold text-ink/55';

/**
 * Scheduled departures for one tour: list with live seat stats
 * (capacity / booked / remaining), an add form, and per-row
 * show-hide + delete. Rendered under the tour edit form.
 */
export default function DeparturesManager({ tour, departures = [] }) {
    const { t, locale } = useLocale();
    const { data, setData, post, processing, errors, reset } = useForm({
        date: '',
        time: '08:00',
        capacity: 20,
        price: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post(`/admin/tours/${tour.slug}/departures`, {
            preserveScroll: true,
            onSuccess: () => reset('date', 'price'),
        });
    };

    return (
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sand">
            <h2 className="font-display text-lg font-bold text-ink">{t('admin.departures.title')}</h2>

            {departures.length === 0 ? (
                <p className="mt-3 text-sm text-ink/55">{t('admin.departures.empty')}</p>
            ) : (
                <ul className="mt-4 divide-y divide-sand">
                    {departures.map((departure) => (
                        <li key={departure.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 text-sm">
                            <span className="font-bold text-ink">
                                {formatShortDate(departure.date, locale)}
                                {departure.time ? ` · ${formatTimeLabel(departure.time, locale)}` : ''}
                            </span>
                            <span className="text-ink/60">
                                {t('admin.departures.capacity')}: {departure.capacity}
                            </span>
                            <span className="text-ink/60">
                                {t('admin.departures.taken')}: {departure.seats_taken}
                            </span>
                            <span className={departure.seats_remaining === 0 ? 'font-bold text-carnelian-600' : 'font-bold text-turquoise-600'}>
                                {t('admin.departures.remaining')}: {departure.seats_remaining}
                            </span>
                            {departure.price != null && (
                                <span className="text-ink/60">
                                    {formatPrice(departure.price, locale)} {t('common.currency')}
                                </span>
                            )}
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${departure.is_active ? 'bg-turquoise-600/10 text-turquoise-600' : 'bg-ink/10 text-ink/50'}`}>
                                {departure.is_active ? t('admin.departures.active') : t('admin.departures.inactive')}
                            </span>
                            <span className="ms-auto flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => router.patch(`/admin/tours/${tour.slug}/departures/${departure.id}/toggle`, {}, { preserveScroll: true })}
                                    className="rounded-md border border-sand px-2.5 py-1 text-xs font-bold text-ink/70 transition hover:border-gold hover:text-ink"
                                >
                                    {departure.is_active ? t('admin.departures.inactive') : t('admin.departures.active')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.delete(`/admin/tours/${tour.slug}/departures/${departure.id}`, { preserveScroll: true })}
                                    className="rounded-md border border-sand px-2.5 py-1 text-xs font-bold text-carnelian-600 transition hover:border-carnelian-600"
                                >
                                    {t('admin.departures.delete')}
                                </button>
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={submit} className="mt-5 grid gap-4 border-t border-sand pt-5 sm:grid-cols-2 lg:grid-cols-5">
                <label className="block">
                    <span className={labelCls}>{t('admin.departures.date')}</span>
                    <input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} className={inputCls} />
                    {errors.date && <span className="mt-1 block text-xs font-bold text-carnelian-600">{errors.date}</span>}
                </label>
                <label className="block">
                    <span className={labelCls}>{t('admin.departures.time')}</span>
                    <input type="time" value={data.time} onChange={(e) => setData('time', e.target.value)} className={inputCls} />
                    {errors.time && <span className="mt-1 block text-xs font-bold text-carnelian-600">{errors.time}</span>}
                </label>
                <label className="block">
                    <span className={labelCls}>{t('admin.departures.capacity')}</span>
                    <input type="number" min="1" max="500" value={data.capacity} onChange={(e) => setData('capacity', e.target.value)} className={inputCls} />
                    {errors.capacity && <span className="mt-1 block text-xs font-bold text-carnelian-600">{errors.capacity}</span>}
                </label>
                <label className="block">
                    <span className={labelCls}>{t('admin.departures.price')}</span>
                    <input type="number" min="0" step="0.01" value={data.price} onChange={(e) => setData('price', e.target.value)} className={inputCls} placeholder={String(tour.price)} />
                    <span className="mt-1 block text-xs text-ink/45">{t('admin.departures.priceHint')}</span>
                    {errors.price && <span className="mt-1 block text-xs font-bold text-carnelian-600">{errors.price}</span>}
                </label>
                <div className="flex items-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="min-h-[40px] w-full rounded-lg bg-gold px-4 py-2 text-sm font-bold text-ink transition hover:bg-gold-light disabled:opacity-60"
                    >
                        {t('admin.departures.add')}
                    </button>
                </div>
            </form>
        </section>
    );
}
