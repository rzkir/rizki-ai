import { Metadata } from 'next'

import Marketing from '@/components/content/marketing/Marketing';

import { marketingMetadata } from '@/helper/meta/Metadata';

export const metadata: Metadata = marketingMetadata

export default function page() {
    return (
        <Marketing />
    )
}
