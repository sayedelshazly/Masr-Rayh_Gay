import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { useLocale } from '../../i18n/LocaleContext';

const inputClass =
    'w-full rounded-sm border-0 bg-white px-3.5 py-2.5 text-ink-900 shadow-sm ring-1 ring-ink-900/15 placeholder:text-ink-500/60 focus:outline-none focus:ring-2 focus:ring-gold-500';

export default function Announcement({ announcement }) {
    const { t } = useLocale();
    const { data, setData, put, processing } = useForm({
        text_ar: announcement.text_ar ?? '',
        text_en: announcement.text_en ?? '',
        link: announcement.link ?? '',
        is_active: announcement.is_active ?? false,
    });

    const submit = (event) => {
        event.preventDefault();
        put('/admin/announcement');
    };

    return (
        <AdminLayout>
            <Head title={t('admin.announcement.title')} />

            <h1 className="font-display text-3xl text-ink-900">{t('admin.announcement.title')}</h1>
            <p className="mt-1 max-w-2xl text-sm text-ink-500">{t('admin.announcement.intro')}</p>

            <div className="mt-6 max-w-2xl rounded-md bg-white p-5 shadow ring-1 ring-ink-900/10">
                <p className="mb-2 text-xs font-bold text-ink-500">{t('admin.announcement.preview')}</p>
                {data.is_active && data.text_ar ? (
                    <div className="bg-gold-500 px-4 py-2 text-center text-[13px] font-bold text-ink-900">
                        𓂀 {data.text_ar} {data.link ? '←' : ''}
                    </div>
                ) : (
                    <div className="bg-sand-100 px-4 py-2 text-center text-[13px] text-ink-500 ring-1 ring-ink-900/10">
                        {t('admin.announcement.previewOff')}
                    </div>
                )}
            </div>

            <form onSubmit={submit} className="mt-4 max-w-2xl space-y-4 rounded-md bg-white p-5 shadow ring-1 ring-ink-900/10">
                <label className="flex cursor-pointer items-center gap-3 rounded-sm bg-gold-500/10 px-4 py-3 ring-1 ring-gold-500/30">
                    <input
                        type="checkbox"
                        checked={data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
                        className="h-5 w-5 accent-[#C9A24B]"
                    />
                    <span className="text-sm font-bold text-ink-900">{t('admin.announcement.active')}</span>
                </label>

                <div>
                    <label htmlFor="text_ar" className="mb-1.5 block text-sm font-bold text-ink-900">{t('admin.announcement.textAr')}</label>
                    <input id="text_ar" dir="rtl" value={data.text_ar} onChange={(e) => setData('text_ar', e.target.value)} className={inputClass} maxLength={180} placeholder="خصم ١٥٪ على رحلات سيوة الأسبوع ده" />
                </div>
                <div>
                    <label htmlFor="text_en" className="mb-1.5 block text-sm font-bold text-ink-900">{t('admin.announcement.textEn')}</label>
                    <input id="text_en" dir="ltr" value={data.text_en} onChange={(e) => setData('text_en', e.target.value)} className={inputClass} maxLength={180} placeholder="15% off Siwa trips this week" />
                </div>
                <div>
                    <label htmlFor="link" className="mb-1.5 block text-sm font-bold text-ink-900">{t('admin.announcement.link')}</label>
                    <input id="link" dir="ltr" value={data.link ?? ''} onChange={(e) => setData('link', e.target.value)} className={inputClass} placeholder="/tours" />
                    <p className="mt-1 text-xs text-ink-500">{t('admin.announcement.linkHint')}</p>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-sm bg-gold-500 px-6 py-2.5 text-sm font-bold text-ink-900 shadow transition hover:bg-gold-300 disabled:opacity-60"
                >
                    {t('admin.announcement.save')}
                </button>
            </form>
        </AdminLayout>
    );
}
