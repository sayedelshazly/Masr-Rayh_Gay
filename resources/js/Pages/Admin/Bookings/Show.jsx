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

export default function Show({ booking, statuses, whatsappUrl }) {
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
                    {whatsappUrl && (
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-turquoise-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-turquoise-600/85"
                        >
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.9-4.45 9.9-9.91C21.94 6.45 17.5 2 12.04 2m0 18.13a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24m4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.38-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.13.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.6.19 1.13.16 1.56.1.48-.07 1.47-.58 1.74-1.14.27-.56.27-1.04.19-1.14-.08-.1-.23-.16-.48-.28" /></svg>
                            {t('admin.whatsappConfirm')}
                        </a>
                    )}
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
