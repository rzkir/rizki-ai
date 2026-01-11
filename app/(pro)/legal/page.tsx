import { Metadata } from 'next'

import Legal from '@/components/pages/pro/legal/Legal';

import { legalMetadata } from '@/helper/meta/Metadata';

export const metadata: Metadata = legalMetadata

export default function page() {
    return (
        <Legal />
    )
}
