import { Fragment } from 'react/jsx-runtime';

import Home from '@/components/home/Home';

import Features from '@/components/features/Features';

import Join from '@/components/join/Join';
import Leaderboard from '@/components/leaderboard/Leaderboard';

export default function page() {
  return (
    <Fragment>
      <Home />
      <Features />
      <Leaderboard />
      <Join />
    </Fragment>
  )
}
