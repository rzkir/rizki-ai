import { Metadata } from 'next'

import Academia from '@/components/pages/edu/academia/Academia';

import { academiaMetadata } from '@/helper/meta/Metadata';

import { breadcrumbAcademiaJsonLd } from '@/helper/breadchumb/Script';

export const metadata: Metadata = academiaMetadata

export default function page() {
    return (
        <>
            <script
                id="breadcrumb-academia-schema"
                type="application/ld+json"
                key="breadcrumb-academia-schema"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbAcademiaJsonLd) }}
            />
            <Academia />
        </>
    )
}
