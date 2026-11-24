import { Link, usePage } from '@inertiajs/react';
import { useLocale } from '../i18n/LocaleContext';
import LanguageSwitcher from '../Components/LanguageSwitcher';
import { BrandMark } from '../Components/Navbar';

/**
 * Admin chrome: a compact sidebar + topbar, in the site palette but
 * denser and more utilitarian than the public layout.
 */
export default function AdminLayout({ children, title }) {
    const { t } = useLocale();
    const { props, url } = usePage();
    const user = props.auth?.user ?? null;
    const flash = props.flash?.success ?? null;

    const links = [
        { label: t('admin.nav.dashboard'), href: '/admin', active: url === '/admin' },
        { label: t('admin.nav.bookings'), href: '/admin/bookings', active: url.startsWith('/admin/bookings') },
        { label: t('admin.nav.tours'), href: '/admin/tours', active: url.startsWith('/admin/tours') },
        { label: t('admin.nav.destinations'), href: '/admin/destinations', active: url.startsWith('/admin/destinations') },
        { label: t('admin.nav.tripRequests'), href: '/admin/trip-requests', active: url.startsWith('/admin/trip-requests') },
        { label: t('admin.nav.tomorrow'), href: '/admin/tomorrow', active: url.startsWith('/admin/tomorrow') },
        { label: t('admin.nav.announcement'), href: '/admin/announcement', active: url.startsWith('/admin/announcement') },
        { label: t('admin.nav.reviewRequests'), href: '/admin/review-requests', active: url.startsWith('/admin/review-requests') },
        { label: t('admin.nav.filmRequests'), href: '/admin/film-requests', active: url.startsWith('/admin/film-requests') },
        { label: t('admin.nav.gallery'), href: '/admin/gallery', active: url.startsWith('/admin/gallery') },
        { label: t('admin.nav.reviews'), href: '/admin/reviews', active: url.startsWith('/admin/reviews') },
    ];

    return (
        <div className="min-h-screen bg-sand/60 font-sans text-ink antialiased">
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-nile-950 text-ivory md:flex">
                    <div className="flex items-center gap-2.5 border-b border-ivory/10 px-5 py-4">
                        <BrandMark className="h-9 w-9" />
                        <div className="leading-tight">
                            <p className="font-display text-sm font-bold">{t('brand.name')}</p>
                            <p className="text-[11px] text-gold-light">{t('admin.panel')}</p>
                        </div>
                    </div>
                    <nav className="flex-1 space-y-1 px-3 py-4">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                    link.active ? 'bg-gold text-ink' : 'text-ivory/85 hover:bg-ivory/10'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="border-t border-ivory/10 px-5 py-4">
                        <a href="/" className="text-sm text-gold-light transition-colors hover:text-gold">
                            ← {t('admin.backToSite')}
                        </a>
                    </div>
                </aside>

                {/* Main column */}
                <div className="min-w-0 flex-1">
                    <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b border-gold/40 bg-ivory/95 px-4 py-3 backdrop-blur sm:px-6">
                        <h1 className="font-display text-lg font-bold text-nile-950">{title ?? t('admin.title')}</h1>
                        <div className="flex items-center gap-4">
                            <nav className="flex gap-1 md:hidden">
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                                            link.active ? 'bg-gold text-ink' : 'bg-sand text-ink/70'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                            <LanguageSwitcher />
                            <span className="hidden text-sm font-bold text-nile-950 sm:block">{user?.name}</span>
                            <a href="/" className="text-sm text-gold-deep hover:underline md:hidden">
                                {t('admin.backToSite')}
                            </a>
                        </div>
                    </header>

                    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
                        {flash && (
                            <p className="mb-4 rounded-xl bg-turquoise-600/15 px-4 py-2.5 text-sm font-bold text-ink-900 ring-1 ring-turquoise-600/50">
                                {t('admin.saved')}
                            </p>
                        )}
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
