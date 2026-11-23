import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Reveal from '../../Components/Reveal';
import { useLocale } from '../../i18n/LocaleContext';

const fieldClass =
    'w-full rounded-md border border-sand-100/20 bg-white/5 px-4 py-3 text-sm font-medium text-sand-100 outline-none transition-colors placeholder:text-sand-100/35 focus:border-gold-500';
const labelClass = 'font-display mb-1.5 block text-sm font-bold text-sand-100/80';

function FieldError({ message }) {
    if (!message) {
        return null;
    }

    return <p className="mt-1.5 text-xs font-medium text-red-300">{message}</p>;
}

export default function Login() {
    const { t, locale } = useLocale();

    const { data, setData, post, processing, errors, transform } = useForm({
        email: '',
        password: '',
        remember: false,
        locale,
    });

    transform((formData) => ({ ...formData, locale }));

    const submit = (event) => {
        event.preventDefault();
        post('/login');
    };

    return (
        <AppLayout>
            <Head title={t('auth.metaLogin')} />

            <section>
                <div className="mx-auto max-w-md px-4 py-14 sm:px-6">
                    <Reveal>
                    <div className="rounded-lg bg-nile-950/70 p-6 shadow-lg shadow-black/25 ring-1 ring-white/10 backdrop-blur sm:p-8">
                        <h1 className="font-display text-2xl font-extrabold text-sand-100">{t('auth.login')}</h1>
                        <p className="mt-2 text-sm leading-relaxed text-sand-100/75">{t('auth.loginSubtitle')}</p>

                        <form onSubmit={submit} noValidate className="mt-6 space-y-5">
                            <div>
                                <label htmlFor="email" className={labelClass}>{t('auth.email')}</label>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    className={fieldClass}
                                    placeholder={t('auth.emailPlaceholder')}
                                    value={data.email}
                                    onChange={(event) => setData('email', event.target.value)}
                                />
                                <FieldError message={errors.email} />
                            </div>

                            <div>
                                <label htmlFor="password" className={labelClass}>{t('auth.password')}</label>
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    className={fieldClass}
                                    value={data.password}
                                    onChange={(event) => setData('password', event.target.value)}
                                />
                                <FieldError message={errors.password} />
                            </div>

                            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-sand-100/80">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-sand-100/30 accent-gold-500"
                                    checked={data.remember}
                                    onChange={(event) => setData('remember', event.target.checked)}
                                />
                                {t('auth.rememberMe')}
                            </label>

                            <button
                                type="submit"
                                disabled={processing}
                                className="font-display w-full min-h-[44px] rounded-md bg-gold-500 px-5 py-3 text-sm font-bold text-ink-900 shadow-sm transition-colors hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? t('auth.processing') : t('auth.login')}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-sand-100/55">
                            {t('auth.noAccount')}{' '}
                            <Link href="/register" className="font-bold text-gold-300 transition-colors hover:text-gold-500">
                                {t('auth.register')}
                            </Link>
                        </p>
                    </div>
                    </Reveal>
                </div>
            </section>
        </AppLayout>
    );
}
