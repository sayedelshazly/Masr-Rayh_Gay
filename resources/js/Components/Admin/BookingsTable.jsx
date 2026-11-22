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
                                    <Link
                                        href={`/admin/bookings/${booking.reference}`}
                                        className="font-bold text-lapis transition-colors hover:text-gold-deep"
                                    >
                                        {t('admin.table.view')}
                                    </Link>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
