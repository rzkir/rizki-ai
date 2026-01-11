import { Metadata } from 'next'

import Seo from '@/components/pages/pro/seo/Seo';

import { seoMetadata } from '@/helper/meta/Metadata';

export const metadata: Metadata = seoMetadata

export default function page() {
    return (
        <Seo />
    )
}
