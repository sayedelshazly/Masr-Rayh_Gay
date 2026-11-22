import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { defaultLocale, locales, translations } from './translations';

const LocaleContext = createContext(null);

const STORAGE_KEY = 'masr-rayh-gay-locale';

function readStoredLocale() {
    if (typeof window === 'undefined') {
        return defaultLocale;
    }

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored && translations[stored] ? stored : defaultLocale;
    } catch {
        return defaultLocale;
    }
}

/** Apply lang/dir to <html> so CSS, Tailwind and the browser all agree. */
function applyDocumentLocale(locale) {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.lang = locale;
    document.documentElement.dir = locales[locale]?.dir ?? 'ltr';
}

/**
 * Provides the active locale, a `t()` dot-path lookup into the dictionary,
 * and the raw `strings` object (handy for arrays such as testimonials).
 */
export function LocaleProvider({ children }) {
    const [locale, setLocaleState] = useState(readStoredLocale);

    useEffect(() => {
        applyDocumentLocale(locale);

        try {
            window.localStorage.setItem(STORAGE_KEY, locale);
        } catch {
            // Private mode etc. — locale simply won't persist.
        }
    }, [locale]);

    const setLocale = useCallback((next) => {
        if (translations[next]) {
            setLocaleState(next);
        }
    }, []);

    const toggleLocale = useCallback(() => {
        setLocaleState((current) => (current === 'ar' ? 'en' : 'ar'));
    }, []);

    const value = useMemo(() => {
        const strings = translations[locale] ?? translations[defaultLocale];

        const t = (path) => {
            const resolved = path
                .split('.')
                .reduce((node, key) => (node && typeof node === 'object' ? node[key] : undefined), strings);

            return resolved ?? path;
        };

        return {
            locale,
            setLocale,
            toggleLocale,
            dir: locales[locale]?.dir ?? 'ltr',
            isRtl: (locales[locale]?.dir ?? 'ltr') === 'rtl',
            strings,
            t,
        };
    }, [locale, setLocale, toggleLocale]);

    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
    const context = useContext(LocaleContext);

    if (!context) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }

    return context;
}
