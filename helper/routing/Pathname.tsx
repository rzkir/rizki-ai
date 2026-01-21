"use client";

import React, { Fragment } from "react";

import { usePathname } from "next/navigation";

import { SiteHeader } from "@/components/site-header";

import Footer from "@/layout/Footer";

import { Toaster } from "sonner";

const Pathname = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const isAuthRoute =
        pathname?.includes("/signin") ||
        pathname?.includes("/signup") ||
        pathname?.includes("/forgot-password") || false;

    return (
        <Fragment>
            {!isAuthRoute && <Toaster position="top-center" richColors />}
            {!isAuthRoute && <SiteHeader />}
            {children}
            {!isAuthRoute && <Footer />}
        </Fragment>
    );
};

export default Pathname;