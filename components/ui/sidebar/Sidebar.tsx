'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { cn } from '@/lib/utils';

import { useAuth } from '@/utils/context/AuthContext';

/* -------------------------------- Components ------------------------------ */

/** Sidebar Header with gradient and animation */
function SidebarHeader({ icon: Icon, title, subtitle, badge }: SidebarHeaderProps) {
    return (
        <div className="relative">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-linear-to-r from-primary/20 via-primary/10 to-transparent rounded-2xl blur-xl opacity-60" />
            <div className="relative flex items-center gap-3">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/30 rounded-xl blur-md animate-pulse" />
                    <div className="relative p-2.5 rounded-xl bg-linear-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                        <Icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sidebar-foreground tracking-tight">{title}</h3>
                    {subtitle && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            {badge}
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

/** Section divider component */
function SectionDivider({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-sidebar-border to-transparent" />
            <span className="text-xs font-semibold text-sidebar-foreground px-4">{children}</span>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-sidebar-border to-transparent" />
        </div>
    );
}

/** Profile component */
function SidebarProfile() {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="space-y-4 mt-auto">
                <SectionDivider>Profile</SectionDivider>
                <p className="text-xs text-muted-foreground">Belum login.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 mt-auto">
            <SectionDivider>Profile</SectionDivider>
            <div className="rounded-2xl border border-sidebar-border/50 bg-sidebar-accent/50 p-4 space-y-3">
                <div className="flex items-center gap-3">
                    {user.photoURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={user.photoURL}
                            alt={user.displayName || "User"}
                            className="w-12 h-12 rounded-full object-cover border-2 border-sidebar-border/50"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium border-2 border-sidebar-border/50">
                            {user.displayName?.slice(0, 2).toUpperCase() || "U"}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-sidebar-foreground truncate">
                            {user.displayName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/** Scrollable content wrapper with fade edges */
function SidebarContent({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn('flex-1 min-h-0 relative flex flex-col', className)}>
            <div className="absolute top-0 left-0 right-0 h-6 bg-linear-to-b from-sidebar to-transparent z-10 pointer-events-none" />
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto scroll-smooth overscroll-contain px-4 py-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-primary/40">
                    {children}
                </div>
                <div className="px-4 pb-6 shrink-0">
                    <SidebarProfile />
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-linear-to-t from-sidebar to-transparent z-10 pointer-events-none" />
        </div>
    );
}

/** Main Sidebar Component */
export function Sidebar({
    header,
    children,
    open,
    onOpenChange,
    className,
    mobileIcon: MobileIcon,
    mobileBadge,
}: SidebarProps) {
    const TriggerIcon = MobileIcon || header.icon;

    return (
        <>
            {/* Mobile: Floating Action Button + Sheet */}
            <div className="lg:hidden fixed bottom-4 right-4 z-50">
                <Sheet open={open} onOpenChange={onOpenChange}>
                    <SheetTrigger asChild>
                        <Button
                            size="lg"
                            className="relative rounded-full h-14 w-14 shadow-xl bg-linear-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 border-0 transition-all duration-300 hover:scale-105 hover:shadow-primary/25 hover:shadow-2xl"
                        >
                            <TriggerIcon className="w-6 h-6" />
                            {mobileBadge !== undefined && mobileBadge > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                                    {mobileBadge > 9 ? '9+' : mobileBadge}
                                </span>
                            )}
                            <span className="sr-only">Open {header.title}</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="left"
                        className="w-[90vw] max-w-sm flex flex-col gap-0 p-0 bg-sidebar text-sidebar-foreground border-sidebar-border overflow-hidden"
                    >
                        {/* Header */}
                        <div className="relative p-5 pr-12 border-b border-sidebar-border/50 bg-linear-to-br from-sidebar via-sidebar to-primary/5">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <SidebarHeader {...header} />
                        </div>
                        {/* Content */}
                        <SidebarContent>{children}</SidebarContent>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop: Fixed Floating Sidebar */}
            <div className={cn('hidden lg:block fixed top-4 left-4 bottom-4 z-30 w-72 xl:w-80', className)}>
                <aside className="h-full max-h-[calc(100vh-2rem)] flex flex-col rounded-2xl border border-sidebar-border/50 bg-sidebar/95 backdrop-blur-xl text-sidebar-foreground shadow-xl shadow-black/5 overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-1/4 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />

                    {/* Header */}
                    <div className="relative p-5 border-b border-sidebar-border/50 bg-linear-to-r from-transparent via-primary/5 to-transparent shrink-0">
                        <SidebarHeader {...header} />
                    </div>

                    {/* Content */}
                    <SidebarContent>{children}</SidebarContent>
                </aside>
            </div>
        </>
    );
}

/** Main content wrapper that accounts for sidebar width */
export function SidebarInset({
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

/** Fixed bottom area that accounts for sidebar width */
export function SidebarFooter({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('fixed bottom-0 left-0 right-0 z-40 lg:left-76 xl:left-84', className)}>
            {children}
        </div>
    );
}

export { SidebarHeader, SidebarContent };