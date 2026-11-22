import { useLocale } from '../../i18n/LocaleContext';

export const STATUS_STYLES = {
    pending: 'bg-gold/20 text-gold-deep ring-gold/50',
    confirmed: 'bg-turquoise-600/15 text-ink ring-turquoise-600/50',
    cancelled: 'bg-carnelian-600/10 text-carnelian-600 ring-carnelian-600/40',
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
