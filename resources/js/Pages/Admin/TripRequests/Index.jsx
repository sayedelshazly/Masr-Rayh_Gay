import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useLocale } from '../../../i18n/LocaleContext';

const STATUS_STYLES = {
    new: 'bg-gold-500/15 text-gold-deep',
    contacted: 'bg-lapis-600/10 text-lapis-600',
    closed: 'bg-ink/10 text-ink/55',
};

/**
 * Inbox for tailor-made trip requests: who wants what, where and
 * when — with one-tap status moves (new → contacted → closed).
 * Budget and interest keys come from the public form's vocabulary.
 */
export default function TripRequestsIndex({ requests = [] }) {
    const { t } = useLocale();

    const statusLabel = (status) =>
        t(`admin.tripRequests.status${status.charAt(0).toUpperCase()}${status.slice(1)}`);

    return (
        <AdminLayout title={t('admin.tripRequests.title')}>
            <Head title={t('admin.tripRequests.title')} />
            <h1 className="font-display text-2xl font-bold text-ink">{t('admin.tripRequests.title')}</h1>

            {requests.length === 0 ? (
                <p className="mt-6 rounded-2xl bg-white p-6 text-sm text-ink/55 shadow-sm ring-1 ring-sand">{t('admin.tripRequests.empty')}</p>
            ) : (
                <ul className="mt-6 space-y-4">
                    {requests.map((request) => (
                        <li key={request.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sand">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                <span className="font-display font-bold text-ink">{request.name}</span>
                                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUS_STYLES[request.status]}`}>
                                    {statusLabel(request.status)}
                                </span>
                                <span className="text-xs text-ink/45">{request.created_at}</span>
                                <span className="ms-auto flex items-center gap-2">
                                    {['new', 'contacted', 'closed'].filter((s) => s !== request.status).map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => router.patch(`/admin/trip-requests/${request.id}/status`, { status }, { preserveScroll: true })}
                                            className="rounded-md border border-sand px-3 py-1.5 text-xs font-bold text-ink/70 transition hover:border-gold"
                                        >
                                            {statusLabel(status)}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => router.delete(`/admin/trip-requests/${request.id}`, { preserveScroll: true })}
                                        className="rounded-md border border-sand px-3 py-1.5 text-xs font-bold text-carnelian-600 transition hover:border-carnelian-600"
                                    >
                                        {t('admin.tripRequests.delete')}
                                    </button>
                                </span>
                            </div>

                            <p className="mt-2 text-sm text-ink/60">
                                <a href={`mailto:${request.email}`} className="hover:text-gold-deep">{request.email}</a>
                                {' · '}
                                <a href={`tel:${request.phone.replace(/\s/g, '')}`} className="hover:text-gold-deep">{request.phone}</a>
                            </p>

                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {request.destinations.map((name) => (
                                    <span key={name} className="rounded-full bg-nile-950/[0.06] px-2.5 py-1 text-xs font-bold text-nile-800">{name}</span>
                                ))}
                                {request.interests.map((interest) => (
                                    <span key={interest} className="rounded-full bg-gold-500/10 px-2.5 py-1 text-xs font-bold text-gold-deep">{t(`planTrip.interests.${interest}`)}</span>
                                ))}
                            </div>

                            <p className="mt-3 text-sm text-ink/70">
                                {request.days} {t('admin.tripRequests.days')} · {request.adults + request.children} {t('admin.tripRequests.people')}
                                {request.start_date ? ` · ${request.start_date}` : ''}
                                {request.budget ? ` · ${t(`planTrip.budgets.${request.budget}`)}` : ''}
                            </p>

                            {request.notes && <p className="mt-2 rounded-md bg-sand-100 px-3 py-2 text-sm leading-relaxed text-ink/75">{request.notes}</p>}
                        </li>
                    ))}
                </ul>
            )}
        </AdminLayout>
    );
}
