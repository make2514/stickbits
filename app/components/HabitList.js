import React from 'react';
import { Grommet, Box, DataTable } from 'grommet';

export default () => (
  <Grommet full>
    <Box
      fill="vertical"
      overflow="auto"
      align="center"
      flex="grow"
      pad="xsmall"
      justify="start"
      direction="column"
      responsive
      wrap
    >
      <DataTable
        columns={[
          {
            header: '',
            property: 'name',
            primary: false,
          },
          {
            header: 'Tue',
            property: 'day0',
            primary: false,
          },
          {
            property: 'day1',
            header: 'Wed',
            primary: false,
          },
          {
            property: 'day2',
            header: 'Thurs',
            primary: false,
          },
          {
            property: 'day3',
            header: 'Fri',
            primary: false,
          },
        ]}
        data={[
          {
            name: 'Habit 1',
            day0: 'x',
            day1: 'x',
            day2: 'x',
            day3: 'x',
          },
          {
            name: 'Habit 2',
            day0: 'x',
            day1: 'o',
            day2: 'o',
            day3: 'x',
          },
          {
            name: 'Habit 3',
            day0: 'x',
            day1: 'x',
            day2: 'o',
            day3: 'x',
          },
          {
            name: 'Habit 4',
            day0: 'x',
            day1: 'x',
            day2: 'o',
            day3: 'x',
          },
          {
            name: 'Habit 5',
            day0: 'x',
            day1: 'x',
            day2: 'x',
            day3: 'x',
          },
        ]}
        fill="horizontal"
        replace={false}
        sortable={false}
      />
    </Box>
  </Grommet>
);
