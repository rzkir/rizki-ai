"use client"

import * as React from "react"

import { IconCirclePlusFilled, IconChevronDown, IconChevronRight, type Icon } from "@tabler/icons-react"

import Link from "next/link"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({})

  const toggleItem = (title: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Initiate New Core"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground rounded-lg px-4 py-3 font-medium duration-200 ease-linear justify-start gap-2"
            >
              <IconCirclePlusFilled className="size-5" />
              <span>+ Initiate New Core</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-2 py-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            NAVIGATION
          </h3>
        </div>
        <SidebarMenu>
          {items.map((item) => {
            const isOpen = openItems[item.title] ?? false
            const hasItems = item.items && item.items.length > 0

            // Jika tidak ada sub-items, render sebagai link biasa
            if (!hasItems) {
              return (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="text-foreground hover:bg-sidebar-accent/50 rounded-lg"
                    >
                      {item.icon && <item.icon className="size-5" />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              )
            }

            // Jika ada sub-items, render dengan collapsible (link utama tidak navigasi)
            return (
              <SidebarMenuItem key={item.title}>
                <div className="flex flex-col w-full">
                  <div className="flex items-center w-full gap-1">
                    <div className="flex-1">
                      <SidebarMenuButton
                        tooltip={item.title}
                        className="w-full text-foreground hover:bg-sidebar-accent/50 rounded-lg"
                        onClick={() => toggleItem(item.title)}
                      >
                        {item.icon && <item.icon className="size-5" />}
                        <span>{item.title}</span>
                        <div className="ml-auto">
                          {isOpen ? (
                            <IconChevronDown className="size-4 transition-transform" />
                          ) : (
                            <IconChevronRight className="size-4 transition-transform" />
                          )}
                        </div>
                      </SidebarMenuButton>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200 ease-in-out",
                      isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className="text-foreground/80 hover:text-foreground hover:bg-sidebar-accent/30 rounded-lg"
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </div>
                </div>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
        <div className="px-2 py-4 mt-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            NEURAL THREADS
          </h3>
          <div className="space-y-2">
            {[
              "Modern Web Design Tips",
              "Next.js 16 Features",
              "Tailwind CSS v4 Guide",
              "React Server Components",
              "AI Integration Tutorial"
            ].map((thread) => (
              <Link
                key={thread}
                href="/programming"
                className="flex items-center gap-2 px-2 py-1.5 text-sm text-foreground hover:text-primary transition-colors rounded-lg hover:bg-sidebar-accent/30 group"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover:bg-primary/80 transition-colors" />
                <span>{thread}</span>
              </Link>
            ))}
          </div>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
