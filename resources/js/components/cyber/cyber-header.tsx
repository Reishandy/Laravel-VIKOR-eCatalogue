import React, { useState } from 'react';
import { Mail, MapPin } from 'lucide-react';
import { useTurncate } from '@/hooks/use-truncate';

interface CyberHeaderProps {
    company_name: string;
    company_email: string;
    company_address: string;
    company_description: string;
    company_logo: string;
}

export default function CyberHeader({
    company_name,
    company_email,
    company_address,
    company_description,
    company_logo,
}: CyberHeaderProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const truncateByChars = useTurncate();

    const truncatedDesc = truncateByChars(company_description);
    const shouldTruncate = company_description !== truncatedDesc;

    return (
        <header className="relative z-20 w-full border-b border-space-border bg-space-950/95 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-6 py-6">
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                    {/* Identity Block */}
                    <div className="group flex items-center gap-4">
                        <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-space-accent/50 bg-space-900 shadow-[0_0_15px_rgba(167,139,250,0.15)] transition-all duration-500 group-hover:shadow-[0_0_25px_rgba(167,139,250,0.3)]">
                            <div className="absolute inset-0 translate-y-full bg-space-accent/10 transition-transform duration-300 group-hover:translate-y-0" />
                            <img
                                src={company_logo}
                                alt={company_name}
                                className="h-full w-full scale-100 p-2"
                            />
                        </div>
                        <div>
                            <h1 className="bg-gradient-to-r from-white via-space-accent to-space-highlight bg-clip-text font-sans text-3xl font-bold tracking-tighter text-transparent">
                                {company_name}
                            </h1>
                            <div className="mt-1 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-space-highlight"></span>
                                <p className="font-mono text-sm tracking-widest text-gray-300 uppercase">
                                    // Orbital.Catalogue_v3.0
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Info Block */}
                    <div className="flex w-full flex-1 flex-col gap-2 text-right font-mono text-sm text-gray-300">
                        <div className="flex cursor-default items-center justify-end gap-2 transition-colors hover:text-space-cyan">
                            <span>{company_address}</span>
                            <MapPin className="h-3 w-3" />
                        </div>
                        <div className="flex cursor-pointer items-center justify-end gap-2 transition-colors hover:text-space-cyan">
                            <a href={`mailto:${company_email}`}>
                                {company_email}
                            </a>
                            <Mail className="h-3 w-3" />
                        </div>
                    </div>
                </div>

                {/* Description Line */}
                <div className="mt-6 w-full rounded-r border-l border-space-border bg-gradient-to-r from-space-800/50 to-transparent p-2 pl-4">
                    <p className="w-full text-justify text-sm leading-relaxed font-light break-words text-space-text">
                        {isExpanded ? company_description : truncatedDesc}
                    </p>
                    {shouldTruncate && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-2 flex cursor-pointer items-center gap-1 font-mono text-xs text-space-accent transition-colors hover:text-space-cyan"
                        >
                            {isExpanded ? 'Show Less' : 'Show More'}
                            <span className="text-lg">
                                {isExpanded ? '↑' : '↓'}
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
