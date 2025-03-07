import { cn } from '@/lib/utils';
import React from 'react';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    children: React.ReactNode;
}

export default function Heading({ as: Component = 'h1', className, children, ...props }: HeadingProps) {
    return (
        <Component
            className={cn(
                'font-heading text-2xl font-bold tracking-tight',
                Component === 'h1' && 'text-3xl lg:text-4xl',
                Component === 'h2' && 'text-2xl lg:text-3xl',
                Component === 'h3' && 'text-xl lg:text-2xl',
                Component === 'h4' && 'text-lg lg:text-xl',
                Component === 'h5' && 'text-base lg:text-lg',
                Component === 'h6' && 'text-sm lg:text-base',
                className,
            )}
            {...props}
        >
            {children}
        </Component>
    );
}
