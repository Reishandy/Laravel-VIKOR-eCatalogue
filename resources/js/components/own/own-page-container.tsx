import { ReactNode } from 'react';

interface OwnPageContainerProps {
    title: string;
    description?: string;
    children: ReactNode;
    headerAction?: ReactNode;
}

export default function OwnPageContainer({ title, description, children, headerAction }: OwnPageContainerProps) {
    return (
        <div className="p-4 space-y-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:items-center md:justify-between">
                <div className="space-y-0.5">
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>

                {headerAction && headerAction}
            </div>

            <div>{children}</div>
        </div>
    );
}
