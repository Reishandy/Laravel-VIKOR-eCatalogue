import OwnInput from '@/components/own/own-input';
import { Field, FieldGroup, FieldSet } from '@/components/ui/field';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { ArrowRight, KeyRound, Mail, User } from 'lucide-react';
import { FormEventHandler } from 'react';
import { register } from '@/routes';
import OwnButton from '@/components/own/own-button';
import OwnCheckbox from '@/components/own/own-checkbox';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const { data, setData, post, processing, errors } = useForm<
        Required<RegisterForm>
    >({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(register().url, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setData({
                    name: '',
                    email: '',
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
            title="Create administrator account"
            description="Please fill in the details below to create your administrator account."
        >
            <Head title="Register" />

            <FieldGroup className="flex flex-col gap-6">
                <FieldSet>
                    <FieldGroup>
                        <OwnInput
                            id="name"
                            label="Full Name"
                            placeholder="Full name"
                            autoComplete="name"
                            autoFocus
                            leadingElement={<User />}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            error={errors.name}
                        />

                        <OwnInput
                            id="email"
                            label="Email"
                            placeholder="example@example.com"
                            type="email"
                            autoComplete="email"
                            leadingElement={<Mail />}
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            error={errors.email}
                        />

                        <OwnInput
                            id="password"
                            label="Password"
                            placeholder="Password"
                            autoComplete="new-password"
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
                    <OwnButton onClick={submit} isProcessing={processing}>
                        <ArrowRight /> Next Step
                    </OwnButton>
                </Field>
            </FieldGroup>
        </AuthLayout>
    );
}
