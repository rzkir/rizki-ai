/**
 * Konfigurasi endpoint API untuk berbagai fitur chat
 */
export const API_ENDPOINTS = {
  programming: "/api/text/programming",
  image: "/api/text/image",
  academia: "/api/text/academia",
  legal: "/api/text/legal",
  marketing: "/api/text/marketing",
} as const;

export type ApiEndpointType = keyof typeof API_ENDPOINTS;
