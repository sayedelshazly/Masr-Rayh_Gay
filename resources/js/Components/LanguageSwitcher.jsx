import { useLocale } from '../i18n/LocaleContext';
import { locales } from '../i18n/translations';

/**
 * AR | EN toggle. Persists via LocaleContext (localStorage) and flips
 * the document direction between RTL and LTR.
 */
export default function LanguageSwitcher({ dark = false }) {
    const { locale, setLocale } = useLocale();

    return (
        <div
            className={`inline-flex items-center overflow-hidden rounded-full border text-xs font-semibold ${
                dark ? 'border-ivory/30 text-ivory' : 'border-gold/50 text-ink'
            }`}
            role="group"
            aria-label="Language / اللغة"
        >
            {Object.entries(locales).map(([code, meta]) => {
                const active = locale === code;

                return (
                    <button
                        key={code}
                        type="button"
                        onClick={() => setLocale(code)}
                        aria-pressed={active}
                        className={`px-3 py-1.5 transition-colors ${
                            active
                                ? 'bg-gold text-ink'
                                : dark
                                  ? 'hover:bg-ivory/10'
                                  : 'hover:bg-sand'
                        }`}
                    >
                        {meta.short}
                    </button>
                );
            })}
        </div>
    );
}
