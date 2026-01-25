"use client"

import * as React from "react"

import Link from "next/link"

import { usePathname } from "next/navigation"

import { IconMenu2, IconX } from "@tabler/icons-react"

import { AnimatePresence, motion } from "framer-motion"

import { navData } from "@/helper/data/data"

import { cn } from "@/lib/utils"

import { ThemeToggler } from "@/components/ThemeToggler"

export default function Menu() {
    const pathname = usePathname()
    const [open, setOpen] = React.useState(false)
    const activeGroupFromPath = React.useMemo(() => {
        return navData.find((g) => pathname?.startsWith(g.url))
    }, [pathname])
    const [activeGroupTitle, setActiveGroupTitle] = React.useState<string>(
        activeGroupFromPath?.title ?? navData[0]?.title ?? ""
    )

    React.useEffect(() => {
        if (!open) return
        setActiveGroupTitle(activeGroupFromPath?.title ?? navData[0]?.title ?? "")
    }, [open, activeGroupFromPath?.title])

    const close = React.useCallback(() => setOpen(false), [])

    React.useEffect(() => {
        if (!open) return

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") close()
        }

        document.addEventListener("keydown", onKeyDown)
        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"

        return () => {
            document.removeEventListener("keydown", onKeyDown)
            document.body.style.overflow = prevOverflow
        }
    }, [open, close])

    return (
        <>
            <div className="fixed right-4 top-4 z-50 flex items-center gap-2 bg-background/80 backdrop-blur rounded-xl p-2 border border-border/60">
                <ThemeToggler />

                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="inline-flex size-11 items-center justify-center rounded-xl border border-border/60 bg-background/80 text-foreground shadow-lg backdrop-blur hover:bg-accent focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                    aria-label="Open menu"
                    aria-haspopup="dialog"
                    aria-expanded={open}
                    aria-controls="edu-menu-overlay"
                >
                    <IconMenu2 className="size-6" />
                </button>
            </div>

            <AnimatePresence>
                {open && (
                    <div
                        id="edu-menu-overlay"
                        role="dialog"
                        aria-modal="true"
                        className="fixed inset-0 z-50"
                    >
                        <motion.button
                            type="button"
                            className="absolute inset-0 bg-black/40"
                            aria-label="Close menu overlay"
                            onClick={close}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        />

                        <motion.div
                            className="absolute inset-0 bg-background"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 24 }}
                            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {/* Top bar */}
                            <div className="flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
                                <div className="min-w-0">
                                    <div className="text-base font-semibold leading-tight">
                                        Navigasi
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Pilih kategori lalu pilih fitur.
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={close}
                                    className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-accent focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                                    aria-label="Close menu"
                                >
                                    <IconX className="size-5" />
                                </button>
                            </div>

                            {/* Mobile group chips */}
                            <div className="border-b border-border bg-background px-4 py-3 sm:hidden">
                                <div className="flex gap-2 overflow-x-auto">
                                    {navData.map((g) => (
                                        <button
                                            key={g.title}
                                            type="button"
                                            onClick={() => setActiveGroupTitle(g.title)}
                                            className={cn(
                                                "shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
                                                activeGroupTitle === g.title
                                                    ? "border-primary/40 bg-primary/10 text-primary"
                                                    : "border-border hover:bg-accent"
                                            )}
                                        >
                                            {g.title}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex h-[calc(100vh-52px-57px)] flex-col sm:h-[calc(100vh-52px)] sm:flex-row">
                                {/* Left: groups */}
                                <aside className="hidden w-70 shrink-0 overflow-auto border-r border-border bg-muted/20 sm:block">
                                    <div className="p-3">
                                        {navData.map((group) => {
                                            const GroupIcon = group.icon
                                            const selected = activeGroupTitle === group.title
                                            const isGroupActive = pathname?.startsWith(group.url) ?? false

                                            return (
                                                <button
                                                    key={group.title}
                                                    type="button"
                                                    onClick={() => setActiveGroupTitle(group.title)}
                                                    className={cn(
                                                        "w-full rounded-xl p-3 text-left transition-colors focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
                                                        "hover:bg-background/70",
                                                        selected && "bg-background shadow-sm",
                                                        isGroupActive && "ring-1 ring-primary/20"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {GroupIcon && (
                                                            <GroupIcon className={cn(
                                                                "size-5",
                                                                selected || isGroupActive ? "text-primary" : "text-muted-foreground"
                                                            )} />
                                                        )}
                                                        <div className="min-w-0">
                                                            <div className="font-medium">{group.title}</div>
                                                            {group.description && (
                                                                <div className="text-xs text-muted-foreground line-clamp-2">
                                                                    {group.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </aside>

                                {/* Right: items */}
                                <main className="flex-1 overflow-auto">
                                    <div className="p-4 sm:p-6">
                                        {(() => {
                                            const group =
                                                navData.find((g) => g.title === activeGroupTitle) ?? navData[0]
                                            if (!group) return null

                                            const GroupIcon = group.icon
                                            const isGroupActive = pathname?.startsWith(group.url) ?? false

                                            return (
                                                <div className="space-y-4">
                                                    <div className="min-w-0 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            {GroupIcon && (
                                                                <GroupIcon className={cn(
                                                                    "size-5",
                                                                    isGroupActive ? "text-primary" : "text-muted-foreground"
                                                                )} />
                                                            )}
                                                            <div className="text-lg font-semibold leading-tight">
                                                                {group.title}
                                                            </div>
                                                        </div>
                                                        {group.description && (
                                                            <div className="text-sm text-muted-foreground">
                                                                {group.description}
                                                            </div>
                                                        )}
                                                        <div className="h-px w-full bg-border/70 mt-2" />
                                                    </div>

                                                    {group.items?.length ? (
                                                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                            {group.items.map((item) => {
                                                                const ItemIcon = item.icon
                                                                const isActive = pathname === item.url

                                                                return (
                                                                    <Link
                                                                        key={item.title}
                                                                        href={item.url}
                                                                        onClick={() => setOpen(false)}
                                                                        className={cn(
                                                                            "rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
                                                                            isActive &&
                                                                            "border-primary/30 bg-primary/10"
                                                                        )}
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            {ItemIcon && (
                                                                                <ItemIcon className={cn(
                                                                                    "size-5",
                                                                                    isActive ? "text-primary" : "text-muted-foreground"
                                                                                )} />
                                                                            )}
                                                                            <div className="font-medium">
                                                                                {item.title}
                                                                            </div>
                                                                        </div>
                                                                        {item.description && (
                                                                            <div className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                                                                {item.description}
                                                                            </div>
                                                                        )}
                                                                    </Link>
                                                                )
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-muted-foreground">
                                                            Tidak ada submenu.
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })()}
                                    </div>
                                </main>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
