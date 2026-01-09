import { Metadata } from 'next'

import Academia from '@/components/content/academia/Academia';

import { academiaMetadata } from '@/helper/meta/Metadata';

export const metadata: Metadata = academiaMetadata

export default function page() {
    return (
        <Academia />
    )
}
