import { useIsMobile } from '@/hooks/use-mobile';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useEffect } from 'react';

interface CyberPaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    per_page?: number;
    total?: number;
}

export default function CyberPagination({
    links,
    current_page,
    last_page,
    prev_page_url,
    next_page_url,
    per_page = 0,
    total = 0,
}: CyberPaginationProps) {
    const isMobile = useIsMobile();

    // Filter out previous/next labels
    const pageLinks = links.filter(
        (link) => !['&laquo; Previous', 'Next &raquo;'].includes(link.label),
    );

    // compute a friendly "Showing X - Y of Z entries" string
    const itemsPerPage = per_page ?? 0;
    const totalItems = total ?? 0;
    const start = totalItems === 0 ? 0 : (current_page - 1) * itemsPerPage + 1;
    const end = Math.min(current_page * itemsPerPage, totalItems);

    const getVisiblePageNumbers = () => {
        const visiblePages = [];
        const showAroundCurrent = isMobile ? 0 : 1;

        // Always show first page
        visiblePages.push({
            number: 1,
            url: pageLinks.find((link) => link.label === '1')?.url || '#',
            active: current_page === 1,
        });

        // Show ellipsis if needed
        if (current_page > 2 + showAroundCurrent) {
            visiblePages.push({ number: -1, url: null, active: false });
        }

        // Pages around current
        for (
            let i = Math.max(2, current_page - showAroundCurrent);
            i <= Math.min(last_page - 1, current_page + showAroundCurrent);
            i++
        ) {
            const pageLink = pageLinks.find((link) => link.label === String(i));
            visiblePages.push({
                number: i,
                url: pageLink?.url || '#',
                active: i === current_page,
            });
        }

        // Show ellipsis if needed
        if (current_page < last_page - 1 - showAroundCurrent) {
            visiblePages.push({ number: -1, url: null, active: false });
        }

        // Always show last page if there are multiple pages
        if (last_page > 1) {
            visiblePages.push({
                number: last_page,
                url:
                    pageLinks.find((link) => link.label === String(last_page))
                        ?.url || '#',
                active: current_page === last_page,
            });
        }

        return visiblePages;
    };

    const visiblePages = getVisiblePageNumbers();

    const handlePageClick = (url: string | null, e: React.MouseEvent) => {
        if (!url) return;
        e.preventDefault();

        router.get(
            url,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                preserveUrl: true,
            },
        );
    };

    useEffect(() => {
        const prefetchOptions = {
            preserveState: true,
            preserveScroll: true,
            preserveUrl: true,
        };

        const pagesToPrefetch = [
            prev_page_url,
            next_page_url,
            pageLinks.length > 3
                ? pageLinks.find((link) => link.label === String(last_page))
                      ?.url
                : null,
        ];

        pagesToPrefetch.forEach((url) => {
            if (url) {
                router.prefetch(url, prefetchOptions, {});
            }
        });
    }, [current_page, prev_page_url, next_page_url, pageLinks, last_page]);

    if (last_page <= 1) {
        return null;
    }

    return (
        // Responsive layout: mobile stack -> [Nav_Online (full), Pagination (center), Showing... (full)]
        // desktop -> [Showing... (left), Pagination (center), Nav_Online (right)]
        <div className="flex flex-col md:flex-row items-center md:justify-between border-t border-space-border bg-space-900/50 px-6 py-4 backdrop-blur-sm">
            {/* Nav Online - top on mobile (full width), right on desktop */}
            <div className="order-1 md:order-3 w-full md:w-auto mb-3 md:mb-0 flex items-center justify-center md:justify-end">
                <div className="flex items-center gap-1.5 rounded-md border border-space-border/40 bg-space-900/60 px-3 py-2 backdrop-blur-sm w-full md:w-auto justify-center md:justify-end">
                    <div className="h-1.5 w-1.5 rounded-full bg-space-highlight" />
                    <span className="font-mono text-xs tracking-wider text-gray-300 uppercase">
                        Nav_Online
                    </span>
                </div>
            </div>

            {/* Pagination Controls - middle on mobile */}
            <div className="order-2 md:order-2 flex w-full md:w-auto items-center justify-center gap-2 mb-3 md:mb-0">
                {/* Previous Button */}
                <div
                    onClick={(e) => prev_page_url && handlePageClick(prev_page_url, e)}
                    className={`group relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-sm border border-space-border bg-space-900/50 px-4 py-2 backdrop-blur-sm transition-all duration-300 ${
                        prev_page_url
                            ? 'hover:-translate-y-0.5 hover:border-space-accent/80 hover:shadow-[0_0_20px_rgba(167,139,250,0.12)]'
                            : 'cursor-not-allowed opacity-30'
                    }`}
                >
                    <ChevronLeft className="h-3 w-3 text-gray-300 transition-colors group-hover:text-space-cyan" />
                    <span className="font-mono text-xs font-bold tracking-wider text-gray-300 uppercase transition-colors group-hover:text-white">
                        Prev
                    </span>

                    {/* Grid Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(167,139,250,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(167,139,250,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 transition-opacity group-hover:opacity-100" />
                </div>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {visiblePages.map((page, index) => {
                        if (page.number === -1) {
                            return (
                                <div key={`ellipsis-${index}`} className="flex h-8 w-8 items-center justify-center">
                                    <MoreHorizontal className="h-4 w-4 text-gray-300" />
                                </div>
                            );
                        }

                        return (
                            <div
                                key={`page-${page.number}`}
                                onClick={(e) => handlePageClick(page.url, e)}
                                className={`group relative flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-sm border backdrop-blur-sm transition-all duration-300 ${
                                    page.active
                                        ? 'border-space-accent bg-space-accent/25 shadow-[0_0_15px_rgba(167,139,250,0.22)]'
                                        : 'border-space-border bg-space-900/50 hover:-translate-y-0.5 hover:border-space-highlight/80 hover:shadow-[0_0_15px_rgba(167,139,250,0.1)]'
                                }`}
                            >
                                <span className={`font-mono text-xs font-bold tracking-wider transition-colors ${
                                    page.active
                                        ? 'text-space-cyan'
                                        : 'text-gray-300 group-hover:text-white'
                                }`}>
                                    {page.number}
                                </span>

                                {/* Active pulse effect */}
                                {page.active && <div className="absolute inset-0 animate-pulse rounded-sm bg-space-accent/10" />}

                                {/* Grid Overlay */}
                                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(167,139,250,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(167,139,250,0.05)_1px,transparent_1px)] bg-[size:15px_15px] opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                        );
                    })}
                </div>

                {/* Next Button */}
                <div
                    onClick={(e) => next_page_url && handlePageClick(next_page_url, e)}
                    className={`group relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-sm border border-space-border bg-space-900/50 px-4 py-2 backdrop-blur-sm transition-all duration-300 ${
                        next_page_url
                            ? 'hover:-translate-y-0.5 hover:border-space-accent/80 hover:shadow-[0_0_20px_rgba(167,139,250,0.12)]'
                            : 'cursor-not-allowed opacity-30'
                    }`}
                >
                    <span className="font-mono text-xs font-bold tracking-wider text-gray-300 uppercase transition-colors group-hover:text-white">
                        Next
                    </span>
                    <ChevronRight className="h-3 w-3 text-gray-300 transition-colors group-hover:text-space-cyan" />

                    {/* Grid Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(167,139,250,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(167,139,250,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
            </div>

            {/* Page Info - bottom on mobile (full width), left on desktop */}
            <div className="order-3 md:order-1 w-full md:w-auto flex items-center justify-center md:justify-start">
                <div className="flex items-center gap-1.5 rounded-md border border-space-highlight/40 bg-space-900/80 px-3 py-2 backdrop-blur-sm w-full md:w-auto justify-center md:justify-start">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-space-highlight" />
                    <span className="font-mono text-xs font-bold tracking-wider text-space-highlight">
                        {`Showing ${start} - ${end} of ${totalItems} ${totalItems === 1 ? 'entry' : 'entries'}`}
                    </span>
                </div>
            </div>
        </div>
    );
}
