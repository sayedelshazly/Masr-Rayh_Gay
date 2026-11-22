import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useLocale } from '../i18n/LocaleContext';
import HieroglyphStrip from './HieroglyphStrip';
import LanguageSwitcher from './LanguageSwitcher';

/** Inline SVG brand mark: a gold ankh inside a lapis ring. */
export function BrandMark({ className = 'h-11 w-11' }) {
    return (
        <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Masr Rayh Gay">
            <circle cx="24" cy="24" r="22" fill="#082F49" />
            <circle cx="24" cy="24" r="21" fill="none" stroke="#C9A227" strokeWidth="1.6" />
            <g stroke="#C9A227" strokeWidth="2.6" strokeLinecap="round" fill="none">
                <circle cx="24" cy="16.5" r="5" />
                <line x1="24" y1="21.5" x2="24" y2="37" />
                <line x1="15.5" y1="27" x2="32.5" y2="27" />
            </g>
        </svg>
    );
}

export default function Navbar() {
    const { t, strings } = useLocale();
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
        <header className="sticky top-0 z-50 shadow-md shadow-ink/5">
            {/* Top bar */}
            <div className="bg-lapis-deep text-ivory">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-1.5 text-xs sm:px-6">
                    <p className="hidden text-gold-light md:block">{t('topbar.note')}</p>
                    <div className="flex items-center gap-5" dir="ltr">
                        <a href={`tel:${strings.topbar.phone.replace(/\s/g, '')}`} className="transition-colors hover:text-gold-light">
                            ☎ {strings.topbar.phone}
                        </a>
                        <a href={`mailto:${strings.topbar.email}`} className="hidden transition-colors hover:text-gold-light sm:block">
                            ✉ {strings.topbar.email}
                        </a>
                    </div>
                    <LanguageSwitcher dark />
                </div>
                <HieroglyphStrip className="pb-1 text-center text-[10px] text-gold/60" />
            </div>

            {/* Main navbar */}
            <nav className="border-b-2 border-gold/70 bg-ivory/95 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
                    <a href="/" className="flex items-center gap-3">
                        <BrandMark />
                        <span className="leading-tight">
                            <span className="font-display block text-xl font-bold text-lapis-deep">
                                {t('brand.name')}
                            </span>
                            <span className="block text-[11px] tracking-wide text-gold-deep">
                                {t('brand.nameLatin')}
                            </span>
                        </span>
                    </a>

                    <ul className="hidden items-center gap-6 lg:flex">
                        {links.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    className="text-sm font-medium text-ink/80 transition-colors hover:text-gold-deep"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="hidden items-center gap-4 md:flex">
                                <span className="max-w-36 truncate text-sm font-bold text-lapis-deep" title={user.name}>
                                    {user.name}
                                </span>
                                <Link
                                    href="/my-bookings"
                                    className="text-sm font-medium text-ink/80 transition-colors hover:text-gold-deep"
                                >
                                    {t('auth.myBookings')}
                                </Link>
                                {user.is_admin && (
                                    <Link
                                        href="/admin"
                                        className="rounded-full bg-lapis-deep px-4 py-2 text-sm font-bold text-gold-light transition-colors hover:bg-lapis"
                                    >
                                        {t('admin.panel')}
                                    </Link>
                                )}
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="rounded-full border border-gold/60 px-4 py-2 text-sm font-bold text-gold-deep transition-colors hover:bg-gold hover:text-ink"
                                >
                                    {t('auth.logout')}
                                </Link>
                            </div>
                        ) : (
                            <div className="hidden items-center gap-4 md:flex">
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-ink/80 transition-colors hover:text-gold-deep"
                                >
                                    {t('auth.login')}
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-full border border-gold/60 px-4 py-2 text-sm font-bold text-gold-deep transition-colors hover:bg-gold hover:text-ink"
                                >
                                    {t('auth.register')}
                                </Link>
                            </div>
                        )}
                        <a
                            href="/tours"
                            className="font-display hidden rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-ink shadow-sm transition-colors hover:bg-gold-deep hover:text-ivory sm:block"
                        >
                            {t('nav.bookNow')}
                        </a>
                        <button
                            type="button"
                            onClick={() => setOpen((value) => !value)}
                            aria-expanded={open}
                            aria-label={t('nav.menu')}
                            className="rounded-md border border-gold/50 px-3 py-2 text-lg leading-none text-lapis-deep lg:hidden"
                        >
                            ☰
                        </button>
                    </div>
                </div>

                {open && (
                    <ul className="space-y-1 border-t border-sand px-4 py-3 lg:hidden">
                        {links.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className="block rounded-md px-3 py-2 text-sm font-medium text-ink/85 hover:bg-sand"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                        <li className="border-t border-sand pt-2">
                            {user ? (
                                <>
                                    <span className="block px-3 py-2 text-sm font-bold text-lapis-deep">
                                        {t('auth.account')}: {user.name}
                                    </span>
                                    <Link
                                        href="/my-bookings"
                                        onClick={() => setOpen(false)}
                                        className="block rounded-md px-3 py-2 text-sm font-medium text-ink/85 hover:bg-sand"
                                    >
                                        {t('auth.myBookings')}
                                    </Link>
                                    {user.is_admin && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setOpen(false)}
                                            className="block rounded-md px-3 py-2 text-sm font-bold text-lapis-deep hover:bg-sand"
                                        >
                                            {t('admin.panel')}
                                        </Link>
                                    )}
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="block w-full rounded-md px-3 py-2 text-start text-sm font-bold text-gold-deep hover:bg-sand"
                                    >
                                        {t('auth.logout')}
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() => setOpen(false)}
                                        className="block rounded-md px-3 py-2 text-sm font-medium text-ink/85 hover:bg-sand"
                                    >
                                        {t('auth.login')}
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setOpen(false)}
                                        className="block rounded-md px-3 py-2 text-sm font-bold text-gold-deep hover:bg-sand"
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
