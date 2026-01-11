import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL as string;

// Default/Root metadata
export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rizki AI - AI Assistant Hub",
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
    title: "Rizki AI - AI Assistant Hub",
    description:
      "Advanced AI assistant platform providing specialized solutions for academia, legal, marketing, and creative tasks",
    siteName: "Rizki AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rizki AI - AI Assistant Hub",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rizki AI - AI Assistant Hub",
    description:
      "Advanced AI assistant platform providing specialized solutions for academia, legal, marketing, and creative tasks",
    images: ["/og-image.png"],
  },
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
    title: "Rizki AI - Marketing Assistant",
    description:
      "Get expert guidance on digital marketing, SEO, content strategy, and campaign optimization",
    siteName: "Rizki AI",
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
    title: "Rizki AI - Marketing Assistant",
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
    title: "Rizki AI - Academic Assistant",
    description:
      "Get expert guidance on research methodology, academic writing, and scholarly topics",
    siteName: "Rizki AI",
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
    title: "Rizki AI - Academic Assistant",
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
    title: "Rizki AI - Legal Assistant",
    description:
      "Get expert guidance on legal matters, compliance, and regulations",
    siteName: "Rizki AI",
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
    title: "Rizki AI - Legal Assistant",
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
    title: "Rizki AI - Finance Assistant",
    description:
      "Get expert guidance on personal finance, investments, budgeting, financial planning, and money management",
    siteName: "Rizki AI",
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
    title: "Rizki AI - Finance Assistant",
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
    title: "Rizki AI - SEO Assistant",
    description:
      "Get expert guidance on search engine optimization, keyword research, on-page SEO, technical SEO, and SEO best practices",
    siteName: "Rizki AI",
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
    title: "Rizki AI - SEO Assistant",
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
    title: "Rizki AI - Image Generator",
    description:
      "Transform your ideas into stunning visuals with our AI-powered image generation tool",
    siteName: "Rizki AI",
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
    title: "Rizki AI - Image Generator",
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
    title: "Rizki AI - Video Generator",
    description:
      "Create compelling videos with our AI-powered video generation platform",
    siteName: "Rizki AI",
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
    title: "Rizki AI - Video Generator",
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
    title: "Rizki AI - Video Analysis",
    description: "Analyze videos with our AI-powered video analysis platform",
    siteName: "Rizki AI",
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
    title: "Rizki AI - Video Analysis",
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
    title: "Rizki AI - Technology Assistant",
    description:
      "Get expert guidance on technology trends, innovations, AI, cloud computing, blockchain, and emerging tech",
    siteName: "Rizki AI",
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
    title: "Rizki AI - Technology Assistant",
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
    title: "Rizki AI - Programming Assistant",
    description:
      "Get expert help with coding, debugging, code review, and programming best practices across multiple languages",
    siteName: "Rizki AI",
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
    title: "Rizki AI - Programming Assistant",
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
    title: "Rizki AI - Personal Assistant",
    description:
      "Share your thoughts, feelings, and concerns with our empathetic AI assistant. Get support and guidance in a safe, confidential space",
    siteName: "Rizki AI",
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
    title: "Rizki AI - Personal Assistant",
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
    title: "Rizki AI - Health Assistant",
    description:
      "Get personalized health advice, wellness tips, and guidance on fitness, nutrition, and mental health from our AI health assistant",
    siteName: "Rizki AI",
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
    title: "Rizki AI - Health Assistant",
    description:
      "Get personalized health advice, wellness tips, and guidance on fitness, nutrition, and mental health from our AI health assistant",
    images: ["/health-og.png"],
  },
};
