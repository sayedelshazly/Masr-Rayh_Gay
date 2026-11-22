import { useLocale } from '../i18n/LocaleContext';
import { destinations } from '../data/home';
import HieroglyphStrip from './HieroglyphStrip';
import { BrandMark } from './Navbar';

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

    return (
        <footer id="contact" className="bg-lapis-deep text-ivory">
            <HieroglyphStrip className="border-b border-gold/25 py-3 text-center text-sm text-gold/70" />

            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
                <div>
                    <div className="flex items-center gap-3">
                        <BrandMark className="h-12 w-12" />
                        <div className="leading-tight">
                            <p className="font-display text-lg font-bold">{t('brand.name')}</p>
                            <p className="text-[11px] tracking-wide text-gold-light">{t('brand.nameLatin')}</p>
                        </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-ivory/75">{t('footer.blurb')}</p>
                    <p className="font-display mt-3 text-sm text-gold-light">{t('brand.tagline')}</p>
                </div>

                <nav aria-label={t('footer.quickLinks')}>
                    <h3 className="font-display mb-4 text-base font-bold text-gold">{t('footer.quickLinks')}</h3>
                    <ul className="space-y-2 text-sm">
                        {quickLinks.map((link) => (
                            <li key={link.label}>
                                <a href={link.href} className="text-ivory/80 transition-colors hover:text-gold-light">
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <nav aria-label={t('footer.topDestinations')}>
                    <h3 className="font-display mb-4 text-base font-bold text-gold">{t('footer.topDestinations')}</h3>
                    <ul className="space-y-2 text-sm">
                        {destinations.map((destination) => (
                            <li key={destination.id}>
                                <a href="/destinations" className="text-ivory/80 transition-colors hover:text-gold-light">
                                    {destination.name[locale]}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div>
                    <h3 className="font-display mb-4 text-base font-bold text-gold">{t('footer.contactTitle')}</h3>
                    <ul className="space-y-2 text-sm text-ivory/80">
                        <li>{t('footer.address')}</li>
                        <li dir="ltr" className="text-start">
                            ☎ {strings.topbar.phone}
                        </li>
                        <li dir="ltr" className="text-start">
                            ✉ {strings.topbar.email}
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-ivory/15">
                <p className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-ivory/60 sm:px-6">
                    © {year} {t('brand.name')} — {t('footer.rights')}
                </p>
            </div>
        </footer>
    );
}
