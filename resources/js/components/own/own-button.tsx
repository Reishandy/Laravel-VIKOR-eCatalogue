import { ReactNode, MouseEvent } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Button } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface OwnButtonProps {
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    children: ReactNode;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | null | undefined
    icon?: ReactNode;
    href?: string;
    isProcessing?: boolean;
    disabled?: boolean;
    asChild?: boolean;
    className?: string;
}

export default function OwnButton({
    onClick,
    children,
    variant = 'default',
    href,
    isProcessing = false,
    disabled = false,
    asChild = false,
    className = '',
}: OwnButtonProps) {
    const Comp = asChild ? Slot : Button;

    return (
        <Comp
            className={cn(
                'transition-all duration-300 hover:scale-103 active:scale-95 cursor-pointer',
                className,
                !asChild && buttonVariants({ variant })
            )}
            onClick={onClick}
            disabled={isProcessing || disabled}
            {...(asChild ? {} : { asChild })}
        >
            {href ? (
                <Link
                    href={href}
                    prefetch={['mount', 'hover']}
                >
                    {isProcessing ? <Spinner/> : children}
                </Link>
            ) : (
                isProcessing ? <Spinner/> : children
            )}
        </Comp>
    );
}
