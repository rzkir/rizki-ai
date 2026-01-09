"use client"

import * as React from "react"

import { IconCirclePlusFilled, IconChevronDown, IconChevronRight, IconMail, type Icon } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

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
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const isOpen = openItems[item.title] ?? false
            const hasItems = item.items && item.items.length > 0

            // Jika tidak ada sub-items, render sebagai link biasa
            if (!hasItems) {
              return (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url}>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
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
                        className="w-full"
                        onClick={() => toggleItem(item.title)}
                      >
                        {item.icon && <item.icon />}
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
                          <SidebarMenuSubButton asChild>
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
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
