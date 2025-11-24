import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { ReactNode, useEffect, useState } from 'react';

interface OwnPopoverProps {
    trigger: ReactNode;
    children: ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    className?: string;
}

export default function OwnPopover({
    trigger,
    children,
    side = 'top',
    align = 'center',
    className = '',
}: OwnPopoverProps) {
    const isMobile = useIsMobile();
    const [isOpen, setIsOpen] = useState(false);

    // Auto-close on mobile when clicking outside
    useEffect(() => {
        if (isMobile && isOpen) {
            const handleClickOutside = () => setIsOpen(false);
            document.addEventListener('click', handleClickOutside);
            return () =>
                document.removeEventListener('click', handleClickOutside);
        }
    }, [isMobile, isOpen]);

    // Desktop hover handlers
    const handleMouseEnter = () => {
        if (!isMobile) {
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setIsOpen(false);
        }
    };

    // Mobile click handler
    const handleClick = (e: React.MouseEvent) => {
        if (isMobile) {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger
                asChild
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
            >
                <div className="inline-flex">{trigger}</div>
            </PopoverTrigger>
            <PopoverContent
                side={side}
                align={align}
                className={className}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </PopoverContent>
        </Popover>
    );
}
