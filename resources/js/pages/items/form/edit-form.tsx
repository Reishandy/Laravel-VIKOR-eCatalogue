import OwnButton from '@/components/own/own-button';
import OwnDialog from '@/components/own/own-dialog';
import FormField from '@/pages/items/form/form-field';
import { update } from '@/routes/items';
import { Item, ItemForm } from '@/types';
import { useForm } from '@inertiajs/react';
import { ArrowDownToLine, Trash2 } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';

interface EditFormProp {
    item: Item;
    open: boolean;
    setOpen: (open: boolean) => void;
    onDelete: (item: Item) => void;
}

export default function EditForm({
    item,
    open,
    setOpen,
    onDelete,
}: EditFormProp) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<Required<ItemForm>>({
            name: item.name,
            description: item.description || '',
            image: null,
            fields:
                item.criteria?.map((field) => ({
                    id: field.id,
                    value: field.pivot!.value,
                })) || [],
            remove_image: false,
        });

    useEffect(() => {
        setData({
            name: item.name,
            description: item.description || '',
            image: null,
            fields:
                item.criteria?.map((field) => ({
                    id: field.id,
                    value: field.pivot!.value,
                })) || [],
            remove_image: false,
        });
    }, [item, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(update(item.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                clearErrors();
            },
        });
    };

    const hasUnsetCriterion = item.criteria?.some(
        (criterion) => !criterion.pivot || criterion.pivot.value === 0,
    );

    return (
        <OwnDialog
            open={open}
            onOpenChange={setOpen}
            dialogTitle={`Edit "${item.name}"`}
            dialogDescription={
                <div>
                    Modify the details of the item below.
                    {hasUnsetCriterion && (
                        <p className="mt-2 text-sm text-destructive">
                            Some criteria have not been set or have a
                            value of 0. Please ensure all criteria are properly
                            configured.
                        </p>
                    )}
                </div>
            }
            dialogFooter={
                <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                    <OwnButton
                        icon={<Trash2 />}
                        variant="destructive"
                        onClick={() => onDelete(item)}
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
            isLong={true}
            onCancel={() => {
                clearErrors();
                reset();
                setOpen(false);
            }}
        >
            <FormField
                criteria={item.criteria ?? []}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                isEdit={true}
            />
        </OwnDialog>
    );
}
