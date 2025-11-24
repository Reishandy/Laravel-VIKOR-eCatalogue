import { home } from '@/routes';
import { ItemsResponse } from '@/types';
import { router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useState } from 'react';

interface PublicPageProps {
    items: ItemsResponse;
    search_query: string

    [key: string]: unknown;
}

export default function Index({ items, search_query }: PublicPageProps) {
    const [searchParam, setSearchParam] = useState<string | undefined>(
        undefined,
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
    }, [items]);

    useEffect(() => {
        if (searchParam !== undefined) debouncedSearch(searchParam);
    }, [searchParam, debouncedSearch]);

    return <div>TODO</div>;
}
