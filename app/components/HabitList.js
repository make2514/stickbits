import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Grommet, Box, DataTable } from 'grommet';
import { get } from '../apis/generics';

export default () => {
  const [habits, setHabits] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const mounted = true;
    const token = localStorage.getItem('token');

    get('habits', token)
      .then(habitsData => {
        if (mounted) {
          setHabits(habitsData);
        }
      })
      .catch(error => {
        console.log(error);
        history.push('/login');
      });
  }, []);

  function transformHabitData(habitsData) {
    return habitsData.map(habit => habit);
  }

  return (
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
              render: datum => (
                <Box>
                  <Link
                    style={{ textDecoration: 'none' }}
                    to="/singlehabitview/1"
                  >
                    {datum.name}
                  </Link>
                </Box>
              ),
            },
            /* {
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
            }, */
          ]}
          data={transformHabitData(habits)}
          fill="horizontal"
          replace={false}
          sortable={false}
        />
      </Box>
    </Grommet>
  );
};
