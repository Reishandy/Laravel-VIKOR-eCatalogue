import OwnButton from '@/components/own/own-button';
import OwnDialog from '@/components/own/own-dialog';
import { destroy } from '@/routes/criteria';
import { useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Criterion } from '@/types';
import { index as itemsIndex } from '@/routes/items';

interface DeleteFormProps {
    criterion: Criterion;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function DeleteForm({
    criterion,
    open,
    setOpen,
}: DeleteFormProps) {
    const { delete: destroyMethod, processing } = useForm();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        destroyMethod(destroy(criterion.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
            },
            invalidateCacheTags: [itemsIndex().url], // Invalidate items index cache for unset criteria warning
        });
    };

    return (
        <OwnDialog
            open={open}
            onOpenChange={setOpen}
            dialogTitle={`Are you sure you want to delete "${criterion.name}"?`}
            dialogDescription="This action cannot be undone. This will permanently delete the criterion and all associated data in items."
            dialogFooter={
                <OwnButton
                    icon={<Trash2 />}
                    variant="destructive"
                    onClick={submit}
                    isProcessing={processing}
                >
                    Delete "{criterion.name}"
                </OwnButton>
            }
        />
    );
}
