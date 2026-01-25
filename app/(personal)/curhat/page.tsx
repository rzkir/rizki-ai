import { Metadata } from 'next'

import Curhat from '@/components/pages/personal/curhat/Curhat';

import { curhatMetadata } from '@/helper/meta/Metadata';

import { breadcrumbCurhatJsonLd } from '@/helper/breadchumb/Script';

export const metadata: Metadata = curhatMetadata

export default function page() {
    return (
        <>
            <script
                id="breadcrumb-curhat-schema"
                type="application/ld+json"
                key="breadcrumb-curhat-schema"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbCurhatJsonLd) }}
            />
            <Curhat />
        </>
    )
}
