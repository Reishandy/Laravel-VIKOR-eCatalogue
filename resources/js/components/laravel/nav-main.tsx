import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { resolveUrl } from '@/lib/utils';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [loadingHref, setLoadingHref] = useState<string | null>(null);

    const handleClick = (e: React.MouseEvent, href: string) => {
        e.preventDefault();

        if (loadingHref) return; // Prevent multiple clicks

        setLoadingHref(href);

        router.visit(href, {
            preserveState: true,
            onFinish: () => setLoadingHref(null),
        });
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={page.url.startsWith(resolveUrl(item.href))} tooltip={{ children: item.title }}>
                            <a href={resolveUrl(item.href)} onClick={(e) => handleClick(e, resolveUrl(item.href))}>
                                {loadingHref === item.href ? <Spinner /> : item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
