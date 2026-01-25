import { Metadata } from 'next'

import Academia from '@/components/pages/edu/science/Science';

import { academiaMetadata } from '@/helper/meta/Metadata';

import { breadcrumbScienceJsonLd } from '@/helper/breadchumb/Script';

export const metadata: Metadata = academiaMetadata

export default function page() {
    return (
        <>
            <script
                id="breadcrumb-science-schema"
                type="application/ld+json"
                key="breadcrumb-science-schema"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbScienceJsonLd) }}
            />
            <Academia />
        </>
    )
}
