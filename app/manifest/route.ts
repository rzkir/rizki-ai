import { NextResponse } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL as string

export async function GET() {
    const manifest = {
        name: 'Rizki AI - AI Assistant Hub',
        short_name: 'Rizki AI',
        description:
            'Advanced AI assistant platform providing specialized solutions for academia, legal, marketing, and creative tasks',
        start_url: BASE_URL,
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0a0a0a',
        orientation: 'portrait-primary',
        icons: [
            {
                src: '/favicon.ico',
                sizes: '48x48',
                type: 'image/x-icon',
                purpose: 'any',
            },
        ],
        categories: ['productivity', 'utilities'],
        lang: 'en',
        dir: 'ltr',
    }

    return NextResponse.json(manifest, {
        headers: {
            'Content-Type': 'application/manifest+json',
            'Cache-Control': 'public, max-age=86400',
        },
    })
}
