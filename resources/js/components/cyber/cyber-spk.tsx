import { Criterion } from '@/types';
import { Activity, RefreshCcw, RefreshCw, Sliders } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CyberSpkProps {
    criteria: Criterion[];
    initialWeights?: { [key: number]: number };
    onWeightsChange: (weights: { [key: number]: number }) => void;
    onApply: () => void;
    onReset: () => void;
}

export default function CyberSpk({
    criteria,
    initialWeights = {},
    onWeightsChange,
    onApply,
    onReset,
}: CyberSpkProps) {
    const [weights, setWeights] = useState<{ [key: number]: number }>(
        initialWeights,
    );

    // Sync with initialWeights prop changes
    useEffect(() => {
        setWeights(initialWeights);
    }, [initialWeights]);

    // Initialize weights if not provided and criteria available
    useEffect(() => {
        if (Object.keys(weights).length === 0 && criteria.length > 0) {
            const defaultWeights = criteria.reduce(
                (acc, criterion) => {
                    acc[criterion.id] = 50; // Default 50% for all
                    return acc;
                },
                {} as { [key: number]: number },
            );
            setWeights(defaultWeights);
            onWeightsChange(defaultWeights);
        }
    }, [criteria, weights, onWeightsChange]);

    const handleChange = (criterionId: number, value: number) => {
        const newWeights = { ...weights, [criterionId]: value };
        setWeights(newWeights);
        onWeightsChange(newWeights);
    };

    const handleReset = () => {
        const resetWeights = criteria.reduce(
            (acc, criterion) => {
                acc[criterion.id] = 50;
                return acc;
            },
            {} as { [key: number]: number },
        );
        setWeights(resetWeights);
        onWeightsChange(resetWeights);
        onReset();
    };

    if (criteria.length === 0) {
        return (
            <div className="rounded-sm border border-space-border bg-space-900/95 p-6 ring-1 ring-space-accent/20 backdrop-blur-xl">
                <div className="mb-6 flex items-center justify-between border-b border-space-border pb-2">
                    <div className="flex items-center gap-2 text-space-accent">
                        <Sliders className="h-4 w-4" />
                        <h2 className="font-mono text-xs font-bold tracking-wider">
                            COMPATIBILITY_MATRIX
                        </h2>
                    </div>
                    <Activity className="h-3 w-3 animate-pulse text-space-highlight" />
                </div>
                <p className="py-4 text-center text-sm text-gray-300">
                    NO_CRITERIA_DEFINED
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-sm border border-space-border bg-space-900/95 p-6 ring-1 ring-space-accent/20 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between border-b border-space-border pb-2">
                <div className="flex items-center gap-2 text-space-accent">
                    <Sliders className="h-4 w-4" />
                    <h2 className="font-mono text-xs font-bold tracking-wider">
                        COMPATIBILITY_MATRIX
                    </h2>
                </div>
                <Activity className="h-3 w-3 animate-pulse text-space-highlight" />
            </div>

            <div className="max-h-80 space-y-6 overflow-y-auto pr-2">
                {criteria.map((criterion) => (
                    <div key={criterion.id} className="group">
                        <div className="mb-2 flex justify-between font-mono text-sm">
                            <span className="text-gray-300 uppercase transition-colors group-hover:text-space-cyan">
                                {criterion.name}
                            </span>
                            <span className="text-space-accent">
                                {weights[criterion.id] ?? 50}%
                            </span>
                        </div>

                        <div className="relative flex h-5 w-full items-center">
                            {/* Track Background */}
                            <div className="absolute inset-x-0 h-1 overflow-hidden rounded-full bg-space-950">
                                <div
                                    className="h-full bg-gradient-to-r from-space-accent to-space-highlight transition-all duration-75"
                                    style={{
                                        width: `${weights[criterion.id] ?? 50}%`,
                                    }}
                                />
                            </div>

                            {/* Visual Knob */}
                            <div
                                className="pointer-events-none absolute z-20 h-3 w-3 rounded-full border border-space-accent bg-white shadow-[0_0_10px_rgba(167,139,250,0.8)] transition-all duration-75"
                                style={{
                                    left: `calc(${weights[criterion.id] ?? 50}% - 6px)`,
                                }}
                            />

                            {/* Invisible Range Input */}
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={weights[criterion.id] ?? 50}
                                onChange={(e) =>
                                    handleChange(
                                        criterion.id,
                                        parseInt(e.target.value),
                                    )
                                }
                                className="absolute inset-0 z-30 h-full w-full cursor-pointer opacity-0"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={onApply}
                className="group mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-space-border bg-space-accent py-2.5 font-mono text-sm tracking-widest uppercase text-white transition-all hover:border-space-highlight hover:shadow-[0_0_20px_rgba(167,139,250,0.3)]"
            >
                <RefreshCw className="h-3 w-3 transition-transform duration-500 group-hover:rotate-180" />
                ENGAGE_SYNTHESIS
            </button>

            <button
                onClick={handleReset}
                className="group mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-space-border bg-space-800 py-2.5 font-mono text-sm tracking-widest uppercase text-gray-300 transition-all hover:border-space-highlight hover:text-white"
            >
                <RefreshCcw className="h-3 w-3 transition-transform duration-500 group-hover:-rotate-180" />
                RESET_MATRIX
            </button>
        </div>
    );
}
