"use client"

import * as React from "react"
import {
  IconInnerShadowTop,
  IconPolaroid,
  IconVideo,
  IconBook,
  IconHeart,
  IconBriefcase,
  IconAi
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
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
      title: "Image Generator",
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
        }
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
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Rizki Ai.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
