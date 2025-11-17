import OwnButton from '@/components/own/own-button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface OwnDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    dialogTitle: ReactNode;
    dialogDescription?: ReactNode;
    dialogFooter: ReactNode;
    dialogTrigger?: ReactNode;
    onCancel?: () => void;
    children?: ReactNode;
}

export default function OwnDialog({
    open,
    onOpenChange,
    dialogTitle,
    dialogDescription,
    dialogFooter,
    dialogTrigger,
    onCancel,
    children,
}: OwnDialogProps) {
    const isMobile = useIsMobile();

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen && onCancel) {
            onCancel();
            return;
        }

        if (onOpenChange) {
            onOpenChange(isOpen);
        }
    };

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={handleOpenChange}>
                <DrawerTrigger asChild>{dialogTrigger}</DrawerTrigger>
                <DrawerContent>
                    <div className="p-4 space-y-4">
                        <DrawerTitle>{dialogTitle}</DrawerTitle>
                        {dialogDescription && (
                            <DrawerDescription>
                                {dialogDescription}
                            </DrawerDescription>
                        )}

                        {children}
                    </div>

                    <DrawerFooter className="pt-2">
                        <DrawerClose asChild>
                            <OwnButton
                                icon={<X />}
                                variant="outline"
                            >
                                Cancel
                            </OwnButton>
                        </DrawerClose>

                        {dialogFooter}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
            <DialogContent>
                <DialogTitle>{dialogTitle}</DialogTitle>
                {dialogDescription && (
                    <DialogDescription>{dialogDescription}</DialogDescription>
                )}

                {children}
                <DialogFooter>
                    <DialogClose asChild>
                        <OwnButton
                            icon={<X />}
                            variant="outline"
                            className="w-full md:w-fit"
                        >
                            Cancel
                        </OwnButton>
                    </DialogClose>

                    {dialogFooter}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
