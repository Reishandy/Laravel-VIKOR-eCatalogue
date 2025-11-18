import OwnButton from '@/components/own/own-button';
import OwnDialog from '@/components/own/own-dialog';
import { update } from '@/routes/items';
import { Item, ItemForm } from '@/types';
import { useForm } from '@inertiajs/react';
import { ArrowDownToLine, Trash2 } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';
import FormField from '@/pages/items/form/form-field';

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
    const { data, setData, put, processing, errors, reset, clearErrors } =
        useForm<Required<ItemForm>>({
            name: item.name,
            description: item.description || '',
            image: null,
            fields: item.criteria?.map((field) => ({
                id: field.id,
                value: field.pivot!.value,
            })) || [],
        });

    useEffect(() => {
        setData({
            name: item.name,
            description: item.description || '',
            image: null,
            fields: item.criteria?.map((field) => ({
                id: field.id,
                value: field.pivot!.value,
            })) || [],
        });
    }, [item, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(update(item.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                clearErrors();
            },
        });
    };

    return (
        <OwnDialog
            open={open}
            onOpenChange={setOpen}
            dialogTitle={`Edit "${item.name}"`}
            dialogDescription="Modify the details of the item below."
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
        >
            <FormField
                criteria={item.criteria??[]}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                isEdit={true}
            />
        </OwnDialog>
    );
}
