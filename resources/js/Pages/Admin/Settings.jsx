import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { useLocale } from '../../i18n/LocaleContext';

function Toggle({ label, checked, onChange }) {
    return (
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-md bg-sand-100/60 px-4 py-3 ring-1 ring-sand-300">
            <span className="text-sm font-bold text-ink-900">{label}</span>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-turquoise-600' : 'bg-ink-500/30'}`}
            >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'start-[22px]' : 'start-0.5'}`} />
            </button>
        </label>
    );
}

export default function AdminSettings({ settings }) {
    const { t } = useLocale();
    const form = useForm({
        whatsapp_number: settings.whatsapp_number ?? '',
        contact_email: settings.contact_email ?? '',
        hold_minutes: settings.hold_minutes ?? 15,
        reviews_enabled: !!settings.reviews_enabled,
        photos_enabled: !!settings.photos_enabled,
        film_enabled: !!settings.film_enabled,
        plan_enabled: !!settings.plan_enabled,
    });

    const submit = (event) => {
        event.preventDefault();
        form.put('/admin/settings', { preserveScroll: true });
    };

    const inputCls = 'mt-1.5 w-full rounded-md border border-sand-300 bg-white px-3.5 py-2.5 text-sm font-medium text-ink-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-gold-500';

    return (
        <AdminLayout>
            <Head title={t('admin.settingsAdmin.title')} />
            <div className="max-w-2xl">
                <h1 className="font-display text-2xl font-bold text-ink-900">{t('admin.settingsAdmin.title')}</h1>
                <p className="mt-1 text-sm text-ink-500">{t('admin.settingsAdmin.subtitle')}</p>

                <form onSubmit={submit} className="mt-6 space-y-6">
                    <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-sand-300">
                        <div>
                            <label htmlFor="whatsapp_number" className="text-sm font-bold text-ink-900">{t('admin.settingsAdmin.whatsapp')}</label>
                            <input id="whatsapp_number" dir="ltr" className={inputCls} value={form.data.whatsapp_number} onChange={(e) => form.setData('whatsapp_number', e.target.value)} placeholder="+20 109 968 7091" />
                            <p className="mt-1 text-xs text-ink-500">{t('admin.settingsAdmin.whatsappHint')}</p>
                            {form.errors.whatsapp_number && <p className="mt-1 text-xs font-medium text-carnelian-600">{form.errors.whatsapp_number}</p>}
                        </div>
                        <div className="mt-4">
                            <label htmlFor="contact_email" className="text-sm font-bold text-ink-900">{t('admin.settingsAdmin.email')}</label>
                            <input id="contact_email" dir="ltr" type="email" className={inputCls} value={form.data.contact_email} onChange={(e) => form.setData('contact_email', e.target.value)} placeholder="hello@example.com" />
                            <p className="mt-1 text-xs text-ink-500">{t('admin.settingsAdmin.emailHint')}</p>
                            {form.errors.contact_email && <p className="mt-1 text-xs font-medium text-carnelian-600">{form.errors.contact_email}</p>}
                        </div>
                        <div className="mt-4">
                            <label htmlFor="hold_minutes" className="text-sm font-bold text-ink-900">{t('admin.settingsAdmin.holdMinutes')}</label>
                            <input id="hold_minutes" type="number" min="5" max="120" className={`${inputCls} w-32`} value={form.data.hold_minutes} onChange={(e) => form.setData('hold_minutes', e.target.value)} />
                            <p className="mt-1 text-xs text-ink-500">{t('admin.settingsAdmin.holdHint')}</p>
                            {form.errors.hold_minutes && <p className="mt-1 text-xs font-medium text-carnelian-600">{form.errors.hold_minutes}</p>}
                        </div>
                    </section>

                    <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-sand-300">
                        <h2 className="mb-3 text-sm font-bold text-ink-900">{t('admin.settingsAdmin.featuresTitle')}</h2>
                        <div className="space-y-2.5">
                            <Toggle label={t('admin.settingsAdmin.reviews')} checked={form.data.reviews_enabled} onChange={(v) => form.setData('reviews_enabled', v)} />
                            <Toggle label={t('admin.settingsAdmin.photos')} checked={form.data.photos_enabled} onChange={(v) => form.setData('photos_enabled', v)} />
                            <Toggle label={t('admin.settingsAdmin.film')} checked={form.data.film_enabled} onChange={(v) => form.setData('film_enabled', v)} />
                            <Toggle label={t('admin.settingsAdmin.plan')} checked={form.data.plan_enabled} onChange={(v) => form.setData('plan_enabled', v)} />
                        </div>
                    </section>

                    <div className="flex items-center gap-3">
                        <button type="submit" disabled={form.processing} className="rounded-md bg-nile-800 px-6 py-2.5 text-sm font-bold text-sand-100 transition hover:bg-nile-950 disabled:opacity-60">
                            {t('admin.settingsAdmin.save')}
                        </button>
                        {form.recentlySuccessful && <span className="text-sm font-bold text-turquoise-600">{t('admin.settingsAdmin.saved')}</span>}
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
