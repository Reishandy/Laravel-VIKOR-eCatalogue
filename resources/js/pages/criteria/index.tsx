import { useCriteriaColumn } from '@/components/column/criteria-column';
import OwnButton from '@/components/own/own-button';
import OwnPageContainer from '@/components/own/own-page-container';
import { DataTable } from '@/components/table/data-table';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/criteria';
import { type BreadcrumbItem, Criterion, User } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Criteria',
        href: index().url,
    },
];

interface CriterionPageProps {
    auth: {
        user: User;
    };
    flash: {
        success?: string;
        error?: string;
        description?: string;
        timestamp?: string;
    };
    criteria: Criterion[];

    [key: string]: unknown;
}

export default function Index({ criteria }: CriterionPageProps) {
    const { auth, flash } = usePage<CriterionPageProps>().props;
    const criteriaColumns = useCriteriaColumn();

    // TODO: Pagination, Search, Row OnClick, etc.
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
                    <DataTable columns={criteriaColumns} data={criteria} />
                </div>
            </OwnPageContainer>
        </AppLayout>
    );
}
