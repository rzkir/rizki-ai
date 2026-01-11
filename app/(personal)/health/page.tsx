import { Metadata } from 'next'

import Health from '@/components/pages/personal/health/Health';

import { healthMetadata } from '@/helper/meta/Metadata';

export const metadata: Metadata = healthMetadata

export default function page() {
    return (
        <Health />
    )
}
