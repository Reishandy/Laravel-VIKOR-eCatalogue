import OwnInput from '@/components/own/own-input';
import OwnPageContainer from '@/components/own/own-page-container';
import AppLayout from '@/layouts/app-layout';
import AddForm from '@/pages/items/form/add-form';
import { ItemsTable } from '@/pages/items/table/items-table';
import { index } from '@/routes/items';
import { type BreadcrumbItem, Criterion, Flash, ItemsResponse } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Items',
        href: index().url,
    },
];

interface ItemsPageProps {
    flash: Flash;
    items: ItemsResponse;
    criteria: Criterion[];
    total: number;

    [key: string]: unknown;
}

export default function Index({ items, criteria, total }: ItemsPageProps) {
    const { flash } = usePage<ItemsPageProps>().props;
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Items" />

            <OwnPageContainer
                title="Items"
                description="Manage your items."
                headerAction={<AddForm criteria={criteria} />}
            >
                <div className="space-y-4">
                    <div className="flex w-full flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0">
                        <OwnInput
                            id="search"
                            type="text"
                            placeholder="Search..."
                            autoComplete="items-search"
                            leadingElement={<Search />}
                            value={searchParam}
                            onChange={(e) => setSearchParam(e.target.value)}
                            className="md:max-w-md"
                        />

                        <div className="text-sm">
                            Showing {items.data.length} out of {total} entries
                        </div>
                    </div>

                    <ItemsTable items={items} />
                </div>
            </OwnPageContainer>
        </AppLayout>
    );
}
