import { Head } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import TourForm from './Form';
import { useLocale } from '../../../i18n/LocaleContext';

export default function Create({ destinations, types }) {
    const { t } = useLocale();

    return (
        <AdminLayout title={t('admin.createTour')}>
            <Head title={t('admin.createTour')} />
            <TourForm destinations={destinations} types={types} />
        </AdminLayout>
    );
}
