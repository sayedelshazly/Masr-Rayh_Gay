import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Reveal from '../../Components/Reveal';
import { DurationLabel } from '../../Components/TourCard';
import { useLocale } from '../../i18n/LocaleContext';
import { formatPrice, formatTimeLabel, localized } from '../../lib/format';

const STATUS_STYLES = {
    pending: 'bg-gold-500/15 text-gold-300 ring-gold-500/40',
    confirmed: 'bg-teal-400/10 text-teal-300 ring-teal-400/40',
    cancelled: 'bg-red-400/10 text-red-300 ring-red-400/40',
    expired: 'bg-white/5 text-sand-100/50 ring-white/15',
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
            <span className="text-sm font-medium text-sand-100/60">{label}</span>
            <span className="font-display text-base font-bold text-sand-100">{children}</span>
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
        <AppLayout backdrop={tour.image ?? undefined}>
            <Head title={t('booking.confirmationMetaTitle')} />

            <section>
                <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
                    <Reveal>
                        <span
                            aria-hidden="true"
                            className="font-display mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold-500 text-4xl font-extrabold text-ink-900 shadow-lg shadow-gold-500/30"
                        >
                            ✓
                        </span>
                        <h1 className="font-display mt-6 text-3xl font-extrabold leading-snug text-sand-100 sm:text-4xl">
                            {t('booking.successTitle')}
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl leading-loose text-sand-100/75">{t('booking.successText')}</p>
                    </Reveal>
                </div>
            </section>

            <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
                <Reveal>
                {/* Reference card */}
                <div className="rounded-lg border-2 border-dashed border-gold-500/50 bg-nile-950/70 px-6 py-7 text-center shadow-lg shadow-black/25 backdrop-blur">
                    <p className="text-sm font-semibold text-sand-100/55">{t('booking.reference')}</p>
                    <p className="font-display mt-2 text-4xl font-extrabold tracking-[0.2em] text-gold-300 sm:text-5xl">
                        {booking.reference}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-sand-100/55">{t('booking.referenceHint')}</p>
                    <span className={`mt-4 inline-block rounded-full px-4 py-1.5 text-sm font-bold ring-1 ${statusStyle}`}>
                        {t('booking.status')}: {t(`booking.statuses.${booking.status}`)}
                    </span>
                </div>

                {/* Booking details */}
                <div className="mt-6 rounded-lg bg-nile-950/70 px-6 py-3 shadow-lg shadow-black/25 ring-1 ring-white/10 backdrop-blur sm:px-8">
                    <DetailRow label={t('booking.tourLabel')}>
                        <Link href={`/tours/${tour.slug}`} className="text-gold-300 transition-colors hover:text-gold-500">
                            {localized(tour, 'title', locale)}
                        </Link>
                    </DetailRow>
                    <div className="border-t border-white/10" />
                    <DetailRow label={localized(destination, 'name', locale) || t('booking.tourLabel')}>
                        <span aria-hidden="true" className="me-2">{destination.glyph ?? '𓂀'}</span>
                        <DurationLabel tour={tour} />
                    </DetailRow>
                    <div className="border-t border-white/10" />
                    <DetailRow label={t('booking.dateLabel')}>
                        {formatDate(booking.travel_date, locale)}
                        {booking.departure?.time ? ` · ${formatTimeLabel(String(booking.departure.time).slice(0, 5), locale)}` : ''}
                    </DetailRow>
                    <div className="border-t border-white/10" />
                    <DetailRow label={t('booking.guestsLine')}>{guests}</DetailRow>
                    <div className="border-t border-white/10" />
                    <DetailRow label={t('booking.customerLabel')}>{booking.customer_name}</DetailRow>
                    <div className="border-t border-white/10" />
                    <DetailRow label={t('booking.totalLabel')}>
                        <span className="font-display text-2xl font-extrabold text-gold-300">
                            {formatPrice(booking.total_price, locale)}{' '}
                            <span className="text-sm font-semibold text-sand-100/60">{t('common.currency')}</span>
                        </span>
                    </DetailRow>
                </div>
                </Reveal>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link
                        href="/tours"
                        className="font-display rounded-md bg-gold-500 px-6 py-3 font-bold text-ink-900 transition-colors hover:bg-gold-300"
                    >
                        {t('booking.browseTours')}
                    </Link>
                    <Link
                        href={`/tours/${tour.slug}`}
                        className="font-display rounded-md border border-gold-500 bg-transparent px-6 py-3 font-bold text-gold-300 ring-1 ring-white/10 backdrop-blur transition-colors hover:bg-gold-500/10"
                    >
                        {t('booking.backToTour')}
                    </Link>
                </div>
            </section>
        </AppLayout>
    );
}
