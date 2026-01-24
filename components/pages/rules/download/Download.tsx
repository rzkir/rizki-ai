"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TypographyH1, TypographyH2, TypographyP } from "@/components/ui/typography";
import { Download as DownloadIcon, Monitor, Smartphone, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type DownloadItem = {
    label: string;
    href: string;
    format: string;
};

type PlatformDownloads = {
    platform: "Windows" | "Android";
    icon: typeof Monitor;
    items: DownloadItem[];
};

type PlatformSection = {
    id: "windows" | "android";
    name: string;
    description: string;
    icon: typeof Monitor;
    href: string;
    badge: string;
};

const PLATFORMS: PlatformDownloads[] = [
    {
        platform: "Windows",
        icon: Monitor,
        items: [
            { label: "Windows (x64) (System)", href: "#", format: ".exe" },
            { label: "Windows (x64) (User)", href: "#", format: ".exe" },
        ],
    },
    {
        platform: "Android",
        icon: Smartphone,
        items: [
            { label: "Android", href: "#", format: ".apk" },
        ],
    },
];

const QODER_SECTIONS: PlatformSection[] = [
    {
        id: "windows",
        name: "Windows",
        description:
            "Rizki AI untuk Windows memberikan pengalaman AI assistant yang lengkap di desktop Anda. Terintegrasi dengan sistem operasi Windows untuk produktivitas maksimal.",
        icon: Monitor,
        href: "#",
        badge: "Windows 10/11",
    },
    {
        id: "android",
        name: "Android",
        description:
            "Bawa Rizki AI ke mana saja dengan aplikasi Android. Akses semua fitur AI assistant langsung dari smartphone atau tablet Anda.",
        icon: Smartphone,
        href: "#",
        badge: "Android 8.0+",
    },
];

const OLDER_VERSIONS = [
    { version: "0.9", platforms: PLATFORMS },
    { version: "0.8", platforms: PLATFORMS },
];

function DownloadList({ platforms }: { platforms: PlatformDownloads[] }) {
    return (
        <div className="space-y-6">
            {platforms.map(({ platform, icon: Icon, items }) => (
                <div key={platform}>
                    <TypographyH2 className="mt-0! mb-3 flex items-center gap-2">
                        <Icon className="w-5 h-5 text-primary" />
                        {platform}
                    </TypographyH2>
                    <ul className="space-y-2">
                        {items.map((item) => (
                            <li key={item.label}>
                                <a
                                    href={item.href}
                                    className="inline-flex items-center gap-2 text-foreground hover:text-primary hover:underline py-1"
                                >
                                    <DownloadIcon className="w-4 h-4" />
                                    {item.label}
                                    <span className="text-muted-foreground text-sm">({item.format})</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default function Download() {
    const [expandedVersion, setExpandedVersion] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-16 max-w-6xl">
                {/* Header - Qoder style */}
                <div className="text-center mb-16">
                    <TypographyH1 className="mb-4">Download</TypographyH1>
                    <TypographyP className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Download versi Rizki AI yang sesuai untuk sistem operasi Anda.
                    </TypographyP>
                </div>

                {/* Top: Qoder-style platform sections */}
                <div className="space-y-16 mb-16">
                    {QODER_SECTIONS.map((section) => {
                        const Icon = section.icon;
                        return (
                            <div
                                key={section.id}
                                className="border-b border-border pb-16 last:border-b-0 last:pb-0"
                            >
                                <div className="grid gap-8 lg:grid-cols-[1fr_400px] items-start">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                                <Icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <TypographyH2 className="mt-0! mb-0!">
                                                {section.name}
                                            </TypographyH2>
                                        </div>
                                        <TypographyP className="text-muted-foreground mb-6 text-base leading-relaxed">
                                            {section.description}
                                        </TypographyP>
                                        <a
                                            href={section.href}
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors w-fit"
                                        >
                                            <DownloadIcon className="w-5 h-5" />
                                            Download
                                        </a>
                                    </div>
                                    <div className="flex justify-center lg:justify-end">
                                        <Card className="w-full max-w-[300px] border-2">
                                            <CardContent className="p-6 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10">
                                                        <Icon className="w-8 h-8 text-primary" />
                                                    </div>
                                                    <TypographyP className="font-semibold text-lg mb-1">
                                                        {section.name}
                                                    </TypographyP>
                                                    <TypographyP className="text-sm text-muted-foreground">
                                                        {section.badge}
                                                    </TypographyP>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom: Cursor-style version list */}
                <div className="space-y-2">
                    {OLDER_VERSIONS.map(({ version }) => {
                        const isExpanded = expandedVersion === version;
                        return (
                            <div
                                key={version}
                                className="border border-border rounded-xl overflow-hidden"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setExpandedVersion(isExpanded ? null : version)
                                    }
                                    className={cn(
                                        "w-full flex items-center justify-between px-6 py-4 text-left",
                                        "hover:bg-muted/50 transition-colors"
                                    )}
                                >
                                    <span className="font-semibold">{version}</span>
                                    {isExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                    )}
                                </button>
                                {isExpanded && (
                                    <div className="px-6 pb-6 pt-2 border-t border-border">
                                        <DownloadList
                                            platforms={OLDER_VERSIONS.find((v) => v.version === version)!.platforms}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
