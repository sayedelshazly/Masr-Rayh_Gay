import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { LocaleProvider } from './i18n/LocaleContext';
import Preloader from './Components/Preloader';
import TombDoor from './Components/TombDoor';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <LocaleProvider>
                <Preloader />
                <TombDoor />
                <App {...props} />
            </LocaleProvider>,
        );
    },
});
