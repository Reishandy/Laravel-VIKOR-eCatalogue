import { useCriteriaColumn } from '@/components/column/criteria-column';
import OwnButton from '@/components/own/own-button';
import OwnInput from '@/components/own/own-input';
import OwnPageContainer from '@/components/own/own-page-container';
import { DataTable } from '@/components/table/data-table';
import DataTablePagination from '@/components/table/data-table-pagination';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/criteria';
import {
    type BreadcrumbItem,
    CriteriaResponse,
    Criterion,
    Flash,
} from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import { Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CriteriaTable } from '@/pages/criteria/table/criteria-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Criteria',
        href: index().url,
    },
];

interface CriterionPageProps {
    flash: Flash;
    criteria: CriteriaResponse;
    total: number;

    [key: string]: unknown;
}

export default function Index({ criteria, total }: CriterionPageProps) {
    const { flash } = usePage<CriterionPageProps>().props;
    const [searchParam, setSearchParam] = useState<string | undefined>(
        undefined,
    );
    const debouncedSearch = useMemo(
        () =>
            debounce((search: string) => {
                router.get(
                    index().url,
                    { search },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        preserveUrl: true,
                    },
                );
            }, 300),
        [],
    );

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success, {
                description: flash.description,
            });
        }

        if (flash.error) {
            toast.error(flash.error, {
                description: flash.description,
            });
        }
    }, [flash.success, flash.error, flash.description, flash.timestamp]);

    useEffect(() => {
        if (searchParam !== undefined) debouncedSearch(searchParam);
    }, [searchParam, debouncedSearch]);

    // TODO: Oncancel for update and add form

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Criteria" />

            <OwnPageContainer
                title="Criteria"
                description="Manage the items criteria fields."
                headerAction={// TODO: Add form
                    <OwnButton
                        variant="default"
                        icon={<Plus />}
                        onClick={() => toast.warning('not implemented yet')}
                    >
                        Add Criterion
                    </OwnButton>
                }
            >
                <div className="space-y-4">
                    <div className="flex w-full flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0">
                        <OwnInput
                            id="search"
                            type="text"
                            placeholder="Search..."
                            autoComplete="criteria-search"
                            leadingElement={<Search />}
                            value={searchParam}
                            onChange={(e) => setSearchParam(e.target.value)}
                            className="md:max-w-md"
                        />

                        <div className="text-sm">
                            Showing {criteria.data.length} out of {total}{' '}
                            entries
                        </div>
                    </div>

                    <CriteriaTable criteria={criteria} />
                </div>
            </OwnPageContainer>
        </AppLayout>
    );
}
