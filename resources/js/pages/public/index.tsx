import { home } from '@/routes';
import { CompanyData, ItemsResponse } from '@/types';
import { router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import { Cpu, Mail, MapPin, Terminal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface PublicPageProps {
    items: ItemsResponse;
    search_query: string;
    company_data: CompanyData;

    [key: string]: unknown;
}

export default function Index({
    items,
    search_query,
    company_data,
}: PublicPageProps) {
    const [searchParam, setSearchParam] = useState<string | undefined>(
        search_query || undefined,
    );
    const debouncedSearch = useMemo(
        () =>
            debounce((search: string) => {
                router.get(
                    home().url,
                    { search },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        preserveUrl: true,
                    },
                );
            }, 300),
        [],
    );

    useEffect(() => {
        // TODO
        console.log(items);
        console.log(search_query);
    }, [items, search_query]);

    useEffect(() => {
        if (searchParam !== undefined) debouncedSearch(searchParam);
    }, [searchParam, debouncedSearch]);

    return (
        <div className="min-h-screen bg-zinc-950 font-sans text-zinc-300 selection:bg-emerald-500/30 selection:text-emerald-200">
            <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950">
                {/* Top System Bar */}
                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-6 py-1 font-mono text-[10px] text-zinc-500 uppercase">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center gap-1.5">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
                            System Online
                        </span>
                        <span>v2.0.4-beta</span>
                    </div>
                    <a
                        href={`mailto:${company_data.email}`}
                        className="transition-colors hover:text-zinc-300"
                    >
                        {company_data.email}
                    </a>
                </div>

                {/* Main Header with Logo and Company Name */}
                <div className="flex flex-col justify-between gap-4 px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className="rounded p-2">
                            {company_data.logo ? (
                                <img
                                    src={company_data.logo}
                                    alt="Company Logo"
                                    className="size-8 rounded-md object-cover"
                                />
                            ) : (
                                <Cpu
                                    size={32}
                                    className="bg-zinc-100 text-zinc-950"
                                />
                            )}
                        </div>
                        <div>
                            <h1 className="text-xl leading-none font-bold tracking-tight text-white">
                                {company_data.name}
                            </h1>
                        </div>
                    </div>

                    {/* Industrial Developer Terminal Style Section */}
                    <div className="relative mt-2 border border-zinc-700 bg-zinc-900 p-4">
                        {/* Terminal decoration lines */}
                        <div className="absolute top-6 right-6 flex gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-zinc-600"></div>
                            <div className="h-1.5 w-1.5 rounded-full bg-zinc-600"></div>
                            <div className="h-1.5 w-1.5 rounded-full bg-zinc-600"></div>
                        </div>

                        <div className="mb-3 flex items-start gap-2">
                            <Terminal
                                size={16}
                                className="mt-0.5 flex-shrink-0 text-emerald-500"
                            />
                            <div className="flex-1">
                                <h2 className="font-mono text-lg font-bold tracking-wider text-white uppercase">
                                    {company_data.name}'s Product Catalogue
                                </h2>
                                <div className="my-2 h-0.5 w-full bg-gradient-to-r from-emerald-500 to-transparent"></div>
                                <p className="font-mono text-sm leading-relaxed text-zinc-400">
                                    {company_data.description}
                                </p>
                            </div>
                        </div>

                        {/* Search Input (Command Line Style) */}
                        <div className="relative flex gap-2">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="font-mono text-lg text-zinc-500">
                                    {'>'}
                                </span>
                            </div>
                            <input
                                type="text"
                                placeholder="Input search query or ID..."
                                value={searchParam || ''}
                                onChange={(e) => setSearchParam(e.target.value)}
                                className="w-full border border-zinc-700 bg-zinc-800 py-3 pr-20 pl-8 font-mono text-sm text-zinc-100 transition-all placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 focus:outline-none"
                            />
                        </div>

                        {/* Status line */}
                        <div className="mt-3 flex items-center gap-4 border-t border-zinc-800 pt-3 font-mono text-xs text-zinc-500">
                            <span className="flex items-center gap-1.5">
                                DISPLAYING RESULTS FOR
                            </span>
                            <span>
                                {'>'} {search_query || 'all items'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content area - you can add your product grid or other content here */}
            <main className="p-6">
                <div className="py-12 text-center text-zinc-600">
                    <p className="font-mono text-sm">
                        CONTENT AREA - ADD PRODUCT GRID OR OTHER COMPONENTS HERE
                    </p>
                    {search_query && (
                        <div className="mt-4 font-mono text-xs text-zinc-500">
                            Search results for: "{search_query}"
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-zinc-800 bg-zinc-900 px-6 py-8">
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
                    {/* Copyright Section */}
                    <div className="flex-1 space-y-2">
                        <div className="font-mono text-sm text-zinc-600">
                            &copy; {new Date().getFullYear()}{' '}
                            {company_data.name}. All systems operational.
                        </div>

                        {/* System Status */}
                        <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
                            <Terminal size={14} />
                            <span>CONNECTED TO NODE: IND-West-01</span>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="flex flex-col gap-2">
                        {/* Address */}
                        {company_data.address && (
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                <MapPin
                                    size={14}
                                    className="flex-shrink-0 text-zinc-600"
                                />
                                <span>{company_data.address}</span>
                            </div>
                        )}

                        {/* Email */}
                        {company_data.email && (
                            <a
                                href={`mailto:${company_data.email}`}
                                className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-300"
                            >
                                <Mail
                                    size={14}
                                    className="flex-shrink-0 text-zinc-600"
                                />
                                <span>{company_data.email}</span>
                            </a>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
}
