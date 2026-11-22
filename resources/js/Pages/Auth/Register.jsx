import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { useLocale } from '../../i18n/LocaleContext';

const fieldClass =
    'w-full rounded-2xl border border-gold/40 bg-white px-4 py-3 text-sm font-medium text-ink outline-none transition-colors focus:border-gold-deep';
const labelClass = 'font-display mb-1.5 block text-sm font-bold text-lapis-deep';

function FieldError({ message }) {
    if (!message) {
        return null;
    }

    return <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p>;
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

            <section className="bg-gradient-to-b from-sand via-ivory to-ivory">
                <div className="mx-auto max-w-md px-4 py-14 sm:px-6">
                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sand sm:p-8">
                        <h1 className="font-display text-2xl font-extrabold text-lapis-deep">{t('auth.register')}</h1>
                        <p className="mt-2 text-sm leading-relaxed text-ink/65">{t('auth.registerSubtitle')}</p>

                        <form onSubmit={submit} noValidate className="mt-6 space-y-5">
                            <div>
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
                                    autoComplete="new-password"
                                    className={fieldClass}
                                    placeholder={t('auth.passwordPlaceholder')}
                                    value={data.password}
                                    onChange={(event) => setData('password', event.target.value)}
                                />
                                <FieldError message={errors.password} />
                            </div>

                            <div>
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

                            <button
                                type="submit"
                                disabled={processing}
                                className="font-display w-full rounded-full bg-gold px-5 py-3 text-sm font-bold text-ink shadow-sm transition-colors hover:bg-gold-deep hover:text-ivory disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? t('auth.processing') : t('auth.register')}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-ink/65">
                            {t('auth.haveAccount')}{' '}
                            <Link href="/login" className="font-bold text-gold-deep transition-colors hover:text-lapis">
                                {t('auth.login')}
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
