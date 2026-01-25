import { Metadata } from 'next'

import Health from '@/components/pages/personal/health/Health';

import { healthMetadata } from '@/helper/meta/Metadata';

import { breadcrumbHealthJsonLd } from '@/helper/breadchumb/Script';

export const metadata: Metadata = healthMetadata

export default function page() {
    return (
        <>
            <script
                id="breadcrumb-health-schema"
                type="application/ld+json"
                key="breadcrumb-health-schema"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbHealthJsonLd) }}
            />
            <Health />
        </>
    )
}
