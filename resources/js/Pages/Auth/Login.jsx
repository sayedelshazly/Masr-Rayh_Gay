import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import AuthShell from '../../Components/AuthShell';
import { useLocale } from '../../i18n/LocaleContext';

const fieldClass =
    'w-full rounded-md border border-sand-100/20 bg-white/5 px-4 py-3 text-sm font-medium text-sand-100 outline-none transition placeholder:text-sand-100/35 focus:border-gold-500 focus:shadow-[0_0_0_4px_rgba(201,162,75,0.10)]';
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

            <AuthShell>
                <div className="auth-rise" style={{ animationDelay: '90ms' }}>
                    <span aria-hidden="true" className="block h-px w-10 bg-gradient-to-l from-transparent via-gold-500 to-gold-300" />
                    <h1 className="font-display mt-4 text-2xl font-extrabold text-sand-100 sm:text-3xl">{t('auth.login')}</h1>
                    <p className="mt-2 text-sm leading-relaxed text-sand-100/75">{t('auth.loginSubtitle')}</p>
                </div>

                <form onSubmit={submit} noValidate className="mt-7 space-y-5">
                    <div className="auth-rise" style={{ animationDelay: '190ms' }}>
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

                    <div className="auth-rise" style={{ animationDelay: '290ms' }}>
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

                    <label
                        className="auth-rise flex cursor-pointer items-center gap-2 text-sm font-medium text-sand-100/80"
                        style={{ animationDelay: '390ms' }}
                    >
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-sand-100/30 accent-gold-500"
                            checked={data.remember}
                            onChange={(event) => setData('remember', event.target.checked)}
                        />
                        {t('auth.rememberMe')}
                    </label>

                    <div className="auth-rise" style={{ animationDelay: '470ms' }}>
                        <button
                            type="submit"
                            disabled={processing}
                            className="font-display w-full min-h-[44px] rounded-md bg-gold-500 px-5 py-3 text-sm font-bold text-ink-900 shadow-[0_10px_30px_rgba(201,162,75,0.30)] transition hover:-translate-y-0.5 hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? t('auth.processing') : t('auth.login')}
                        </button>
                    </div>
                </form>

                <p className="auth-rise mt-7 text-center text-sm text-sand-100/55" style={{ animationDelay: '550ms' }}>
                    {t('auth.noAccount')}{' '}
                    <Link href="/register" className="font-bold text-gold-300 transition-colors hover:text-gold-500">
                        {t('auth.register')}
                    </Link>
                </p>
            </AuthShell>
        </AppLayout>
    );
}
