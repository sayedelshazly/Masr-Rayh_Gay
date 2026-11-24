import { Link } from '@inertiajs/react';
import { useLocale } from '../../i18n/LocaleContext';
import { formatPrice, localized } from '../../lib/format';
import StatusBadge from './StatusBadge';

/** Shared bookings table (dashboard recent list + bookings index). */
export default function BookingsTable({ bookings, showActions = true }) {
    const { t, locale } = useLocale();

    if (!bookings.length) {
        return <p className="px-4 py-8 text-center text-sm text-ink/55">{t('admin.noBookings')}</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-start text-sm">
                <thead>
                    <tr className="border-b border-sand text-xs uppercase tracking-wide text-ink/50">
                        <th className="px-3 py-2.5 text-start font-bold">{t('admin.table.reference')}</th>
                        <th className="px-3 py-2.5 text-start font-bold">{t('admin.table.tour')}</th>
                        <th className="px-3 py-2.5 text-start font-bold">{t('admin.table.customer')}</th>
                        <th className="px-3 py-2.5 text-start font-bold">{t('admin.table.date')}</th>
                        <th className="px-3 py-2.5 text-start font-bold">{t('admin.table.guests')}</th>
                        <th className="px-3 py-2.5 text-start font-bold">{t('admin.table.total')}</th>
                        <th className="px-3 py-2.5 text-start font-bold">{t('admin.table.status')}</th>
                        {showActions && <th className="px-3 py-2.5 text-start font-bold">{t('admin.table.actions')}</th>}
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.reference} className="border-b border-sand/70 last:border-0 hover:bg-sand/40">
                            <td className="px-3 py-2.5 font-mono text-xs font-bold text-lapis">{booking.reference}</td>
                            <td className="max-w-52 truncate px-3 py-2.5">{localized(booking.tour, 'title', locale)}</td>
                            <td className="px-3 py-2.5">
                                <span className="block font-medium">{booking.customer_name}</span>
                                <span className="block text-xs text-ink/50" dir="ltr">
                                    {booking.customer_email}
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-2.5">{String(booking.travel_date ?? '').slice(0, 10)}</td>
                            <td className="whitespace-nowrap px-3 py-2.5">
                                {booking.adults} {t('admin.table.adults')}
                                {booking.children > 0 && ` · ${booking.children} ${t('admin.table.children')}`}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2.5 font-bold">
                                {formatPrice(booking.total_price, locale)} {t('common.currency')}
                            </td>
                            <td className="px-3 py-2.5">
                                <StatusBadge status={booking.status} />
                            </td>
                            {showActions && (
                                <td className="px-3 py-2.5">
                                    <span className="flex items-center gap-3">
                                        <Link
                                            href={`/admin/bookings/${booking.reference}`}
                                            className="font-bold text-lapis transition-colors hover:text-gold-deep"
                                        >
                                            {t('admin.table.view')}
                                        </Link>
                                        {booking.whatsapp_url && (
                                            <a
                                                href={booking.whatsapp_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                title={t('admin.table.whatsapp')}
                                                className="flex items-center gap-1 font-bold text-turquoise-600 transition-colors hover:text-turquoise-600/70"
                                            >
                                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.9-4.45 9.9-9.91C21.94 6.45 17.5 2 12.04 2m0 18.13a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24m4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.38-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.13.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.6.19 1.13.16 1.56.1.48-.07 1.47-.58 1.74-1.14.27-.56.27-1.04.19-1.14-.08-.1-.23-.16-.48-.28" /></svg>
                                                {t('admin.table.whatsapp')}
                                            </a>
                                        )}
                                    </span>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
