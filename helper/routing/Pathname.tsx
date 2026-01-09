"use client";

import React from "react";

import { usePathname } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";

import { SiteHeader } from "@/components/site-header";

import Footer from "@/layout/Footer";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { Toaster } from "sonner";

const Pathname = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const isAuthRoute =
        pathname?.includes("/signin") ||
        pathname?.includes("/signup") ||
        pathname?.includes("/forgot-password") ||
        pathname?.includes("/auth/") || false;

    if (isAuthRoute) {
        return (
            <main>
                <Toaster
                    position="top-center"
                    richColors
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: 'black',
                            color: '#fff',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        },
                        className: 'font-medium',
                    }}
                />
                {children}
                <Footer />
            </main>
        );
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <main>
                    <Toaster
                        position="top-center"
                        richColors
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: 'black',
                                color: '#fff',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            },
                            className: 'font-medium',
                        }}
                    />
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Pathname;