import { home } from '@/routes';
import { CompanyData, Item, ItemsResponse } from '@/types';
import { router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useState } from 'react';
import CyberHeader from '@/components/cyber/cyber-header';
import CyberSearch from '@/components/cyber/cyber-search';
import CyberProductCard from '@/components/cyber/cyber-product-card';
import { CyberProductModal } from '@/components/cyber/cyber-product-modal';

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
    const [selectedItem, setSelectedItem] = useState<null | Item>(null);
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

    // TODO: Pagination
    // TODO: Compartmentize
    // TODO: AOS
    // TODO: SPK & Rank display & indicator that spk is in effect & clear button on spk popover

    return (
        <div className="min-h-screen bg-space-950 text-space-text font-sans selection:bg-space-accent selection:text-white overflow-hidden relative">
            {/* Dynamic Star Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-space-900 via-space-950 to-space-950" />
                <div className="absolute inset-0 bg-stars opacity-40 animate-pulse-slow" style={{ backgroundSize: '800px 800px' }}></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-space-accent/5 blur-[120px] rounded-full pointer-events-none" />
            </div>

            <CyberHeader
                company_name={company_data.name}
                company_email={company_data.email}
                company_address={company_data.address}
                company_description={company_data.description}
                company_logo={company_data.logo ?? 'favicon.ico'}
            />

            <CyberSearch
                searchTerm={searchParam || ''}
                setSearchTerm={setSearchParam}
            />

            <main className="mx-auto w-full max-w-7xl flex-grow px-6 py-12">
                {/* Controls / Filter Header */}
                <div className="mb-8 flex items-end justify-between border-b border-dashed border-space-border/50 pb-4">
                    <div>
                        <h2 className="font-mono text-2xl tracking-tight text-white">
                            DATABASE_ENTRIES
                        </h2>
                        <span className="ml-1 font-mono text-xs text-space-highlight">
                            // {items.data.length} ACTIVE NODES
                        </span>
                    </div>
                </div>

                {/* Full Width Grid */}
                <section>
                    {items.data.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {items.data.map((item) => (
                                <CyberProductCard
                                    key={item.id}
                                    item={item}
                                    onViewSpecs={setSelectedItem}
                                    currency={company_data.currency}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-space-border bg-space-900/20 py-24">
                            <span className="mb-4 text-4xl">🔭</span>
                            <h3 className="mb-2 font-mono text-lg text-white">
                                NO_SIGNALS_DETECTED
                            </h3>
                            <p className="max-w-xs text-center text-sm text-space-muted">
                                Adjust query parameters or recalibrate search
                                sensors.
                            </p>
                        </div>
                    )}
                </section>
            </main>

            <footer className="border-t border-space-border bg-space-950/80 py-8 text-center font-mono text-sm text-space-muted backdrop-blur">
                <p className="cursor-default transition-colors hover:text-space-accent">
                    © {new Date().getFullYear()} {company_data.name}. All
                    rights reserved.
                </p>
            </footer>

            <CyberProductModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                currency={company_data.currency}
                email={company_data.email}
            />
        </div>
    );
}
