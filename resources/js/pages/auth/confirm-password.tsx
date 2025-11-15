import OwnButton from '@/components/own/own-button';
import OwnInput from '@/components/own/own-input';
import { Field, FieldGroup, FieldSet } from '@/components/ui/field';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';
import { Head, useForm } from '@inertiajs/react';
import { KeyRound } from 'lucide-react';
import { FormEventHandler } from 'react';

interface ConfirmPasswordForm {
    password: string;
}

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors } = useForm<
        Required<ConfirmPasswordForm>
    >({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(store().url, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setData({
                    password: '',
                });
            },
            onError: () => {
                setData('password', '');
            },
        });
    };

    return (
        <AuthLayout
            title="Confirm your password"
            description="This is a secure area of the application. Please confirm your password before continuing."
        >
            <Head title="Confirm password" />

            <FieldGroup className="flex flex-col gap-6">
                <FieldSet>
                    <FieldGroup>
                        <OwnInput
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
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
                    </FieldGroup>
                </FieldSet>

                <Field className="mt-4">
                    <OwnButton
                        icon={<KeyRound />}
                        onClick={submit}
                        isProcessing={processing}
                    >
                        Confirm password
                    </OwnButton>
                </Field>
            </FieldGroup>
        </AuthLayout>
    );
}
