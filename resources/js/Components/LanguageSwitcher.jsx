import { useLocale } from '../i18n/LocaleContext';
import { locales } from '../i18n/translations';

/**
 * AR | EN toggle — bare text, no box: the active language in gold, the
 * other dimmed. Persists via LocaleContext (localStorage) and flips the
 * document direction between RTL and LTR.
 */
export default function LanguageSwitcher({ dark = false }) {
    const { locale, setLocale } = useLocale();

    return (
        <div className="inline-flex items-center gap-1.5 text-xs" role="group" aria-label="Language / اللغة">
            {Object.entries(locales).map(([code, meta], index) => {
                const active = locale === code;

                return (
                    <span key={code} className="inline-flex items-center gap-1.5">
                        {index > 0 && (
                            <span aria-hidden="true" className={dark ? 'text-sand-100/30' : 'text-ink-900/30'}>
                                |
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => setLocale(code)}
                            aria-pressed={active}
                            className={`py-1 transition-colors duration-150 ease-stone ${
                                active
                                    ? dark
                                        ? 'font-bold text-gold-300'
                                        : 'font-bold text-gold-deep'
                                    : dark
                                      ? 'text-sand-100/55 hover:text-sand-100'
                                      : 'text-ink-900/50 hover:text-ink-900'
                            }`}
                        >
                            {meta.short}
                        </button>
                    </span>
                );
            })}
        </div>
    );
}
