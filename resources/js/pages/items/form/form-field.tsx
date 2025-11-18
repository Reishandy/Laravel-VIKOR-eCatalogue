import OwnInput from '@/components/own/own-input';
import OwnTextarea from '@/components/own/own-textarea';
import {
    FieldDescription, FieldError,
    FieldGroup,
    FieldLegend,
    FieldSet,
} from '@/components/ui/field';
import { useCurrencySymbol } from '@/hooks/use-currency';
import { Criterion, ItemForm, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Image, ListChecks } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect } from 'react';

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

    const updateField = (id: number, value: number) => {
        const updatedFields = data.fields.map((f) =>
            f.id === id ? { ...f, value } : f,
        );
        setData('fields', updatedFields);
    };

    useEffect(() => {
        console.log(errors)
    }, [errors]);

    return (
        <FieldGroup>
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <FieldSet className="flex-1">
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
                        label="Description (Optional)"
                        placeholder="Description"
                        minDisplayRows={8}
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
                        trailingElement={auth.user.currency}
                        value={
                            data.fields.find((f) => f.id === 1)?.value !==
                            undefined
                                ? data.fields
                                      .find((f) => f.id === 1)!
                                      .value.toString()
                                : ''
                        }
                        onChange={(e) => updateField(1, Number(e.target.value))}
                        disabled={processing}
                        error={errors['fields.1.value'] || ''}
                    />
                </FieldSet>

                {criteria.length > 1 && (
                    <ScrollArea className="flex-1 max-h-[60vh] md:pr-2">
                        <FieldSet>
                            <FieldLegend>Additional Criteria Fields</FieldLegend>
                            <FieldDescription>
                                Can be scrolled if many criteria exist.
                            </FieldDescription>
                            {Object.keys(errors).some((key) =>
                                key.startsWith('fields.'),
                            ) && (
                                <FieldError>
                                    There are errors in the criteria fields, check below.
                                </FieldError>
                            )}

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
                                            trailingElement={`/ ${criterion.max_value}`}
                                            value={field ? String(field.value) : ''}
                                            onChange={(e) => {
                                                updateField(
                                                    criterion.id,
                                                    Number(e.target.value),
                                                );
                                            }}
                                            disabled={processing}
                                            description={criterion.description}
                                            error={
                                                errors[`fields.${criterion.id}.value`] ||
                                                ''
                                            }
                                            min={1}
                                            max={criterion.max_value}
                                        />
                                    );
                                })}
                        </FieldSet>
                    </ScrollArea>
                )}
            </div>
        </FieldGroup>
    );
}
