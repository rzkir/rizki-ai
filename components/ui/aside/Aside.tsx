'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/* ---------------------------------- Types --------------------------------- */
export interface AsideLayoutProps {
    /** Main content */
    children: React.ReactNode;
    /** Additional className */
    className?: string;
}

export interface AsideMainProps {
    /** Main content */
    children: React.ReactNode;
    /** Additional className */
    className?: string;
    /** Show decorative background blurs */
    showBackground?: boolean;
    /** Custom max-width for content container */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
    /** Padding bottom for fixed footer */
    footerPadding?: boolean;
}

export interface AsideFooterProps {
    /** Footer content */
    children: React.ReactNode;
    /** Additional className */
    className?: string;
    /** Custom max-width for footer container */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
}

/* -------------------------------- Constants ------------------------------- */
const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
};

/* -------------------------------- Components ------------------------------ */

/**
 * Root layout wrapper for pages with sidebar
 * Provides flex container for sidebar + main content
 */
export function AsideLayout({ children, className }: AsideLayoutProps) {
    return (
        <section className={cn('flex min-h-svh bg-background', className)}>
            {children}
        </section>
    );
}

/**
 * Main content area that accounts for sidebar width
 * Use this as a direct child of AsideLayout alongside Sidebar
 */
export function AsideInset({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <main className={cn('flex-1 flex flex-col min-h-svh lg:pl-76 xl:pl-84', className)}>
            {children}
        </main>
    );
}

/**
 * Decorative background with blur effects
 * Accounts for sidebar width on desktop
 */
export function AsideBackground({ className }: { className?: string }) {
    return (
        <div className={cn('fixed inset-0 overflow-hidden pointer-events-none lg:left-76 xl:left-84', className)}>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>
    );
}

/**
 * Scrollable main content wrapper
 * Handles overflow and padding for fixed footer
 */
export function AsideMain({
    children,
    className,
    showBackground = true,
    maxWidth = '7xl',
    footerPadding = true,
}: AsideMainProps) {
    return (
        <>
            {showBackground && <AsideBackground />}
            <div className={cn('flex-1 overflow-y-auto relative', footerPadding && 'pb-28', className)}>
                <div className={cn('mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12', maxWidthClasses[maxWidth])}>
                    {children}
                </div>
            </div>
        </>
    );
}

/**
 * Fixed bottom footer area
 * Accounts for sidebar width on desktop
 */
export function AsideFooter({
    children,
    className,
    maxWidth = '7xl',
}: AsideFooterProps) {
    return (
        <div className={cn('fixed bottom-0 left-0 right-0 z-40 lg:left-76 xl:left-84', className)}>
            <div className={cn('mx-auto p-4 sm:p-6 lg:px-8', maxWidthClasses[maxWidth])}>
                {children}
            </div>
        </div>
    );
}

/**
 * Section divider with centered label
 */
export function AsideSectionDivider({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
            <span className="text-sm font-semibold text-foreground px-4">{children}</span>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
        </div>
    );
}

// Re-export all components
export {
    AsideLayout as Layout,
    AsideInset as Inset,
    AsideMain as Main,
    AsideFooter as Footer,
    AsideBackground as Background,
    AsideSectionDivider as SectionDivider,
};
