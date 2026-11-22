import { Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import BookingsTable from '../../Components/Admin/BookingsTable';
import StatusBadge from '../../Components/Admin/StatusBadge';
import { useLocale } from '../../i18n/LocaleContext';
import { formatPrice } from '../../lib/format';

function StatCard({ label, value, accent = false }) {
    return (
        <div className={`rounded-2xl p-5 shadow-sm ring-1 ${accent ? 'bg-lapis-deep text-ivory ring-lapis-deep' : 'bg-white ring-sand'}`}>
            <p className={`text-xs font-bold uppercase tracking-wide ${accent ? 'text-gold-light' : 'text-ink/50'}`}>{label}</p>
            <p className="font-display mt-2 text-3xl font-bold">{value}</p>
        </div>
    );
}

export default function Dashboard({ stats, bookingsByStatus, recentBookings }) {
    const { t, locale } = useLocale();

    return (
        <AdminLayout title={t('admin.nav.dashboard')}>
            <Head title={t('admin.title')} />

            <section className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                <StatCard label={t('admin.stats.totalBookings')} value={formatPrice(stats.total_bookings, locale)} accent />
                <StatCard label={t('admin.stats.pendingBookings')} value={formatPrice(stats.pending_bookings, locale)} />
                <StatCard
                    label={t('admin.stats.confirmedRevenue')}
                    value={`${formatPrice(stats.confirmed_revenue, locale)} ${t('common.currency')}`}
                />
                <StatCard label={t('admin.stats.totalTours')} value={formatPrice(stats.total_tours, locale)} />
                <StatCard label={t('admin.stats.totalDestinations')} value={formatPrice(stats.total_destinations, locale)} />
                <StatCard label={t('admin.stats.totalUsers')} value={formatPrice(stats.total_users, locale)} />
            </section>

            <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-sand">
                <h2 className="font-display text-base font-bold text-lapis-deep">{t('admin.byStatus')}</h2>
                <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
                    {bookingsByStatus.map((row) => (
                        <li key={row.status} className="flex items-center gap-2 text-sm">
                            <StatusBadge status={row.status} />
                            <span className="font-display text-lg font-bold">{formatPrice(row.count, locale)}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="mt-6 rounded-2xl bg-white shadow-sm ring-1 ring-sand">
                <h2 className="font-display px-5 pt-5 text-base font-bold text-lapis-deep">{t('admin.recentBookings')}</h2>
                <BookingsTable bookings={recentBookings} />
            </section>
        </AdminLayout>
    );
}
