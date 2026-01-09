import { Metadata } from 'next'

import ImageLayout from '@/components/content/image-analysis/ImageAnalysis';

import { imageMetadata } from '@/helper/meta/Metadata';

export const metadata: Metadata = imageMetadata

export default function page() {
    return (
        <ImageLayout />
    )
}

