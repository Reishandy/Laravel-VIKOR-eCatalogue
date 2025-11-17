import OwnButton from '@/components/own/own-button';
import OwnDialog from '@/components/own/own-dialog';
import { update } from '@/routes/criteria';
import { Criterion, CriterionForm } from '@/types';
import { useForm } from '@inertiajs/react';
import { ArrowDownToLine, Trash2 } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';
import FormField from '@/pages/criteria/form/form-field';

interface EditFormState {
    criterion: Criterion;
    open: boolean;
    setOpen: (open: boolean) => void;
    onDelete: (criterion: Criterion) => void;
}

export default function EditForm({
    criterion,
    open,
    setOpen,
    onDelete,
}: EditFormState) {
    const { data, setData, put, processing, errors, reset, clearErrors } =
        useForm<Required<CriterionForm>>({
            name: criterion.name,
            description: criterion.description,
            type: criterion.type,
            max_value: criterion.max_value,
        });

    useEffect(() => {
        setData({
            name: criterion.name,
            description: criterion.description,
            type: criterion.type,
            max_value: criterion.max_value,
        });
    }, [criterion, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(update(criterion.id).url, {
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
            dialogTitle={`Edit "${criterion.name}"`}
            dialogDescription="Modify the details of the criterion below."
            dialogFooter={
                <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                    <OwnButton
                        icon={<Trash2 />}
                        variant="destructive"
                        onClick={() => onDelete(criterion)}
                    >
                        Delete
                    </OwnButton>

                    <OwnButton
                        icon={<ArrowDownToLine />}
                        onClick={submit}
                        isProcessing={processing}
                    >
                        Save Changes
                    </OwnButton>
                </div>
            }
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
