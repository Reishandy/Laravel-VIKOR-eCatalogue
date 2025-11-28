import { useCurrencySymbol } from '@/hooks/use-currency';
import { Item } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Cpu, MessageSquare, X, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import ImageViewer from './image-viewer';

interface CyberProductModalProps {
    item: Item | null;
    onClose: () => void;
    currency: string;
    email: string;
}

export function CyberProductModal({
    item,
    onClose,
    currency,
    email,
}: CyberProductModalProps) {
    const currencySymbol = useCurrencySymbol(currency);
    const [viewerOpen, setViewerOpen] = useState(false);

    // Helper to format numbers for the technical table and unit cost:
    // - If the value is an integer (no fractional part) -> show integer with thousands separators (e.g. 60,000,000)
    // - If the value has a fractional part -> show up to 2 decimal places (e.g. 2.50 or 2.5 depending on locale)
    const formatCriterionValue = (raw: number | string) => {
        const value = Number(raw);
        if (!isFinite(value)) return String(raw);

        const frac = Math.abs(value - Math.trunc(value));

        if (frac < 1e-9) {
            // Integer - no decimals
            return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
        }

        // Has fractional part - show up to 2 decimals
        return new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
    };

    return (
        <AnimatePresence mode="wait">
            {item && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-space-950/95 backdrop-blur-md"
                    />

                    {/* Modal Window */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="relative flex h-[90vh] md:h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-space-border bg-space-900/80 shadow-[0_0_50px_rgba(0,0,0,0.6)] ring-1 ring-space-border"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-space-border bg-space-800/40 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded bg-space-accent/10 p-1.5">
                                    <Cpu className="h-5 w-5 text-space-accent" />
                                </div>
                                <div>
                                    <h2 className="font-mono text-base font-bold tracking-tight text-white">
                                        SPEC_SHEET //{' '}
                                        <span className="text-space-highlight">
                                            {item.id}
                                        </span>
                                    </h2>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-full p-2 text-gray-300 transition-colors hover:bg-space-800 hover:text-white cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content Scrollable Area */}
                        <div className="custom-scrollbar grid flex-1 grid-cols-1 p-0 lg:grid-cols-2 overflow-hidden">
                            {/* Left Column: Visuals & Inquiry */}
                            <div className="relative flex-none flex flex-col border-b border-space-border bg-black lg:col-span-1 lg:border-r lg:border-b-0">
                                <div className="relative min-h-[300px] flex-grow">
                                    {item.image ? (
                                        <>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover opacity-90"
                                                style={{ display: 'block' }}
                                                draggable={false}
                                            />

                                            {/* Overlay button (absolute top-left) placed beside the image */}
                                            <div className="absolute left-4 top-4 z-30 pointer-events-auto">
                                                <button
                                                    type="button"
                                                    onClick={() => setViewerOpen(true)}
                                                    aria-label={`View full image for ${item.name}`}
                                                    className="rounded bg-black/40 p-2 text-white hover:bg-black/60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-space-accent"
                                                >
                                                    <ImageIcon className="h-6 w-6" />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-space-950 text-xs text-gray-300">
                                            404: NO_IMAGE_AVAILABLE
                                        </div>
                                    )}

                                    {/* Technical Overlay Lines */}
                                    {/* Gradient overlay should not block clicks on the image button */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-space-900 pointer-events-none" aria-hidden />
                                    <div className="absolute top-6 left-6 h-8 w-8 border-t-2 border-l-2 border-space-accent/50" />
                                    <div className="absolute right-6 bottom-6 h-8 w-8 border-r-2 border-b-2 border-space-accent/50" />
                                </div>

                                <div className="flex flex-col gap-6 border-t border-space-border bg-space-900/60 p-6 backdrop-blur">
                                    <a
                                        href={`mailto:${email}?subject=Inquiry: ${item.name} [ID:${item.id}]`}
                                        className="hover:bg-space-accentHover flex w-full transform items-center justify-center gap-3 rounded bg-space-accent py-3 font-mono text-sm font-bold tracking-widest text-white uppercase shadow-[0_0_20px_rgba(167,139,250,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(167,139,250,0.55)]"
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                        Initialize Inquiry
                                    </a>
                                </div>
                            </div>

                            {/* Right Column: Data */}
                            <div className="flex flex-col bg-space-900/60 p-6 lg:col-span-1 lg:p-10 overflow-y-auto">
                                <div className="mb-8">
                                    <h3 className="mb-4 font-sans text-3xl leading-tight font-bold text-white">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm leading-relaxed font-light text-space-text">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="flex-grow space-y-6">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex flex-col rounded border border-space-border/50 bg-space-950/60 p-4">
                                            <span className="mb-1 block font-mono text-sm text-gray-300 uppercase">
                                                Unit Cost
                                            </span>
                                            <span className="font-mono text-2xl text-space-accent">
                                                {currencySymbol}
                                                {formatCriterionValue(
                                                    (
                                                        item.criteria?.find(
                                                            (c) => c.id === 1,
                                                        )?.pivot?.value ?? 0
                                                    )
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="mb-3 flex items-center gap-2 font-mono text-sm tracking-widest text-gray-300 uppercase">
                                            <span className="h-px w-8 bg-space-border" />
                                            Technical Data
                                            <span className="h-px flex-grow bg-space-border" />
                                        </h4>
                                        <div className="space-y-3">
                                            {item.criteria!.map((criterion) => (
                                                <div
                                                    key={criterion.id}
                                                    className="group"
                                                >
                                                    <div className="mb-1 flex justify-between text-sm">
                                                        <span className="text-gray-300 transition-colors group-hover:text-space-cyan">
                                                            {criterion.name}
                                                        </span>
                                                        <span className="font-mono text-white">
                                                            {formatCriterionValue(criterion.pivot?.value ?? 0)}{' '}
                                                            {criterion.unit}
                                                        </span>
                                                    </div>
                                                    <div className="h-1 w-full overflow-hidden rounded-full bg-space-950">
                                                        <div
                                                            className="h-full bg-space-border transition-all duration-500 group-hover:bg-space-highlight"
                                                            style={{
                                                                width: `${(criterion.pivot!.value / criterion.max_value) * 100}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    <ImageViewer src={item.image ?? ''} alt={item.name ?? ''} open={viewerOpen} onClose={() => setViewerOpen(false)} />
                </div>
            )}
        </AnimatePresence>
    );
}
