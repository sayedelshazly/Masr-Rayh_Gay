import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useLocale } from '../../../i18n/LocaleContext';

const inputCls =
    'w-full rounded-lg border border-sand bg-ivory px-3 py-2 text-sm outline-none focus:border-gold';
const labelCls = 'mb-1 block text-xs font-bold text-ink/55';

function Field({ label, error, children }) {
    return (
        <label className="block">
            <span className={labelCls}>{label}</span>
            {children}
            {error && <span className="mt-1 block text-xs font-bold text-carnelian-600">{error}</span>}
        </label>
    );
}

export default function Edit({ destination }) {
    const { t } = useLocale();

    const { data, setData, put, processing, errors } = useForm({
        slug: destination.slug ?? '',
        name_ar: destination.name_ar ?? '',
        name_en: destination.name_en ?? '',
        tagline_ar: destination.tagline_ar ?? '',
        tagline_en: destination.tagline_en ?? '',
        description_ar: destination.description_ar ?? '',
        description_en: destination.description_en ?? '',
        region: destination.region ?? '',
        gradient: destination.gradient ?? '',
        glyph: destination.glyph ?? '',
        image: destination.image ?? '',
        sort_order: destination.sort_order ?? 0,
        is_featured: destination.is_featured ?? false,
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/destinations/${destination.slug}`);
    };

    return (
        <AdminLayout title={`${t('admin.editDestination')} — ${destination.name_en}`}>
            <Head title={t('admin.editDestination')} />

            <form onSubmit={submit} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sand">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label={t('admin.fields.nameAr')} error={errors.name_ar}>
                        <input value={data.name_ar} onChange={(e) => setData('name_ar', e.target.value)} className={inputCls} required />
                    </Field>
                    <Field label={t('admin.fields.nameEn')} error={errors.name_en}>
                        <input value={data.name_en} onChange={(e) => setData('name_en', e.target.value)} className={inputCls} dir="ltr" required />
                    </Field>
                    <Field label={t('admin.fields.slug')} error={errors.slug}>
                        <input value={data.slug} onChange={(e) => setData('slug', e.target.value)} className={inputCls} dir="ltr" required />
                    </Field>
                    <Field label={t('admin.fields.region')} error={errors.region}>
                        <input value={data.region} onChange={(e) => setData('region', e.target.value)} className={inputCls} dir="ltr" required />
                    </Field>
                    <Field label={t('admin.fields.taglineAr')} error={errors.tagline_ar}>
                        <input value={data.tagline_ar} onChange={(e) => setData('tagline_ar', e.target.value)} className={inputCls} />
                    </Field>
                    <Field label={t('admin.fields.taglineEn')} error={errors.tagline_en}>
                        <input value={data.tagline_en} onChange={(e) => setData('tagline_en', e.target.value)} className={inputCls} dir="ltr" />
                    </Field>
                    <Field label={t('admin.fields.descriptionAr')} error={errors.description_ar}>
                        <textarea rows={4} value={data.description_ar} onChange={(e) => setData('description_ar', e.target.value)} className={inputCls} />
                    </Field>
                    <Field label={t('admin.fields.descriptionEn')} error={errors.description_en}>
                        <textarea rows={4} value={data.description_en} onChange={(e) => setData('description_en', e.target.value)} className={inputCls} dir="ltr" />
                    </Field>
                    <Field label={t('admin.fields.gradient')} error={errors.gradient}>
                        <input value={data.gradient} onChange={(e) => setData('gradient', e.target.value)} className={inputCls} dir="ltr" />
                    </Field>
                    <Field label={t('admin.fields.image')} error={errors.image}>
                        <input value={data.image} onChange={(e) => setData('image', e.target.value)} className={inputCls} dir="ltr" placeholder="/images/destinations/…" />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label={t('admin.fields.glyph')} error={errors.glyph}>
                            <input value={data.glyph} onChange={(e) => setData('glyph', e.target.value)} className={inputCls} />
                        </Field>
                        <Field label={t('admin.fields.sortOrder')} error={errors.sort_order}>
                            <input type="number" min="0" value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} className={inputCls} />
                        </Field>
                    </div>
                </div>

                <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                        type="checkbox"
                        checked={data.is_featured}
                        onChange={(e) => setData('is_featured', e.target.checked)}
                        className="h-4 w-4 accent-gold-deep"
                    />
                    {t('admin.fields.isFeatured')}
                </label>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-gold-deep hover:text-ivory disabled:opacity-50"
                    >
                        {t('admin.save')}
                    </button>
                    <a href="/admin/destinations" className="rounded-full px-5 py-2.5 text-sm font-bold text-ink/60 ring-1 ring-sand transition-colors hover:bg-sand">
                        {t('admin.cancel')}
                    </a>
                </div>
            </form>
        </AdminLayout>
    );
}
