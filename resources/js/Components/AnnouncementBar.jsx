import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useLocale } from '../i18n/LocaleContext';

/**
 * The admin-managed announcement strip at the very top of the
 * site. Dismissing hides it for the session; editing the text
 * in the admin (new updated_at) brings it back for everyone.
 */
export default function AnnouncementBar() {
    const { announcement } = usePage().props;
    const { t, locale } = useLocale();
    const dismissKey = announcement ? `masr-announcement-${announcement.id}-${announcement.updated_at}` : null;
    const [dismissed, setDismissed] = useState(
        () => dismissKey !== null && window.sessionStorage.getItem(dismissKey) === '1',
    );

    if (!announcement || dismissed) {
        return null;
    }

    const text = locale === 'ar' ? announcement.text_ar : announcement.text_en || announcement.text_ar;

    const content = (
        <>
            <span aria-hidden="true" className="font-glyph text-base leading-none">𓂀</span>
            <span className="font-bold">{text}</span>
            {announcement.link && <span aria-hidden="true" className="font-bold">{locale === 'ar' ? '←' : '→'}</span>}
        </>
    );

    return (
        <div className="relative z-40 bg-gold-500 text-ink-900 shadow-[0_2px_16px_rgba(201,162,75,0.35)]">
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-10 py-2 text-center text-[13px]">
                {announcement.link ? (
                    <Link href={announcement.link} className="flex items-center gap-2 transition hover:opacity-75">
                        {content}
                    </Link>
                ) : (
                    <p className="flex items-center gap-2">{content}</p>
                )}
            </div>
            <button
                type="button"
                aria-label={t('hero.close')}
                onClick={() => {
                    window.sessionStorage.setItem(dismissKey, '1');
                    setDismissed(true);
                }}
                className="absolute end-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-xs font-bold transition hover:bg-ink-900/10"
            >
                ✕
            </button>
        </div>
    );
}
