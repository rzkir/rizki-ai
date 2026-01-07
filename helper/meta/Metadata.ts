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
  title: "Rizki AI - AI Marketing Assistant",
  description:
    "Get expert guidance on digital marketing, SEO, content strategy, and campaign optimization",
  alternates: {
    canonical: `${SITE_URL}/marketing`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/marketing`,
    title: "Rizki AI - AI Marketing Assistant",
    description:
      "Get expert guidance on digital marketing, SEO, content strategy, and campaign optimization",
    siteName: "Rizki AI",
    images: [
      {
        url: "/marketing-og.png",
        width: 1200,
        height: 630,
        alt: "Rizki AI - AI Marketing Assistant",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rizki AI - AI Marketing Assistant",
    description:
      "Get expert guidance on digital marketing, SEO, content strategy, and campaign optimization",
    images: ["/marketing-og.png"],
  },
};

// Academia metadata
export const academiaMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rizki AI - AI Academic Assistant",
  description:
    "Get expert guidance on research methodology, academic writing, and scholarly topics",
  alternates: {
    canonical: `${SITE_URL}/academia`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/academia`,
    title: "Rizki AI - AI Academic Assistant",
    description:
      "Get expert guidance on research methodology, academic writing, and scholarly topics",
    siteName: "Rizki AI",
    images: [
      {
        url: "/academia-og.png",
        width: 1200,
        height: 630,
        alt: "Rizki AI - AI Academic Assistant",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rizki AI - AI Academic Assistant",
    description:
      "Get expert guidance on research methodology, academic writing, and scholarly topics",
    images: ["/academia-og.png"],
  },
};

// Legal metadata
export const legalMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rizki AI - AI Legal Assistant",
  description:
    "Get expert guidance on legal matters, compliance, and regulations",
  alternates: {
    canonical: `${SITE_URL}/legal`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/legal`,
    title: "Rizki AI - AI Legal Assistant",
    description:
      "Get expert guidance on legal matters, compliance, and regulations",
    siteName: "Rizki AI",
    images: [
      {
        url: "/legal-og.png",
        width: 1200,
        height: 630,
        alt: "Rizki AI - AI Legal Assistant",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rizki AI - AI Legal Assistant",
    description:
      "Get expert guidance on legal matters, compliance, and regulations",
    images: ["/legal-og.png"],
  },
};

// Image Generation metadata
export const imageMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rizki AI - AI Image Generator",
  description:
    "Transform your ideas into stunning visuals with our AI-powered image generation tool",
  alternates: {
    canonical: `${SITE_URL}/image`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/image`,
    title: "Rizki AI - AI Image Generator",
    description:
      "Transform your ideas into stunning visuals with our AI-powered image generation tool",
    siteName: "Rizki AI",
    images: [
      {
        url: "/image-og.png",
        width: 1200,
        height: 630,
        alt: "Rizki AI - AI Image Generator",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rizki AI - AI Image Generator",
    description:
      "Transform your ideas into stunning visuals with our AI-powered image generation tool",
    images: ["/image-og.png"],
  },
};

// Video Generation metadata
export const videoMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rizki AI - AI Video Generator",
  description:
    "Create compelling videos with our AI-powered video generation platform",
  alternates: {
    canonical: `${SITE_URL}/video`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/video`,
    title: "Rizki AI - AI Video Generator",
    description:
      "Create compelling videos with our AI-powered video generation platform",
    siteName: "Rizki AI",
    images: [
      {
        url: "/video-og.png",
        width: 1200,
        height: 630,
        alt: "Rizki AI - AI Video Generator",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rizki AI - AI Video Generator",
    description:
      "Create compelling videos with our AI-powered video generation platform",
    images: ["/video-og.png"],
  },
};
