import { Criterion } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

export function useCriteriaColumn() {
    return useMemo(
        (): ColumnDef<Criterion>[] => [
            {
                id: 'id',
                accessorKey: 'id',
                header: () => <div className="w-10 text-center font-extrabold">ID</div>,
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
                    <div className="w-30 text-start font-extrabold">Criterion Name</div>
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
                    <div className="max-w-2xl text-start md:max-w-full font-extrabold">
                        Description
                    </div>
                ),
                cell: ({ row }) => {
                    return (
                        <div className="line-clamp-2 max-w-2xl text-start text-wrap overflow-ellipsis md:max-w-full">
                            {row.getValue('description')}
                        </div>
                    );
                },
            },
            {
                id: 'type',
                accessorKey: 'type',
                header: () => <div className="w-10 text-center font-extrabold">Type</div>,
                cell: ({ row }) => {
                    // TODO: Format type value
                    return (
                        <div className="w-10 text-center">
                            {row.getValue('type')}
                        </div>
                    );
                },
            },
            {
                id: 'max_value',
                accessorKey: 'max_value',
                header: () => <div className="w-10 text-center font-extrabold">Range</div>,
                cell: ({ row }) => {
                    // TODO: Format max_value
                    return (
                        <div className="w-10 text-center">
                            {row.getValue('max_value')}
                        </div>
                    );
                },
            },
        ],
        [],
    );
}
