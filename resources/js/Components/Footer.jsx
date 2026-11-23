import { useLocale } from '../i18n/LocaleContext';
import { destinations } from '../data/home';
import HieroglyphStrip from './HieroglyphStrip';
import { BrandMark } from './Navbar';

/**
 * Footer — kept deliberately quiet: a centred brand moment on top,
 * three calm link columns, hairline, legal line, and the brand name
 * set giant and ghosted across the very bottom edge (clipped), the
 * way luxury houses sign a page. Links warm to gold and lean a step
 * toward the reader on hover.
 */
export default function Footer() {
    const { t, strings, locale } = useLocale();
    const year = new Date().getFullYear();

    const quickLinks = [
        { label: t('nav.home'), href: '/' },
        { label: t('nav.tours'), href: '/tours' },
        { label: t('nav.destinations'), href: '/destinations' },
        { label: t('nav.academy'), href: '/#academy' },
        { label: t('nav.about'), href: '#' },
    ];

    const linkClass =
        'inline-block text-sand-100/70 transition-all duration-300 ease-stone hover:ps-1.5 hover:text-gold-300';

    return (
        <footer id="contact" className="relative overflow-hidden bg-nile-950 text-sand-100">
            <HieroglyphStrip className="border-b border-gold-500/25 py-3 text-center text-sm text-gold-500/70" />

            {/* brand moment */}
            <div className="mx-auto max-w-2xl px-4 pt-14 text-center sm:px-6">
                <BrandMark className="mx-auto h-14 w-14" alive />
                <p className="font-display mt-4 text-2xl font-bold">{t('brand.name')}</p>
                <p className="mt-1 text-xs tracking-[0.3em] text-gold-300">{t('brand.nameLatin')}</p>
                <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-sand-100/65">{t('footer.blurb')}</p>
                <p className="font-display mt-3 text-sm text-gold-300">{t('brand.tagline')}</p>
            </div>

            <div aria-hidden="true" className="mx-auto mt-12 h-px max-w-5xl bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

            {/* columns */}
            <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 text-center sm:px-6 sm:text-start md:grid-cols-3">
                <nav aria-label={t('footer.quickLinks')}>
                    <h3 className="font-display mb-4 text-sm font-bold tracking-widest text-gold-500">{t('footer.quickLinks')}</h3>
                    <ul className="space-y-2.5 text-sm">
                        {quickLinks.map((link) => (
                            <li key={link.label}>
                                <a href={link.href} className={linkClass}>
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <nav aria-label={t('footer.topDestinations')}>
                    <h3 className="font-display mb-4 text-sm font-bold tracking-widest text-gold-500">{t('footer.topDestinations')}</h3>
                    <ul className="space-y-2.5 text-sm">
                        {destinations.map((destination) => (
                            <li key={destination.id}>
                                <a href="/destinations" className={linkClass}>
                                    {destination.name[locale]}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div>
                    <h3 className="font-display mb-4 text-sm font-bold tracking-widest text-gold-500">{t('footer.contactTitle')}</h3>
                    <ul className="space-y-3 text-sm text-sand-100/70">
                        <li className="flex items-start gap-2.5 sm:justify-start justify-center">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                            <span>{t('footer.address')}</span>
                        </li>
                        <li>
                            <a href={`tel:${strings.topbar.phone.replace(/\s/g, '')}`} className="flex items-center gap-2.5 transition-colors hover:text-gold-300 sm:justify-start justify-center">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4 shrink-0 text-gold-500" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                </svg>
                                <span dir="ltr">{strings.topbar.phone}</span>
                            </a>
                        </li>
                        <li>
                            <a href={`mailto:${strings.topbar.email}`} className="flex items-center gap-2.5 transition-colors hover:text-gold-300 sm:justify-start justify-center">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4 shrink-0 text-gold-500" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                                <span dir="ltr">{strings.topbar.email}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* legal */}
            <div className="relative border-t border-sand-100/12">
                <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-sand-100/55 sm:px-6">
                    © {year} {t('brand.name')} — {t('footer.rights')}
                </p>
            </div>

            {/* the signature: brand name set giant across the bottom edge */}
            <div aria-hidden="true" className="pointer-events-none relative select-none overflow-hidden">
                <p className="font-display -mb-[0.23em] bg-gradient-to-b from-sand-100/[0.09] to-sand-100/[0.015] bg-clip-text text-center text-[16.5vw] font-black leading-none whitespace-nowrap text-transparent">
                    {t('brand.name')}
                </p>
            </div>
        </footer>
    );
}
