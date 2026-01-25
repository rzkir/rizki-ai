import { Metadata } from 'next'

import ImageLayout from '@/components/pages/image/image-analysis/ImageAnalysis';

import { imageMetadata } from '@/helper/meta/Metadata';

import { breadcrumbImageAnalysisJsonLd } from '@/helper/breadchumb/Script';

export const metadata: Metadata = imageMetadata

export default function page() {
    return (
        <>
            <script
                id="breadcrumb-image-analysis-schema"
                type="application/ld+json"
                key="breadcrumb-image-analysis-schema"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbImageAnalysisJsonLd) }}
            />
            <ImageLayout />
        </>
    )
}

