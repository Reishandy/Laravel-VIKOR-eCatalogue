import { Item } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { SquarePen, Trash, TriangleAlert } from 'lucide-react';
import { useMemo } from 'react';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';

interface ItemsColumnProps {
    handleEdit: (item: Item) => void;
    handleDelete: (item: Item) => void;
}

export function useItemsColumn({ handleEdit, handleDelete }: ItemsColumnProps) {
    return useMemo(
        (): ColumnDef<Item>[] => [
            {
                id: 'id',
                accessorKey: 'id',
                header: () => (
                    <div className="w-10 text-center font-extrabold">ID</div>
                ),
                cell: ({ row }) => {
                    return (
                        <div className="w-10 text-center">
                            {row.getValue('id')}
                        </div>
                    );
                },
            },
            {
                id: 'image',
                accessorKey: 'image',
                header: () => (
                    <div className="w-20 text-center font-extrabold">Image</div>
                ),
                cell: ({ row }) => {
                    const imageUrl = row.getValue('image') as string;
                    return (
                        <div className="flex w-20 justify-center">
                            {imageUrl ? (
                                <div className="size-20 overflow-hidden rounded-lg border">
                                    <img
                                        src={imageUrl}
                                        alt="Item"
                                        className="size-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex size-20 items-center justify-center rounded-lg border bg-muted text-xs text-muted-foreground">
                                    No Image
                                </div>
                            )}
                        </div>
                    );
                },
            },
            {
                id: 'name',
                accessorKey: 'name',
                header: () => (
                    <div className="w-30 text-start font-extrabold">
                        Item Name
                    </div>
                ),
                cell: ({ row }) => {
                    // Check if any of the criteria have a pivot value of 0 or undefined
                    const criteria = row.original.criteria || [];
                    const hasUnsetCriterion = criteria.some(
                        (criterion) =>
                            !criterion.pivot || criterion.pivot.value === 0,
                    );

                    return (
                        <div className="flex flex-row items-center space-x-2">
                            {hasUnsetCriterion && (
                                // THis is not updating when switching pages
                                <HoverCard>
                                    <HoverCardTrigger>
                                        <TriangleAlert className="size-5 text-destructive transition-all duration-300 hover:scale-105" />
                                    </HoverCardTrigger>
                                    <HoverCardContent className="bg-destructive text-sm">
                                        There is an unset criterion value for
                                        this item, please edit the item to set
                                        it.
                                    </HoverCardContent>
                                </HoverCard>
                            )}

                            <div className="line-clamp-2 w-30 text-start font-medium text-wrap overflow-ellipsis">
                                {row.getValue('name')}
                            </div>
                        </div>
                    );
                },
            },
            {
                id: 'description',
                accessorKey: 'description',
                header: () => (
                    <div className="max-w-2xl min-w-sm text-start font-extrabold md:max-w-full">
                        Description
                    </div>
                ),
                cell: ({ row }) => {
                    return (
                        <div className="line-clamp-2 max-w-2xl min-w-sm text-start text-wrap overflow-ellipsis md:max-w-full">
                            {row.getValue('description')}
                        </div>
                    );
                },
            },
            {
                id: 'actions',
                cell: ({ row }) => {
                    return (
                        <div className="flex flex-row items-center justify-center gap-x-2">
                            <SquarePen
                                className="size-5 cursor-pointer text-primary transition-transform duration-300 hover:scale-105 hover:text-primary/70 active:scale-95"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(row.original);
                                }}
                            />
                            <Trash
                                className="size-5 cursor-pointer text-destructive transition-transform duration-300 hover:scale-105 hover:text-destructive/70 active:scale-95"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(row.original);
                                }}
                            />
                        </div>
                    );
                },
            },
        ],
        [handleEdit, handleDelete],
    );
}
