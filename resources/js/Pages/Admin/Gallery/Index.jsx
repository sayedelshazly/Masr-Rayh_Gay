import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useLocale } from '../../../i18n/LocaleContext';

export default function AdminGalleryIndex({ photos = [] }) {
    const { t } = useLocale();

    return (
        <AdminLayout>
            <Head title={t('admin.galleryAdmin.title')} />
            <div className="mb-6 flex items-baseline justify-between gap-4">
                <h1 className="font-display text-2xl font-bold text-ink-900">{t('admin.galleryAdmin.title')}</h1>
                <span className="text-sm text-ink-500">{photos.length}</span>
            </div>

            {photos.length === 0 ? (
                <div className="rounded-lg bg-white p-10 text-center text-sm text-ink-500 shadow-sm ring-1 ring-sand-300">
                    {t('admin.galleryAdmin.empty')}
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {photos.map((photo) => (
                        <div key={photo.id} className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-sand-300">
                            <div className="relative h-52">
                                <img src={photo.url} alt={photo.caption ?? ''} className="h-full w-full object-cover" />
                                <span className={`absolute start-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${photo.is_approved ? 'bg-teal-50 text-teal-700 ring-teal-200' : 'bg-gold-500/15 text-gold-deep ring-gold-500/40'}`}>
                                    {photo.is_approved ? t('admin.galleryAdmin.liveBadge') : t('admin.galleryAdmin.pendingBadge')}
                                </span>
                            </div>
                            <div className="p-4">
                                {photo.caption && <p className="text-sm font-medium leading-relaxed text-ink-900">{photo.caption}</p>}
                                <p className="mt-1.5 text-xs text-ink-500">{photo.traveller} · {photo.tour_title}</p>
                                <p className="mt-0.5 text-xs font-medium text-ink-500" dir="ltr">{photo.reference}</p>
                                <div className="mt-3 flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => router.patch(`/admin/gallery/${photo.id}/toggle`, {}, { preserveScroll: true })}
                                        className="rounded-md bg-nile-800 px-3 py-1.5 text-xs font-bold text-sand-100 transition hover:bg-nile-950"
                                    >
                                        {photo.is_approved ? t('admin.galleryAdmin.hide') : t('admin.galleryAdmin.approve')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (window.confirm(t('admin.galleryAdmin.delete') + '?')) {
                                                router.delete(`/admin/gallery/${photo.id}`, { preserveScroll: true });
                                            }
                                        }}
                                        className="rounded-md px-3 py-1.5 text-xs font-bold text-carnelian-600 transition hover:bg-red-50"
                                    >
                                        {t('admin.galleryAdmin.delete')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
