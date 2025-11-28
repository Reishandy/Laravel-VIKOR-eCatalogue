import React from 'react';
import { ArrowRight, Box } from 'lucide-react';
import { Item } from '@/types';
import { useCurrencySymbol } from '@/hooks/use-currency';
import { useTurncate } from '@/hooks/use-truncate';

interface CyberProductCardProps {
    item: Item;
    onViewSpecs: (item: Item) => void;
    currency: string;
}

export default function CyberProductCard({
    item,
    onViewSpecs,
    currency,
}: CyberProductCardProps) {
    const currencySymbol = useCurrencySymbol(currency);
    const truncateByChars = useTurncate();

    const price = item.criteria?.find((c) => c.id === 1)?.pivot?.value ?? 0;

    return (
        <div
            onClick={() => onViewSpecs(item)}
            className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-sm border border-space-border bg-space-900/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-space-accent/80 hover:shadow-[0_0_30px_rgba(167,139,250,0.14)]"
        >
            {/* Image Area */}
            <div className="relative h-56 w-full overflow-hidden border-b border-space-border bg-space-950">
                {item.rank && (
                    <div className="absolute top-3 left-3 z-10">
                        <div className="flex items-center gap-1.5 rounded-md border border-space-highlight/40 bg-space-900/90 px-2.5 py-1.5 backdrop-blur-sm transition-all duration-300 hover:border-space-highlight/80 hover:bg-space-900/95">
                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-space-highlight" />
                            <span className="font-mono text-xs font-bold tracking-wider text-space-highlight">
                                #{item.rank}
                            </span>
                        </div>
                    </div>
                )}

                {/* Grid Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(167,139,250,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(167,139,250,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-space-900 to-transparent opacity-70" />

                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full scale-100 object-cover opacity-85 contrast-125 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-space-950 text-xs text-gray-300">
                        404: NO_IMAGE_AVAILABLE
                    </div>
                )}
            </div>

            {/* Content Body */}
            <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-start justify-between">
                    <h3 className="font-sans text-lg leading-tight font-semibold text-white transition-colors group-hover:text-space-cyan">
                        {item.name}
                    </h3>
                </div>

                <div className="mb-4 flex items-baseline gap-2">
                    <span className="font-mono text-lg text-space-accent">
                        {currencySymbol}
                        {price.toFixed(2)}
                    </span>
                    <span className="font-mono text-sm text-gray-200 uppercase">
                        Unit Price
                    </span>
                </div>

                <p className="mb-6 line-clamp-3 flex-grow text-xs leading-relaxed font-light text-gray-300">
                    {truncateByChars(item.description ?? '', 100)}
                </p>

                {/* Action Row */}
                <div className="mt-auto flex items-center justify-between border-t border-dashed border-space-border pt-4">
                    <div className="flex items-center gap-2 font-mono text-sm text-gray-300">
                        <Box className="h-3 w-3 text-gray-200" />
                        <span>ID: {item.id}</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-space-text uppercase transition-colors group-hover:text-space-highlight">
                        Access Data
                        <ArrowRight className="h-3 w-3 transform transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </div>
        </div>
    );
}
