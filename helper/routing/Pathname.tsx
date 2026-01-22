"use client";

import React, { Fragment } from "react";

import { usePathname } from "next/navigation";

import { SiteHeader } from "@/components/site-header";

import Footer from "@/layout/Footer";

import { Toaster } from "sonner";

const Pathname = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const isAuthRoute = pathname?.includes("/auth") ||
        pathname?.includes("/tech-hub") ||
        pathname?.includes("/personal") ||
        pathname?.includes("/image") ||
        pathname?.includes("/edu") ||
        pathname?.includes("/pro") || false;

    return (
        <Fragment>
            <Toaster position="top-center" richColors />
            {!isAuthRoute && <SiteHeader />}
            {children}
            {!isAuthRoute && <Footer />}
        </Fragment>
    );
};

export default Pathname;