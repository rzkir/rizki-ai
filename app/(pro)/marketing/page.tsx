import { Metadata } from 'next'

import Marketing from '@/components/pages/pro/marketing/Marketing';

import { marketingMetadata } from '@/helper/meta/Metadata';

import { breadcrumbMarketingJsonLd } from '@/helper/breadchumb/Script';

export const metadata: Metadata = marketingMetadata

export default function page() {
    return (
        <>
            <script
                id="breadcrumb-marketing-schema"
                type="application/ld+json"
                key="breadcrumb-marketing-schema"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbMarketingJsonLd) }}
            />
            <Marketing />
        </>
    )
}
