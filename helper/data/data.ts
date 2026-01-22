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
    description: "Pusat teknologi dan pemrograman dengan AI",
    items: [
      {
        title: "Programming",
        url: "/programming",
        icon: IconCode,
        description: "Bantuan coding dan pemrograman dengan AI"
      },
      {
        title: "Technology",
        url: "/technology",
        icon: IconCpu,
        description: "Diskusi dan informasi teknologi terkini"
      },
    ],
  },
  {
    title: "Personal",
    url: "/personal",
    icon: IconHeart,
    description: "Layanan personal untuk kehidupan sehari-hari",
    items: [
      {
        title: "Teman Curhat",
        url: "/curhat",
        icon: IconMessage,
        description: "Teman berbicara dan berbagi cerita dengan AI"
      },
      {
        title: "Health",
        url: "/health",
        icon: IconHeartbeat,
        description: "Konsultasi kesehatan dan tips hidup sehat"
      },
    ],
  },
  {
    title: "Image",
    url: "/image",
    icon: IconPolaroid,
    description: "Alat untuk analisis dan generasi gambar",
    items: [
      {
        title: "Image Analysis",
        url: "/image-analysis",
        icon: IconSearch,
        description: "Analisis gambar dengan teknologi AI"
      },
      {
        title: "Image Generator",
        url: "/image-generator",
        icon: IconPhotoPlus,
        description: "Buat gambar dari teks dengan AI"
      },
    ],
  },
  {
    title: "Education",
    url: "/edu",
    icon: IconBook,
    description: "Layanan pendidikan dan pembelajaran",
    items: [
      {
        title: "Academia",
        url: "/academia",
        icon: IconSchool,
        description: "Bantuan akademik dan penelitian"
      },
      {
        title: "Science",
        url: "/science",
        icon: IconAtom,
        description: "Eksplorasi sains dan ilmu pengetahuan"
      },
      {
        title: "Translation",
        url: "/translation",
        icon: IconLanguage,
        description: "Terjemahan teks ke berbagai bahasa"
      },
    ],
  },
  {
    title: "Professional",
    url: "/pro",
    icon: IconBriefcase,
    description: "Layanan profesional untuk bisnis dan karir",
    items: [
      {
        title: "Legal",
        url: "/legal",
        icon: IconScale,
        description: "Konsultasi dan bantuan hukum"
      },
      {
        title: "Marketing",
        url: "/marketing",
        icon: IconChartBar,
        description: "Strategi dan ide pemasaran digital"
      },
      {
        title: "Finance",
        url: "/finance",
        icon: IconCash,
        description: "Saran keuangan dan investasi"
      },
      {
        title: "SEO",
        url: "/seo",
        icon: IconSeo,
        description: "Optimasi SEO untuk website"
      },
    ],
  },
  {
    title: "Video",
    url: "/video",
    icon: IconVideo,
    description: "Alat untuk analisis dan generasi video",
    items: [
      {
        title: "Video Analysis",
        url: "/video-analysis",
        icon: IconPlayerPlay,
        description: "Analisis konten video dengan AI"
      },
      {
        title: "Video Generator",
        url: "/video-generator",
        icon: IconVideoPlus,
        description: "Buat video dari teks atau gambar"
      },
    ],
  },
]