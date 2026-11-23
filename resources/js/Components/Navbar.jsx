import { useEffect, useRef, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { useLocale } from '../i18n/LocaleContext';
import LanguageSwitcher from './LanguageSwitcher';

/** Inline SVG brand mark: the Eye of Horus in gold inside a nile ring. */
export function BrandMark({ className = 'h-11 w-11' }) {
    return (
        <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Masr Rayh Gay">
            <circle cx="24" cy="24" r="22" fill="#0B1F2E" />
            <circle cx="24" cy="24" r="21" fill="none" stroke="#C9A24B" strokeWidth="1.6" />
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
            {/* Iris */}
            <circle cx="24" cy="24" r="4.4" fill="#C9A24B" />
        </svg>
    );
}

/**
 * Routes whose top band is genuinely dark (video/photo hero or nile band),
 * so the fixed navbar can start transparent over it. Light-topped pages
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
    const { props, url } = usePage();
    const user = props.auth?.user ?? null;
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userOpen, setUserOpen] = useState(false);

    const handleLogout = () => {
        setUserOpen(false);
        router.post('/logout');
    };
    const userMenuRef = useRef(null);

    const overlay = isOverlayRoute(url);
    const solid = !overlay || scrolled || open;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

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

    const links = [
        { label: t('nav.home'), href: '/' },
        { label: t('nav.tours'), href: '/tours' },
        { label: t('nav.destinations'), href: '/destinations' },
        { label: t('nav.academy'), href: '/academy' },
        { label: t('nav.about'), href: '#' },
        { label: t('nav.contact'), href: '#contact' },
    ];

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-stone ${
                solid ? 'bg-nile-950/95 shadow-md shadow-ink-900/10 backdrop-blur' : 'bg-transparent'
            }`}
        >
            <nav className={solid ? 'border-b-2 border-gold-500/70' : 'border-b-2 border-transparent'}>
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
                    <a href="/" className="flex items-center gap-2.5">
                        <BrandMark className="h-9 w-9" />
                        <span className="leading-tight">
                            <span className="font-display block text-lg font-bold text-sand-100">
                                {t('brand.name')}
                            </span>
                            <span className="block text-[10px] tracking-wide text-gold-300">
                                {t('brand.nameLatin')}
                            </span>
                        </span>
                    </a>

                    <ul className="hidden items-center gap-5 lg:flex">
                        {links.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    className="text-[13px] font-medium text-sand-100/80 transition-colors hover:text-gold-300"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-2.5">
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
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-500/50 bg-nile-800 text-gold-300 transition-colors duration-150 ease-stone hover:text-gold-500"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        className="h-[18px] w-[18px]"
                                        aria-hidden="true"
                                    >
                                        <circle cx="12" cy="8" r="3.6" />
                                        <path d="M5 19.4c1.2-3.1 3.9-4.7 7-4.7s5.8 1.6 7 4.7" />
                                    </svg>
                                </button>
                                {userOpen && (
                                    <div
                                        role="menu"
                                        className="absolute end-0 top-[calc(100%+8px)] w-52 rounded-lg border border-gold-500/25 bg-nile-950 p-1.5 shadow-xl shadow-ink-900/30"
                                    >
                                        <div className="mb-1 border-b border-sand-100/10 px-3 py-2">
                                            <p className="truncate text-[13px] font-bold text-sand-100">{user.name}</p>
                                            <p className="truncate text-[11px] text-sand-100/55" dir="ltr">
                                                {user.email}
                                            </p>
                                        </div>
                                        <Link
                                            href="/my-bookings"
                                            role="menuitem"
                                            onClick={() => setUserOpen(false)}
                                            className="block rounded-md px-3 py-2 text-[13px] font-medium text-sand-100/85 transition-colors hover:bg-nile-800"
                                        >
                                            {t('auth.myBookings')}
                                        </Link>
                                        {user.is_admin && (
                                            <Link
                                                href="/admin"
                                                role="menuitem"
                                                onClick={() => setUserOpen(false)}
                                                className="block rounded-md px-3 py-2 text-[13px] font-medium text-sand-100/85 transition-colors hover:bg-nile-800"
                                            >
                                                {t('admin.panel')}
                                            </Link>
                                        )}
                                        <button
                                            type="button"
                                            role="menuitem"
                                            onClick={handleLogout}
                                            className="block w-full rounded-md px-3 py-2 text-start text-[13px] font-bold text-gold-300 transition-colors hover:bg-nile-800"
                                        >
                                            {t('auth.logout')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden items-center gap-3 md:flex">
                                <Link
                                    href="/login"
                                    className="text-[13px] font-medium text-sand-100/80 transition-colors hover:text-gold-300"
                                >
                                    {t('auth.login')}
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-md border border-gold-500/60 px-3 py-1.5 text-[13px] font-bold text-gold-300 transition-colors hover:bg-gold-500 hover:text-ink-900"
                                >
                                    {t('auth.register')}
                                </Link>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setOpen((value) => !value)}
                            aria-expanded={open}
                            aria-label={t('nav.menu')}
                            className="rounded-md border border-gold-500/50 px-2 py-1.5 text-base leading-none text-gold-300 lg:hidden"
                        >
                            ☰
                        </button>
                    </div>
                </div>

                {open && (
                    <ul className="space-y-1 border-t border-nile-800 px-4 py-2.5 lg:hidden">
                        {links.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className="block rounded-md px-3 py-1.5 text-[13px] font-medium text-sand-100/85 hover:bg-nile-800"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                        <li className="border-t border-nile-800 pt-2">
                            {user ? (
                                <>
                                    <Link
                                        href="/my-bookings"
                                        onClick={() => setOpen(false)}
                                        className="block rounded-md px-3 py-1.5 text-[13px] font-medium text-sand-100/85 hover:bg-nile-800"
                                    >
                                        {t('auth.myBookings')}
                                    </Link>
                                    {user.is_admin && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setOpen(false)}
                                            className="block rounded-md px-3 py-1.5 text-[13px] font-bold text-gold-300 hover:bg-nile-800"
                                        >
                                            {t('admin.panel')}
                                        </Link>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() => setOpen(false)}
                                        className="block rounded-md px-3 py-1.5 text-[13px] font-medium text-sand-100/85 hover:bg-nile-800"
                                    >
                                        {t('auth.login')}
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setOpen(false)}
                                        className="block rounded-md px-3 py-1.5 text-[13px] font-bold text-gold-300 hover:bg-nile-800"
                                    >
                                        {t('auth.register')}
                                    </Link>
                                </>
                            )}
                        </li>
                    </ul>
                )}
            </nav>
        </header>
    );
}
