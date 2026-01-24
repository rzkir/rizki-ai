import Download from '@/components/pages/rules/download/Download'

import { downloadMetadata } from '@/helper/meta/Metadata'

import { Metadata } from 'next'

export const metadata: Metadata = downloadMetadata

export default function page() {
    return (
        <Download />
    )
}
