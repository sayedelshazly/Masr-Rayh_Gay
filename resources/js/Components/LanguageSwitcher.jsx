import { useLocale } from '../i18n/LocaleContext';
import { locales } from '../i18n/translations';

/**
 * AR | EN toggle — compact segmented control. Persists via LocaleContext
 * (localStorage) and flips the document direction between RTL and LTR.
 */
export default function LanguageSwitcher({ dark = false }) {
    const { locale, setLocale } = useLocale();

    return (
        <div
            className={`inline-flex items-center gap-0.5 rounded-md border p-0.5 text-[11px] font-semibold ${
                dark
                    ? 'border-sand-100/25 bg-sand-100/5 text-sand-100'
                    : 'border-gold-500/40 bg-white/60 text-ink-900'
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
                        className={`flex h-7 items-center rounded-sm px-2.5 tracking-wide transition-colors duration-150 ease-stone ${
                            active
                                ? 'bg-gold-500 text-ink-900 shadow-sm'
                                : dark
                                  ? 'text-sand-100/65 hover:text-sand-100'
                                  : 'text-ink-900/55 hover:text-ink-900'
                        }`}
                    >
                        {meta.short}
                    </button>
                );
            })}
        </div>
    );
}
