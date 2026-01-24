import Help from '@/components/pages/rules/help/Help'

import { helpMetadata } from '@/helper/meta/Metadata'

import { Metadata } from 'next'

export const metadata: Metadata = helpMetadata

export default function page() {
    return (
        <Help />
    )
}
