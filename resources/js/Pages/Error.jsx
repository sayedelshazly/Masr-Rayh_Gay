import { Head } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import Button from '../Components/Button';
import { useLocale } from '../i18n/LocaleContext';

const KNOWN = [403, 404, 500, 503];
const GHOST_GLYPHS = '𓂀 𓆣 𓋹 𓅃 𓆑 𓇋 𓏏 𓊵 𓍿 𓅓';

/**
 * The site's own error page: a traveller lost in the tomb. The
 * status code stands huge in gold leaf over a drift of ghost
 * glyphs, with the way back lit clearly. Rendered by the
 * exception handler for 403/404/503 (and 500 in production).
 */
export default function Error({ status = 500 }) {
    const { t } = useLocale();
    const code = KNOWN.includes(Number(status)) ? Number(status) : 500;

    return (
        <AppLayout>
            <Head title={`${code} — ${t('brand.name')}`} />
            <section className="relative overflow-hidden">
                <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 pb-24 pt-[148px] text-center sm:px-6">
                    <p aria-hidden="true" className="font-glyph pointer-events-none absolute inset-x-0 top-24 select-none whitespace-nowrap text-center text-[7rem] leading-none text-gold-500/[0.07] sm:text-[10rem]">
                        {GHOST_GLYPHS}
                    </p>

                    <p className="font-display text-gold-shine relative text-[6.5rem] font-bold leading-none sm:text-[9rem]">
                        {code}
                    </p>

                    <h1 className="font-display relative mt-2 text-3xl font-bold text-sand-100 sm:text-4xl">
                        {t(`errors.${code}.title`)}
                    </h1>
                    <p className="relative mt-4 max-w-md leading-loose text-sand-100/70">
                        {t(`errors.${code}.text`)}
                    </p>

                    <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
                        <Button href="/">{t('errors.home')}</Button>
                        <Button href="/tours" variant="secondaryDark">{t('errors.toursBtn')}</Button>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
