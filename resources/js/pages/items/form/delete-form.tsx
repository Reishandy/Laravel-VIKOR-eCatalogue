import OwnButton from '@/components/own/own-button';
import OwnDialog from '@/components/own/own-dialog';
import { destroy } from '@/routes/items';
import { useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Item } from '@/types';

interface DeleteFormProps {
    item: Item;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function DeleteForm({
    item,
    open,
    setOpen,
}: DeleteFormProps) {
    const { delete: destroyMethod, processing } = useForm();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        destroyMethod(destroy(item.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
            }
        });
    };

    return (
        <OwnDialog
            open={open}
            onOpenChange={setOpen}
            dialogTitle={`Are you sure you want to delete "${item.name}"?`}
            dialogDescription="This action cannot be undone. This will permanently delete the item."
            dialogFooter={
                <OwnButton
                    icon={<Trash2 />}
                    variant="destructive"
                    onClick={submit}
                    isProcessing={processing}
                >
                    Delete "{item.name}"
                </OwnButton>
            }
        />
    );
}
