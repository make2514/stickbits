/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';

import { Grommet, Box } from 'grommet';
import Header from '../../components/Header';
import HabitList from '../../components/HabitList';

export default function HomePage() {
  return (
    <Grommet full>
      <Box
        fill="vertical"
        overflow="auto"
        align="stretch"
        flex="grow"
        direction="column"
        justify="start"
      >
        <Header />
        <HabitList />
      </Box>
    </Grommet>
  );
}
