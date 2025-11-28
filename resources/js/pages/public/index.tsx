import CyberHeader from '@/components/cyber/cyber-header';
import CyberProductCard from '@/components/cyber/cyber-product-card';
import { CyberProductModal } from '@/components/cyber/cyber-product-modal';
import CyberSearch from '@/components/cyber/cyber-search';
import { home } from '@/routes';
import {
    CompanyData,
    CriteriaWeights,
    Criterion,
    Item,
    ItemsResponse,
} from '@/types';
import { router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useState } from 'react';
import CyberPagination from '@/components/cyber/cyber-pagination';

interface PublicPageProps {
    items: ItemsResponse;
    criteria: Criterion[];
    company_data: CompanyData;
    search_query: string;
    spk_weights?: string;

    [key: string]: unknown;
}

export default function Index({
    items,
    criteria,
    company_data,
    search_query,
    spk_weights,
}: PublicPageProps) {
    const [searchParam, setSearchParam] = useState<string | undefined>(
        search_query || undefined,
    );
    const [selectedItem, setSelectedItem] = useState<null | Item>(null);

    // Initialize SPK weights from the optional prop `spk_weights`
    const initialSpkWeights: CriteriaWeights = (() => {
        if (!spk_weights) return {};
        try {
            return JSON.parse(spk_weights) as CriteriaWeights;
        } catch (error) {
            console.error('Failed to parse SPK weights:', error);
            return {};
        }
    })();

    const [spkWeights, setSpkWeights] = useState<CriteriaWeights>(
        initialSpkWeights,
    );

    const executeSearch = (search: string, weights: CriteriaWeights) => {
        const params: Record<string, string> = {};

        if (search) params.search = search;
        if (Object.keys(weights).length > 0) {
            params.spk_weights = JSON.stringify(weights);
        }

        router.get(home().url, params, {
            preserveState: true,
            preserveScroll: true,
            preserveUrl: true,
        });
    };

    const debouncedSearch = useMemo(() => debounce(executeSearch, 300), []);

    const handleSpkWeightsChange = (weights: CriteriaWeights) => {
        setSpkWeights(weights);
    };

    const handleSpkApply = () => {
        // Cancel any pending debounced search and execute immediately
        debouncedSearch.cancel();
        executeSearch(searchParam || '', spkWeights);
    };

    const handleSpkReset = () => {
        setSpkWeights({});
        // Cancel any pending debounced search and execute immediately
        debouncedSearch.cancel();
        executeSearch(searchParam || '', {});
    };

    useEffect(() => {
        if (searchParam !== undefined) {
            debouncedSearch(searchParam, spkWeights);
        }
    }, [searchParam, debouncedSearch, spkWeights]);

    const isSpkActive = Object.keys(initialSpkWeights || {}).length > 0;

    return (
        <div className="relative min-h-screen overflow-hidden bg-space-950 font-sans text-space-text selection:bg-space-accent selection:text-white">
            {/* Dynamic Star Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-space-900 via-space-950 to-space-950" />
                <div
                    className="bg-stars absolute inset-0 animate-pulse-slow opacity-40"
                    style={{ backgroundSize: '800px 800px' }}
                ></div>
                <div className="pointer-events-none absolute top-0 left-1/2 h-[500px] w-full max-w-4xl -translate-x-1/2 rounded-full bg-space-accent/5 blur-[120px]" />
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
                criteria={criteria}
                spkWeights={spkWeights}
                onSpkWeightsChange={handleSpkWeightsChange}
                onSpkApply={handleSpkApply}
                onSpkReset={handleSpkReset}
                isSpkActive={isSpkActive}
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

                    {isSpkActive && (
                        <span className="mb-1 inline-block rounded-full bg-space-accent/20 px-3 py-1 font-mono text-xs text-space-accent">
                                COMPATIBILITY_MATRIX_ACTIVE
                            </span>
                    )}
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

                    <CyberPagination
                        links={items.links}
                        current_page={items.current_page}
                        last_page={items.last_page}
                        prev_page_url={items.prev_page_url}
                        next_page_url={items.next_page_url}
                        per_page={items.per_page}
                        total={items.total}
                    />
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
