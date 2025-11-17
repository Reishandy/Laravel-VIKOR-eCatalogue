import { useCriteriaColumn } from '@/components/column/criteria-column';
import { DataTable } from '@/components/table/data-table';
import DataTablePagination from '@/components/table/data-table-pagination';
import DeleteForm from '@/pages/criteria/form/delete-form';
import { CriteriaResponse, Criterion } from '@/types';
import { useState } from 'react';
import { toast } from 'sonner';
import EditForm from '@/pages/criteria/form/edit-form';

interface CriteriaTableProps {
    criteria: CriteriaResponse;
}

export function CriteriaTable({ criteria }: CriteriaTableProps) {
    const [selectedCriterion, setSelectedCriterion] =
        useState<Criterion | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleEdit = (criterion: Criterion) => {
        if (criterion.id === 1 && criterion.name === 'Price') {
            toast.error('The Price criterion cannot be modified.', {
                description:
                    'This criterion is essential for the system and cannot be modified.',
            });
            return;
        }

        setSelectedCriterion(criterion);
        setEditDialogOpen(true);
    };

    const handleDelete = (criterion: Criterion) => {
        if (criterion.id === 1 && criterion.name === 'Price') {
            return;
        }

        setSelectedCriterion(criterion);
        setDeleteDialogOpen(true);
    };

    const criteriaColumns = useCriteriaColumn({ handleEdit, handleDelete });

    return (
        <div className="space-y-4">
            <DataTable
                columns={criteriaColumns}
                data={criteria.data}
                onRowClick={handleEdit}
            />

            <DataTablePagination
                links={criteria.links}
                current_page={criteria.current_page}
                last_page={criteria.last_page}
                prev_page_url={criteria.prev_page_url}
                next_page_url={criteria.next_page_url}
            />

            {selectedCriterion && (
                <div>
                    <EditForm
                        criterion={selectedCriterion}
                        open={editDialogOpen}
                        setOpen={setEditDialogOpen}
                        onDelete={(criterion) => {
                            setEditDialogOpen(false);
                            handleDelete(criterion);
                        }}
                    />

                    <DeleteForm
                        criterion={selectedCriterion}
                        open={deleteDialogOpen}
                        setOpen={setDeleteDialogOpen}
                    />
                </div>
            )}
        </div>
    );
}
