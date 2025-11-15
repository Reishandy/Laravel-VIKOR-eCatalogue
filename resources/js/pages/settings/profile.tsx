import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { ArrowDownToLine, Mail, User } from 'lucide-react';
import DeleteUser from '@/components/laravel/delete-user';
import HeadingSmall from '@/components/laravel/heading-small';
import OwnInput from '@/components/own/own-input';
import OwnButton from '@/components/own/own-button';
import { Field, FieldGroup, FieldSet } from '@/components/ui/field';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit, update } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

interface ProfileForm {
    name: string;
    email: string;
}

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, processing, errors, recentlySuccessful } =
        useForm<Required<ProfileForm>>({
            name: auth.user.name,
            email: auth.user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(update().url, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Profile information"
                        description="Update your name and email address"
                    />

                    <FieldGroup className="flex flex-col gap-6">
                        <FieldSet>
                            <FieldGroup>
                                <OwnInput
                                    id="name"
                                    label="Name"
                                    placeholder="Full name"
                                    autoComplete="name"
                                    leadingElement={<User />}
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    disabled={processing}
                                    error={errors.name}
                                />

                                <OwnInput
                                    id="email"
                                    label="Email address"
                                    type="email"
                                    placeholder="Email address"
                                    autoComplete="username"
                                    leadingElement={<Mail />}
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    disabled={processing}
                                    error={errors.email}
                                />
                            </FieldGroup>
                        </FieldSet>

                        {mustVerifyEmail &&
                            auth.user.email_verified_at === null && (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                                    <p className="text-sm text-amber-800 dark:text-amber-200">
                                        Your email address is unverified.{' '}
                                        <Link
                                            href={send()}
                                            as="button"
                                            className="font-medium underline decoration-amber-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-amber-600"
                                        >
                                            Click here to resend the
                                            verification email.
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <div className="mt-2 text-sm font-medium text-green-600">
                                            A new verification link has been
                                            sent to your email address.
                                        </div>
                                    )}
                                </div>
                            )}

                        <Field className="flex items-center gap-4 mt-2">
                            <OwnButton
                                icon={<ArrowDownToLine />}
                                onClick={submit}
                                isProcessing={processing}
                            >
                                Save
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

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
