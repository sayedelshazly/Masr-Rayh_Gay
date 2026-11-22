import { useState } from 'react';
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

export default function Navbar() {
    const { t } = useLocale();
    const { props } = usePage();
    const user = props.auth?.user ?? null;
    const [open, setOpen] = useState(false);

    const links = [
        { label: t('nav.home'), href: '/' },
        { label: t('nav.tours'), href: '/tours' },
        { label: t('nav.destinations'), href: '/destinations' },
        { label: t('nav.academy'), href: '/academy' },
        { label: t('nav.about'), href: '#' },
        { label: t('nav.contact'), href: '#contact' },
    ];

    return (
        <header className="sticky top-0 z-50 shadow-md shadow-ink-900/5">
            {/* Main navbar */}
            <nav className="border-b-2 border-gold-500/70 bg-nile-950 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
                    <a href="/" className="flex items-center gap-3">
                        <BrandMark />
                        <span className="leading-tight">
                            <span className="font-display block text-xl font-bold text-sand-100">
                                {t('brand.name')}
                            </span>
                            <span className="block text-[11px] tracking-wide text-gold-300">
                                {t('brand.nameLatin')}
                            </span>
                        </span>
                    </a>

                    <ul className="hidden items-center gap-6 lg:flex">
                        {links.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    className="text-sm font-medium text-sand-100/80 transition-colors hover:text-gold-300"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-3">
                        <LanguageSwitcher dark />
                        {user ? (
                            <div className="hidden items-center gap-4 md:flex">
                                <span className="max-w-36 truncate text-sm font-bold text-sand-100" title={user.name}>
                                    {user.name}
                                </span>
                                <Link
                                    href="/my-bookings"
                                    className="text-sm font-medium text-sand-100/80 transition-colors hover:text-gold-300"
                                >
                                    {t('auth.myBookings')}
                                </Link>
                                {user.is_admin && (
                                    <Link
                                        href="/admin"
                                        className="rounded-md bg-gold-500 px-4 py-2 text-sm font-bold text-ink-900 transition-colors hover:bg-gold-300"
                                    >
                                        {t('admin.panel')}
                                    </Link>
                                )}
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="rounded-md border border-gold-500/60 px-4 py-2 text-sm font-bold text-gold-300 transition-colors hover:bg-gold-500 hover:text-ink-900"
                                >
                                    {t('auth.logout')}
                                </Link>
                            </div>
                        ) : (
                            <div className="hidden items-center gap-4 md:flex">
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-sand-100/80 transition-colors hover:text-gold-300"
                                >
                                    {t('auth.login')}
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-md border border-gold-500/60 px-4 py-2 text-sm font-bold text-gold-300 transition-colors hover:bg-gold-500 hover:text-ink-900"
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
                            className="rounded-md border border-gold-500/50 px-3 py-2 text-lg leading-none text-gold-300 lg:hidden"
                        >
                            ☰
                        </button>
                    </div>
                </div>

                {open && (
                    <ul className="space-y-1 border-t border-nile-800 px-4 py-3 lg:hidden">
                        {links.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className="block rounded-md px-3 py-2 text-sm font-medium text-sand-100/85 hover:bg-nile-800"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                        <li className="border-t border-nile-800 pt-2">
                            {user ? (
                                <>
                                    <span className="block px-3 py-2 text-sm font-bold text-sand-100">
                                        {t('auth.account')}: {user.name}
                                    </span>
                                    <Link
                                        href="/my-bookings"
                                        onClick={() => setOpen(false)}
                                        className="block rounded-md px-3 py-2 text-sm font-medium text-sand-100/85 hover:bg-nile-800"
                                    >
                                        {t('auth.myBookings')}
                                    </Link>
                                    {user.is_admin && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setOpen(false)}
                                            className="block rounded-md px-3 py-2 text-sm font-bold text-gold-300 hover:bg-nile-800"
                                        >
                                            {t('admin.panel')}
                                        </Link>
                                    )}
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="block w-full rounded-md px-3 py-2 text-start text-sm font-bold text-gold-300 hover:bg-nile-800"
                                    >
                                        {t('auth.logout')}
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() => setOpen(false)}
                                        className="block rounded-md px-3 py-2 text-sm font-medium text-sand-100/85 hover:bg-nile-800"
                                    >
                                        {t('auth.login')}
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setOpen(false)}
                                        className="block rounded-md px-3 py-2 text-sm font-bold text-gold-300 hover:bg-nile-800"
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
