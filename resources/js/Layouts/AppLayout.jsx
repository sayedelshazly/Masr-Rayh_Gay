import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';

/**
 * Site-wide chrome: top bar + navbar on top, footer at the bottom,
 * page content in between. Locale comes from LocaleProvider (mounted
 * in app.jsx) so every page and component shares one language state.
 */
export default function AppLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-ivory font-sans text-ink antialiased">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
