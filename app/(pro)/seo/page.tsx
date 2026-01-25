import { Metadata } from 'next'

import Seo from '@/components/pages/pro/seo/Seo';

import { seoMetadata } from '@/helper/meta/Metadata';

import { breadcrumbSeoJsonLd } from '@/helper/breadchumb/Script';

export const metadata: Metadata = seoMetadata

export default function page() {
    return (
        <>
            <script
                id="breadcrumb-seo-schema"
                type="application/ld+json"
                key="breadcrumb-seo-schema"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSeoJsonLd) }}
            />
            <Seo />
        </>
    )
}
