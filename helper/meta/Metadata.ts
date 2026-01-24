import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL as string;

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME as string;

// Default/Root metadata
export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - AI Assistant Hub`,
    template: "%s | AI Assistant Hub",
  },
  description:
    "Advanced AI assistant platform providing specialized solutions for academia, legal, marketing, and creative tasks",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${SITE_NAME} - AI Assistant Hub`,
    description:
      "Advanced AI assistant platform providing specialized solutions for academia, legal, marketing, and creative tasks",
    siteName: SITE_NAME,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - AI Assistant Hub`,
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - AI Assistant Hub`,
    description:
      "Advanced AI assistant platform providing specialized solutions for academia, legal, marketing, and creative tasks",
    images: ["/og-image.png"],
  },
  manifest: "/manifest",
};

// Marketing metadata
export const marketingMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rizki AI - Marketing Assistant",
  description:
    "Get expert guidance on digital marketing, SEO, content strategy, and campaign optimization",
  alternates: {
    canonical: `${SITE_URL}/marketing`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/marketing`,
    title: `${SITE_NAME} - Marketing Assistant`,
    description:
      "Get expert guidance on digital marketing, SEO, content strategy, and campaign optimization",
    siteName: SITE_NAME,
    images: [
      {
        url: "/marketing-og.png",
        width: 1200,
        height: 630,
        alt: "Rizki AI - Marketing Assistant",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Marketing Assistant`,
    description:
      "Get expert guidance on digital marketing, SEO, content strategy, and campaign optimization",
    images: ["/marketing-og.png"],
  },
};

// Academia metadata
export const academiaMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rizki AI - Academic Assistant",
  description:
    "Get expert guidance on research methodology, academic writing, and scholarly topics",
  alternates: {
    canonical: `${SITE_URL}/academia`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/academia`,
    title: `${SITE_NAME} - Academic Assistant`,
    description:
      "Get expert guidance on research methodology, academic writing, and scholarly topics",
    siteName: SITE_NAME,
    images: [
      {
        url: "/academia-og.png",
        width: 1200,
        height: 630,
        alt: "Rizki AI - Academic Assistant",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Academic Assistant`,
    description:
      "Get expert guidance on research methodology, academic writing, and scholarly topics",
    images: ["/academia-og.png"],
  },
};

// Legal metadata
export const legalMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rizki AI - Legal Assistant",
  description:
    "Get expert guidance on legal matters, compliance, and regulations",
  alternates: {
    canonical: `${SITE_URL}/legal`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/legal`,
    title: `${SITE_NAME} - Legal Assistant`,
    description:
      "Get expert guidance on legal matters, compliance, and regulations",
    siteName: SITE_NAME,
    images: [
      {
        url: "/legal-og.png",
        width: 1200,
        height: 630,
        alt: "Rizki AI - Legal Assistant",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Legal Assistant`,
    description:
      "Get expert guidance on legal matters, compliance, and regulations",
    images: ["/legal-og.png"],
  },
};

// Finance metadata
export const financeMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rizki AI - Finance Assistant",
  description:
    "Get expert guidance on personal finance, investments, budgeting, financial planning, and money management",
  alternates: {
    canonical: `${SITE_URL}/finance`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/finance`,
    title: `${SITE_NAME} - Finance Assistant`,
    description:
      "Get expert guidance on personal finance, investments, budgeting, financial planning, and money management",
    siteName: SITE_NAME,
    images: [
      {
        url: "/finance-og.png",
        width: 1200,
        height: 630,
        alt: "Rizki AI - Finance Assistant",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Finance Assistant`,
    description:
      "Get expert guidance on personal finance, investments, budgeting, financial planning, and money management",
    images: ["/finance-og.png"],
  },
};

// SEO metadata
export const seoMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rizki AI - SEO Assistant",
  description:
    "Get expert guidance on search engine optimization, keyword research, on-page SEO, technical SEO, and SEO best practices",
  alternates: {
    canonical: `${SITE_URL}/seo`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/seo`,
    title: `${SITE_NAME} - SEO Assistant`,
    description:
      "Get expert guidance on search engine optimization, keyword research, on-page SEO, technical SEO, and SEO best practices",
    siteName: SITE_NAME,
    images: [
      {
        url: "/seo-og.png",
        width: 1200,
        height: 630,
        alt: "Rizki AI - SEO Assistant",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - SEO Assistant`,
    description:
      "Get expert guidance on search engine optimization, keyword research, on-page SEO, technical SEO, and SEO best practices",
    images: ["/seo-og.png"],
  },
};

// Image Generation metadata
export const imageMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rizki AI - Image Generator",
  description:
    "Transform your ideas into stunning visuals with our AI-powered image generation tool",
  alternates: {
    canonical: `${SITE_URL}/image`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/image`,
    title: `${SITE_NAME} - Image Generator`,
    description:
      "Transform your ideas into stunning visuals with our AI-powered image generation tool",
    siteName: SITE_NAME,
    images: [
      {
        url: "/image-og.png",
        width: 1200,
        height: 630,
        alt: "Rizki AI - Image Generator",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Image Generator`,
    description:
      "Transform your ideas into stunning visuals with our AI-powered image generation tool",
    images: ["/image-og.png"],
  },
};

// Video Generation metadata
export const videoMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rizki AI - Video Generator",
  description:
    "Create compelling videos with our AI-powered video generation platform",
  alternates: {
    canonical: `${SITE_URL}/video`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/video`,
    title: `${SITE_NAME} - Video Generator`,
    description:
      "Create compelling videos with our AI-powered video generation platform",
    siteName: SITE_NAME,
    images: [
      {
        url: "/video-og.png",
        width: 1200,
        height: 630,
        alt: "Rizki AI - Video Generator",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Video Generator`,
    description:
      "Create compelling videos with our AI-powered video generation platform",
    images: ["/video-og.png"],
  },
};

// Video Generation metadata
export const videoAnalysisMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rizki AI - Video Analysis",
  description: "Analyze videos with our AI-powered video analysis platform",
  alternates: {
    canonical: `${SITE_URL}/video-analysis`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/video-analysis`,
    title: `${SITE_NAME} - Video Analysis`,
    description: "Analyze videos with our AI-powered video analysis platform",
    siteName: SITE_NAME,
    images: [
      {
        url: "/video-og.png",
        width: 1200,
        height: 630,
        alt: "Rizki AI - Video Analysis",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Video Analysis`,
    description: "Analyze videos with our AI-powered video analysis platform",
    images: ["/video-analysis-og.png"],
  },
};

// Technology metadata
export const technologyMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rizki AI - Technology Assistant",
  description:
    "Get expert guidance on technology trends, innovations, AI, cloud computing, blockchain, and emerging tech",
  alternates: {
    canonical: `${SITE_URL}/technology`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/technology`,
    title: `${SITE_NAME} - Technology Assistant`,
    description:
      "Get expert guidance on technology trends, innovations, AI, cloud computing, blockchain, and emerging tech",
    siteName: SITE_NAME,
    images: [
      {
        url: "/technology-og.png",
        width: 1200,
        height: 630,
        alt: "Rizki AI - Technology Assistant",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Technology Assistant`,
    description:
      "Get expert guidance on technology trends, innovations, AI, cloud computing, blockchain, and emerging tech",
    images: ["/technology-og.png"],
  },
};

// Programming metadata
export const programmingMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rizki AI - Programming Assistant",
  description:
    "Get expert help with coding, debugging, code review, and programming best practices across multiple languages",
  alternates: {
    canonical: `${SITE_URL}/programming`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/programming`,
    title: `${SITE_NAME} - Programming Assistant`,
    description:
      "Get expert help with coding, debugging, code review, and programming best practices across multiple languages",
    siteName: SITE_NAME,
    images: [
      {
        url: "/programming-og.png",
        width: 1200,
        height: 630,
        alt: "Rizki AI - Programming Assistant",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Programming Assistant`,
    description:
      "Get expert help with coding, debugging, code review, and programming best practices across multiple languages",
    images: ["/programming-og.png"],
  },
};

// Curhat metadata
export const curhatMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rizki AI - Personal Assistant",
  description:
    "Share your thoughts, feelings, and concerns with our empathetic AI assistant. Get support and guidance in a safe, confidential space",
  alternates: {
    canonical: `${SITE_URL}/curhat`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/curhat`,
    title: `${SITE_NAME} - Personal Assistant`,
    description:
      "Share your thoughts, feelings, and concerns with our empathetic AI assistant. Get support and guidance in a safe, confidential space",
    siteName: SITE_NAME,
    images: [
      {
        url: "/curhat-og.png",
        width: 1200,
        height: 630,
        alt: "Rizki AI - Personal Assistant",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Personal Assistant`,
    description:
      "Share your thoughts, feelings, and concerns with our empathetic AI assistant. Get support and guidance in a safe, confidential space",
    images: ["/curhat-og.png"],
  },
};

// Health metadata
export const healthMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rizki AI - Health Assistant",
  description:
    "Get personalized health advice, wellness tips, and guidance on fitness, nutrition, and mental health from our AI health assistant",
  alternates: {
    canonical: `${SITE_URL}/health`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/health`,
    title: `${SITE_NAME} - Health Assistant`,
    description:
      "Get personalized health advice, wellness tips, and guidance on fitness, nutrition, and mental health from our AI health assistant",
    siteName: SITE_NAME,
    images: [
      {
        url: "/health-og.png",
        width: 1200,
        height: 630,
        alt: "Rizki AI - Health Assistant",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Health Assistant`,
    description:
      "Get personalized health advice, wellness tips, and guidance on fitness, nutrition, and mental health from our AI health assistant",
    images: ["/health-og.png"],
  },
};

// Help metadata
export const helpMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rizki AI - Help & Support",
  description:
    "Get help and support for Rizki AI. Find answers to frequently asked questions, learn how to use our AI assistants, and get the most out of our platform",
  alternates: {
    canonical: `${SITE_URL}/help`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/help`,
    title: `${SITE_NAME} - Help & Support`,
    description:
      `Get help and support for ${SITE_NAME}. Find answers to frequently asked questions, learn how to use our AI assistants, and get the most out of our platform`,
    siteName: SITE_NAME,
    images: [
      {
        url: "/help-og.png",
        width: 1200,
        height: 630,
        alt: "Rizki AI - Help & Support",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Help & Support`,
    description:
      `Get help and support for ${SITE_NAME}. Find answers to frequently asked questions, learn how to use our AI assistants, and get the most out of our platform`,
    images: ["/help-og.png"],
  },
};

// Download metadata
export const downloadMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rizki AI - Download",
  description:
    "Download Rizki AI for Windows and Android. Get the AI assistant app on your desktop or mobile device",
  alternates: {
    canonical: `${SITE_URL}/download`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/download`,
    title: `${SITE_NAME} - Download`,
    description:
      "Download Rizki AI for Windows and Android. Get the AI assistant app on your desktop or mobile device",
    siteName: SITE_NAME,
    images: [
      {
        url: "/download-og.png",
        width: 1200,
        height: 630,
        alt: "Rizki AI - Download",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Download`,
    description:
      "Download Rizki AI for Windows and Android. Get the AI assistant app on your desktop or mobile device",
    images: ["/download-og.png"],
  },
};
