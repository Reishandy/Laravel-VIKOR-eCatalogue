import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/criteria';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import OwnPageContainer from '@/components/own/own-page-container';
import OwnButton from '@/components/own/own-button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

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

            <OwnPageContainer
                title="Criteria"
                description="Manage the items criteria fields."
                headerAction={
                    <OwnButton
                        variant="default"
                        icon={<Plus />}
                        onClick={() => toast.warning('not implemented yet')}
                    >
                        Add Criterion
                    </OwnButton>
                }
            >
                <div>
                    {/* DataTable component to be implemented here */}
                </div>
            </OwnPageContainer>
        </AppLayout>
    );
}
