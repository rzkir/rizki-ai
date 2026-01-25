import { Metadata } from 'next'

import Finance from '@/components/pages/pro/finance/Finance';

import { financeMetadata } from '@/helper/meta/Metadata';

import { breadcrumbFinanceJsonLd } from '@/helper/breadchumb/Script';

export const metadata: Metadata = financeMetadata

export default function page() {
    return (
        <>
            <script
                id="breadcrumb-finance-schema"
                type="application/ld+json"
                key="breadcrumb-finance-schema"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbFinanceJsonLd) }}
            />
            <Finance />
        </>
    )
}
