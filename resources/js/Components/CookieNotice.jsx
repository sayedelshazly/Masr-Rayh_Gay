import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { useLocale } from '../i18n/LocaleContext';

const SEEN_KEY = 'masr-cookie-notice-seen';

/**
 * A one-time slim notice: the site uses essential cookies only.
 * Stored in localStorage so it appears once per browser.
 */
export default function CookieNotice() {
    const { t } = useLocale();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let seen = '1';
        try {
            seen = window.localStorage.getItem(SEEN_KEY) ?? '';
        } catch {
            seen = '1';
        }
        if (!seen) {
            const id = setTimeout(() => setVisible(true), 1600);
            return () => clearTimeout(id);
        }
        return undefined;
    }, []);

    if (!visible) {
        return null;
    }

    const dismiss = () => {
        try {
            window.localStorage.setItem(SEEN_KEY, '1');
        } catch {
            // storage unavailable — dismiss for this view only
        }
        setVisible(false);
    };

    return (
        <div className="animate-popup-in fixed inset-x-0 bottom-0 z-40 border-t border-gold-500/25 bg-nile-950/92 backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
                <p className="text-center text-[13px] leading-relaxed text-sand-100/80">
                    <span aria-hidden="true" className="font-glyph me-2 text-gold-400">𓏏</span>
                    {t('privacy.noticeText')}{' '}
                    <Link href="/privacy" className="font-bold text-gold-300 underline decoration-gold-500/40 underline-offset-4 transition hover:text-gold-500">
                        {t('privacy.noticeLink')}
                    </Link>
                </p>
                <button
                    type="button"
                    onClick={dismiss}
                    className="rounded-md bg-gold-500 px-4 py-1.5 text-[13px] font-bold text-ink-900 transition hover:bg-gold-300"
                >
                    {t('privacy.noticeAccept')}
                </button>
            </div>
        </div>
    );
}
