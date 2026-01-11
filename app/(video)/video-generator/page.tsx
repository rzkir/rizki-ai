import { Metadata } from 'next'

import VideoGenrate from '@/components/pages/video/video-genrate/VideoGenrate';

import { videoMetadata } from '@/helper/meta/Metadata';

export const metadata: Metadata = videoMetadata

export default function page() {
    return (
        <VideoGenrate />
    )
}

