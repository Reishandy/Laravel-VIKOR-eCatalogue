import React, { useEffect, useRef, useState } from 'react';
import { Search, Sliders } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import CyberSpk from '@/components/cyber/cyber-spk';
import { CriteriaWeights, Criterion } from '@/types';

interface CyberSearchProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    criteria: Criterion[];
    spkWeights: CriteriaWeights;
    onSpkWeightsChange: (weights: CriteriaWeights) => void;
    onSpkApply: () => void;
    onSpkReset: () => void;
}

export default function CyberSearch({
    searchTerm,
    setSearchTerm,
    criteria,
    spkWeights,
    onSpkWeightsChange,
    onSpkApply,
    onSpkReset,
}: CyberSearchProps) {
    const [isSpkOpen, setIsSpkOpen] = useState(false);
    const spkRef = useRef<HTMLDivElement>(null);

    // Close SPK module when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                spkRef.current &&
                !spkRef.current.contains(event.target as Node)
            ) {
                setIsSpkOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSpkApply = () => {
        onSpkApply();
        setIsSpkOpen(false);
    };

    const handleSpkReset = () => {
        onSpkReset();
    };

    return (
        <div className="sticky top-0 z-40 w-full border-b border-space-border bg-space-900/30 py-8 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    {/* Search Bar */}
                    <div className="group relative w-full max-w-3xl">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <Search className="h-5 w-5 text-space-muted transition-colors group-focus-within:text-space-cyan" />
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-sm border border-space-border bg-space-950/80 py-3 pr-12 pl-12 font-mono text-sm text-white placeholder-space-muted shadow-lg transition-all focus:border-space-accent focus:ring-1 focus:ring-space-accent focus:outline-none"
                            placeholder="SEARCH CATALOGUE DATABASE..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* SPK Toggle & Metadata */}
                    <div
                        className="relative flex w-full items-center justify-end gap-4 md:w-auto"
                        ref={spkRef}
                    >
                        <div className="hidden flex-col text-right font-mono text-[10px] leading-tight text-space-muted md:flex">
                            <span>INDEX: ONLINE</span>
                            <span className="text-space-highlight">
                                V.3.1.0
                            </span>
                        </div>

                        <button
                            onClick={() => setIsSpkOpen(!isSpkOpen)}
                            className={`flex cursor-pointer items-center gap-2 border px-4 py-3 font-mono text-xs tracking-wider uppercase transition-all duration-300 ${isSpkOpen ? 'border-space-accent bg-space-accent text-white' : 'border-space-border bg-space-950 text-space-muted hover:border-space-accent hover:text-white'}`}
                        >
                            <Sliders className="h-4 w-4" />
                            <span>SPK_Mod</span>
                            {Object.keys(spkWeights).length > 0 && (
                                <span className="flex h-2 w-2">
                                    <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-space-highlight opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-space-highlight"></span>
                                </span>
                            )}
                        </button>

                        {/* Popover SPK Module */}
                        <AnimatePresence>
                            {isSpkOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full right-0 z-50 mt-2 w-80 shadow-2xl shadow-space-950/50 md:w-96"
                                >
                                    <CyberSpk
                                        criteria={criteria}
                                        initialWeights={spkWeights}
                                        onWeightsChange={onSpkWeightsChange}
                                        onApply={handleSpkApply}
                                        onReset={handleSpkReset}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
