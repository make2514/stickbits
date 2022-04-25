import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Box,
  DataTable,
  Header,
  Text,
  Layer,
  TextInput,
  Button,
} from 'grommet';
import { Checkmark, Close, Add, MoreVertical } from 'grommet-icons';
import { subDays, format, isSameDay } from 'date-fns';
import { get, post } from '../apis/generics';

import ActionList from './ActionList';

const token = localStorage.getItem('token');

const AddHabit = ({ onHabitsChange }) => {
  const [show, setShow] = useState();
  const [habitName, setHabitName] = useState('');
  const [habitDescription, setHabitDescription] = useState('');

  const onSaveHandler = () => {
    if (!habitName.trim()) {
      // TODO: show message stating that habit name has to be more than 1 character
      return;
    }
    post(
      `habits`,
      {
        name: habitName,
        description: habitDescription,
      },
      token,
    ).then(() => {
      setShow(false);
      onHabitsChange();
    });
  };

  return (
    <Box>
      <Add
        onClick={() => {
          setShow(true);
        }}
      />
      {show && (
        <Layer
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
        >
          <TextInput
            placeholder="Habit name"
            value={habitName}
            onChange={event => setHabitName(event.target.value)}
          />
          <TextInput
            placeholder="Habit description"
            value={habitDescription}
            onChange={event => setHabitDescription(event.target.value)}
          />
          <Button label="create" onClick={onSaveHandler} />
          <Button label="close" onClick={() => setShow(false)} />
        </Layer>
      )}
    </Box>
  );
};

const HomePageHeader = ({ onHabitsChange }) => (
  <Header
    align="baseline"
    direction="row"
    flex={false}
    justify="between"
    gap="medium"
    pad="xsmall"
    background={{ color: 'graph-3' }}
  >
    <Text>Time-wallet</Text>
    <Box
      align="center"
      justify="between"
      direction="row"
      width="xsmall"
      flex="shrink"
    >
      <AddHabit onHabitsChange={onHabitsChange} />
      <MoreVertical />
    </Box>
  </Header>
);

export default () => {
  const [habits, setHabits] = useState([]);
  const [selectedHabitData, setSelectedHabitData] = useState();
  const [showActionList, setShowActionList] = useState(true);
  const [updateHabits, setUpdateHabits] = useState(1);
  const history = useHistory();

  const onHabitsChange = () => {
    setUpdateHabits(updateHabits + 1);
  };

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem('token');

    const today = new Date();

    if (!selectedHabitData) {
      get(`habits?endDate=${today}&startDate=${subDays(today, 4)}`, token)
        .then(habitsData => {
          if (mounted) {
            setHabits(habitsData);
          }
        })
        .catch(() => {
          history.push('/login');
        });
    }
    return () => {
      mounted = false;
    };
  }, [selectedHabitData, updateHabits]);

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
                  onClickHabitDayStatus(datum, format(date, 'yyyy-MM-dd'));
                }}
              />
            ) : (
              <Close
                onClick={() => {
                  onClickHabitDayStatus(datum, format(date, 'yyyy-MM-dd'));
                }}
              />
            )}
          </Box>
        ),
      };
    });
  }

  const onClickHabitDayStatus = (datum, selectedDate) => {
    setSelectedHabitData({
      habit: datum,
      selectedDate,
    });
    setShowActionList(true);
  };

  const onCloseActionList = () => {
    setSelectedHabitData(false);
    setShowActionList(false);
  };

  return (
    <div>
      <HomePageHeader onHabitsChange={onHabitsChange} />
      <DataTable
        columns={[
          {
            property: 'name',
            header: '',
            primary: false,
            render: habit => {
              const pathWithHabitData = {
                pathname: `/singlehabitview/${habit.id}`,
                habit,
              };
              return (
                <Box>
                  <Link
                    style={{ textDecoration: 'none' }}
                    to={pathWithHabitData}
                  >
                    {habit.name}
                  </Link>
                </Box>
              );
            },
          },
          ...getHabitDataRows(habits),
        ]}
        data={transformHabitData(habits)}
        fill="horizontal"
        replace={false}
        sortable={false}
      />
      <ActionList
        onCloseActionList={onCloseActionList}
        selectedHabitData={selectedHabitData}
        showActionList={showActionList}
      />
    </div>
  );
};
