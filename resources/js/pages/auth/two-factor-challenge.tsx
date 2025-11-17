import OwnButton from '@/components/own/own-button';
import OwnInput from '@/components/own/own-input';
import OwnOtp from '@/components/own/own-otp';
import { Field, FieldGroup, FieldSet } from '@/components/ui/field';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/two-factor/login';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useMemo, useState } from 'react';
import { ScanFace } from 'lucide-react';

interface TwoFactorChallengeForm {
    code: string;
    recovery_code: string;
}

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);

    const { data, setData, post, processing, errors, reset } = useForm<
        Required<TwoFactorChallengeForm>
    >({
        code: '',
        recovery_code: '',
    });

    const authConfigContent = useMemo<{
        title: string;
        description: string;
        toggleText: string;
    }>(() => {
        if (showRecoveryInput) {
            return {
                title: 'Recovery Code',
                description:
                    'Please confirm access to your account by entering one of your emergency recovery codes.',
                toggleText: 'login using an authentication code',
            };
        }

        return {
            title: 'Authentication Code',
            description:
                'Enter the authentication code provided by your authenticator application.',
            toggleText: 'login using a recovery code',
        };
    }, [showRecoveryInput]);

    const toggleRecoveryMode = (): void => {
        setShowRecoveryInput(!showRecoveryInput);
        reset();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(store().url, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                reset();
            },
            onError: () => {
                reset();
            },
        });
    };

    return (
        <AuthLayout
            title={authConfigContent.title}
            description={authConfigContent.description}
        >
            <Head title="Two-Factor Authentication" />

            <FieldGroup className="flex flex-col gap-6">
                <form onSubmit={submit}>
                    <FieldSet>
                        <FieldGroup>
                            {showRecoveryInput ? (
                                <Field>
                                    <OwnInput
                                        id="recovery_code"
                                        label="Recovery Code"
                                        type="text"
                                        placeholder="Enter recovery code"
                                        autoFocus={showRecoveryInput}
                                        value={data.recovery_code}
                                        onChange={(e) =>
                                            setData(
                                                'recovery_code',
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing}
                                        error={errors.recovery_code}
                                    />
                                </Field>
                            ) : (
                                <Field>
                                    <OwnOtp
                                        id="code"
                                        label="Authentication Code"
                                        maxLength={OTP_MAX_LENGTH}
                                        value={data.code}
                                        onChange={(value) =>
                                            setData('code', value)
                                        }
                                        disabled={processing}
                                        autoFocus={!showRecoveryInput}
                                        error={errors.code}
                                    />
                                </Field>
                            )}
                        </FieldGroup>
                    </FieldSet>

                    <Field className="mt-4">
                        <OwnButton icon={<ScanFace/>} onClick={submit} isProcessing={processing}>
                            Continue
                        </OwnButton>
                    </Field>

                    <div className="text-center text-sm text-muted-foreground mt-4">
                        <span>or you can </span>
                        <button
                            type="button"
                            className="cursor-pointer text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                            onClick={toggleRecoveryMode}
                        >
                            {authConfigContent.toggleText}
                        </button>
                    </div>
                </form>
            </FieldGroup>
        </AuthLayout>
    );
}
