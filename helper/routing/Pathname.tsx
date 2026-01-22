"use client";

import React, { Fragment } from "react";

import { usePathname } from "next/navigation";

import { SiteHeader } from "@/components/site-header";

import Footer from "@/layout/Footer";

import { Toaster } from "sonner";

const Pathname = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const isAuthRoute = pathname?.includes("/auth") ||
        pathname?.includes("/programming") ||
        pathname?.includes("/technology") ||
        pathname?.includes("/curhat") ||
        pathname?.includes("/health") ||
        pathname?.includes("/image-generator") ||
        pathname?.includes("/image-analysis") ||
        pathname?.includes("/academia") ||
        pathname?.includes("/science") ||
        pathname?.includes("/translation") ||
        pathname?.includes("/legal") ||
        pathname?.includes("/marketing") ||
        pathname?.includes("/finance") ||
        pathname?.includes("/seo") ||
        pathname?.includes("/video-analysis") ||
        pathname?.includes("/video-generator") ||
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