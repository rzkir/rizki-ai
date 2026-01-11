import { Metadata } from 'next'

import Curhat from '@/components/pages/personal/curhat/Curhat';

import { curhatMetadata } from '@/helper/meta/Metadata';

export const metadata: Metadata = curhatMetadata

export default function page() {
    return (
        <Curhat />
    )
}
