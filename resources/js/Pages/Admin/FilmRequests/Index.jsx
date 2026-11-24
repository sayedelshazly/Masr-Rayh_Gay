import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useLocale } from '../../../i18n/LocaleContext';
import { formatPrice } from '../../../lib/format';

const STATUS_STYLES = {
    new: 'bg-gold-500/15 text-gold-deep ring-gold-500/40',
    contacted: 'bg-lapis-600/10 text-lapis-600 ring-lapis-600/30',
    closed: 'bg-ink-900/5 text-ink-500 ring-ink-900/15',
};

export default function FilmRequestsIndex({ requests }) {
    const { t, locale } = useLocale();
    const { flash } = usePage().props;

    const setStatus = (id, status) => router.patch(`/admin/film-requests/${id}`, { status }, { preserveScroll: true });
    const remove = (id) => {
        if (window.confirm(t('admin.filmRequests.confirmDelete'))) {
            router.delete(`/admin/film-requests/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout>
            <Head title={t('admin.filmRequests.title')} />

            <div className="mb-6">
                <h1 className="font-display text-3xl text-ink-900">{t('admin.filmRequests.title')}</h1>
                <p className="mt-1 text-sm text-ink-500">
                    {requests.length} {t('admin.filmRequests.count')}
                </p>
            </div>

            {flash?.success && (
                <p className="mb-4 rounded-sm bg-turquoise-600/10 px-4 py-2.5 text-sm font-semibold text-turquoise-600 ring-1 ring-turquoise-600/30">
                    {t('admin.saved')}
                </p>
            )}

            {requests.length === 0 ? (
                <div className="rounded-md bg-white p-10 text-center shadow ring-1 ring-ink-900/10">
                    <p className="font-glyph text-4xl text-gold-500">𓋹</p>
                    <p className="mt-3 font-semibold text-ink-900">{t('admin.filmRequests.empty')}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((request) => (
                        <article key={request.id} className="rounded-md bg-white p-5 shadow ring-1 ring-ink-900/10">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h2 className="flex flex-wrap items-center gap-2 font-display text-xl text-ink-900">
                                        {t(`film.pkg.${request.package}.name`)}
                                        {request.price && <span className="text-base font-bold text-gold-deep">{formatPrice(request.price, locale)}</span>}
                                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ${STATUS_STYLES[request.status]}`}>
                                            {t(`admin.filmRequests.statuses.${request.status}`)}
                                        </span>
                                    </h2>
                                    <p className="mt-1 text-sm text-ink-500">
                                        {request.name} · <span dir="ltr">{request.phone}</span>
                                        {request.email && <> · {request.email}</>}
                                    </p>
                                </div>
                                <p className="text-xs text-ink-500">{request.created_at}</p>
                            </div>

                            <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                                <div className="flex gap-2">
                                    <dt className="shrink-0 font-bold text-ink-900">{t('admin.filmRequests.tour')}:</dt>
                                    <dd className="text-ink-500">{request.tour_title_ar ?? t('admin.filmRequests.noTour')}</dd>
                                </div>
                                <div className="flex gap-2">
                                    <dt className="shrink-0 font-bold text-ink-900">{t('admin.filmRequests.date')}:</dt>
                                    <dd className="text-ink-500">{request.travel_date ?? '—'}</dd>
                                </div>
                            </dl>

                            {request.notes && (
                                <p className="mt-3 rounded-sm bg-sand-100 px-3.5 py-2.5 text-sm leading-relaxed text-ink-900">
                                    {request.notes}
                                </p>
                            )}

                            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink-900/10 pt-4">
                                {request.status !== 'contacted' && request.status !== 'closed' && (
                                    <button type="button" onClick={() => setStatus(request.id, 'contacted')} className="rounded-sm bg-lapis-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-nile-800">
                                        {t('admin.filmRequests.markContacted')}
                                    </button>
                                )}
                                {request.status !== 'closed' && (
                                    <button type="button" onClick={() => setStatus(request.id, 'closed')} className="rounded-sm bg-ink-900/5 px-3 py-1.5 text-xs font-bold text-ink-900 ring-1 ring-ink-900/15 transition hover:bg-ink-900/10">
                                        {t('admin.filmRequests.markClosed')}
                                    </button>
                                )}
                                {request.status !== 'new' && (
                                    <button type="button" onClick={() => setStatus(request.id, 'new')} className="rounded-sm bg-white px-3 py-1.5 text-xs font-bold text-ink-500 ring-1 ring-ink-900/15 transition hover:bg-sand-100">
                                        {t('admin.filmRequests.markNew')}
                                    </button>
                                )}
                                <button type="button" onClick={() => remove(request.id)} className="ms-auto rounded-sm bg-carnelian-600/10 px-3 py-1.5 text-xs font-bold text-carnelian-600 ring-1 ring-carnelian-600/30 transition hover:bg-carnelian-600 hover:text-white">
                                    {t('admin.delete')}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
