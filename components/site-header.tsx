"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconInnerShadowTop,
  IconPolaroid,
  IconVideo,
  IconBook,
  IconHeart,
  IconBriefcase,
  IconAi,
  IconChevronDown,
  IconMenu2,
  IconChevronRight,
  IconLogin,
  IconLogout,
  IconUser,
  IconLayoutDashboard,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/utils/context/AuthContext"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { ThemeToggler } from "@/components/ThemeToggler"

const navData = [
  {
    title: "Tech Hub",
    url: "/tech-hub",
    icon: IconAi,
    items: [
      {
        title: "Programming",
        url: "/programming",
      },
      {
        title: "Technology",
        url: "/technology",
      },
    ],
  },
  {
    title: "Personal",
    url: "/personal",
    icon: IconHeart,
    items: [
      {
        title: "Teman Curhat",
        url: "/curhat",
      },
      {
        title: "Health",
        url: "/health",
      },
    ],
  },
  {
    title: "Image",
    url: "/image",
    icon: IconPolaroid,
    items: [
      {
        title: "Image Analysis",
        url: "/image-analysis",
      },
      {
        title: "Image Generator",
        url: "/image-generator",
      },
    ],
  },
  {
    title: "Education",
    url: "/edu",
    icon: IconBook,
    items: [
      {
        title: "Academia",
        url: "/academia",
      },
      {
        title: "Science",
        url: "/science",
      },
      {
        title: "Translation",
        url: "/translation",
      },
    ],
  },
  {
    title: "Professional",
    url: "/pro",
    icon: IconBriefcase,
    items: [
      {
        title: "Legal",
        url: "/legal",
      },
      {
        title: "Marketing",
        url: "/marketing",
      },
      {
        title: "Finance",
        url: "/finance",
      },
      {
        title: "SEO",
        url: "/seo",
      },
    ],
  },
  {
    title: "Video",
    url: "/video",
    icon: IconVideo,
    items: [
      {
        title: "Video Analysis",
        url: "/video-analysis",
      },
      {
        title: "Video Generator",
        url: "/video-generator",
      },
    ],
  },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const { user, loading, logout, getDashboardUrl, hasRole } = useAuth()

  return (
    <header className="sticky top-0 md:top-4 max-w-6xl mx-auto z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-none md:rounded-2xl">
      <div className="flex h-16 items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <IconInnerShadowTop className="size-5 text-primary" />
          <span className="text-lg font-semibold">Rizki Ai.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 ml-6">
          {navData.map((item) => {
            const hasItems = item.items && item.items.length > 0
            const isActive = pathname?.startsWith(item.url) || false

            if (!hasItems) {
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {item.icon && <item.icon className="size-4" />}
                  <span>{item.title}</span>
                </Link>
              )
            }

            return (
              <DropdownMenu key={item.title}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 h-auto text-sm font-medium",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.icon && <item.icon className="size-4" />}
                    <span>{item.title}</span>
                    <IconChevronDown className="size-3.5 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {item.items?.map((subItem) => {
                    const isSubActive = pathname === subItem.url
                    return (
                      <DropdownMenuItem key={subItem.title} asChild>
                        <Link
                          href={subItem.url}
                          className={cn(
                            "flex items-center w-full",
                            isSubActive && "bg-accent"
                          )}
                        >
                          {subItem.title}
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggler />
          {!loading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL} alt={user.displayName} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {user.displayName?.slice(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.displayName}</span>
                      <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardUrl(user.role)} className="flex items-center gap-2">
                      {hasRole("admins") ? <IconLayoutDashboard className="size-4" /> : <IconUser className="size-4" />}
                      <span>{hasRole("admins") ? "Dashboard" : "Profil"}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive gap-2">
                    <IconLogout className="size-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" asChild size="sm" className="gap-2">
                <Link href="/login">
                  <IconLogin className="size-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </Button>
            )
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <IconMenu2 className="size-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <IconInnerShadowTop className="size-5 text-primary" />
                  <span>Rizki Ai.</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-2">
                {navData.map((item) => {
                  const hasItems = item.items && item.items.length > 0
                  const isActive = pathname?.startsWith(item.url) || false

                  if (!hasItems) {
                    return (
                      <Link
                        key={item.title}
                        href={item.url}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        {item.icon && <item.icon className="size-5" />}
                        <span>{item.title}</span>
                      </Link>
                    )
                  }

                  return (
                    <MobileNavItem
                      key={item.title}
                      item={item}
                      pathname={pathname}
                      onNavigate={() => setMobileMenuOpen(false)}
                    />
                  )
                })}
                <div className="mt-4 pt-4 border-t border-border">
                  {!loading && (
                    user ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 px-4 py-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.photoURL} alt={user.displayName} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {user.displayName?.slice(0, 2).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium truncate">{user.displayName}</span>
                            <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button asChild variant="outline" className="flex-1 gap-2" onClick={() => setMobileMenuOpen(false)}>
                            <Link href={getDashboardUrl(user.role)}>
                              {hasRole("admins") ? <IconLayoutDashboard className="size-4" /> : <IconUser className="size-4" />}
                              <span>{hasRole("admins") ? "Dashboard" : "Profil"}</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                            <IconLogout className="size-4" />
                            <span className="sr-only">Logout</span>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button asChild className="w-full gap-2" onClick={() => setMobileMenuOpen(false)}>
                        <Link href="/login">
                          <IconLogin className="size-4" />
                          <span>Login</span>
                        </Link>
                      </Button>
                    )
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function MobileNavItem({
  item,
  pathname,
  onNavigate,
}: {
  item: typeof navData[0]
  pathname: string | null
  onNavigate: () => void
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const isActive = pathname?.startsWith(item.url) || false

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        )}
      >
        <div className="flex items-center gap-3">
          {item.icon && <item.icon className="size-5" />}
          <span>{item.title}</span>
        </div>
        <IconChevronRight
          className={cn(
            "size-4 transition-transform",
            isOpen && "rotate-90"
          )}
        />
      </button>
      {isOpen && (
        <div className="ml-4 mt-2 space-y-1 border-l border-border pl-4">
          {item.items?.map((subItem) => {
            const isSubActive = pathname === subItem.url
            return (
              <Link
                key={subItem.title}
                href={subItem.url}
                onClick={onNavigate}
                className={cn(
                  "flex items-center px-4 py-2 rounded-lg text-sm transition-colors",
                  isSubActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {subItem.title}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
