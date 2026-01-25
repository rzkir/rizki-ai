import { Metadata } from 'next';

import Programming from '@/components/pages/tech-hub/programming/programming';

import { programmingMetadata } from '@/helper/meta/Metadata';

import { breadcrumbProgrammingJsonLd } from '@/helper/breadchumb/Script';

export const metadata: Metadata = programmingMetadata

export default function Home() {
  return (
    <>
      <script
        id="breadcrumb-programming-schema"
        type="application/ld+json"
        key="breadcrumb-programming-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbProgrammingJsonLd) }}
      />
      <Programming />
    </>
  );
}