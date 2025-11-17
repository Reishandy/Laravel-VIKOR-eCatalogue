import { Badge } from '@/components/ui/badge';
import { Criterion } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { SquarePen, Trash } from 'lucide-react';

interface CriteriaColumnProps {
    handleEdit: (criterion: Criterion) => void;
    handleDelete: (criterion: Criterion) => void;
}

export function useCriteriaColumn({
    handleEdit,
    handleDelete,
}: CriteriaColumnProps) {
    return useMemo(
        (): ColumnDef<Criterion>[] => [
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
                id: 'name',
                accessorKey: 'name',
                header: () => (
                    <div className="w-30 text-start font-extrabold">
                        Criterion Name
                    </div>
                ),
                cell: ({ row }) => {
                    return (
                        <div className="line-clamp-2 w-30 text-start font-medium text-wrap overflow-ellipsis">
                            {row.getValue('name')}
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
                id: 'type',
                accessorKey: 'type',
                header: () => (
                    <div className="text-center font-extrabold">Type</div>
                ),
                cell: ({ row }) => {
                    return (
                        <div className="flex justify-center">
                            <Badge
                                variant={
                                    row.getValue('type') === 'cost'
                                        ? 'secondary'
                                        : 'default'
                                }
                                className="text-md w-20 px-2 py-1"
                            >
                                {row.getValue('type')}
                            </Badge>
                        </div>
                    );
                },
            },
            {
                id: 'max_value',
                accessorKey: 'max_value',
                header: () => (
                    <div className="text-center font-extrabold">Range</div>
                ),
                cell: ({ row }) => {
                    return (
                        <div className="text-center">
                            <Badge
                                variant="outline"
                                className="text-md w-30 px-2 py-1"
                            >
                                0 -{' '}
                                {row.getValue('max_value') === -1
                                    ? '∞'
                                    : row.getValue('max_value')}
                            </Badge>
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
