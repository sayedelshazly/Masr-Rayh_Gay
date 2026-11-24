import { usePage } from '@inertiajs/react';
import Footer from '../Components/Footer';
import LoginInvite from '../Components/LoginInvite';
import AnnouncementBar from '../Components/AnnouncementBar';
import Navbar, { isOverlayRoute } from '../Components/Navbar';
import WhatsAppFloat from '../Components/WhatsAppFloat';
import TripAssistant from '../Components/TripAssistant';

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
    const { url } = usePage();
    const overlay = isOverlayRoute(url);
    const isHome = url === '/';

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
            <WhatsAppFloat />
            <TripAssistant />
            <LoginInvite />
        </div>
    );
}
