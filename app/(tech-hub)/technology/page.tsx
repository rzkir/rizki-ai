import { Metadata } from 'next';

import Technology from '@/components/pages/tech-hub/technology/Technology';

import { technologyMetadata } from '@/helper/meta/Metadata';

export const metadata: Metadata = technologyMetadata

export default function Home() {
  return <Technology />;
}