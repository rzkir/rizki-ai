import { Metadata } from 'next'

import Finance from '@/components/pages/pro/finance/Finance';

import { financeMetadata } from '@/helper/meta/Metadata';

export const metadata: Metadata = financeMetadata

export default function page() {
    return (
        <Finance />
    )
}
