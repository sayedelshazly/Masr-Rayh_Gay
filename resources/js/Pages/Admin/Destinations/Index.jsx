import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useLocale } from '../../../i18n/LocaleContext';
import { localized } from '../../../lib/format';

export default function Index({ destinations }) {
    const { t, locale } = useLocale();

    return (
        <AdminLayout title={t('admin.destinationsTitle')}>
            <Head title={t('admin.destinationsTitle')} />

            <section className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-sand">
                <table className="w-full min-w-[640px] text-sm">
                    <thead>
                        <tr className="border-b border-sand text-xs uppercase tracking-wide text-ink/50">
                            <th className="px-4 py-3 text-start font-bold">{t('admin.fields.nameAr')} / EN</th>
                            <th className="px-4 py-3 text-start font-bold">{t('admin.fields.region')}</th>
                            <th className="px-4 py-3 text-start font-bold">{t('admin.toursTitle')}</th>
                            <th className="px-4 py-3 text-start font-bold">{t('admin.featured')}</th>
                            <th className="px-4 py-3 text-start font-bold">{t('admin.fields.sortOrder')}</th>
                            <th className="px-4 py-3 text-start font-bold">{t('admin.table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {destinations.map((destination) => (
                            <tr key={destination.id} className="border-b border-sand/70 last:border-0 hover:bg-sand/40">
                                <td className="px-4 py-3">
                                    <span className="me-2 text-lg text-gold-deep">{destination.glyph}</span>
                                    <span className="font-medium">{localized(destination, 'name', locale)}</span>
                                    <span className="block font-mono text-xs text-ink/45" dir="ltr">
                                        {destination.slug}
                                    </span>
                                </td>
                                <td className="px-4 py-3">{destination.region}</td>
                                <td className="px-4 py-3">
                                    {destination.tours_count} {t('admin.toursCount')}
                                </td>
                                <td className="px-4 py-3">{destination.is_featured ? t('admin.featured') : t('admin.notFeatured')}</td>
                                <td className="px-4 py-3">{destination.sort_order}</td>
                                <td className="px-4 py-3">
                                    <Link
                                        href={`/admin/destinations/${destination.slug}/edit`}
                                        className="font-bold text-lapis hover:text-gold-deep"
                                    >
                                        {t('admin.table.edit')}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </AdminLayout>
    );
}
