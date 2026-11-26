import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import Footer from '../Components/Footer';
import LoginInvite from '../Components/LoginInvite';
import AnnouncementBar from '../Components/AnnouncementBar';
import Navbar, { isOverlayRoute } from '../Components/Navbar';
import WhatsAppFloat from '../Components/WhatsAppFloat';
import TripAssistant from '../Components/TripAssistant';
import CookieNotice from '../Components/CookieNotice';
import { useLocale } from '../i18n/LocaleContext';

/**
 * Site-wide chrome: fixed navbar on top, footer at the bottom, page
 * content in between. The navbar overlays dark hero bands (home,
 * tours, destinations, academy); on other pages a spacer keeps
 * content clear of the fixed bar.
 *
 * Fixed landmark backdrop: every page sits on the same dark Nile
 * night as the home page — a landmark photo fixed behind the
 * content (content scrolls over it) under a nile gradient. Each
 * page family gets its OWN photo so the site feels like a journey:
 * home = Sphinx & Pyramids, tours = Luxor temple, destinations =
 * Qaitbay Citadel, academy = Luxor colonnade, account/booking =
 * Aswan on the Nile. Detail pages pass their own photo (the tour's
 * or destination's image) through the `backdrop` prop.
 * Locale comes from LocaleProvider (mounted in app.jsx) so every
 * page and component shares one language state.
 */
const ROUTE_BACKDROPS = [
    ['/tours', '/images/tours/luxor-east-west-bank-2-days.jpg'],
    ['/destinations', '/images/destinations/alexandria.jpg'],
    ['/academy', '/images/destinations/luxor.jpg'],
];

const DEFAULT_BACKDROP = '/images/destinations/aswan.jpg';
const HOME_BACKDROP = '/images/destinations/cairo-giza.jpg';

export default function AppLayout({ children, backdrop }) {
    const { url, props } = usePage();
    const { t } = useLocale();
    const overlay = isOverlayRoute(url);
    const isHome = url === '/';

    // Rare session errors (an expired page after a long pause) arrive as
    // `flash.error` and are shown once, in the site's own voice.
    const flashError = props.flash?.error ?? null;
    const [dismissedError, setDismissedError] = useState(null);
    const showFlashError = flashError !== null && dismissedError !== flashError;

    useEffect(() => {
        setDismissedError(null);
    }, [flashError]);

    const image =
        backdrop ??
        (isHome
            ? HOME_BACKDROP
            : (ROUTE_BACKDROPS.find(([prefix]) => url.startsWith(prefix))?.[1] ?? DEFAULT_BACKDROP));

    return (
        <div className="relative isolate flex min-h-screen flex-col bg-nile-950 font-sans text-sand-100 antialiased">
            <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-nile-950">
                <img src={image} alt="" className="h-full w-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-b from-nile-950/60 via-nile-950/30 to-nile-950/70" />
            </div>
            <AnnouncementBar />
            <div className="relative flex flex-1 flex-col">
                <Navbar />
                {!overlay && <div className="h-[169px] shrink-0" aria-hidden="true" />}
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
            {showFlashError && (
                <div
                    role="alert"
                    className="fixed bottom-5 start-1/2 z-[75] w-[min(92vw,26rem)] -translate-x-1/2 rounded-lg bg-nile-950/95 px-4 py-3 pe-10 text-sm font-medium text-sand-100 shadow-2xl shadow-black/50 ring-1 ring-carnelian-600/60 backdrop-blur rtl:translate-x-1/2"
                >
                    {flashError === 'page_expired' ? t('common.pageExpired') : flashError}
                    <button
                        type="button"
                        onClick={() => setDismissedError(flashError)}
                        aria-label={t('hero.close')}
                        className="absolute end-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-sand-100/60 transition hover:bg-white/5 hover:text-sand-100"
                    >
                        ✕
                    </button>
                </div>
            )}
            <WhatsAppFloat />
            <TripAssistant />
            <CookieNotice />
            <LoginInvite />
        </div>
    );
}
