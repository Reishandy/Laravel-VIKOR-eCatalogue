import OwnInput from '@/components/own/own-input';
import OwnTextarea from '@/components/own/own-textarea';
import {
    FieldDescription,
    FieldGroup,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from '@/components/ui/field';
import { Criterion, ItemForm, SharedData } from '@/types';
import { Image, ListChecks } from 'lucide-react';
import { useCurrencySymbol } from '@/hooks/use-currency';
import { usePage } from '@inertiajs/react';

interface FormFieldProps {
    criteria: Criterion[];
    data: ItemForm;
    setData: <K extends keyof ItemForm>(field: K, value: ItemForm[K]) => void;
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
    const { auth } = usePage<SharedData>().props;
    const currencySymbol = useCurrencySymbol(auth.user?.currency ?? 'USD');

    // TODO: 2 side by side for larger screens?
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

                {/*Separate for Price field, by default it is id 1*/}
                <OwnInput
                    id="criterion-1"
                    label="Price"
                    type="number"
                    placeholder="Enter Item Price"
                    leadingElement={currencySymbol}
                    value={
                        data.fields.find((f) => f.id === 1)
                            ? String(data.fields.find((f) => f.id === 1)!.value)
                            : ''
                    }
                    onChange={(e) => {
                        const updatedFields = data.fields.map((f) =>
                            f.id === 1
                                ? { ...f, value: Number(e.target.value) }
                                : f,
                        );
                        setData('fields', updatedFields);
                    }}
                    disabled={processing}
                    error={errors['fields.1'] || ''}
                />
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
                <FieldLegend>Fields</FieldLegend>
                <FieldDescription>Additional dynamic item fields</FieldDescription>

                {/*  TODO: Add warning if value is 0 to indicate new unset criterion  */}
                {criteria
                    .filter((criterion) => criterion.id !== 1) // Exclude price field (id 1)
                    .map((criterion) => {
                        const field = data.fields.find(
                            (f) => f.id === criterion.id,
                        );

                        return (
                            <OwnInput
                                key={criterion.id}
                                id={`criterion-${criterion.id}`}
                                label={criterion.name}
                                type="number"
                                placeholder={`Enter ${criterion.name} value`}
                                value={field ? String(field.value) : ''}
                                onChange={(e) => {
                                    const updatedFields = data.fields.map(
                                        (f) =>
                                            f.id === criterion.id
                                                ? {
                                                      ...f,
                                                      value: Number(
                                                          e.target.value,
                                                      ),
                                                  }
                                                : f,
                                    );
                                    setData('fields', updatedFields);
                                }}
                                disabled={processing}
                                error={errors[`fields.${criterion.id}`] || ''}
                            />
                        );
                    })}
            </FieldSet>
        </FieldGroup>
    );
}
