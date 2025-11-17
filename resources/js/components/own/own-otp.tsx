import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { cn } from '@/lib/utils';

interface OwnOtpProps {
    id: string;
    label?: string;
    maxLength?: number;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    autoFocus?: boolean;
    description?: string;
    error?: string;
    className?: string;
    pattern?: string;
}

export default function OwnOtp({
    id,
    label,
    maxLength = 6,
    value = '',
    onChange,
    disabled = false,
    autoFocus = false,
    description,
    error,
    className = '',
    pattern = REGEXP_ONLY_DIGITS,
}: OwnOtpProps) {
    return (
        <Field className={className} data-invalid={!!error}>
            {label && <FieldLabel htmlFor={id} className="w-full flex items-center justify-start md:justify-center">{label}</FieldLabel>}

            <div className="flex justify-center">
                <InputOTP
                    id={id}
                    name={id}
                    maxLength={maxLength}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    autoFocus={autoFocus}
                    pattern={pattern}
                >
                    <InputOTPGroup className="gap-2">
                        {Array.from({ length: maxLength }, (_, index) => (
                            <InputOTPSlot
                                key={index}
                                index={index}
                                className="h-12 w-12 border-border text-lg data-[active=true]:border-ring data-[active=true]:ring-4 data-[active=true]:ring-ring/20"
                            />
                        ))}
                    </InputOTPGroup>
                </InputOTP>
            </div>

            {description && (
                <FieldDescription className={cn('text-center', error && '-mb-2')}>
                    {description}
                </FieldDescription>
            )}
            {error && <FieldError className="text-center">{error}</FieldError>}
        </Field>
    );
}
