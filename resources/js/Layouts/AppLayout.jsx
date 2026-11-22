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
        <div className="flex min-h-screen flex-col bg-sand-100 font-sans text-ink-900 antialiased">
            <Navbar />
            {!overlay && <div className="h-[70px] shrink-0" aria-hidden="true" />}
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
