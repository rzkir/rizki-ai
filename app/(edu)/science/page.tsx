import { Metadata } from 'next'

import Academia from '@/components/pages/edu/science/Science';

import { academiaMetadata } from '@/helper/meta/Metadata';

export const metadata: Metadata = academiaMetadata

export default function page() {
    return (
        <Academia />
    )
}
