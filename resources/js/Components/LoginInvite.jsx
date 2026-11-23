import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { useLocale } from '../i18n/LocaleContext';
import { BrandMark } from './Navbar';
import Button from './Button';

const SEEN_KEY = 'masr-login-invite-seen';

/**
 * A one-time welcome popup in the site's own style, inviting
 * guests to log in shortly after they first open the site. Shows
 * once per browser session, never to logged-in users and never
 * on the auth pages themselves.
 */
export default function LoginInvite() {
    const { t } = useLocale();
    const { props, url } = usePage();
    const user = props.auth?.user ?? null;
    const [visible, setVisible] = useState(false);

    const close = () => {
        try {
            sessionStorage.setItem(SEEN_KEY, '1');
        } catch {
            // Private mode: just close for this mount.
        }
        setVisible(false);
    };

    useEffect(() => {
        if (user || url === '/login' || url === '/register') {
            return undefined;
        }
        let seen = false;
        try {
            seen = !!sessionStorage.getItem(SEEN_KEY);
        } catch {
            seen = false;
        }
        if (seen) {
            return undefined;
        }
        // Wait for the preloader to lift before knocking.
        const timer = window.setTimeout(() => setVisible(true), 3400);
        return () => window.clearTimeout(timer);
    }, [user, url]);

    useEffect(() => {
        if (!visible) {
            return undefined;
        }
        const onKey = (event) => {
            if (event.key === 'Escape') {
                close();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [visible]);

    if (!visible) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={t('auth.inviteTitle')}>
            <button
                type="button"
                aria-label={t('auth.inviteGuest')}
                onClick={close}
                className="absolute inset-0 cursor-default bg-nile-950/70 backdrop-blur-sm"
            />
            <div className="animate-popup-in relative w-full max-w-sm rounded-lg bg-nile-950 p-6 text-center shadow-2xl shadow-black/50 ring-1 ring-gold-500/40 sm:p-8">
                <button
                    type="button"
                    onClick={close}
                    aria-label="Close"
                    className="absolute end-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-sand-100/50 transition hover:bg-white/5 hover:text-sand-100"
                >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>

                <BrandMark className="mx-auto h-14 w-14" alive />
                <p aria-hidden="true" className="font-glyph mt-3 text-sm tracking-[0.5em] text-gold-500/50">
                    𓂀 𓋹 𓆣 𓅃
                </p>
                <h2 className="font-display mt-3 text-2xl font-bold text-sand-100">{t('auth.inviteTitle')}</h2>
                <p className="mt-2 text-sm leading-relaxed text-sand-100/65">{t('auth.inviteText')}</p>

                <div className="mt-6 flex flex-col gap-2.5">
                    <Button href="/login" onClick={close} className="w-full">
                        {t('auth.login')}
                    </Button>
                    <Button href="/register" variant="secondaryDark" onClick={close} className="w-full">
                        {t('auth.register')}
                    </Button>
                    <button
                        type="button"
                        onClick={close}
                        className="mt-1 text-xs font-medium text-sand-100/50 underline-offset-4 transition hover:text-gold-300 hover:underline"
                    >
                        {t('auth.inviteGuest')}
                    </button>
                </div>
            </div>
        </div>
    );
}
