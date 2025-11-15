import OwnButton from '@/components/own/own-button';
import OwnInput from '@/components/own/own-input';
import { Field, FieldGroup, FieldSet } from '@/components/ui/field';
import AuthLayout from '@/layouts/auth-layout';
import { update } from '@/routes/password';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { KeyRound } from 'lucide-react';

interface ResetPasswordForm {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors } = useForm<
        Required<ResetPasswordForm>
    >({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(update().url, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setData({
                    password: '',
                    password_confirmation: '',
                });
            },
            onError: () => {
                setData('password', '');
                setData('password_confirmation', '');
            },
        });
    };

    return (
        <AuthLayout
            title="Reset password"
            description="Please enter your new password below"
        >
            <Head title="Reset password" />

            <FieldGroup className="flex flex-col gap-6">
                <FieldSet>
                    <FieldGroup>
                        <OwnInput
                            id="email"
                            label="Email"
                            type="email"
                            value={data.email}
                            readOnly={true}
                            disabled={processing}
                            error={errors.email}
                        />

                        <OwnInput
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="Password"
                            autoComplete="new-password"
                            autoFocus
                            leadingElement={<KeyRound />}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            disabled={processing}
                            error={errors.password}
                            isPassword
                        />

                        <OwnInput
                            id="password_confirmation"
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm password"
                            autoComplete="new-password"
                            leadingElement={<KeyRound />}
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            disabled={processing}
                            error={errors.password_confirmation}
                            isPassword
                        />
                    </FieldGroup>
                </FieldSet>

                <Field className="mt-4">
                    <OwnButton
                        icon={<KeyRound />}
                        onClick={submit}
                        isProcessing={processing}
                    >
                        Reset password
                    </OwnButton>
                </Field>
            </FieldGroup>
        </AuthLayout>
    );
}
