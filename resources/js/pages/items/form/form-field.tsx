import OwnInput from '@/components/own/own-input';
import OwnTextarea from '@/components/own/own-textarea';
import { FieldGroup, FieldSet } from '@/components/ui/field';
import { Criterion, ItemForm } from '@/types';
import { Image, ListChecks } from 'lucide-react';

interface FormFieldProps {
    criteria: Criterion[];
    data: ItemForm;
    setData: <K extends keyof ItemForm>(
        field: K,
        value: ItemForm[K],
    ) => void;
    errors: Record<string, string>;
    processing: boolean;
    isEdit?: boolean;
}

export default function FormField({
    criteria,
    data,
    setData,
    errors,
    processing,
    isEdit = false,
}: FormFieldProps) {
    return (
        <FieldGroup>
            <FieldSet>
                <OwnInput
                    id="name"
                    label="Item Name"
                    placeholder="Item name"
                    autoComplete="item-name"
                    autoFocus
                    leadingElement={<ListChecks />}
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    disabled={processing}
                    error={errors.name}
                />

                <OwnInput
                    id="image"
                    label={isEdit ? 'Change Image' : 'Image'}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    leadingElement={<Image />}
                    onChange={(e) =>
                        setData(
                            'image',
                            e.target.files ? e.target.files[0] : null,
                        )
                    }
                    disabled={processing}
                    description="Maximum file size: 2MB."
                    error={errors.image}
                />

                <OwnTextarea
                    id="description"
                    label="Description"
                    placeholder="Description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    disabled={processing}
                    error={errors.description}
                />

                {/*  TODO: List of field  */}
            </FieldSet>
        </FieldGroup>
    );
}
