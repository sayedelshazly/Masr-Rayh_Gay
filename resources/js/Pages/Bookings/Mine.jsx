import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { useLocale } from '../../i18n/LocaleContext';
import { formatPrice, localized } from '../../lib/format';

const STATUS_STYLES = {
    pending: 'bg-gold/20 text-gold-deep ring-gold/50',
    confirmed: 'bg-emerald-100 text-emerald-800 ring-emerald-300',
    cancelled: 'bg-red-100 text-red-700 ring-red-300',
};

function formatDate(value, locale) {
    if (!value) {
        return '';
    }

    const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);

    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          });
}

function BookingCard({ booking, onCancel, cancelling }) {
    const { t, locale } = useLocale();
    const tour = booking.tour ?? {};
    const destination = tour.destination ?? {};
    const statusStyle = STATUS_STYLES[booking.status] ?? STATUS_STYLES.pending;

    const today = new Date().toISOString().slice(0, 10);
    const travelDate = String(booking.travel_date ?? '').slice(0, 10);
    const cancellable = booking.status === 'pending' && travelDate >= today;

    const guests = [
        `${booking.adults} ${t('booking.adults')}`,
        booking.children > 0 ? `${booking.children} ${t('booking.children')}` : null,
    ]
        .filter(Boolean)
        .join(' · ');

    return (
        <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sand sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <Link
                        href={`/tours/${tour.slug}`}
                        className="font-display text-lg font-bold text-lapis-deep transition-colors hover:text-gold-deep"
                    >
                        {localized(tour, 'title', locale)}
                    </Link>
                    <p className="mt-1 text-sm font-medium text-ink/55">
                        {t('myBookings.destination')}: {localized(destination, 'name', locale)}
                    </p>
                </div>
                <span className={`inline-block rounded-full px-3.5 py-1.5 text-xs font-bold ring-1 ${statusStyle}`}>
                    {t(`booking.statuses.${booking.status}`)}
                </span>
            </div>

            <dl className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                <div className="flex items-baseline justify-between gap-2 sm:block">
                    <dt className="font-medium text-ink/55">{t('booking.reference')}</dt>
                    <dd className="font-display mt-0.5 font-bold tracking-wider text-gold-deep">{booking.reference}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-2 sm:block">
                    <dt className="font-medium text-ink/55">{t('booking.dateLabel')}</dt>
                    <dd className="mt-0.5 font-bold text-ink">{formatDate(booking.travel_date, locale)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-2 sm:block">
                    <dt className="font-medium text-ink/55">{t('myBookings.guests')}</dt>
                    <dd className="mt-0.5 font-bold text-ink">{guests}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-2 sm:block">
                    <dt className="font-medium text-ink/55">{t('booking.total')}</dt>
                    <dd className="mt-0.5 font-bold text-ink">
                        {formatPrice(booking.total_price, locale)} {t('common.currency')}
                    </dd>
                </div>
            </dl>

            {cancellable && (
                <div className="mt-5 border-t border-sand pt-4 text-end">
                    <button
                        type="button"
                        disabled={cancelling}
                        onClick={() => onCancel(booking)}
                        className="rounded-full border border-red-300 px-4 py-2 text-xs font-bold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {cancelling ? t('myBookings.cancelling') : t('myBookings.cancel')}
                    </button>
                </div>
            )}
        </article>
    );
}

export default function Mine({ bookings }) {
    const { t } = useLocale();
    const [cancellingRef, setCancellingRef] = useState(null);

    const cancel = (booking) => {
        if (!window.confirm(t('myBookings.cancelConfirm'))) {
            return;
        }

        router.patch(`/my-bookings/${booking.reference}/cancel`, {}, {
            preserveScroll: true,
            onStart: () => setCancellingRef(booking.reference),
            onFinish: () => setCancellingRef(null),
        });
    };

    return (
        <AppLayout>
            <Head title={t('myBookings.metaTitle')} />

            <section className="bg-lapis-deep">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                    <h1 className="font-display text-3xl font-extrabold text-ivory sm:text-4xl">{t('myBookings.title')}</h1>
                    <p className="mt-3 max-w-2xl leading-loose text-ivory/80">{t('myBookings.subtitle')}</p>
                </div>
            </section>

            <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
                {bookings.length === 0 ? (
                    <div className="rounded-3xl border-2 border-dashed border-gold/50 bg-white px-6 py-14 text-center">
                        <p className="font-display text-2xl font-extrabold text-lapis-deep">{t('myBookings.emptyTitle')}</p>
                        <p className="mx-auto mt-3 max-w-md leading-loose text-ink/65">{t('myBookings.emptyText')}</p>
                        <Link
                            href="/tours"
                            className="font-display mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink shadow-sm transition-colors hover:bg-gold-deep hover:text-ivory"
                        >
                            {t('myBookings.emptyCta')}
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {bookings.map((booking) => (
                            <BookingCard
                                key={booking.reference}
                                booking={booking}
                                onCancel={cancel}
                                cancelling={cancellingRef === booking.reference}
                            />
                        ))}
                    </div>
                )}
            </section>
        </AppLayout>
    );
}
