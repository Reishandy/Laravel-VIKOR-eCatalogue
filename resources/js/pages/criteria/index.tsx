import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/criteria';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Criteria',
        href: index().url,
    },
];

export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Criteria" />
            PPPP
        </AppLayout>
    );
}
