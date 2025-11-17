import { useItemsColumn } from '@/components/column/items-column';
import OwnButton from '@/components/own/own-button';
import OwnInput from '@/components/own/own-input';
import OwnPageContainer from '@/components/own/own-page-container';
import { DataTable } from '@/components/table/data-table';
import DataTablePagination from '@/components/table/data-table-pagination';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/items';
import { type BreadcrumbItem, Item, ItemsResponse } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import { Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Items',
        href: index().url,
    },
];

interface ItemsPageProps {
    flash: {
        success?: string;
        error?: string;
        description?: string;
        timestamp?: string;
    };
    items: ItemsResponse;
    total: number;

    [key: string]: unknown;
}

export default function Index({ items, total }: ItemsPageProps) {
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

    const handleEdit = (item: Item) => {
        toast.warning(`not implemented yet, item id: ${item.id}`);
    };
    const handleDelete = (item: Item) => {
        toast.warning(`not implemented yet, item id: ${item.id}`);
    };

    const itemsColumns = useItemsColumn({ handleEdit, handleDelete });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Items" />

            <OwnPageContainer
                title="Items"
                description="Manage your items."
                headerAction={
                    <OwnButton
                        variant="default"
                        icon={<Plus />}
                        onClick={() => toast.warning('not implemented yet')}
                    >
                        Add Item
                    </OwnButton>
                }
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

                    <DataTable
                        columns={itemsColumns}
                        data={items.data}
                        onRowClick={handleEdit}
                    />

                    <DataTablePagination
                        links={items.links}
                        current_page={items.current_page}
                        last_page={items.last_page}
                        prev_page_url={items.prev_page_url}
                        next_page_url={items.next_page_url}
                    />
                </div>
            </OwnPageContainer>
        </AppLayout>
    );
}
