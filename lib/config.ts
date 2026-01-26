export const API_ENDPOINTS = {
  // Tech Hub
  programming: "/api/tech-hub/programming",
  technology: "/api/tech-hub/technology",
  // Image
  imageAnalyze: "/api/image/image-analyze",
  imageGenerator: "/api/image/image-generator",
  // Video
  videoAnalyze: "/api/video/video-analysis",
  // Edu
  academia: "/api/edu/academia",
  science: "/api/edu/science",
  translation: "/api/edu/translation",
  // Pro
  finance: "/api/pro/finance",
  legal: "/api/pro/legal",
  marketing: "/api/pro/marketing",
  seo: "/api/pro/seo",
  // Personal
  curhat: "/api/personal/curhat",
  health: "/api/personal/health",
} as const;

export type ApiEndpointType = keyof typeof API_ENDPOINTS;