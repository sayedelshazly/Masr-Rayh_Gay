import { Head } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import TourForm from './Form';
import { useLocale } from '../../../i18n/LocaleContext';

export default function Edit({ tour, destinations, types }) {
    const { t } = useLocale();

    return (
        <AdminLayout title={`${t('admin.editTour')} — ${tour.title_en}`}>
            <Head title={t('admin.editTour')} />
            <TourForm tour={tour} destinations={destinations} types={types} />
        </AdminLayout>
    );
}
