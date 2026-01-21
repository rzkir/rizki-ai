import { Fragment } from 'react/jsx-runtime';

import Home from '@/components/home/Home';

import Features from '@/components/features/Features';

import Leaderboard from '@/components/leaderboard/Leaderboard';

import Community from '@/components/community/Community';

import Join from '@/components/join/Join';

export default function page() {
  return (
    <Fragment>
      <Home />
      <Features />
      <Leaderboard />
      <Join />
      <Community />
    </Fragment>
  )
}
