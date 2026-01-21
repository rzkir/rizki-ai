import {
    IconPolaroid,
    IconVideo,
    IconBook,
    IconHeart,
    IconBriefcase,
    IconAi,
    IconCode,
    IconCpu,
    IconMessage,
    IconHeartbeat,
    IconSearch,
    IconPhotoPlus,
    IconSchool,
    IconAtom,
    IconLanguage,
    IconScale,
    IconChartBar,
    IconCash,
    IconSeo,
    IconPlayerPlay,
    IconVideoPlus,
  } from "@tabler/icons-react"

export const navData = [
    {
      title: "Tech Hub",
      url: "/tech-hub",
      icon: IconAi,
      items: [
        { title: "Programming", url: "/programming", icon: IconCode },
        { title: "Technology", url: "/technology", icon: IconCpu },
      ],
    },
    {
      title: "Personal",
      url: "/personal",
      icon: IconHeart,
      items: [
        { title: "Teman Curhat", url: "/curhat", icon: IconMessage },
        { title: "Health", url: "/health", icon: IconHeartbeat },
      ],
    },
    {
      title: "Image",
      url: "/image",
      icon: IconPolaroid,
      items: [
        { title: "Image Analysis", url: "/image-analysis", icon: IconSearch },
        { title: "Image Generator", url: "/image-generator", icon: IconPhotoPlus },
      ],
    },
    {
      title: "Education",
      url: "/edu",
      icon: IconBook,
      items: [
        { title: "Academia", url: "/academia", icon: IconSchool },
        { title: "Science", url: "/science", icon: IconAtom },
        { title: "Translation", url: "/translation", icon: IconLanguage },
      ],
    },
    {
      title: "Professional",
      url: "/pro",
      icon: IconBriefcase,
      items: [
        { title: "Legal", url: "/legal", icon: IconScale },
        { title: "Marketing", url: "/marketing", icon: IconChartBar },
        { title: "Finance", url: "/finance", icon: IconCash },
        { title: "SEO", url: "/seo", icon: IconSeo },
      ],
    },
    {
      title: "Video",
      url: "/video",
      icon: IconVideo,
      items: [
        { title: "Video Analysis", url: "/video-analysis", icon: IconPlayerPlay },
        { title: "Video Generator", url: "/video-generator", icon: IconVideoPlus },
      ],
    },
  ]