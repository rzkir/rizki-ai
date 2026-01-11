import { Metadata } from 'next'

import VideoLayout from '@/components/pages/video/video-analysis/VideoAnalysis';

import { videoAnalysisMetadata } from '@/helper/meta/Metadata';

export const metadata: Metadata = videoAnalysisMetadata

export default function page() {
    return (
        <VideoLayout />
    )
}

