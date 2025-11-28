import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ImageViewerProps {
    src: string;
    alt?: string;
    open: boolean;
    onClose: () => void;
}

export default function ImageViewer({ src, alt = '', open, onClose }: ImageViewerProps) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Image container */}
                    <motion.div
                        initial={{ y: 20, scale: 0.98 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: 20, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                        className="relative max-h-[90vh] max-w-[95vw]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            aria-label="Close image"
                            className="absolute right-2 top-2 z-20 rounded bg-black/40 p-2 text-white hover:bg-black/60 cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <img
                            src={src}
                            alt={alt}
                            className="max-h-[90vh] max-w-[95vw] object-contain select-none"
                            draggable={false}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

