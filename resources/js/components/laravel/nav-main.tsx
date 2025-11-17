import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { resolveUrl } from '@/lib/utils';
import { Link } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [loadingHref, setLoadingHref] = useState<string | null>(null);

    const handleClick = (href: string) => {
        if (loadingHref) return; // Prevent multiple clicks
        setTimeout(() => setLoadingHref(href), 100);
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={page.url.startsWith(resolveUrl(item.href))} tooltip={{ children: item.title }}>
                            <Link
                                href={resolveUrl(item.href)}
                                prefetch={['mount', 'hover']}
                                onClick={() => handleClick(resolveUrl(item.href))}
                            >
                                {loadingHref === item.href ? <Spinner /> : item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
