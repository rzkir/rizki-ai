import { Metadata } from 'next';

import Technology from '@/components/pages/tech-hub/technology/Technology';

import { technologyMetadata } from '@/helper/meta/Metadata';

import { breadcrumbTechnologyJsonLd } from '@/helper/breadchumb/Script';

export const metadata: Metadata = technologyMetadata

export default function Home() {
  return (
    <>
      <script
        id="breadcrumb-technology-schema"
        type="application/ld+json"
        key="breadcrumb-technology-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbTechnologyJsonLd) }}
      />
      <Technology />
    </>
  );
}