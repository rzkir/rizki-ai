import { Metadata } from 'next'

import VideoGenrate from '@/components/pages/video/video-genrate/VideoGenrate';

import { videoMetadata } from '@/helper/meta/Metadata';

import { breadcrumbVideoGeneratorJsonLd } from '@/helper/breadchumb/Script';

export const metadata: Metadata = videoMetadata

export default function page() {
    return (
        <>
            <script
                id="breadcrumb-video-generator-schema"
                type="application/ld+json"
                key="breadcrumb-video-generator-schema"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbVideoGeneratorJsonLd) }}
            />
            <VideoGenrate />
        </>
    )
}

