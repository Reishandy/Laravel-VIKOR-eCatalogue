import TextLink from '@/components/laravel/text-link';
import OwnButton from '@/components/own/own-button';
import OwnInput from '@/components/own/own-input';
import { Field, FieldGroup, FieldSet } from '@/components/ui/field';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { email } from '@/routes/password';
import { Head, useForm } from '@inertiajs/react';
import { Mail, Send } from 'lucide-react';
import { FormEventHandler } from 'react';

interface ForgotPasswordForm {
    email: string;
}

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<
        Required<ForgotPasswordForm>
    >({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(email().url, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setData({
                    email: '',
                });
            },
        });
    };

    return (
        <AuthLayout
            title="Forgot password"
            description="Enter your email to receive a password reset link"
        >
            <Head title="Forgot password" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <FieldGroup className="flex flex-col gap-6">
                <FieldSet>
                    <FieldGroup>
                        <OwnInput
                            id="email"
                            label="Email address"
                            type="email"
                            placeholder="email@example.com"
                            autoComplete="off"
                            autoFocus
                            leadingElement={<Mail />}
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            error={errors.email}
                        />
                    </FieldGroup>
                </FieldSet>

                <Field className="mt-4">
                    <OwnButton onClick={submit} isProcessing={processing}>
                        <Send /> Email password reset link
                    </OwnButton>
                </Field>

                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>Or, return to</span>
                    <TextLink href={login()}>log in</TextLink>
                </div>
            </FieldGroup>
        </AuthLayout>
    );
}
