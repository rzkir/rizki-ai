"use client";

import React from "react";
import Link from "next/link";
import {
    IconInnerShadowTop,
    IconBrandGithub,
    IconBrandX,
    IconMail,
    IconArrowUp,
    IconHeart,
} from "@tabler/icons-react";

const social = [
    { icon: IconBrandGithub, href: "https://github.com", label: "GitHub" },
    { icon: IconBrandX, href: "https://x.com", label: "X" },
    { icon: IconMail, href: "mailto:hello@rizkiai.com", label: "Email" },
];

const links = {
    product: [
        { label: "Tech Hub", href: "/tech-hub" },
        { label: "Personal", href: "/personal" },
        { label: "Image AI", href: "/image" },
        { label: "Education", href: "/edu" },
        { label: "Professional", href: "/pro" },
        { label: "Video AI", href: "/video" },
    ],
    resources: [
        { label: "Blog", href: "/blog" },
        { label: "Changelog", href: "/changelog" },
        { label: "Bantuan", href: "/help" },
        { label: "Download", href: "/download" },
    ],
    terms: [
        { label: "Ketentuan Layanan", href: "/terms" },
        { label: "Kebijakan Privasi", href: "/privacy" },
    ],
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-auto relative overflow-hidden">
            {/* Top border — gradient line */}
            <div
                className="h-px w-full opacity-60"
                style={{
                    background:
                        "linear-gradient(90deg, transparent, oklch(0.65 0.25 280 / 0.6), oklch(0.75 0.22 200 / 0.6), transparent)",
                }}
            />

            <div className="relative mx-auto container px-4 py-12">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                    {/* Brand block */}
                    <div className="sm:col-span-2 lg:col-span-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-foreground hover:opacity-90 transition-opacity"
                        >
                            <span
                                className="flex size-9 items-center justify-center rounded-lg text-primary"
                                style={{
                                    background:
                                        "linear-gradient(135deg, oklch(0.65 0.25 280 / 0.15), oklch(0.75 0.22 200 / 0.15)",
                                }}
                            >
                                <IconInnerShadowTop className="size-5" />
                            </span>
                            <span className="text-lg font-semibold tracking-tight">
                                Rizki Ai.
                            </span>
                        </Link>
                        <p className="mt-3 max-w-sm text-sm text-muted-foreground leading-relaxed">
                            Asisten AI untuk produktivitas, edukasi, dan kreativitas.
                            Satu tempat untuk coding, gambar, video, bisnis, dan ilmu.
                        </p>
                    </div>

                    {/* Product links */}
                    <div className="sm:col-span-1 lg:col-span-2">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Produk
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {links.product.map(({ label, href }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="text-sm text-foreground/90 hover:text-primary transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="sm:col-span-1 lg:col-span-2">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Resources
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {links.resources.map(({ label, href }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="text-sm text-foreground/90 hover:text-primary transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Terms */}
                    <div className="sm:col-span-1 lg:col-span-2">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Terms
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {links.terms.map(({ label, href }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="text-sm text-foreground/90 hover:text-primary transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className="sm:col-span-1 lg:col-span-2">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Connect
                        </h3>
                        <div className="mt-4 flex items-center gap-2">
                            {social.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-lg p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    aria-label={label}
                                >
                                    <Icon className="size-4" />
                                </a>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={scrollToTop}
                            className="mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Kembali ke atas"
                        >
                            <span className="rounded-md bg-muted/80 p-1.5">
                                <IconArrowUp className="size-3.5" />
                            </span>
                            Kembali ke atas
                        </button>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
                    <p className="text-xs text-muted-foreground">
                        © {year} Rizki Ai. Dibuat dengan{" "}
                        <IconHeart className="inline size-3.5 text-primary" /> di
                        Indonesia.
                    </p>
                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                        <Link
                            href="/"
                            className="hover:text-foreground transition-colors"
                        >
                            Beranda
                        </Link>
                        <span className="text-border">·</span>
                        <a
                            href="mailto:hello@rizkiai.com"
                            className="hover:text-foreground transition-colors"
                        >
                            Kontak
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
