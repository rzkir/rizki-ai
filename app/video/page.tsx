import { Metadata } from 'next';
import React from 'react'

import { videoMetadata } from '@/helper/meta/Metadata';

export const metadata: Metadata = videoMetadata

export default function page() {
    return (
        <div>page</div>
    )
}
