import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { DurationLabel } from '../../Components/TourCard';
import { useLocale } from '../../i18n/LocaleContext';
import { formatPrice, localized } from '../../lib/format';

const STATUS_STYLES = {
    pending: 'bg-gold/20 text-gold-deep ring-gold/50',
    confirmed: 'bg-turquoise-600/15 text-ink ring-turquoise-600/50',
    cancelled: 'bg-carnelian-600/10 text-carnelian-600 ring-carnelian-600/40',
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

function DetailRow({ label, children }) {
    return (
        <div className="flex flex-wrap items-baseline justify-between gap-2 py-3">
            <span className="text-sm font-medium text-ink/55">{label}</span>
            <span className="font-display text-base font-bold text-ink">{children}</span>
        </div>
    );
}

export default function BookingShow({ booking }) {
    const { t, locale } = useLocale();
    const tour = booking.tour ?? {};
    const destination = tour.destination ?? {};
    const statusStyle = STATUS_STYLES[booking.status] ?? STATUS_STYLES.pending;

    const guests = [
        `${booking.adults} ${t('booking.adults')}`,
        booking.children > 0 ? `${booking.children} ${t('booking.children')}` : null,
    ]
        .filter(Boolean)
        .join(' · ');

    return (
        <AppLayout>
            <Head title={t('booking.confirmationMetaTitle')} />

            <section className="bg-gradient-to-b from-sand via-ivory to-ivory">
                <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
                    <span
                        aria-hidden="true"
                        className="font-display mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold text-4xl font-extrabold text-ink shadow-lg shadow-gold/30"
                    >
                        ✓
                    </span>
                    <h1 className="font-display mt-6 text-3xl font-extrabold leading-snug text-lapis-deep sm:text-4xl">
                        {t('booking.successTitle')}
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl leading-loose text-ink/70">{t('booking.successText')}</p>
                </div>
            </section>

            <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
                {/* Reference card */}
                <div className="rounded-3xl border-2 border-dashed border-gold/60 bg-white px-6 py-7 text-center shadow-sm">
                    <p className="text-sm font-semibold text-ink/55">{t('booking.reference')}</p>
                    <p className="font-display mt-2 text-4xl font-extrabold tracking-[0.2em] text-gold-deep sm:text-5xl">
                        {booking.reference}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-ink/50">{t('booking.referenceHint')}</p>
                    <span className={`mt-4 inline-block rounded-full px-4 py-1.5 text-sm font-bold ring-1 ${statusStyle}`}>
                        {t('booking.status')}: {t(`booking.statuses.${booking.status}`)}
                    </span>
                </div>

                {/* Booking details */}
                <div className="mt-6 rounded-3xl bg-white px-6 py-3 shadow-sm ring-1 ring-sand sm:px-8">
                    <DetailRow label={t('booking.tourLabel')}>
                        <Link href={`/tours/${tour.slug}`} className="text-lapis transition-colors hover:text-gold-deep">
                            {localized(tour, 'title', locale)}
                        </Link>
                    </DetailRow>
                    <div className="border-t border-sand" />
                    <DetailRow label={localized(destination, 'name', locale) || t('booking.tourLabel')}>
                        <span aria-hidden="true" className="me-2">{destination.glyph ?? '𓂀'}</span>
                        <DurationLabel tour={tour} />
                    </DetailRow>
                    <div className="border-t border-sand" />
                    <DetailRow label={t('booking.dateLabel')}>{formatDate(booking.travel_date, locale)}</DetailRow>
                    <div className="border-t border-sand" />
                    <DetailRow label={t('booking.guestsLine')}>{guests}</DetailRow>
                    <div className="border-t border-sand" />
                    <DetailRow label={t('booking.customerLabel')}>{booking.customer_name}</DetailRow>
                    <div className="border-t border-sand" />
                    <DetailRow label={t('booking.totalLabel')}>
                        <span className="text-2xl font-extrabold text-gold-deep">
                            {formatPrice(booking.total_price, locale)}{' '}
                            <span className="text-sm font-semibold text-ink/70">{t('common.currency')}</span>
                        </span>
                    </DetailRow>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link
                        href="/tours"
                        className="font-display rounded-full bg-gold px-6 py-3 font-bold text-ink transition-colors hover:bg-gold-deep hover:text-ivory"
                    >
                        {t('booking.browseTours')}
                    </Link>
                    <Link
                        href={`/tours/${tour.slug}`}
                        className="font-display rounded-full bg-white px-6 py-3 font-bold text-lapis ring-1 ring-sand transition-colors hover:text-gold-deep"
                    >
                        {t('booking.backToTour')}
                    </Link>
                </div>
            </section>
        </AppLayout>
    );
}
