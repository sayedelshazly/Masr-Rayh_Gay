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

export default function Register() {
    const { t, locale } = useLocale();

    const { data, setData, post, processing, errors, transform } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        locale,
    });

    transform((formData) => ({ ...formData, locale }));

    const submit = (event) => {
        event.preventDefault();
        post('/register', {
            onFinish: () => setData('password_confirmation', ''),
        });
    };

    return (
        <AppLayout>
            <Head title={t('auth.metaRegister')} />

            <AuthShell>
                <div className="auth-rise" style={{ animationDelay: '90ms' }}>
                    <span aria-hidden="true" className="block h-px w-10 bg-gradient-to-l from-transparent via-gold-500 to-gold-300" />
                    <h1 className="font-display mt-4 text-2xl font-extrabold text-sand-100 sm:text-3xl">{t('auth.register')}</h1>
                    <p className="mt-2 text-sm leading-relaxed text-sand-100/75">{t('auth.registerSubtitle')}</p>
                </div>

                <form onSubmit={submit} noValidate className="mt-7 space-y-5">
                    <div className="auth-rise" style={{ animationDelay: '190ms' }}>
                        <label htmlFor="name" className={labelClass}>{t('auth.name')}</label>
                        <input
                            id="name"
                            type="text"
                            autoComplete="name"
                            className={fieldClass}
                            placeholder={t('auth.namePlaceholder')}
                            value={data.name}
                            onChange={(event) => setData('name', event.target.value)}
                        />
                        <FieldError message={errors.name} />
                    </div>

                    <div className="auth-rise" style={{ animationDelay: '270ms' }}>
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

                    <div className="auth-rise" style={{ animationDelay: '350ms' }}>
                        <label htmlFor="password" className={labelClass}>{t('auth.password')}</label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            className={fieldClass}
                            placeholder={t('auth.passwordPlaceholder')}
                            value={data.password}
                            onChange={(event) => setData('password', event.target.value)}
                        />
                        <FieldError message={errors.password} />
                    </div>

                    <div className="auth-rise" style={{ animationDelay: '430ms' }}>
                        <label htmlFor="password_confirmation" className={labelClass}>{t('auth.confirmPassword')}</label>
                        <input
                            id="password_confirmation"
                            type="password"
                            autoComplete="new-password"
                            className={fieldClass}
                            placeholder={t('auth.confirmPasswordPlaceholder')}
                            value={data.password_confirmation}
                            onChange={(event) => setData('password_confirmation', event.target.value)}
                        />
                        <FieldError message={errors.password_confirmation} />
                    </div>

                    <div className="auth-rise" style={{ animationDelay: '510ms' }}>
                        <button
                            type="submit"
                            disabled={processing}
                            className="font-display w-full min-h-[44px] rounded-md bg-gold-500 px-5 py-3 text-sm font-bold text-ink-900 shadow-[0_10px_30px_rgba(201,162,75,0.30)] transition hover:-translate-y-0.5 hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? t('auth.processing') : t('auth.register')}
                        </button>
                    </div>
                </form>

                <p className="auth-rise mt-7 text-center text-sm text-sand-100/55" style={{ animationDelay: '590ms' }}>
                    {t('auth.haveAccount')}{' '}
                    <Link href="/login" className="font-bold text-gold-300 transition-colors hover:text-gold-500">
                        {t('auth.login')}
                    </Link>
                </p>
            </AuthShell>
        </AppLayout>
    );
}
