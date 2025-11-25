import React, { useState, useMemo, useEffect } from 'react';
import {
    Search,
    X,
    SlidersHorizontal,
    Cpu,
    Box,
    ChevronRight,
    Terminal,
    Activity,
    MapPin,
    Mail,
    Info,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

// --- MOCK DATA ---

const COMPANY_INFO = {
    name: "NEXUS INDUSTRIAL SUPPLIES",
    desc: "High-grade components for automated infrastructure.",
    email: "procurement@nexus-ind.sys",
    address: "Sector 7G, Industrial District, Jakarta",
    version: "v2.0.4-beta"
};

// Mock Items with Dynamic Criteria
// Criteria structure: { key: string, label: string, value: number, max: number, unit: string }
const MOCK_ITEMS = Array.from({ length: 12 }).map((_, i) => ({
    id: `NXS-${1000 + i}`,
    name: `Actuator Module Type-${String.fromCharCode(65 + i)}`,
    desc: "Heavy duty linear actuator with servo feedback loop. Designed for high-precision assembly lines.",
    price: 1500000 + (i * 250000),
    image: `/api/placeholder/400/300`, // Placeholder
    // Simulating the dynamic criteria field
    criteria: [
        { key: 'durability', label: 'Durability Rating', value: 80 + (i % 5) * 4, max: 100, unit: 'pts' },
        { key: 'efficiency', label: 'Power Efficiency', value: 60 + (i % 7) * 5, max: 100, unit: '%' },
        { key: 'load', label: 'Max Load', value: 50 + (i * 10), max: 200, unit: 'kg' },
        { key: 'precision', label: 'Precision variance', value: 10 - (i % 8), max: 10, unit: 'mm' }, // Lower is better usually, but for SPK simplicity we'll treat high score = good compatibility
        { key: 'heat', label: 'Heat Resistance', value: 100 + (i * 5), max: 300, unit: '°C' },
        { key: 'maintenance', label: 'Maintenance Interval', value: 12 + (i % 4), max: 24, unit: 'mo' },
    ]
}));

// --- COMPONENTS ---

// 1. Reusable Badge
const TechBadge = ({ children, color = "zinc" }) => {
    const colors = {
        zinc: "bg-zinc-800 text-zinc-300 border-zinc-700",
        emerald: "bg-emerald-950/30 text-emerald-400 border-emerald-900",
        amber: "bg-amber-950/30 text-amber-500 border-amber-900",
        blue: "bg-blue-950/30 text-blue-400 border-blue-900",
    };
    return (
        <span className={`px-2 py-0.5 text-xs font-mono border ${colors[color]} uppercase tracking-wider`}>
      {children}
    </span>
    );
};

// 2. The Compatibility (SPK) Engine Panel
const SPKPanel = ({ weights, setWeights, isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="border-b border-zinc-800 bg-zinc-900/50 p-6 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2 mb-4 text-amber-500">
                <Activity size={18} />
                <h3 className="text-sm font-mono font-bold uppercase tracking-widest">Compatibility Engine (SPK Mode)</h3>
            </div>

            <p className="text-zinc-500 text-xs mb-6 max-w-2xl">
                Adjust the sliders below to prioritize specific criteria. The system will calculate a compatibility score for each item based on your requirements.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.keys(weights).map((key) => (
                    <div key={key} className="space-y-2">
                        <div className="flex justify-between text-xs font-mono uppercase text-zinc-400">
                            <span>{key}</span>
                            <span className={weights[key] > 0 ? "text-amber-500" : ""}>{weights[key]}% Priority</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={weights[key]}
                            onChange={(e) => setWeights(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                            className="w-full h-1 bg-zinc-800 rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-amber-500 hover:[&::-webkit-slider-thumb]:bg-amber-400"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

// 3. Product Detail Modal
const ProductModal = ({ item, onClose }) => {
    if (!item) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-900">
                    <div className="flex items-center gap-3">
                        <TechBadge color="blue">Details</TechBadge>
                        <span className="font-mono text-zinc-400 text-sm">{item.id}</span>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col lg:flex-row h-full">

                        {/* Left: Image & Quick Info */}
                        <div className="lg:w-2/5 p-6 border-r border-zinc-800 bg-zinc-900/50">
                            <div className="aspect-square bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-6 relative overflow-hidden group">
                                {/* Simulated Image */}
                                <Box size={64} className="text-zinc-600 group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                            </div>

                            <h2 className="text-xl font-bold text-white mb-2">{item.name}</h2>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">{item.desc}</p>

                            <div className="text-2xl font-mono text-emerald-400 mb-1">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}
                            </div>
                            <div className="text-xs text-zinc-500 font-mono">EXCL. VAT</div>
                        </div>

                        {/* Right: Technical Specs (Dynamic Criteria) */}
                        <div className="lg:w-3/5 p-0">
                            <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center gap-2">
                                <Terminal size={16} className="text-zinc-500" />
                                <span className="text-xs font-mono uppercase text-zinc-500">Technical_Specification_Manifest</span>
                            </div>

                            <div className="p-6 grid grid-cols-1 gap-4">
                                {item.criteria.map((crit, idx) => (
                                    <div key={idx} className="group">
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-sm font-mono text-zinc-400 uppercase">{crit.label}</span>
                                            <span className="text-sm font-mono text-white">
                        {crit.value} <span className="text-zinc-600 text-xs">{crit.unit}</span>
                      </span>
                                        </div>
                                        {/* Progress Bar Visualization */}
                                        <div className="w-full h-1.5 bg-zinc-800 overflow-hidden">
                                            <div
                                                className="h-full bg-zinc-500 group-hover:bg-blue-500 transition-colors"
                                                style={{ width: `${(crit.value / crit.max) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-zinc-600 font-mono mt-1">
                                            <span>0</span>
                                            <span>MAX: {crit.max}</span>
                                        </div>
                                    </div>
                                ))}

                                {/* Simulated extensive data dump for "lots of criteria" */}
                                <div className="mt-6 pt-6 border-t border-zinc-800 border-dashed">
                                    <h4 className="text-xs font-mono text-zinc-500 mb-3 uppercase">Additional Parameters</h4>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-mono">
                                        <div className="flex justify-between border-b border-zinc-800/50 pb-1">
                                            <span className="text-zinc-500">Material_Grade</span>
                                            <span className="text-zinc-300">AL-7075</span>
                                        </div>
                                        <div className="flex justify-between border-b border-zinc-800/50 pb-1">
                                            <span className="text-zinc-500">Cert_ISO</span>
                                            <span className="text-zinc-300">9001:2015</span>
                                        </div>
                                        <div className="flex justify-between border-b border-zinc-800/50 pb-1">
                                            <span className="text-zinc-500">Input_Voltage</span>
                                            <span className="text-zinc-300">24V DC</span>
                                        </div>
                                        <div className="flex justify-between border-b border-zinc-800/50 pb-1">
                                            <span className="text-zinc-500">IP_Rating</span>
                                            <span className="text-zinc-300">IP67</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors text-sm font-mono uppercase tracking-wide"
                    >
                        Close Viewer
                    </button>
                    <button className="px-6 py-2 bg-white text-black hover:bg-zinc-200 transition-colors text-sm font-mono font-bold uppercase tracking-wide flex items-center gap-2">
                        <Mail size={16} /> Request Quote
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ---

export default function App() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);

    // SPK State
    const [isSPKMode, setIsSPKMode] = useState(false);
    // Default weights mapping to our mock data keys
    const [spkWeights, setSpkWeights] = useState({
        durability: 50,
        efficiency: 50,
        load: 0,
        precision: 0
    });

    // Derived Logic: Filtering & SPK Calculation
    const processedItems = useMemo(() => {
        let items = MOCK_ITEMS.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (isSPKMode) {
            // Calculate Score
            items = items.map(item => {
                let totalScore = 0;
                let maxPossibleScore = 0;

                Object.keys(spkWeights).forEach(key => {
                    const weight = spkWeights[key];
                    if (weight > 0) {
                        const criterion = item.criteria.find(c => c.key === key);
                        if (criterion) {
                            // Normalize value to 0-1
                            const normalizedValue = criterion.value / criterion.max;
                            totalScore += normalizedValue * weight;
                            maxPossibleScore += weight;
                        }
                    }
                });

                const matchPercentage = maxPossibleScore > 0
                    ? Math.round((totalScore / maxPossibleScore) * 100)
                    : 0;

                return { ...item, matchScore: matchPercentage };
            });

            // Sort by Score DESC
            items.sort((a, b) => b.matchScore - a.matchScore);
        }

        return items;
    }, [searchTerm, isSPKMode, spkWeights]);

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">

            {/* 1. Industrial Header */}
            <header className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-40">
                {/* Top System Bar */}
                <div className="bg-zinc-900 px-6 py-1 flex justify-between items-center text-[10px] font-mono uppercase text-zinc-500 border-b border-zinc-800">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> System Online</span>
                        <span>{COMPANY_INFO.version}</span>
                    </div>
                    <div>{COMPANY_INFO.email}</div>
                </div>

                {/* Main Nav */}
                <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-zinc-100 text-zinc-950">
                            <Cpu size={28} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-white leading-none">{COMPANY_INFO.name}</h1>
                            <p className="text-xs text-zinc-500 mt-1 font-mono max-w-md">{COMPANY_INFO.desc}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-zinc-400">
                        <div className="hidden md:flex items-center gap-2">
                            <MapPin size={14} className="text-zinc-600" />
                            <span>{COMPANY_INFO.address}</span>
                        </div>
                        <button className="text-white hover:text-emerald-400 transition-colors font-mono uppercase text-xs border border-zinc-700 px-3 py-1">
                            Client_Login
                        </button>
                    </div>
                </div>
            </header>

            {/* 2. Controls Toolbar */}
            <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-[85px] z-30">
                <div className="flex flex-col md:flex-row gap-4 items-center">

                    {/* Search Input (Command Line Style) */}
                    <div className="relative flex-1 w-full group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-zinc-500 font-mono text-lg">{'>'}</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Input search query or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 pl-8 pr-4 py-3 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all font-mono text-sm placeholder:text-zinc-600"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <Search size={16} className="text-zinc-600" />
                        </div>
                    </div>

                    {/* SPK Toggle Button */}
                    <button
                        onClick={() => setIsSPKMode(!isSPKMode)}
                        className={`
              flex items-center gap-2 px-6 py-3 border text-sm font-mono uppercase tracking-wider transition-all w-full md:w-auto justify-center
              ${isSPKMode
                            ? "bg-amber-950/20 border-amber-600 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"}
            `}
                    >
                        <SlidersHorizontal size={16} />
                        <span>Smart_Rank {isSPKMode ? "ON" : "OFF"}</span>
                    </button>
                </div>
            </div>

            {/* 3. SPK Panel (Collapsible) */}
            <SPKPanel
                weights={spkWeights}
                setWeights={setSpkWeights}
                isOpen={isSPKMode}
            />

            {/* 4. Product Grid */}
            <main className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">
                        {processedItems.length} Records Found
                    </h2>
                    {isSPKMode && (
                        <div className="text-xs text-amber-600 font-mono flex items-center gap-1">
                            <Info size={12} />
                            Sorted by weighted relevance
                        </div>
                    )}
                </div>

                {processedItems.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-zinc-600 border border-dashed border-zinc-800 bg-zinc-900/20">
                        <AlertCircle size={48} className="mb-4 opacity-50" />
                        <p className="font-mono text-lg">NO_DATA_FOUND</p>
                        <p className="text-sm">Refine search criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {processedItems.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedProduct(item)}
                                className="group relative bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
                            >
                                {/* Decoration Lines */}
                                <div className="absolute top-0 right-0 p-2 opacity-50">
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
                                        <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
                                        <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Match Score Overlay (SPK Only) */}
                                {isSPKMode && item.matchScore !== undefined && (
                                    <div className="absolute top-0 left-0 z-10 p-2">
                                        <div className={`
                       px-2 py-1 text-xs font-mono font-bold border shadow-lg backdrop-blur-md
                       ${item.matchScore > 80 ? "bg-emerald-900/80 border-emerald-500 text-emerald-400" :
                                            item.matchScore > 50 ? "bg-amber-900/80 border-amber-500 text-amber-400" :
                                                "bg-zinc-800/80 border-zinc-600 text-zinc-400"}
                     `}>
                                            MATCH: {item.matchScore}%
                                        </div>
                                    </div>
                                )}

                                {/* Card Image Area */}
                                <div className="h-48 bg-zinc-950 flex items-center justify-center border-b border-zinc-800 relative">
                                    <Box size={40} className="text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                                    {/* Tech Overlay lines */}
                                    <div className="absolute bottom-2 left-2 text-[10px] font-mono text-zinc-600">
                                        IMG_SRC: {item.id}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-mono text-[10px] text-zinc-500">{item.id}</span>
                                        <ChevronRight size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                                    </div>

                                    <h3 className="text-zinc-100 font-bold mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1">{item.name}</h3>
                                    <p className="text-zinc-500 text-xs line-clamp-2 mb-4 flex-1">{item.desc}</p>

                                    {/* Mini Data Grid */}
                                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400 mb-4 bg-zinc-950 p-2 border border-zinc-800/50">
                                        <div className="flex flex-col">
                                            <span className="text-zinc-600">DURABILITY</span>
                                            <span>{item.criteria.find(c=>c.key ==='durability').value}/100</span>
                                        </div>
                                        <div className="flex flex-col border-l border-zinc-800 pl-2">
                                            <span className="text-zinc-600">LOAD_CAP</span>
                                            <span>{item.criteria.find(c=>c.key ==='load').value}kg</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-3 border-t border-zinc-800 flex justify-between items-end">
                                        <div className="text-emerald-500 font-mono text-lg">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumSignificantDigits: 3 }).format(item.price)}
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Effect Bar */}
                                <div className="h-1 w-full bg-zinc-800">
                                    <div className="h-full bg-emerald-500 w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* 5. Footer */}
            <footer className="border-t border-zinc-800 bg-zinc-900 px-6 py-8 mt-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-zinc-500">
                        <Terminal size={16} />
                        <span className="font-mono text-xs">CONNECTED TO NODE: IND-West-01</span>
                    </div>
                    <div className="text-zinc-600 text-xs">
                        &copy; {new Date().getFullYear()} {COMPANY_INFO.name}. All systems operational.
                    </div>
                </div>
            </footer>

            {/* Modals */}
            <ProductModal item={selectedProduct} onClose={() => setSelectedProduct(null)} />

        </div>
    );
}
