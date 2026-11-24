import { useEffect, useRef, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { useLocale } from '../i18n/LocaleContext';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * Inline SVG brand mark: the Eye of Horus in gold inside a nile ring.
 *
 * With `alive` the eye lives: it blinks every few seconds, and
 * its iris leans toward `gaze` (-1 … 1) when a gaze is given.
 */
export function BrandMark({ className = 'h-11 w-11', alive = false, gaze = 0 }) {
    const [blinking, setBlinking] = useState(false);

    useEffect(() => {
        if (!alive) {
            return undefined;
        }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return undefined;
        }
        let cancelled = false;
        let t1;
        let t2;
        const loop = () => {
            t1 = window.setTimeout(
                () => {
                    if (cancelled) return;
                    setBlinking(true);
                    t2 = window.setTimeout(() => {
                        if (cancelled) return;
                        setBlinking(false);
                        loop();
                    }, 140);
                },
                2400 + Math.random() * 3400,
            );
        };
        loop();
        return () => {
            cancelled = true;
            window.clearTimeout(t1);
            window.clearTimeout(t2);
        };
    }, [alive]);

    return (
        <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Masr Rayh Gay">
            <circle cx="24" cy="24" r="22" fill="#0B1F2E" />
            <circle cx="24" cy="24" r="21" fill="none" stroke="#C9A24B" strokeWidth="1.6" />
            <g
                style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    transform: blinking ? 'scaleY(0.08)' : 'scaleY(1)',
                    transition: 'transform 120ms ease-in-out',
                }}
            >
                <g stroke="#C9A24B" strokeWidth="2.3" strokeLinecap="round" fill="none">
                    {/* Brow */}
                    <path d="M7.5 15.5 Q24 6.5 40.5 15.5" />
                    {/* Eye outline */}
                    <path d="M8.5 24.5 Q24 13.5 39.5 24.5 Q24 33.5 8.5 24.5 Z" />
                    {/* Teardrop */}
                    <path d="M17 30.5 L17 38.5" />
                    {/* Cheek curl */}
                    <path d="M28.5 30 Q38 30.5 37 35.5 Q36.2 39 32.5 38" />
                </g>
                {/* Iris — leans toward the visited link when alive */}
                <g
                    style={{
                        transform: `translateX(${(alive ? gaze : 0) * 2.4}px)`,
                        transition: 'transform 380ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                    }}
                >
                    <circle cx="24" cy="24" r="4.4" fill="#C9A24B" />
                </g>
            </g>
        </svg>
    );
}

/**
 * Routes whose top band is genuinely dark (video/photo hero or nile band),
 * so the navbar can start transparent over it. Light-topped pages
 * (tours/destinations indexes, academy glyphs/quiz, auth, and the calm
 * booking checkout at /tours/{slug}/book) are deliberately excluded —
 * AppLayout gives them a spacer under the solid navbar instead.
 */
export function isOverlayRoute(url) {
    return (
        url === '/' ||
        url === '/academy' ||
        url.startsWith('/academy/lessons/') ||
        url.startsWith('/academy/name') ||
        url.startsWith('/destinations/') ||
        (url.startsWith('/tours/') && !url.endsWith('/book'))
    );
}

export default function Navbar() {
    const { t } = useLocale();
    const { props } = usePage();
    const user = props.auth?.user ?? null;
    const initial = user ? (Array.from(user.name.trim())[0] ?? '').toUpperCase() : '';
    const [userOpen, setUserOpen] = useState(false);

    const handleLogout = () => {
        setUserOpen(false);
        router.post('/logout');
    };
    const userMenuRef = useRef(null);

    // Account dropdown: close on outside click or Escape.
    useEffect(() => {
        if (!userOpen) return;
        const onPointerDown = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserOpen(false);
            }
        };
        const onKeyDown = (event) => {
            if (event.key === 'Escape') setUserOpen(false);
        };
        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [userOpen]);

    return (
        <header className="absolute inset-x-0 top-0 z-50">
            <nav>
                <div className="mx-auto max-w-7xl px-4 pb-3 pt-4 sm:px-6">
                    {/* The brand, centred: the living eye over the name */}
                    <a href="/" className="mx-auto flex w-fit flex-col items-center">
                        <BrandMark className="h-12 w-12" alive />
                        <span className="mt-1.5 text-center leading-none">
                            <span className="font-display block text-xl font-bold text-sand-100">
                                {t('brand.name')}
                            </span>
                            <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.34em] text-gold-300">
                                {t('brand.nameLatin')}
                            </span>
                        </span>
                    </a>

                    {/* Bottom row: language at the start corner, account at the end corner */}
                    <div className="mt-2.5 flex items-end justify-between">
                        <LanguageSwitcher dark />
                        {user ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    type="button"
                                    onClick={() => setUserOpen((value) => !value)}
                                    aria-expanded={userOpen}
                                    aria-haspopup="menu"
                                    aria-label={t('auth.account')}
                                    title={user.name}
                                    className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-b from-gold-300 via-gold-500 to-gold-500 p-[2px] shadow-[0_4px_18px_rgba(201,162,75,0.45)] transition duration-200 ease-stone hover:scale-105"
                                >
                                    <span className="font-display flex h-full w-full items-center justify-center rounded-full bg-gradient-to-b from-nile-800 to-nile-950 text-[15px] font-bold text-gold-300 transition group-hover:text-gold-500">
                                        {initial}
                                    </span>
                                    <span
                                        aria-hidden="true"
                                        className={`absolute -bottom-0.5 -end-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-nile-950 text-gold-300 ring-1 ring-gold-500/70 transition-transform duration-300 ease-stone ${userOpen ? 'rotate-180' : ''}`}
                                    >
                                        <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l7 7 7-7" /></svg>
                                    </span>
                                </button>
                                {userOpen && (
                                    <div
                                        role="menu"
                                        className="animate-popup-in absolute end-0 top-[calc(100%+10px)] w-60 rounded-xl bg-nile-950/95 p-1.5 shadow-2xl shadow-black/50 ring-1 ring-gold-500/40 backdrop-blur"
                                    >
                                        <span aria-hidden="true" className="pointer-events-none absolute inset-1 rounded-[10px] ring-1 ring-gold-500/15" />
                                        <div className="relative mb-1 flex items-center gap-3 border-b border-sand-100/10 px-3 pb-3 pt-2.5">
                                            <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-gold-300 via-gold-500 to-gold-500 p-[2px]">
                                                <span className="font-display flex h-full w-full items-center justify-center rounded-full bg-gradient-to-b from-nile-800 to-nile-950 text-lg font-bold text-gold-300">{initial}</span>
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block truncate text-sm font-bold text-sand-100">{user.name}</span>
                                                <span className="block truncate text-[11px] text-sand-100/55" dir="ltr">{user.email}</span>
                                            </span>
                                        </div>
                                        <Link
                                            href="/my-bookings"
                                            role="menuitem"
                                            onClick={() => setUserOpen(false)}
                                            className="animate-carve-in group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium text-sand-100/85 transition-colors hover:bg-nile-800 hover:text-gold-300"
                                            style={{ animationDelay: '60ms' }}
                                        >
                                            <span aria-hidden="true" className="font-glyph text-base leading-none text-gold-400">𓂀</span>
                                            {t('auth.myBookings')}
                                            <span aria-hidden="true" className="ms-auto text-gold-500 opacity-0 transition group-hover:opacity-100"><svg viewBox="0 0 24 24" className="h-3.5 w-3.5 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg></span>
                                        </Link>
                                        {user.is_admin && (
                                            <Link
                                                href="/admin"
                                                role="menuitem"
                                                onClick={() => setUserOpen(false)}
                                                className="animate-carve-in group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium text-sand-100/85 transition-colors hover:bg-nile-800 hover:text-gold-300"
                                                style={{ animationDelay: '130ms' }}
                                            >
                                                <span aria-hidden="true" className="font-glyph text-base leading-none text-gold-400">𓋹</span>
                                                {t('admin.panel')}
                                                <span aria-hidden="true" className="ms-auto text-gold-500 opacity-0 transition group-hover:opacity-100"><svg viewBox="0 0 24 24" className="h-3.5 w-3.5 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg></span>
                                            </Link>
                                        )}
                                        <div className="relative mt-1 border-t border-sand-100/10 pt-1">
                                            <button
                                                type="button"
                                                role="menuitem"
                                                onClick={handleLogout}
                                                className="animate-carve-in flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-start text-[13px] font-bold text-gold-300 transition-colors hover:bg-nile-800"
                                                style={{ animationDelay: '200ms' }}
                                            >
                                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3M10 8l-4 4 4 4M6 12h11" /></svg>
                                                {t('auth.logout')}
                                            </button>
                                        </div>
                                        <span aria-hidden="true" className="relative mx-auto mb-1 mt-2 block h-1 w-12 rounded-full bg-gold-500/70" />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2.5">
                                <Link
                                    href="/login"
                                    className="text-xs font-medium text-sand-100/80 transition-colors hover:text-gold-300"
                                >
                                    {t('auth.login')}
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-md border border-gold-500/60 px-2.5 py-1 text-xs font-bold text-gold-300 transition-colors hover:bg-gold-500 hover:text-ink-900"
                                >
                                    {t('auth.register')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
