import { useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { FormEventHandler, useRef } from 'react';

import HeadingSmall from '@/components/laravel/heading-small';
import OwnButton from '@/components/own/own-button';
import OwnDialog from '@/components/own/own-dialog';
import OwnInput from '@/components/own/own-input';
import { FieldGroup, FieldSet } from '@/components/ui/field';
import { destroy } from '@/routes/profile';

interface DeleteUserForm {
    password: string;
}

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroyMethod,
        processing,
        errors,
        reset,
        clearErrors
    } = useForm<Required<DeleteUserForm>>({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        destroyMethod(destroy().url, {
            preserveScroll: true,
            onSuccess: () => {
                reset('password');
                clearErrors();
            },
            onError: (errors) => {
                if (errors.password) {
                    passwordInput.current?.focus();
                }
            },
        });
    };

    const handleCancel = () => {
        reset('password');
        clearErrors();
    };

    return (
        <div className="space-y-6">
            <HeadingSmall
                title="Delete account"
                description="Delete your account and all of its resources"
            />

            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">Warning</p>
                    <p className="text-sm">
                        Please proceed with caution, this will delete all data
                        and resources.
                    </p>
                </div>

                <OwnDialog
                    dialogTitle="Are you sure you want to delete your account?"
                    dialogDescription="Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password to confirm you would like to permanently delete your account."
                    dialogFooter={
                        <OwnButton
                            icon={<Trash2 />}
                            variant="destructive"
                            isProcessing={processing}
                            onClick={submit}
                            data-test="confirm-delete-user-button"
                        >
                            Delete account
                        </OwnButton>
                    }
                    dialogTrigger={
                        <OwnButton
                            icon={<Trash2 />}
                            variant="destructive"
                            data-test="delete-user-button"
                        >
                            Delete account and data
                        </OwnButton>
                    }
                    onCancel={handleCancel}
                >
                    <FieldGroup>
                        <FieldSet>
                            <OwnInput
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="Enter your password to confirm"
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                disabled={processing}
                                error={errors.password}
                                isPassword
                                ref={passwordInput}
                            />
                        </FieldSet>
                    </FieldGroup>
                </OwnDialog>
            </div>
        </div>
    );
}
