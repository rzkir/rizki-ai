import { Metadata } from 'next';

import Chat from '@/components/chat';

import { defaultMetadata } from '@/helper/meta/Metadata';

export const metadata: Metadata = defaultMetadata

export default function Home() {
  return <Chat />;
}
