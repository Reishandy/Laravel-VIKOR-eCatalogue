import OwnButton from '@/components/own/own-button';
import { Field, FieldGroup, FieldSet } from '@/components/ui/field';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { Head, useForm } from '@inertiajs/react';
import { LogIn } from 'lucide-react';
import { FormEventHandler } from 'react';
import OwnInput from '@/components/own/own-input';
import OwnCheckbox from '@/components/own/own-checkbox';
import { request } from '@/routes/password';
import TextLink from '@/components/laravel/text-link';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors } = useForm<
        Required<LoginForm>
    >({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(login().url, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setData({
                    email: '',
                    password: '',
                    remember: false,
                });
            },
            onError: () => {
                setData('password', '');
            },
        });
    };

    return (
        <AuthLayout
            title="Log in to your account"
            description="Enter your email and password below to log in"
        >
            <Head title="Log in" />

            <FieldGroup className="flex flex-col gap-6">
                <FieldSet>
                    <FieldGroup>
                        <OwnInput
                            id="email"
                            label="Email"
                            type="email"
                            placeholder="example@example.com"
                            autoComplete="email"
                            autoFocus
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            error={errors.email}
                        />

                        <OwnInput
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="Password"
                            autoComplete="new-password"
                            isPassword
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            disabled={processing}
                            error={errors.password}
                        />

                        <div className="flex flex-row items-center justify-between">
                            <OwnCheckbox
                                id="remember"
                                label="Remember me"
                                checked={data.remember}
                                onChange={() =>
                                    setData('remember', !data.remember)
                                }
                                disabled={processing}
                                className="flex-1"
                            />

                            {canResetPassword && (
                                <TextLink href={request()} className="text-sm">
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                    </FieldGroup>
                </FieldSet>

                <Field className="mt-4">
                    <OwnButton onClick={submit} isProcessing={processing}>
                        <LogIn /> Log in
                    </OwnButton>
                </Field>
            </FieldGroup>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
