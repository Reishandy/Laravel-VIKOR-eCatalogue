import { Head, useForm } from '@inertiajs/react';
import { KeyRound, Unlock } from 'lucide-react';
import { FormEventHandler, useRef } from 'react';

import HeadingSmall from '@/components/laravel/heading-small';
import OwnButton from '@/components/own/own-button';
import OwnInput from '@/components/own/own-input';
import { Field, FieldGroup, FieldSet } from '@/components/ui/field';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/user-password';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: edit().url,
    },
];

interface PasswordForm {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        put,
        processing,
        errors,
        recentlySuccessful,
        reset,
    } = useForm<Required<PasswordForm>>({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(edit().url, {
            preserveScroll: true,
            onSuccess: () => {
                reset('current_password', 'password', 'password_confirmation');
            },
            onError: (errors) => {
                if (errors.password) {
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    currentPasswordInput.current?.focus();
                }

                // Clear password fields on error
                setData('password', '');
                setData('password_confirmation', '');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Password settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Update password"
                        description="Ensure your account is using a long, random password to stay secure"
                    />

                    <FieldGroup className="flex flex-col gap-6">
                        <FieldSet>
                            <FieldGroup>
                                <OwnInput
                                    id="current_password"
                                    label="Current password"
                                    type="password"
                                    placeholder="Current password"
                                    autoComplete="current-password"
                                    leadingElement={<Unlock />}
                                    value={data.current_password}
                                    onChange={(e) =>
                                        setData(
                                            'current_password',
                                            e.target.value,
                                        )
                                    }
                                    disabled={processing}
                                    error={errors.current_password}
                                    isPassword
                                    ref={currentPasswordInput}
                                />

                                <OwnInput
                                    id="password"
                                    label="New password"
                                    type="password"
                                    placeholder="New password"
                                    autoComplete="new-password"
                                    leadingElement={<KeyRound />}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    disabled={processing}
                                    error={errors.password}
                                    isPassword
                                    ref={passwordInput}
                                />

                                <OwnInput
                                    id="password_confirmation"
                                    label="Confirm password"
                                    type="password"
                                    placeholder="Confirm password"
                                    autoComplete="new-password"
                                    leadingElement={<KeyRound />}
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    disabled={processing}
                                    error={errors.password_confirmation}
                                    isPassword
                                />
                            </FieldGroup>
                        </FieldSet>

                        <Field className="mt-2 flex items-center gap-4">
                            <OwnButton
                                onClick={submit}
                                isProcessing={processing}
                            >
                                Save password
                            </OwnButton>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-500">
                                    Saved
                                </p>
                            </Transition>
                        </Field>
                    </FieldGroup>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
