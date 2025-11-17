import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { useIsMobile } from '@/hooks/use-mobile';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';

interface DataTablePaginationProps {
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

export default function DataTablePagination({
    links,
    current_page,
    last_page,
    prev_page_url,
    next_page_url,
}: DataTablePaginationProps) {
    const isMobile = useIsMobile();

    links.filter(
        (link) => !['&laquo; Previous', 'Next &raquo;'].includes(link.label),
    );
    const getVisiblePageNumbers = () => {
        const visiblePages = [];
        const showAroundCurrent = isMobile ? 0 : 1;

        // Always show first page
        visiblePages.push({
            number: 1,
            url: links.find((link) => link.label === '1')?.url || '#',
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
            const pageLink = links.find((link) => link.label === String(i));
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
                    links.find((link) => link.label === String(last_page))
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
            // This prevent fetching the first page if there is only one page
            // Why 3? since we have Previous, Next, and at least one-page link
            links.length > 3 ? links.find((link) => link.label === String(last_page))?.url : null,
        ];

        pagesToPrefetch.forEach((url) => {
            if (url) {
                router.prefetch(url, prefetchOptions, {});
            }
        });
    }, [current_page, prev_page_url, next_page_url, links, last_page]);

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    {prev_page_url ? (
                        <PaginationPrevious
                            href={prev_page_url}
                            size="default"
                            onClick={(e) => handlePageClick(prev_page_url, e)}
                        />
                    ) : (
                        <PaginationPrevious
                            href="#"
                            className="pointer-events-none opacity-50"
                            size="default"
                        />
                    )}
                </PaginationItem>

                {visiblePages.map((page, index) => {
                    if (page.number === -1) {
                        return (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    return (
                        <PaginationItem key={`page-${page.number}`}>
                            <PaginationLink
                                href={page.url || '#'}
                                isActive={page.active}
                                size="default"
                                onClick={(
                                    e: React.MouseEvent<HTMLAnchorElement>,
                                ) => handlePageClick(page.url, e)}
                            >
                                {page.number.toString()}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                <PaginationItem>
                    {next_page_url ? (
                        <PaginationNext
                            href={next_page_url}
                            size="default"
                            onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
                                handlePageClick(next_page_url, e)
                            }
                        />
                    ) : (
                        <PaginationNext
                            href="#"
                            className="pointer-events-none opacity-50"
                            size="default"
                        />
                    )}
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
