import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ReactNode } from 'react';

interface SelectOption {
    label: string;
    value: string;
}

interface OwnSelectProps {
    id: string;
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    description?: string;
    error?: string;
    options: SelectOption[];
    help?: ReactNode;
    className?: string;
}

export default function OwnSelect({
    id,
    label,
    placeholder = 'Select an option',
    value,
    onChange,
    disabled = false,
    description,
    error,
    options,
    help,
    className = '',
}: OwnSelectProps) {
    return (
        <Field className={className} data-invalid={!!error}>
            <div className="flex space-x-2 items-center">
                {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
                {help && help}
            </div>

            <Select value={value} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger
                    id={id}
                    aria-invalid={!!error}
                    className="w-full cursor-pointer"
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                            className="cursor-pointer"
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {description && (
                <FieldDescription className={error && '-mb-2'}>
                    {description}
                </FieldDescription>
            )}
            {error && <FieldError className="-mb-4">{error}</FieldError>}
        </Field>
    );
}
