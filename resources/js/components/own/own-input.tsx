import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from '@/components/ui/input-group';
import { Eye, EyeOff } from 'lucide-react';
import { ChangeEvent, ReactNode, useState, Ref } from 'react';

interface OwnInputProps {
    id: string;
    label?: string;
    placeholder?: string;
    type?: string;
    accept?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    readOnly?: boolean;
    leadingElement?: ReactNode;
    trailingElement?: ReactNode;
    value?: string | number;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    description?: string;
    error?: string;
    isPassword?: boolean;
    className?: string;
    ref?: Ref<HTMLInputElement>;
    min?: number;
    max?: number;
}

export default function OwnInput({
    id,
    label,
    placeholder,
    type = 'text',
    accept,
    autoComplete,
    autoFocus = false,
    readOnly = false,
    leadingElement,
    trailingElement,
    value,
    onChange,
    disabled = false,
    description,
    error,
    isPassword = false,
    className = '',
    ref,
    min,
    max,
}: OwnInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Field className={className} data-invalid={!!error}>
            {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}

            <InputGroup id={id}>
                {leadingElement && (
                    <InputGroupAddon>{leadingElement}</InputGroupAddon>
                )}

                <InputGroupInput
                    id={id}
                    name={id}
                    type={
                        isPassword ? (showPassword ? 'text' : 'password') : type
                    }
                    accept={accept}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    readOnly={readOnly}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    aria-invalid={!!error}
                    ref={ref}
                    min={min}
                    max={max}
                    className={accept && 'cursor-pointer'}
                />

                {trailingElement && (
                    <InputGroupAddon align="inline-end">
                        {trailingElement}
                    </InputGroupAddon>
                )}

                {isPassword && (
                    <InputGroupButton
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                        title={showPassword ? 'Hide password' : 'Show password'}
                        className="mr-1"
                    >
                        {showPassword ? (
                            <EyeOff size={16} />
                        ) : (
                            <Eye size={16} />
                        )}
                    </InputGroupButton>
                )}
            </InputGroup>

            {description && <FieldDescription className={error && '-mb-2'}>{description}</FieldDescription>}
            {error && <FieldError className="-mb-4">{error}</FieldError>}
        </Field>
    );
}
