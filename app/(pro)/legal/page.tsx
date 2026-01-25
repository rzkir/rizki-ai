import { Metadata } from 'next'

import Legal from '@/components/pages/pro/legal/Legal';

import { legalMetadata } from '@/helper/meta/Metadata';

import { breadcrumbLegalJsonLd } from '@/helper/breadchumb/Script';

export const metadata: Metadata = legalMetadata

export default function page() {
    return (
        <>
            <script
                id="breadcrumb-legal-schema"
                type="application/ld+json"
                key="breadcrumb-legal-schema"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLegalJsonLd) }}
            />
            <Legal />
        </>
    )
}
