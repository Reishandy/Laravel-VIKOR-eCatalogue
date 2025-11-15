import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/laravel/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

export default function Setup() {
    // TODO: Add the fields

    return (
        <AuthLayout
            title="Setup the application"
            description="Please fill in the details below to setup the application."
        >
            <Head title="Setup" />
            <Form
                {...store.form()} // TODO
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">TODO</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={5} // TODO: Update tab index
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create account
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
