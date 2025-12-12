import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    clickable?: boolean;
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
    hover = false,
    clickable = false,
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={cn(
                'bg-white rounded-xl border border-gray-200 p-6',
                hover && 'hover:shadow-md hover:border-gray-300 transition-all',
                clickable && 'cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};