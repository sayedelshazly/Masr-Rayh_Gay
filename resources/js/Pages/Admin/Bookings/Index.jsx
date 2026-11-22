import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import BookingsTable from '../../../Components/Admin/BookingsTable';
import { useLocale } from '../../../i18n/LocaleContext';

export default function Index({ bookings, statuses, filters }) {
    const { t } = useLocale();
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const applyFilters = (next) => {
        router.get('/admin/bookings', next, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout title={t('admin.bookingsTitle')}>
            <Head title={t('admin.bookingsTitle')} />

            <form
                className="mb-5 flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-sand"
                onSubmit={(e) => {
                    e.preventDefault();
                    applyFilters({ search, status });
                }}
            >
                <label className="min-w-56 flex-1">
                    <span className="mb-1 block text-xs font-bold text-ink/55">{t('admin.table.customer')}</span>
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('admin.searchBookings')}
                        className="w-full rounded-lg border border-sand bg-ivory px-3 py-2 text-sm outline-none focus:border-gold"
                    />
                </label>
                <label>
                    <span className="mb-1 block text-xs font-bold text-ink/55">{t('admin.table.status')}</span>
                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            applyFilters({ search, status: e.target.value });
                        }}
                        className="rounded-lg border border-sand bg-ivory px-3 py-2 text-sm outline-none focus:border-gold"
                    >
                        <option value="">{t('admin.allStatuses')}</option>
                        {statuses.map((s) => (
                            <option key={s} value={s}>
                                {t(`admin.statuses.${s}`)}
                            </option>
                        ))}
                    </select>
                </label>
                <button
                    type="submit"
                    className="rounded-full bg-gold px-5 py-2 text-sm font-bold text-ink transition-colors hover:bg-gold-deep hover:text-ivory"
                >
                    {t('admin.filter')}
                </button>
            </form>

            <section className="rounded-2xl bg-white shadow-sm ring-1 ring-sand">
                <BookingsTable bookings={bookings.data} />
            </section>

            {bookings.last_page > 1 && (
                <nav className="mt-5 flex flex-wrap justify-center gap-1.5">
                    {bookings.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            preserveState
                            className={`rounded-lg px-3 py-1.5 text-sm font-bold ${
                                link.active ? 'bg-lapis-deep text-ivory' : 'bg-white text-ink/70 ring-1 ring-sand'
                            } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </nav>
            )}
        </AdminLayout>
    );
}
