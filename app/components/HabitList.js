import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Grommet, Box, DataTable, Layer, Button } from 'grommet';
import { Checkmark, Close } from 'grommet-icons';
import { subDays, format, isSameDay } from 'date-fns';
import { get } from '../apis/generics';

export default () => {
  const [habits, setHabits] = useState([]);
  const [selectedHabitData, setSelectedHabitData] = React.useState();
  const history = useHistory();

  useEffect(() => {
    const mounted = true;
    const token = localStorage.getItem('token');

    const today = new Date();

    get(`habits?endDate=${today}&startDate=${subDays(today, 4)}`, token)
      .then(habitsData => {
        if (mounted) {
          setHabits(habitsData);
        }
      })
      .catch(() => {
        history.push('/login');
      });
  }, []);

  function transformHabitData(habitsData) {
    // get the keys for the desired array element
    const today = new Date();
    const dateArray = [];
    for (let i = 0; i < 4; i += 1) {
      dateArray[i] = format(subDays(today, i), 'yyyy-MM-dd');
    }

    return habitsData.map(habit => {
      const rowData = {};
      // TODO: refactor this code
      dateArray.forEach(date => {
        rowData[date] =
          habit.actions.length === 0
            ? false
            : habit.actions.filter(
                action =>
                  action.timeEntries.filter(timeEntry =>
                    isSameDay(new Date(timeEntry.date), new Date(date)),
                  ).length > 0,
              ).length > 0;
      });

      return {
        ...habit,
        ...rowData,
      };
    });
  }

  function getHabitDataRows() {
    const today = new Date();
    const dateArray = [];
    for (let i = 0; i < 4; i += 1) {
      dateArray[i] = subDays(today, i);
    }

    return dateArray.map(date => {
      const day = format(date, 'd');
      const dayOfWeek = format(date, 'E');
      return {
        property: day,
        header: (
          <Box>
            <Box>{dayOfWeek}</Box>
            <Box>{day}</Box>
          </Box>
        ),
        render: datum => (
          <Box pad={{ vertical: 'xsmall' }}>
            {datum[format(date, 'yyyy-MM-dd')] ? (
              <Checkmark
                onClick={() => {
                  onClickHabitDayStatus(datum);
                }}
              />
            ) : (
              <Close
                onClick={() => {
                  onClickHabitDayStatus(datum);
                }}
              />
            )}
          </Box>
        ),
      };
    });
  }

  const ActionList = ({ onClockActionList, selectedHabitData }) => {
    const actions = selectedHabitData ? selectedHabitData.actions : {};

    return (
      <Box>
        {selectedHabitData && (
          <Layer>
            <Button
              label="close"
              onClick={() => {
                onClockActionList();
              }}
            />
            {actions.length > 0 &&
              actions.map(action => <Box key={action.id}>{action.name}</Box>)}
          </Layer>
        )}
      </Box>
    );
  };

  const onClickHabitDayStatus = datum => {
    setSelectedHabitData(datum);
  };

  const onClockActionList = () => {
    setSelectedHabitData(false);
  };

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
              property: 'name',
              header: '',
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
            ...getHabitDataRows(habits),
          ]}
          data={transformHabitData(habits)}
          fill="horizontal"
          replace={false}
          sortable={false}
        />
        <ActionList
          onClockActionList={onClockActionList}
          selectedHabitData={selectedHabitData}
        />
      </Box>
    </Grommet>
  );
};
