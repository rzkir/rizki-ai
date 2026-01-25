import { Metadata } from 'next'

import Translation from '@/components/pages/edu/translation/Translation';

import { seoMetadata } from '@/helper/meta/Metadata';

import { breadcrumbTranslationJsonLd } from '@/helper/breadchumb/Script';

export const metadata: Metadata = seoMetadata

export default function page() {
    return (
        <>
            <script
                id="breadcrumb-translation-schema"
                type="application/ld+json"
                key="breadcrumb-translation-schema"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbTranslationJsonLd) }}
            />
            <Translation />
        </>
    )
}
