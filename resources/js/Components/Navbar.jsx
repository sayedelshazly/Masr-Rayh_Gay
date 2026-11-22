import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useLocale } from '../i18n/LocaleContext';
import LanguageSwitcher from './LanguageSwitcher';

/** Inline SVG brand mark: a gold-500 ankh inside a nile-800 ring. */
export function BrandMark({ className = 'h-11 w-11' }) {
    return (
        <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Masr Rayh Gay">
            <circle cx="24" cy="24" r="22" fill="#0B1F2E" />
            <circle cx="24" cy="24" r="21" fill="none" stroke="#C9A24B" strokeWidth="1.6" />
            <g stroke="#C9A24B" strokeWidth="2.6" strokeLinecap="round" fill="none">
                <circle cx="24" cy="16.5" r="5" />
                <line x1="24" y1="21.5" x2="24" y2="37" />
                <line x1="15.5" y1="27" x2="32.5" y2="27" />
            </g>
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

    const overlay = isOverlayRoute(url);
    const solid = !overlay || scrolled || open;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

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
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
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
                            <div className="hidden items-center gap-3 md:flex">
                                <span className="max-w-36 truncate text-[13px] font-bold text-sand-100" title={user.name}>
                                    {user.name}
                                </span>
                                <Link
                                    href="/my-bookings"
                                    className="text-[13px] font-medium text-sand-100/80 transition-colors hover:text-gold-300"
                                >
                                    {t('auth.myBookings')}
                                </Link>
                                {user.is_admin && (
                                    <Link
                                        href="/admin"
                                        className="rounded-md bg-gold-500 px-3 py-1.5 text-[13px] font-bold text-ink-900 transition-colors hover:bg-gold-300"
                                    >
                                        {t('admin.panel')}
                                    </Link>
                                )}
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="rounded-md border border-gold-500/60 px-3 py-1.5 text-[13px] font-bold text-gold-300 transition-colors hover:bg-gold-500 hover:text-ink-900"
                                >
                                    {t('auth.logout')}
                                </Link>
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
                                    <span className="block px-3 py-1.5 text-[13px] font-bold text-sand-100">
                                        {t('auth.account')}: {user.name}
                                    </span>
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
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="block w-full rounded-md px-3 py-1.5 text-start text-[13px] font-bold text-gold-300 hover:bg-nile-800"
                                    >
                                        {t('auth.logout')}
                                    </Link>
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
