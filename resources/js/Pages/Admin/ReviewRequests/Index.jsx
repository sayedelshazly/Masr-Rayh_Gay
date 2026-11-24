import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useLocale } from '../../../i18n/LocaleContext';

export default function ReviewRequestsIndex({ bookings }) {
    const { t } = useLocale();

    return (
        <AdminLayout>
            <Head title={t('admin.reviewRequests.title')} />

            <div className="mb-6">
                <h1 className="font-display text-3xl text-ink-900">{t('admin.reviewRequests.title')}</h1>
                <p className="mt-1 text-sm text-ink-500">
                    {t('admin.reviewRequests.intro')} · {bookings.length} {t('admin.reviewRequests.tripsDone')}
                </p>
            </div>

            {bookings.length === 0 ? (
                <div className="rounded-md bg-white p-10 text-center shadow ring-1 ring-ink-900/10">
                    <p className="font-glyph text-4xl text-gold-500">𓂀</p>
                    <p className="mt-3 font-semibold text-ink-900">{t('admin.reviewRequests.empty')}</p>
                    <p className="mt-1 text-sm text-ink-500">{t('admin.reviewRequests.emptyText')}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {bookings.map((booking) => (
                        <article
                            key={booking.reference}
                            className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-md bg-white p-4 shadow ring-1 ring-ink-900/10"
                        >
                            <div className="min-w-52 flex-1">
                                <h2 className="font-bold text-ink-900">{booking.tour_title_ar}</h2>
                                <p className="mt-0.5 text-sm text-ink-500">
                                    {booking.customer_name} · <span dir="ltr">{booking.customer_phone}</span>
                                </p>
                            </div>
                            <div className="text-sm text-ink-500">
                                <p>{t('admin.reviewRequests.travelDate')}: <span dir="ltr">{booking.travel_date}</span></p>
                                <p className="mt-0.5 font-mono text-xs font-bold text-lapis-600">{booking.reference}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/admin/bookings/${booking.reference}`}
                                    className="rounded-sm bg-white px-3 py-2 text-xs font-bold text-lapis-600 ring-1 ring-ink-900/15 transition hover:bg-sand-100"
                                >
                                    {t('admin.table.view')}
                                </Link>
                                {booking.whatsapp_review_url && (
                                    <a
                                        href={booking.whatsapp_review_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-sm bg-turquoise-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-turquoise-600/85"
                                    >
                                        {t('admin.reviewRequests.askReview')}
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
