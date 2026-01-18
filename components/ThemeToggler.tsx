"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { IconSun, IconMoon, IconDeviceDesktop } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggler() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="size-9">
                <IconSun className="size-4" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        )
    }

    const getIcon = () => {
        if (theme === "dark") {
            return <IconMoon className="size-4" />
        }
        if (theme === "light") {
            return <IconSun className="size-4" />
        }
        return <IconDeviceDesktop className="size-4" />
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9">
                    {getIcon()}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setTheme("light")} className="flex flex-col items-start gap-1 py-2">
                    <div className="flex items-center">
                        <IconSun className="mr-2 size-4" />
                        <span className="font-medium">Light</span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-6">
                        Gunakan tema terang
                    </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="flex flex-col items-start gap-1 py-2">
                    <div className="flex items-center">
                        <IconMoon className="mr-2 size-4" />
                        <span className="font-medium">Dark</span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-6">
                        Gunakan tema gelap
                    </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="flex flex-col items-start gap-1 py-2">
                    <div className="flex items-center">
                        <IconDeviceDesktop className="mr-2 size-4" />
                        <span className="font-medium">System</span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-6">
                        Ikuti preferensi sistem
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
