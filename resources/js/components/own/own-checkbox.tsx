import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';

interface CheckboxProps {
    id: string;
    label?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    description?: string;
    error?: string;
    className?: string;
}

export default function OwnCheckbox({
    id,
    label,
    checked = false,
    onChange,
    disabled = false,
    description,
    error,
    className = '',
}: CheckboxProps) {
    return (
        <Field className={className} data-invalid={!!error}>
            <div className="flex items-center gap-2">
                <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={onChange}
                    disabled={disabled}
                    aria-invalid={!!error}
                    className="cursor-pointer transition-all duration-300 hover:scale-103 active:scale-95"
                />
                {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
            </div>

            {description && <FieldDescription className={error && '-mb-2'}>{description}</FieldDescription>}
            {error && <FieldError className="-mb-4">{error}</FieldError>}
        </Field>
    );
}
