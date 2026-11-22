import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useLocale } from '../../../i18n/LocaleContext';
import { formatPrice, localized } from '../../../lib/format';

function Toggle({ tour, field, onLabel, offLabel }) {
    const active = Boolean(tour[field]);
    return (
        <button
            type="button"
            onClick={() => router.patch(`/admin/tours/${tour.slug}/toggle`, { field }, { preserveScroll: true })}
            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 transition-colors ${
                active
                    ? 'bg-turquoise-600/15 text-ink ring-turquoise-600/50'
                    : 'bg-ink/5 text-ink/50 ring-ink/15 hover:bg-sand'
            }`}
        >
            {active ? onLabel : offLabel}
        </button>
    );
}

export default function Index({ tours }) {
    const { t, locale } = useLocale();

    const remove = (tour) => {
        if (window.confirm(t('admin.deleteTourConfirm'))) {
            router.delete(`/admin/tours/${tour.slug}`);
        }
    };

    return (
        <AdminLayout title={t('admin.toursTitle')}>
            <Head title={t('admin.toursTitle')} />

            <div className="mb-4 flex justify-end">
                <Link
                    href="/admin/tours/create"
                    className="rounded-full bg-gold px-5 py-2 text-sm font-bold text-ink transition-colors hover:bg-gold-deep hover:text-ivory"
                >
                    + {t('admin.newTour')}
                </Link>
            </div>

            <section className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-sand">
                <table className="w-full min-w-[760px] text-sm">
                    <thead>
                        <tr className="border-b border-sand text-xs uppercase tracking-wide text-ink/50">
                            <th className="px-4 py-3 text-start font-bold">{t('admin.table.tour')}</th>
                            <th className="px-4 py-3 text-start font-bold">{t('admin.fields.destination')}</th>
                            <th className="px-4 py-3 text-start font-bold">{t('admin.fields.price')}</th>
                            <th className="px-4 py-3 text-start font-bold">{t('admin.active')}</th>
                            <th className="px-4 py-3 text-start font-bold">{t('admin.featured')}</th>
                            <th className="px-4 py-3 text-start font-bold">{t('admin.table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tours.map((tour) => (
                            <tr key={tour.id} className="border-b border-sand/70 last:border-0 hover:bg-sand/40">
                                <td className="max-w-64 px-4 py-3">
                                    <span className="block truncate font-medium">{localized(tour, 'title', locale)}</span>
                                    <span className="block font-mono text-xs text-ink/45" dir="ltr">
                                        {tour.slug}
                                    </span>
                                </td>
                                <td className="px-4 py-3">{localized(tour.destination, 'name', locale)}</td>
                                <td className="whitespace-nowrap px-4 py-3 font-bold">
                                    {formatPrice(tour.price, locale)} {t('common.currency')}
                                </td>
                                <td className="px-4 py-3">
                                    <Toggle tour={tour} field="is_active" onLabel={t('admin.active')} offLabel={t('admin.inactive')} />
                                </td>
                                <td className="px-4 py-3">
                                    <Toggle tour={tour} field="is_featured" onLabel={t('admin.featured')} offLabel={t('admin.notFeatured')} />
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <Link
                                        href={`/admin/tours/${tour.slug}/edit`}
                                        className="font-bold text-lapis hover:text-gold-deep"
                                    >
                                        {t('admin.table.edit')}
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => remove(tour)}
                                        className="ms-4 font-bold text-carnelian-600 hover:text-carnelian-600"
                                    >
                                        {t('admin.table.delete')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <p className="mt-4 text-xs text-ink/50">{t('admin.itineraryNote')}</p>
        </AdminLayout>
    );
}
