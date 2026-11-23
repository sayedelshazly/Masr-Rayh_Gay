import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Reveal from '../../Components/Reveal';
import { useLocale } from '../../i18n/LocaleContext';
import { formatPrice, localized } from '../../lib/format';

const STATUS_STYLES = {
    pending: 'bg-gold-500/15 text-gold-300 ring-gold-500/40',
    confirmed: 'bg-teal-400/10 text-teal-300 ring-teal-400/40',
    cancelled: 'bg-red-400/10 text-red-300 ring-red-400/40',
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
        <article className="rounded-lg bg-nile-950/70 p-6 shadow-lg shadow-black/25 ring-1 ring-white/10 backdrop-blur sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <Link
                        href={`/tours/${tour.slug}`}
                        className="font-display text-lg font-bold text-sand-100 transition-colors hover:text-gold-300"
                    >
                        {localized(tour, 'title', locale)}
                    </Link>
                    <p className="mt-1 text-sm font-medium text-sand-100/55">
                        {t('myBookings.destination')}: {localized(destination, 'name', locale)}
                    </p>
                </div>
                <span className={`inline-block rounded-full px-3.5 py-1.5 text-xs font-bold ring-1 ${statusStyle}`}>
                    {t(`booking.statuses.${booking.status}`)}
                </span>
            </div>

            <dl className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                <div className="flex items-baseline justify-between gap-2 sm:block">
                    <dt className="font-medium text-sand-100/60">{t('booking.reference')}</dt>
                    <dd className="font-display mt-0.5 font-bold tracking-wider text-gold-300">{booking.reference}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-2 sm:block">
                    <dt className="font-medium text-sand-100/60">{t('booking.dateLabel')}</dt>
                    <dd className="mt-0.5 font-bold text-sand-100">{formatDate(booking.travel_date, locale)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-2 sm:block">
                    <dt className="font-medium text-sand-100/60">{t('myBookings.guests')}</dt>
                    <dd className="mt-0.5 font-bold text-sand-100">{guests}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-2 sm:block">
                    <dt className="font-medium text-sand-100/60">{t('booking.total')}</dt>
                    <dd className="mt-0.5 font-bold text-sand-100">
                        {formatPrice(booking.total_price, locale)} {t('common.currency')}
                    </dd>
                </div>
            </dl>

            {cancellable && (
                <div className="mt-5 border-t border-white/10 pt-4 text-end">
                    <button
                        type="button"
                        disabled={cancelling}
                        onClick={() => onCancel(booking)}
                        className="rounded-full border border-red-400/40 px-4 py-2 text-xs font-bold text-red-300 transition-colors hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-60"
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

            <section className="border-b border-white/10">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                    <Reveal>
                        <h1 className="font-display text-3xl font-extrabold text-sand-100 sm:text-4xl">{t('myBookings.title')}</h1>
                        <p className="mt-3 max-w-2xl leading-loose text-sand-100/75">{t('myBookings.subtitle')}</p>
                    </Reveal>
                </div>
            </section>

            <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
                {bookings.length === 0 ? (
                    <Reveal>
                        <div className="rounded-lg border-2 border-dashed border-gold-500/40 bg-nile-950/70 px-6 py-14 text-center backdrop-blur">
                            <p className="font-display text-2xl font-extrabold text-sand-100">{t('myBookings.emptyTitle')}</p>
                            <p className="mx-auto mt-3 max-w-md leading-loose text-sand-100/70">{t('myBookings.emptyText')}</p>
                            <Link
                                href="/tours"
                                className="font-display mt-6 inline-block rounded-md bg-gold-500 px-6 py-3 text-sm font-bold text-ink-900 shadow-sm transition-colors hover:bg-gold-300"
                            >
                                {t('myBookings.emptyCta')}
                            </Link>
                        </div>
                    </Reveal>
                ) : (
                    <Reveal>
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
                    </Reveal>
                )}
            </section>
        </AppLayout>
    );
}
