import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface Flash {
    success?: string;
    error?: string;
    description?: string;
    timestamp?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    company_name?: string;
    company_email?: string;
    company_description?: string;
    company_address?: string;
    locale?: string;
    logo?: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

interface Pivot {
    criterion_id: number;
    item_id: number;
    value: number;
}

export interface Criterion {
    id: number;
    name: string;
    description: string;
    type: 'benefit' | 'cost';
    max_value: number;
    pivot?: Pivot;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Item {
    id: number;
    name: string;
    description: string;
    image?: string;
    criteria?: Criterion[];
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface CriteriaResponse {
    data: Criterion[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

export interface ItemsResponse {
    data: Item[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

export interface CriterionForm {
    name: string;
    description: string;
    type: 'benefit' | 'cost' | '';
    max_value: number;
    is_infinite: boolean;
}

export interface DynamicField {
    id: number;
    name: string;
    value: number;
}

export interface ItemForm {
    name: string;
    description: string;
    image?: File | null;
    fields: DynamicField[];
}
