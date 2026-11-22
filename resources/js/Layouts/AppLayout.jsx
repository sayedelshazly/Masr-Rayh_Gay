import { usePage } from '@inertiajs/react';
import Footer from '../Components/Footer';
import Navbar, { isOverlayRoute } from '../Components/Navbar';

/**
 * Site-wide chrome: fixed navbar on top, footer at the bottom, page
 * content in between. The navbar overlays dark hero bands (home, tours,
 * destinations, academy); on light pages a spacer keeps content clear
 * of the fixed bar. Locale comes from LocaleProvider (mounted in
 * app.jsx) so every page and component shares one language state.
 */
export default function AppLayout({ children }) {
    const { url } = usePage();
    const overlay = isOverlayRoute(url);

    return (
        <div className="relative isolate flex min-h-screen flex-col bg-sand-100 font-sans text-ink-900 antialiased">
            {/* Fixed landmark backdrop: the Sphinx & Pyramids ghost behind
                everything after the hero — the image stays put while the
                content scrolls over it. Kept faint on purpose so text
                stays readable; opaque sections (stats, footer) frame it. */}
            <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <img
                    src="/images/destinations/cairo-giza.jpg"
                    alt=""
                    className="h-full w-full object-cover opacity-[0.15]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-sand-100/30 via-transparent to-sand-100/50" />
            </div>
            <Navbar />
            {!overlay && <div className="h-[70px] shrink-0" aria-hidden="true" />}
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
