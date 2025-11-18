import OwnCheckbox from '@/components/own/own-checkbox';
import OwnInput from '@/components/own/own-input';
import OwnSelect from '@/components/own/own-select';
import OwnTextarea from '@/components/own/own-textarea';
import { FieldGroup, FieldSet } from '@/components/ui/field';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { CriterionForm } from '@/types';
import { Hash, Info, ListChecks } from 'lucide-react';

interface FormFieldProps {
    data: CriterionForm;
    setData: <K extends keyof CriterionForm>(
        field: K,
        value: CriterionForm[K],
    ) => void;
    errors: Record<string, string>;
    processing: boolean;
}

export default function FormField({
    data,
    setData,
    errors,
    processing,
}: FormFieldProps) {
    return (
        <FieldGroup>
            <FieldSet>
                <OwnInput
                    id="name"
                    label="Criterion Name"
                    placeholder="Criterion name"
                    autoComplete="criterion-name"
                    autoFocus
                    leadingElement={<ListChecks />}
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    disabled={processing}
                    error={errors.name}
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

                <OwnSelect
                    id="type"
                    label="Criterion Type"
                    placeholder="Select criterion type"
                    value={data.type}
                    onChange={(value) =>
                        setData('type', value as 'benefit' | 'cost' | '')
                    }
                    disabled={processing}
                    error={errors.type}
                    options={[
                        { label: 'Benefit', value: 'benefit' },
                        { label: 'Cost', value: 'cost' },
                    ]}
                    help={
                        <HoverCard>
                            <HoverCardTrigger>
                                <Info className="size-4 cursor-help transition-all duration-300 hover:scale-105" />
                            </HoverCardTrigger>
                            <HoverCardContent>
                                <p className="text-sm">
                                    <span className="font-extrabold">
                                        Benefit
                                    </span>
                                    : Higher values are better.
                                </p>
                                <p className="text-sm">
                                    <span className="font-extrabold">Cost</span>
                                    : Lower values are better.
                                </p>
                            </HoverCardContent>
                        </HoverCard>
                    }
                />

                <OwnInput
                    id="max_value"
                    label="Maximum Value"
                    placeholder="Maximum value"
                    autoComplete="criterion-max-value"
                    leadingElement={<Hash />}
                    type="number"
                    value={data.max_value <= 0 ? '' : data.max_value}
                    onChange={(e) => setData('max_value', Number(e.target.value))}
                    disabled={processing || data.is_infinite}
                    error={errors.max_value}
                    min={1}
                />

                <OwnCheckbox
                    id="is_infinite"
                    label="Infinite Maximum Value"
                    checked={data.is_infinite}
                    onChange={(checked) => {
                        setData('is_infinite', checked);
                        if (checked) {
                            setData('max_value', -1);
                        } else {
                            setData('max_value', 1);
                        }
                    }}
                    disabled={processing}
                    error={errors.is_infinite}
                />
            </FieldSet>
        </FieldGroup>
    );
}
