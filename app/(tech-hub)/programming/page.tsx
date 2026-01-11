import { Metadata } from 'next';

import Programming from '@/components/pages/tech-hub/programming/programming';

import { programmingMetadata } from '@/helper/meta/Metadata';

export const metadata: Metadata = programmingMetadata

export default function Home() {
  return <Programming />;
}