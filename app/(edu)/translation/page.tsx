import { Metadata } from 'next'

import Translation from '@/components/pages/edu/translation/Translation';

import { seoMetadata } from '@/helper/meta/Metadata';

export const metadata: Metadata = seoMetadata

export default function page() {
    return (
        <Translation />
    )
}
