import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { useLocale } from '../../i18n/LocaleContext';
import { formatPrice } from '../../lib/format';

export default function Tomorrow({ date, bookings, totalTravellers }) {
    const { t, locale } = useLocale();

    return (
        <AdminLayout>
            <Head title={t('admin.tomorrow.title')} />

            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="font-display text-3xl text-ink-900">{t('admin.tomorrow.title')}</h1>
                    <p className="mt-1 text-sm text-ink-500">
                        {date} · {bookings.length} {t('admin.tomorrow.trips')} · {totalTravellers} {t('admin.tomorrow.travellers')}
                    </p>
                </div>
                <p className="rounded-sm bg-gold-500/10 px-3 py-1.5 text-xs font-semibold text-gold-deep ring-1 ring-gold-500/30">
                    {t('admin.tomorrow.hint')}
                </p>
            </div>

            {bookings.length === 0 ? (
                <div className="rounded-md bg-white p-10 text-center shadow ring-1 ring-ink-900/10">
                    <p className="font-glyph text-4xl text-gold-500">𓇋</p>
                    <p className="mt-3 font-semibold text-ink-900">{t('admin.tomorrow.empty')}</p>
                    <p className="mt-1 text-sm text-ink-500">{t('admin.tomorrow.emptyText')}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {bookings.map((booking) => (
                        <article
                            key={booking.reference}
                            className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-md bg-white p-4 shadow ring-1 ring-ink-900/10"
                        >
                            <div className="min-w-16 text-center">
                                <p className="font-display text-xl font-bold text-lapis-600">
                                    {booking.departure_time ?? '—'}
                                </p>
                                <p className="text-[11px] font-semibold text-ink-500">{t('admin.tomorrow.departure')}</p>
                            </div>

                            <div className="min-w-52 flex-1">
                                <h2 className="font-bold text-ink-900">{booking.tour_title_ar}</h2>
                                <p className="mt-0.5 text-sm text-ink-500">
                                    {booking.customer_name} · <span dir="ltr">{booking.customer_phone}</span>
                                </p>
                            </div>

                            <div className="text-sm text-ink-500">
                                <p>
                                    {booking.adults} {t('admin.table.adults')}
                                    {booking.children > 0 && <> · {booking.children} {t('admin.table.children')}</>}
                                </p>
                                <p className="mt-0.5 font-mono text-xs font-bold text-lapis-600">{booking.reference}</p>
                            </div>

                            <p className="font-bold text-ink-900">{formatPrice(booking.total_price, locale)}</p>

                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/admin/bookings/${booking.reference}`}
                                    className="rounded-sm bg-white px-3 py-2 text-xs font-bold text-lapis-600 ring-1 ring-ink-900/15 transition hover:bg-sand-100"
                                >
                                    {t('admin.table.view')}
                                </Link>
                                {booking.whatsapp_reminder_url && (
                                    <a
                                        href={booking.whatsapp_reminder_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1.5 rounded-sm bg-turquoise-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-turquoise-600/85"
                                    >
                                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.9-4.45 9.9-9.91C21.94 6.45 17.5 2 12.04 2m0 18.13a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24m4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.38-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.13.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.6.19 1.13.16 1.56.1.48-.07 1.47-.58 1.74-1.14.27-.56.27-1.04.19-1.14-.08-.1-.23-.16-.48-.28" /></svg>
                                        {t('admin.tomorrow.remind')}
                                    </a>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
