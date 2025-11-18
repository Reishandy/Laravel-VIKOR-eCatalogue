import OwnButton from '@/components/own/own-button';
import OwnInput from '@/components/own/own-input';
import OwnSelect from '@/components/own/own-select';
import OwnTextarea from '@/components/own/own-textarea';
import { Field, FieldGroup, FieldSet } from '@/components/ui/field';
import { edit, update } from '@/routes/setup';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowDownToLine, Building, Image, Mail, MapPin } from 'lucide-react';
import { FormEventHandler } from 'react';
import type { BreadcrumbItem, SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import HeadingSmall from '@/components/laravel/heading-small';
import SettingsLayout from '@/layouts/settings/layout';
import AppLayout from '@/layouts/app-layout';
import { useCurrencyOptions } from '@/hooks/use-currency';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Company settings',
        href: edit().url,
    },
];

interface SetupForm {
    company_name: string;
    company_email: string;
    company_description: string;
    company_address: string;
    logo: File | null;
    currency: string;
}

export default function SetupEdit() {
    const { auth } = usePage<SharedData>().props;

    const currencyOptions = useCurrencyOptions();
    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm<Required<SetupForm>>({
            company_name: auth.user.company_name || '',
            company_email: auth.user.company_email || '',
            company_description: auth.user.company_description || '',
            company_address: auth.user.company_address || '',
            logo: null,
            currency: auth.user.currency || '',
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(update().url, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Company Information"
                        description="Update your company's information and settings."
                    />

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
                                        setData(
                                            'company_description',
                                            e.target.value,
                                        )
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
                                        setData(
                                            'company_address',
                                            e.target.value,
                                        )
                                    }
                                    disabled={processing}
                                    error={errors.company_address}
                                />

                                <OwnSelect
                                    id="currency"
                                    label="Currency"
                                    value={data.currency}
                                    onChange={(value) =>
                                        setData('currency', value)
                                    }
                                    disabled={processing}
                                    error={errors.currency}
                                    options={currencyOptions}
                                />

                                <OwnInput
                                    id="logo"
                                    label="New Company Logo"
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    leadingElement={<Image />}
                                    onChange={(e) =>
                                        setData(
                                            'logo',
                                            e.target.files
                                                ? e.target.files[0]
                                                : null,
                                        )
                                    }
                                    disabled={processing}
                                    description="Maximum file size: 2MB. Leave empty to keep current logo."
                                    error={errors.logo}
                                />
                            </FieldGroup>
                        </FieldSet>

                        <Field className="mt-4">
                            <OwnButton
                                icon={<ArrowDownToLine />}
                                onClick={submit}
                                isProcessing={processing}
                                className="w-full"
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
            </SettingsLayout>
        </AppLayout>
    );
}
