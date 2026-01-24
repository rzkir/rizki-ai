import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL as string

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        { path: '', priority: 1, changeFrequency: 'daily' as const },
        // Auth
        { path: 'signin', priority: 0.6, changeFrequency: 'monthly' as const },
        { path: 'signup', priority: 0.6, changeFrequency: 'monthly' as const },
        // Edu
        { path: 'academia', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: 'science', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: 'translation', priority: 0.8, changeFrequency: 'weekly' as const },
        // Image
        { path: 'image-analysis', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: 'image-generator', priority: 0.8, changeFrequency: 'weekly' as const },
        // Personal
        { path: 'curhat', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: 'health', priority: 0.8, changeFrequency: 'weekly' as const },
        // Pro
        { path: 'finance', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: 'legal', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: 'marketing', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: 'seo', priority: 0.8, changeFrequency: 'weekly' as const },
        // Tech Hub
        { path: 'programming', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: 'technology', priority: 0.8, changeFrequency: 'weekly' as const },
        // Video
        { path: 'video-analysis', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: 'video-generator', priority: 0.8, changeFrequency: 'weekly' as const },
        // Rules / Info
        { path: 'blog', priority: 0.7, changeFrequency: 'weekly' as const },
        { path: 'changelog', priority: 0.6, changeFrequency: 'weekly' as const },
        { path: 'download', priority: 0.6, changeFrequency: 'monthly' as const },
        { path: 'help', priority: 0.7, changeFrequency: 'monthly' as const },
        // Profile
        { path: 'profile', priority: 0.6, changeFrequency: 'monthly' as const },
    ]

    return routes.map(({ path, priority, changeFrequency }) => ({
        url: path ? `${BASE_URL}/${path}` : BASE_URL,
        lastModified: new Date(),
        changeFrequency,
        priority,
    }))
}
