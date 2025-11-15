import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { Trash2 } from 'lucide-react';

import HeadingSmall from '@/components/laravel/heading-small';
import OwnButton from '@/components/own/own-button';
import OwnInput from '@/components/own/own-input';
import { FieldGroup, FieldSet } from '@/components/ui/field';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
    } = useForm<Required<DeleteUserForm>>({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        destroyMethod(destroy().url, {
            preserveScroll: true,
            onSuccess: () => {
                reset('password');
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
    };

    // TODO: Use own modal component later
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

                <Dialog>
                    <DialogTrigger asChild>
                        <OwnButton
                            icon={<Trash2 />}
                            variant="destructive"
                            data-test="delete-user-button"
                        >
                            Delete account and data
                        </OwnButton>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>
                            Are you sure you want to delete your account?
                        </DialogTitle>
                        <DialogDescription>
                            Once your account is deleted, all of its resources
                            and data will also be permanently deleted. Please
                            enter your password to confirm you would like to
                            permanently delete your account.
                        </DialogDescription>

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

                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button
                                    variant="secondary"
                                    onClick={handleCancel}
                                    type="button"
                                >
                                    Cancel
                                </Button>
                            </DialogClose>

                            <OwnButton
                                icon={<Trash2 />}
                                variant="destructive"
                                isProcessing={processing}
                                onClick={submit}
                                data-test="confirm-delete-user-button"
                            >
                                Delete account
                            </OwnButton>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
