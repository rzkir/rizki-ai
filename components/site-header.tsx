"use client"

import * as React from "react"

import Link from "next/link"

import { usePathname } from "next/navigation"

import { useTheme } from "next-themes"

import {
  IconInnerShadowTop,
  IconMenu2,
  IconX,
  IconChevronRight,
  IconLogin,
  IconLogout,
  IconUser,
  IconLayoutDashboard,
  IconSun,
  IconMoon,
  IconDeviceDesktop,
} from "@tabler/icons-react"

import { useAuth } from "@/utils/context/AuthContext"

import { navData } from "@/helper/data/data"

import { cn } from "@/lib/utils"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)
  const [themeMenuOpen, setThemeMenuOpen] = React.useState(false)
  const { user, loading, logout, getDashboardUrl, hasRole } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-user-menu]') && !target.closest('[data-theme-menu]')) {
        setUserMenuOpen(false)
        setThemeMenuOpen(false)
      }
    }
    if (userMenuOpen || themeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userMenuOpen, themeMenuOpen])

  const getThemeIcon = () => {
    if (!mounted) return <IconSun className="size-4" />
    if (theme === "dark") return <IconMoon className="size-4" />
    if (theme === "light") return <IconSun className="size-4" />
    return <IconDeviceDesktop className="size-4" />
  }

  return (
    <header className="sticky top-2 sm:top-4 max-w-md sm:max-w-2xl lg:max-w-6xl mx-auto z-50 border border-border/40 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/60 rounded-2xl shadow-lg shadow-black/5">
      <div className="flex h-16 items-center gap-4 px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
        >
          <IconInnerShadowTop className="size-5 text-primary" />
          <span className="text-lg font-semibold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Rizki Ai.
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex ml-6 flex-1">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              {navData.map((item) => {
                const hasItems = item.items && item.items.length > 0
                const isActive = pathname?.startsWith(item.url) || false

                if (!hasItems) {
                  return (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.url}
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "flex items-center gap-2",
                            isActive && "bg-primary/10 text-primary"
                          )}
                        >
                          {item.icon && <item.icon className="size-4" />}
                          <span>{item.title}</span>
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                }

                return (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuTrigger className={cn(
                      "flex items-center gap-2 bg-transparent",
                      isActive && "bg-primary/10 text-primary"
                    )}>
                      {item.icon && <item.icon className="size-4" />}
                      <span>{item.title}</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="w-56 p-2 space-y-1">
                        {item.items?.map((subItem) => {
                          const isSubActive = pathname === subItem.url
                          const SubIcon = subItem.icon
                          return (
                            <li key={subItem.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={subItem.url}
                                  className={cn(
                                    "flex flex-col gap-1 rounded-sm p-3 text-sm transition-colors",
                                    isSubActive
                                      ? "bg-primary/10 text-primary font-medium"
                                      : "hover:bg-accent"
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    {SubIcon && <SubIcon className="size-4 shrink-0" />}
                                    <span className="font-medium">{subItem.title}</span>
                                  </div>
                                  {subItem.description && (
                                    <span className="text-xs text-muted-foreground leading-relaxed">
                                      {subItem.description}
                                    </span>
                                  )}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          )
                        })}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Theme Toggler */}
          <div className="relative" data-theme-menu>
            <button
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {getThemeIcon()}
            </button>
            {themeMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg p-2 z-50">
                <button
                  onClick={() => {
                    setTheme("system")
                    setThemeMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent transition-colors text-left"
                >
                  <IconDeviceDesktop className="size-4" />
                  <div className="flex-1">
                    <div className="font-medium">System</div>
                    <div className="text-xs text-muted-foreground">Ikuti preferensi sistem</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setTheme("light")
                    setThemeMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent transition-colors text-left"
                >
                  <IconSun className="size-4" />
                  <div className="flex-1">
                    <div className="font-medium">Light</div>
                    <div className="text-xs text-muted-foreground">Gunakan tema terang</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setTheme("dark")
                    setThemeMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent transition-colors text-left"
                >
                  <IconMoon className="size-4" />
                  <div className="flex-1">
                    <div className="font-medium">Dark</div>
                    <div className="text-xs text-muted-foreground">Gunakan tema gelap</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* User Menu / Login Button */}
          {!loading && (
            user ? (
              <div className="relative" data-user-menu>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-primary/20 transition-all"
                  aria-label="User menu"
                >
                  {user.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                      {user.displayName?.slice(0, 2).toUpperCase() || "U"}
                    </div>
                  )}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                      <div className="font-medium text-sm">{user.displayName}</div>
                      <div className="text-xs text-muted-foreground truncate mt-1">
                        {user.email}
                      </div>
                    </div>
                    <div className="p-1">
                      <Link
                        href={getDashboardUrl(user.role)}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent transition-colors w-full"
                      >
                        {hasRole("admins") ? (
                          <IconLayoutDashboard className="size-4" />
                        ) : (
                          <IconUser className="size-4" />
                        )}
                        <span>{hasRole("admins") ? "Dashboard" : "Profil"}</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setUserMenuOpen(false)
                        }}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors w-full"
                      >
                        <IconLogout className="size-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/signin"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <IconLogin className="size-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <IconX className="size-5" />
            ) : (
              <IconMenu2 className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-80 p-0 lg:hidden">
          <SheetHeader className="px-4 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconInnerShadowTop className="size-5 text-primary" />
                <SheetTitle className="text-lg font-semibold m-0">
                  Rizki Ai.
                </SheetTitle>
              </div>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <nav className="flex flex-col gap-1 p-4">
              {navData.map((item) => (
                <MobileNavItem
                  key={item.title}
                  item={item}
                  pathname={pathname}
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
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
  const hasItems = item.items && item.items.length > 0
  const isActive = pathname?.startsWith(item.url) || false

  if (!hasItems) {
    return (
      <Link
        href={item.url}
        onClick={onNavigate}
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
            "size-4 transition-transform duration-200",
            isOpen && "rotate-90"
          )}
        />
      </button>
      {isOpen && (
        <div className="ml-4 mt-1 space-y-1 border-l-2 border-border/50 pl-4">
          {item.items?.map((subItem) => {
            const isSubActive = pathname === subItem.url
            const SubIcon = subItem.icon
            return (
              <Link
                key={subItem.title}
                href={subItem.url}
                onClick={onNavigate}
                className={cn(
                  "flex flex-col gap-1 px-4 py-2 rounded-lg text-sm transition-colors",
                  isSubActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <div className="flex items-center gap-3">
                  {SubIcon && <SubIcon className="size-4 shrink-0" />}
                  <span>{subItem.title}</span>
                </div>
                {subItem.description && (
                  <span className="text-xs text-muted-foreground leading-relaxed ml-7">
                    {subItem.description}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
