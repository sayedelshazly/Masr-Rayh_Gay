import { useForm } from '@inertiajs/react';
import { useLocale } from '../../../i18n/LocaleContext';
import { localized } from '../../../lib/format';

const inputCls =
    'w-full rounded-lg border border-sand bg-ivory px-3 py-2 text-sm outline-none focus:border-gold';
const labelCls = 'mb-1 block text-xs font-bold text-ink/55';

function Field({ label, error, children, hint }) {
    return (
        <label className="block">
            <span className={labelCls}>{label}</span>
            {children}
            {hint && <span className="mt-1 block text-xs text-ink/45">{hint}</span>}
            {error && <span className="mt-1 block text-xs font-bold text-carnelian-600">{error}</span>}
        </label>
    );
}

/** Shared create/edit form for tours. Includes are edited one-per-line. */
export default function TourForm({ tour = null, destinations, types }) {
    const { t, locale } = useLocale();
    const isEdit = Boolean(tour);

    const { data, setData, post, put, processing, errors } = useForm({
        destination_id: tour?.destination_id ?? '',
        slug: tour?.slug ?? '',
        image: tour?.image ?? '',
        title_ar: tour?.title_ar ?? '',
        title_en: tour?.title_en ?? '',
        summary_ar: tour?.summary_ar ?? '',
        summary_en: tour?.summary_en ?? '',
        description_ar: tour?.description_ar ?? '',
        description_en: tour?.description_en ?? '',
        duration_days: tour?.duration_days ?? 1,
        duration_nights: tour?.duration_nights ?? '',
        price: tour?.price ?? '',
        old_price: tour?.old_price ?? '',
        type: tour?.type ?? 'cultural',
        rating: tour?.rating ?? '',
        reviews_count: tour?.reviews_count ?? 0,
        includes_ar: (tour?.includes_ar ?? []).join('\n'),
        includes_en: (tour?.includes_en ?? []).join('\n'),
        meeting_point_ar: tour?.meeting_point_ar ?? '',
        meeting_point_en: tour?.meeting_point_en ?? '',
        is_featured: tour?.is_featured ?? false,
        is_active: tour?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/tours/${tour.slug}`);
        } else {
            post('/admin/tours');
        }
    };

    return (
        <form onSubmit={submit} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sand">
            <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t('admin.fields.destination')} error={errors.destination_id}>
                    <select
                        value={data.destination_id}
                        onChange={(e) => setData('destination_id', e.target.value)}
                        className={inputCls}
                        required
                    >
                        <option value="">—</option>
                        {destinations.map((d) => (
                            <option key={d.id} value={d.id}>
                                {localized(d, 'name', locale)}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label={t('admin.fields.slug')} error={errors.slug} hint={t('admin.fields.slugHint')}>
                    <input value={data.slug} onChange={(e) => setData('slug', e.target.value)} className={inputCls} dir="ltr" />
                </Field>
                <Field label={t('admin.fields.image')} error={errors.image}>
                    <input value={data.image} onChange={(e) => setData('image', e.target.value)} className={inputCls} dir="ltr" placeholder="/images/tours/…" />
                </Field>
                <Field label={t('admin.fields.titleAr')} error={errors.title_ar}>
                    <input value={data.title_ar} onChange={(e) => setData('title_ar', e.target.value)} className={inputCls} required />
                </Field>
                <Field label={t('admin.fields.titleEn')} error={errors.title_en}>
                    <input value={data.title_en} onChange={(e) => setData('title_en', e.target.value)} className={inputCls} dir="ltr" required />
                </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t('admin.fields.summaryAr')} error={errors.summary_ar}>
                    <textarea rows={2} value={data.summary_ar} onChange={(e) => setData('summary_ar', e.target.value)} className={inputCls} />
                </Field>
                <Field label={t('admin.fields.summaryEn')} error={errors.summary_en}>
                    <textarea rows={2} value={data.summary_en} onChange={(e) => setData('summary_en', e.target.value)} className={inputCls} dir="ltr" />
                </Field>
                <Field label={t('admin.fields.descriptionAr')} error={errors.description_ar}>
                    <textarea rows={5} value={data.description_ar} onChange={(e) => setData('description_ar', e.target.value)} className={inputCls} />
                </Field>
                <Field label={t('admin.fields.descriptionEn')} error={errors.description_en}>
                    <textarea rows={5} value={data.description_en} onChange={(e) => setData('description_en', e.target.value)} className={inputCls} dir="ltr" />
                </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <Field label={t('admin.fields.durationDays')} error={errors.duration_days}>
                    <input type="number" min="1" value={data.duration_days} onChange={(e) => setData('duration_days', e.target.value)} className={inputCls} required />
                </Field>
                <Field label={t('admin.fields.durationNights')} error={errors.duration_nights}>
                    <input type="number" min="0" value={data.duration_nights} onChange={(e) => setData('duration_nights', e.target.value)} className={inputCls} />
                </Field>
                <Field label={t('admin.fields.price')} error={errors.price}>
                    <input type="number" min="0" step="0.01" value={data.price} onChange={(e) => setData('price', e.target.value)} className={inputCls} required />
                </Field>
                <Field label={t('admin.fields.oldPrice')} error={errors.old_price}>
                    <input type="number" min="0" step="0.01" value={data.old_price} onChange={(e) => setData('old_price', e.target.value)} className={inputCls} />
                </Field>
                <Field label={t('admin.fields.type')} error={errors.type}>
                    <select value={data.type} onChange={(e) => setData('type', e.target.value)} className={inputCls}>
                        {types.map((type) => (
                            <option key={type} value={type}>
                                {t(`tours.types.${type}`)}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label={t('admin.fields.rating')} error={errors.rating}>
                    <input type="number" min="0" max="5" step="0.1" value={data.rating} onChange={(e) => setData('rating', e.target.value)} className={inputCls} />
                </Field>
                <Field label={t('admin.fields.reviewsCount')} error={errors.reviews_count}>
                    <input type="number" min="0" value={data.reviews_count} onChange={(e) => setData('reviews_count', e.target.value)} className={inputCls} />
                </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t('admin.fields.includesAr')} error={errors.includes_ar}>
                    <textarea rows={4} value={data.includes_ar} onChange={(e) => setData('includes_ar', e.target.value)} className={inputCls} />
                </Field>
                <Field label={t('admin.fields.includesEn')} error={errors.includes_en}>
                    <textarea rows={4} value={data.includes_en} onChange={(e) => setData('includes_en', e.target.value)} className={inputCls} dir="ltr" />
                </Field>
                <Field label={t('admin.fields.meetingPointAr')} error={errors.meeting_point_ar}>
                    <input value={data.meeting_point_ar} onChange={(e) => setData('meeting_point_ar', e.target.value)} className={inputCls} />
                </Field>
                <Field label={t('admin.fields.meetingPointEn')} error={errors.meeting_point_en}>
                    <input value={data.meeting_point_en} onChange={(e) => setData('meeting_point_en', e.target.value)} className={inputCls} dir="ltr" />
                </Field>
            </div>

            <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm font-medium">
                    <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="h-4 w-4 accent-gold-deep" />
                    {t('admin.fields.isActive')}
                </label>
                <label className="flex items-center gap-2 text-sm font-medium">
                    <input type="checkbox" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} className="h-4 w-4 accent-gold-deep" />
                    {t('admin.fields.isFeatured')}
                </label>
            </div>

            <p className="text-xs text-ink/50">{t('admin.itineraryNote')}</p>

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-gold-deep hover:text-ivory disabled:opacity-50"
                >
                    {isEdit ? t('admin.save') : t('admin.createTour')}
                </button>
                <a href="/admin/tours" className="rounded-full px-5 py-2.5 text-sm font-bold text-ink/60 ring-1 ring-sand transition-colors hover:bg-sand">
                    {t('admin.cancel')}
                </a>
            </div>
        </form>
    );
}
