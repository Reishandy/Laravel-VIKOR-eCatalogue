import OwnButton from '@/components/own/own-button';
import OwnDialog from '@/components/own/own-dialog';
import { store } from '@/routes/criteria';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import FormField from '@/pages/criteria/form/form-field';
import { CriterionForm } from '@/types';
import { index as itemsIndex } from '@/routes/items';

export default function AddForm() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<Required<CriterionForm>>({
            name: '',
            description: '',
            unit: '',
            type: '',
            max_value: 0,
            is_infinite: false
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
            invalidateCacheTags: [itemsIndex().url], // Invalidate items index cache for unset criteria warning
        });
    };

    return (
        <OwnDialog
            open={open}
            onOpenChange={setOpen}
            dialogTrigger={
                <OwnButton variant="default" icon={<Plus />}>
                    Add Criterion
                </OwnButton>
            }
            dialogTitle="Add New Criterion"
            dialogDescription="Fill in the details to create a new criterion."
            dialogFooter={
                <OwnButton
                    icon={<Plus />}
                    onClick={submit}
                    isProcessing={processing}
                >
                    Add Criterion
                </OwnButton>
            }
            onCancel={() => {
                clearErrors()
                setOpen(false);
            }}
        >
            <FormField
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
            />
        </OwnDialog>
    );
}
