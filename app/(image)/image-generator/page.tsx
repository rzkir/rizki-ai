import { Metadata } from 'next'

import ImageGenerator from '@/components/pages/image/image-generator/ImageGenerator';

import { imageMetadata } from '@/helper/meta/Metadata';

export const metadata: Metadata = imageMetadata

export default function page() {
    return (
        <ImageGenerator />
    )
}

