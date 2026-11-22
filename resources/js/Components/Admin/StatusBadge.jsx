import { useLocale } from '../../i18n/LocaleContext';

export const STATUS_STYLES = {
    pending: 'bg-gold/20 text-gold-deep ring-gold/50',
    confirmed: 'bg-emerald-100 text-emerald-800 ring-emerald-300',
    cancelled: 'bg-red-100 text-red-700 ring-red-300',
};

export default function StatusBadge({ status }) {
    const { t } = useLocale();
    const style = STATUS_STYLES[status] ?? STATUS_STYLES.pending;

    return (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${style}`}>
            {t(`admin.statuses.${status}`)}
        </span>
    );
}
