import OwnButton from '@/components/own/own-button';
import OwnInput from '@/components/own/own-input';
import OwnSelect from '@/components/own/own-select';
import OwnTextarea from '@/components/own/own-textarea';
import { Field, FieldGroup, FieldSet } from '@/components/ui/field';
import { useCurrencyOptions } from '@/hooks/use-currency';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/setup';
import { Head, useForm } from '@inertiajs/react';
import { Building, CircleCheckBig, Image, Mail, MapPin } from 'lucide-react';
import { FormEventHandler } from 'react';

interface SetupForm {
    company_name: string;
    company_email: string;
    company_description: string;
    company_address: string;
    logo: File | null;
    currency: string;
}

export default function Setup() {
    const currencyOptions = useCurrencyOptions();
    const { data, setData, post, processing, errors } = useForm<
        Required<SetupForm>
    >({
        company_name: '',
        company_email: '',
        company_description: '',
        company_address: '',
        logo: null,
        currency: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(store().url, {
            preserveScroll: true,
        });
    };

    return (
        <AuthLayout
            title="Setup the application"
            description="Please fill in the details below to setup the application."
        >
            <Head title="Setup" />

            <FieldGroup className="flex flex-col gap-6">
                <FieldSet>
                    <FieldGroup>
                        <OwnInput
                            id="company_name"
                            label="Company Name"
                            placeholder="Your company name"
                            autoComplete="organization"
                            autoFocus
                            leadingElement={<Building />}
                            value={data.company_name}
                            onChange={(e) =>
                                setData('company_name', e.target.value)
                            }
                            disabled={processing}
                            error={errors.company_name}
                        />

                        <OwnInput
                            id="company_email"
                            label="Company Email"
                            placeholder="company@example.com"
                            type="email"
                            autoComplete="email"
                            leadingElement={<Mail />}
                            value={data.company_email}
                            onChange={(e) =>
                                setData('company_email', e.target.value)
                            }
                            disabled={processing}
                            error={errors.company_email}
                        />

                        <OwnTextarea
                            id="company_description"
                            label="Company Description"
                            placeholder="Brief description of your company"
                            maxDisplayRows={5}
                            value={data.company_description}
                            onChange={(e) =>
                                setData('company_description', e.target.value)
                            }
                            disabled={processing}
                            error={errors.company_description}
                        />

                        <OwnInput
                            id="company_address"
                            label="Company Address"
                            placeholder="Your company address"
                            autoComplete="street-address"
                            leadingElement={<MapPin />}
                            value={data.company_address}
                            onChange={(e) =>
                                setData('company_address', e.target.value)
                            }
                            disabled={processing}
                            error={errors.company_address}
                        />

                        <OwnSelect
                            id="currency"
                            label="Currency"
                            placeholder="Select your currency"
                            value={data.currency}
                            onChange={(value) => setData('currency', value)}
                            disabled={processing}
                            error={errors.currency}
                            options={currencyOptions}
                        />

                        <OwnInput
                            id="logo"
                            label="Company Logo"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            leadingElement={<Image />}
                            onChange={(e) =>
                                setData(
                                    'logo',
                                    e.target.files ? e.target.files[0] : null,
                                )
                            }
                            disabled={processing}
                            description="Maximum file size: 2MB."
                            error={errors.logo}
                        />
                    </FieldGroup>
                </FieldSet>

                <Field className="mt-4">
                    <OwnButton
                        icon={<CircleCheckBig />}
                        onClick={submit}
                        isProcessing={processing}
                        className="w-full"
                    >
                        Complete Setup
                    </OwnButton>
                </Field>
            </FieldGroup>
        </AuthLayout>
    );
}
