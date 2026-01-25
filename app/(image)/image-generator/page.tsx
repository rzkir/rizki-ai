import { Metadata } from 'next'

import ImageGenerator from '@/components/pages/image/image-generator/ImageGenerator';

import { imageMetadata } from '@/helper/meta/Metadata';

import { breadcrumbImageGeneratorJsonLd } from '@/helper/breadchumb/Script';

export const metadata: Metadata = imageMetadata

export default function page() {
    return (
        <>
            <script
                id="breadcrumb-image-generator-schema"
                type="application/ld+json"
                key="breadcrumb-image-generator-schema"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbImageGeneratorJsonLd) }}
            />
            <ImageGenerator />
        </>
    )
}

