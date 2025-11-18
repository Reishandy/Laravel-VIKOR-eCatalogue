import OwnButton from '@/components/own/own-button';
import OwnDialog from '@/components/own/own-dialog';
import { store } from '@/routes/items';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import FormField from '@/pages/items/form/form-field';
import { Criterion, ItemForm } from '@/types';

interface AddFormProps {
    criteria: Criterion[];
}

export default function AddForm({ criteria }: AddFormProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<Required<ItemForm>>({
            name: '',
            description: '',
            image: null,
            fields: criteria.map((criterion) => ({
                id: criterion.id,
                value: 0,
            })),
            remove_image: false,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(store().url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                setOpen(false);
            },
        });
    };

    return (
        <OwnDialog
            open={open}
            onOpenChange={setOpen}
            dialogTrigger={
                <OwnButton variant="default" icon={<Plus />}>
                    Add Item
                </OwnButton>
            }
            dialogTitle="Add New Item"
            dialogDescription="Fill in the details to create a new item."
            dialogFooter={
                <OwnButton
                    icon={<Plus />}
                    onClick={submit}
                    isProcessing={processing}
                >
                    Add Item
                </OwnButton>
            }
            isLong={true}
            onCancel={() => {
                clearErrors()
                setOpen(false);
            }}
        >
            <FormField
                criteria={criteria}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
            />
        </OwnDialog>
    );
}
