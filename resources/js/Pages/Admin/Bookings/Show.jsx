import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import StatusBadge from '../../../Components/Admin/StatusBadge';
import { useLocale } from '../../../i18n/LocaleContext';
import { formatPrice, localized } from '../../../lib/format';

function Row({ label, children }) {
    return (
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-sand/70 py-2.5 last:border-0">
            <dt className="text-xs font-bold uppercase tracking-wide text-ink/50">{label}</dt>
            <dd className="text-sm font-medium">{children}</dd>
        </div>
    );
}

export default function Show({ booking, statuses }) {
    const { t, locale } = useLocale();
    const [status, setStatus] = useState(booking.status);
    const tour = booking.tour ?? {};

    const saveStatus = () => {
        router.patch(
            `/admin/bookings/${booking.reference}/status`,
            { status },
            { preserveScroll: true },
        );
    };

    return (
        <AdminLayout title={`${t('admin.bookingDetails')} — ${booking.reference}`}>
            <Head title={booking.reference} />

            <Link href="/admin/bookings" className="text-sm font-bold text-lapis hover:text-gold-deep">
                ← {t('admin.nav.bookings')}
            </Link>

            <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_320px]">
                <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sand">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="font-mono text-lg font-bold text-lapis-deep">{booking.reference}</h2>
                        <StatusBadge status={booking.status} />
                    </div>
                    <dl className="mt-4">
                        <Row label={t('admin.table.tour')}>
                            <Link href={`/tours/${tour.slug}`} className="text-lapis hover:underline">
                                {localized(tour, 'title', locale)}
                            </Link>{' '}
                            · {localized(tour.destination, 'name', locale)}
                        </Row>
                        <Row label={t('admin.table.customer')}>{booking.customer_name}</Row>
                        <Row label={t('admin.table.email')}>
                            <span dir="ltr">{booking.customer_email}</span>
                        </Row>
                        <Row label={t('admin.table.phone')}>
                            <span dir="ltr">{booking.customer_phone}</span>
                        </Row>
                        <Row label={t('admin.table.user')}>
                            {booking.user ? (
                                <>
                                    {booking.user.name} · <span dir="ltr">{booking.user.email}</span>
                                </>
                            ) : (
                                t('admin.table.guest')
                            )}
                        </Row>
                        <Row label={t('admin.table.date')}>{String(booking.travel_date ?? '').slice(0, 10)}</Row>
                        <Row label={t('admin.table.guests')}>
                            {booking.adults} {t('admin.table.adults')}
                            {booking.children > 0 && ` · ${booking.children} ${t('admin.table.children')}`}
                        </Row>
                        <Row label={t('admin.table.total')}>
                            <span className="font-display text-base font-bold">
                                {formatPrice(booking.total_price, locale)} {t('common.currency')}
                            </span>
                        </Row>
                        <Row label={t('admin.table.createdAt')}>{String(booking.created_at ?? '').slice(0, 10)}</Row>
                        {booking.notes && <Row label={t('admin.table.notes')}>{booking.notes}</Row>}
                    </dl>
                </section>

                <section className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sand">
                    <h3 className="font-display text-base font-bold text-lapis-deep">{t('admin.changeStatus')}</h3>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="mt-3 w-full rounded-lg border border-sand bg-ivory px-3 py-2 text-sm outline-none focus:border-gold"
                    >
                        {statuses.map((s) => (
                            <option key={s} value={s}>
                                {t(`admin.statuses.${s}`)}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={saveStatus}
                        disabled={status === booking.status}
                        className="mt-3 w-full rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-gold-deep hover:text-ivory disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {t('admin.save')}
                    </button>
                </section>
            </div>
        </AdminLayout>
    );
}
