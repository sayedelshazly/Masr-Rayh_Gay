import { usePage } from '@inertiajs/react';
import Footer from '../Components/Footer';
import Navbar, { isOverlayRoute } from '../Components/Navbar';

/**
 * Site-wide chrome: fixed navbar on top, footer at the bottom, page
 * content in between. The navbar overlays dark hero bands (home, tours,
 * destinations, academy); on light pages a spacer keeps content clear
 * of the fixed bar.
 *
 * Fixed landmark backdrop (Sphinx & Pyramids): the image stays put
 * while content scrolls over it. On the home page it is DARK like the
 * hero (nile night, image at 40% under a nile gradient) so the whole
 * page reads as one scene; other pages keep a faint light treatment
 * because their content is designed for light backgrounds.
 * Locale comes from LocaleProvider (mounted in app.jsx) so every page
 * and component shares one language state.
 */
export default function AppLayout({ children }) {
    const { url } = usePage();
    const overlay = isOverlayRoute(url);
    const isHome = url === '/';

    return (
        <div
            className={`relative isolate flex min-h-screen flex-col font-sans antialiased ${
                isHome ? 'bg-nile-950 text-sand-100' : 'bg-sand-100 text-ink-900'
            }`}
        >
            {isHome ? (
                <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-nile-950">
                    <img
                        src="/images/destinations/cairo-giza.jpg"
                        alt=""
                        className="h-full w-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-nile-950/60 via-nile-950/30 to-nile-950/70" />
                </div>
            ) : (
                <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                    <img
                        src="/images/destinations/cairo-giza.jpg"
                        alt=""
                        className="h-full w-full object-cover opacity-[0.15]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-sand-100/30 via-transparent to-sand-100/50" />
                </div>
            )}
            <Navbar />
            {!overlay && <div className="h-[70px] shrink-0" aria-hidden="true" />}
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
