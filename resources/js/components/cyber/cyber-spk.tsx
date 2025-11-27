import React, { useState } from 'react';
import { Sliders, Activity, RefreshCw } from 'lucide-react';

export default function CyberSpk() {
    const [weights, setWeights] = useState({
        performance: 75,
        durability: 50,
        efficiency: 25
    });

    const handleChange = (key: keyof typeof weights, value: number) => {
        setWeights(prev => ({ ...prev, [key]: value }));
    };

    // TODO: Dynamic field generation based on criteria from backend
    // TODO: Submit updated weights to backend

    return (
        <div className="border border-space-border bg-space-900/95 backdrop-blur-xl p-6 rounded-sm ring-1 ring-space-accent/20">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-space-border">
                <div className="flex items-center gap-2 text-space-accent">
                    <Sliders className="w-4 h-4" />
                    <h2 className="font-mono text-xs font-bold tracking-wider">COMPATIBILITY_MATRIX</h2>
                </div>
                <Activity className="w-3 h-3 text-space-highlight animate-pulse" />
            </div>

            <div className="space-y-6">
                {Object.entries(weights).map(([key, val]) => (
                    <div key={key} className="group">
                        <div className="flex justify-between mb-2 font-mono text-[10px]">
                            <span className="uppercase text-space-muted group-hover:text-space-cyan transition-colors">{key}</span>
                            <span className="text-space-accent">{val}%</span>
                        </div>

                        <div className="relative w-full h-5 flex items-center">
                            {/* Track Background */}
                            <div className="absolute inset-x-0 h-1 bg-space-950 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-space-accent to-space-highlight transition-all duration-75"
                                    style={{ width: `${val}%` }}
                                />
                            </div>

                            {/* Visual Knob */}
                            <div
                                className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(167,139,250,0.8)] border border-space-accent pointer-events-none transition-all duration-75 z-20"
                                style={{ left: `calc(${val}% - 6px)` }}
                            />

                            {/* Invisible Range Input */}
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={val}
                                onChange={(e) => handleChange(key as keyof typeof weights, parseInt(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-8 py-2.5 bg-space-800 border border-space-border hover:border-space-highlight text-space-muted hover:text-white font-mono text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 group rounded-sm">
                <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                Update Vectors
            </button>
        </div>
    );
};
