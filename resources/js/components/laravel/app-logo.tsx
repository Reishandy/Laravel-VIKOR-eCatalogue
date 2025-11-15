import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

export default function AppLogo() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <img
                    src={auth.user.logo ? '/storage/' + auth.user.logo : '/favicon.svg'}
                    alt="Company Logo"
                    className="size-5 object-cover rounded-md"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 leading-tight font-semibold line-clamp-3 overflow-hidden text-ellipsis">
                    {auth.user.company_name
                        ? auth.user.company_name
                        : "Rei's eCatalogue"}
                </span>
            </div>
        </>
    );
}
