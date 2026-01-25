import { Metadata } from 'next'

import VideoLayout from '@/components/pages/video/video-analysis/VideoAnalysis';

import { videoAnalysisMetadata } from '@/helper/meta/Metadata';

import { breadcrumbVideoAnalysisJsonLd } from '@/helper/breadchumb/Script';

export const metadata: Metadata = videoAnalysisMetadata

export default function page() {
    return (
        <>
            <script
                id="breadcrumb-video-analysis-schema"
                type="application/ld+json"
                key="breadcrumb-video-analysis-schema"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbVideoAnalysisJsonLd) }}
            />
            <VideoLayout />
        </>
    )
}

