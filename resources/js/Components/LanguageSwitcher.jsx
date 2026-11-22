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
            className={`inline-flex items-center overflow-hidden rounded-md border text-xs font-semibold ${
                dark ? 'border-sand-100/30 text-sand-100' : 'border-gold-500/50 text-ink-900'
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
                        className={`flex min-h-[44px] items-center px-3 transition-colors ${
                            active
                                ? 'bg-gold-500 text-ink-900'
                                : dark
                                  ? 'hover:bg-sand-100/10'
                                  : 'hover:bg-sand-300'
                        }`}
                    >
                        {meta.short}
                    </button>
                );
            })}
        </div>
    );
}
