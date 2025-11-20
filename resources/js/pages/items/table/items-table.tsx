import { useItemsColumn } from '@/pages/items/column/items-column';
import { DataTable } from '@/components/table/data-table';
import DataTablePagination from '@/components/table/data-table-pagination';
import DeleteForm from '@/pages/items/form/delete-form';
import { Criterion, Item, ItemsResponse, SharedData } from '@/types';
import { useEffect, useState } from 'react';
import EditForm from '@/pages/items/form/edit-form';
import { usePage } from '@inertiajs/react';

interface ItemsTableProps {
    items: ItemsResponse;
}

export function ItemsTable({ items }: ItemsTableProps) {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleEdit = (item: Item) => {
        setSelectedItem(item);
        setEditDialogOpen(true);
    };

    const handleDelete = (item: Item) => {
        if (item.id === 1 && item.name === 'Price') {
            return;
        }

        setSelectedItem(item);
        setDeleteDialogOpen(true);
    };

    const itemsColumns = useItemsColumn({ handleEdit, handleDelete });

    return (
        <div className="space-y-4">
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

            {selectedItem && (
                <div>
                    <EditForm
                        key={selectedItem.id}
                        item={selectedItem}
                        open={editDialogOpen}
                        setOpen={setEditDialogOpen}
                        onDelete={(item) => {
                            setEditDialogOpen(false);
                            handleDelete(item);
                        }}
                    />

                    <DeleteForm
                        key={selectedItem.id}
                        item={selectedItem}
                        open={deleteDialogOpen}
                        setOpen={setDeleteDialogOpen}
                    />
                </div>
            )}
        </div>
    );
}
