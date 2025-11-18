import { NavFooter } from '@/components/laravel/nav-footer';
import { NavMain } from '@/components/laravel/nav-main';
import { NavUser } from '@/components/laravel/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as criteriaIndex } from '@/routes/criteria';
import { index as itemsIndex } from '@/routes/items';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    ExternalLink,
    Github,
    LayoutGrid,
    ListChecks,
    Package,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
        icon: LayoutGrid,
    },
    {
        title: 'Criteria',
        href: criteriaIndex().url,
        icon: ListChecks,
    },
    {
        title: 'Items',
        href: itemsIndex().url,
        icon: Package,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/Reishandy/Laravel-VIKOR-eCatalogue',
        icon: Github,
    },
    {
        title: 'Public Page',
        href: '/',
        icon: ExternalLink,
    }
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch={['mount', 'hover']}>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
