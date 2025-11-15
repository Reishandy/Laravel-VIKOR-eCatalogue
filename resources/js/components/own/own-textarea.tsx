import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import { InputGroup } from '@/components/ui/input-group';
import { ChangeEvent, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface OwnTextareProps {
    id: string;
    label?: string;
    placeholder?: string;
    autoFocus?: boolean;
    readOnly?: boolean;
    minDisplayRows?: number;
    maxDisplayRows?: number;
    resizable?: boolean;
    autoExpand?: boolean;
    value?: string | number;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    disabled?: boolean;
    description?: string;
    error?: string;
    className?: string;
}

export default function OwnTextarea({
    id,
    label,
    placeholder,
    autoFocus = false,
    readOnly = false,
    minDisplayRows = 3,
    maxDisplayRows = 10,
    resizable = true,
    autoExpand = true,
    value = '',
    onChange,
    disabled = false,
    description,
    error,
    className = '',
}: OwnTextareProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-expand functionality for textarea
    useEffect(() => {
        if (autoExpand && textareaRef.current) {
            const textarea = textareaRef.current;

            // Reset height to auto to get the correct scrollHeight
            textarea.style.height = 'auto';

            // Calculate the content height
            const contentHeight = textarea.scrollHeight;
            const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
            const maxHeight = lineHeight * maxDisplayRows;
            const minHeight = lineHeight * minDisplayRows;

            // Set the height based on content within min/max bounds
            if (contentHeight > maxHeight) {
                textarea.style.height = `${maxHeight}px`;
                textarea.style.overflowY = 'auto';
            } else if (contentHeight < minHeight) {
                textarea.style.height = `${minHeight}px`;
                textarea.style.overflowY = 'hidden';
            } else {
                textarea.style.height = `${contentHeight}px`;
                textarea.style.overflowY = 'hidden';
            }
        }
    }, [value, autoExpand, minDisplayRows, maxDisplayRows]);

    const handleTextareaKeyDown = (
        e: React.KeyboardEvent<HTMLTextAreaElement>,
    ) => {
        // Allow Enter key for new lines, but prevent form submission if it's part of a form
        if (e.key === 'Enter' && !e.shiftKey) {
            // You can add custom behavior here if needed
            // For example, to submit on Enter without Shift, you might want to prevent default
            // e.preventDefault();
        }
    };

    return (
        <Field className={className} data-invalid={!!error}>
            {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}

            <InputGroup id={id}>
                <Textarea
                    ref={textareaRef}
                    id={id}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    readOnly={readOnly}
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleTextareaKeyDown}
                    rows={minDisplayRows}
                    style={{
                        minHeight: `${minDisplayRows * 1.5}rem`,
                        maxHeight: `${maxDisplayRows * 1.5}rem`,
                    }}
                    disabled={disabled}
                    className={!resizable ? 'resize-none' : 'resize-y'}
                    aria-invalid={!!error}
                />
            </InputGroup>

            {description && (
                <FieldDescription className={error && '-mb-2'}>
                    {description}
                </FieldDescription>
            )}
            {error && <FieldError className="-mb-4">{error}</FieldError>}
        </Field>
    );
}
