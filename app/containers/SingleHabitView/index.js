import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { isSameDay, isSameMonth, subDays } from 'date-fns';
import _ from 'lodash';
import { Box, Text, List, Calendar, Layer, Button, TextInput } from 'grommet';
import { Add, Edit } from 'grommet-icons';

import ActionList from '../../components/ActionList';
import { get, put, deleteAPI, post } from '../../apis/generics';

const token = localStorage.getItem('token');

const EditActionIcon = ({
  originalValue,
  id,
  onChangingHabitRelatedData,
  habitId,
}) => {
  const [show, setShow] = useState();
  const [actionNewName, setActionNewName] = useState('');

  const onSaveHandler = () => {
    put(`actions/${id}`, token, { name: actionNewName }).then(() => {
      onChangingHabitRelatedData(habitId);
      setShow(false);
    });
  };

  const onDeleteHandler = () => {
    deleteAPI(`actions/${id}`, token).then(() => {
      onChangingHabitRelatedData(habitId);
      setShow(false);
    });
  };

  return (
    <Box>
      <Edit
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
            placeholder={originalValue}
            value={actionNewName}
            onChange={event => setActionNewName(event.target.value)}
          />
          <Button label="save" onClick={onSaveHandler} />
          <Button label="delete" onClick={onDeleteHandler} />
          <Button label="close" onClick={() => setShow(false)} />
        </Layer>
      )}
    </Box>
  );
};

const EditHabitIcon = ({ originalValue, id, onChangingHabitRelatedData }) => {
  const history = useHistory();
  const [show, setShow] = useState();
  const [habitNewName, setHabitNewName] = useState('');

  const onSaveHandler = () => {
    put(`habits/${id}`, token, { name: habitNewName }).then(() => {
      onChangingHabitRelatedData(id);
      setShow(false);
    });
  };

  const onDeleteHandler = () => {
    deleteAPI(`habits/${id}`, token).then(() => {
      history.push('/');
    });
  };

  return (
    <Box>
      <Edit
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
            placeholder={originalValue}
            value={habitNewName}
            onChange={event => setHabitNewName(event.target.value)}
          />
          <Button label="save" onClick={onSaveHandler} />
          <Button label="delete" onClick={onDeleteHandler} />
          <Button label="close" onClick={() => setShow(false)} />
        </Layer>
      )}
    </Box>
  );
};

const AddActionIcon = ({
  habitId,
  onChangingHabitRelatedData,
  actionLevel,
}) => {
  const [show, setShow] = useState();
  const [actionNewName, setActionNewName] = useState('');

  const onSaveHandler = () => {
    if (!actionNewName.trim()) {
      // TODO: show message stating that action name has to be more than 1 character
      return;
    }
    post(`actions`, token, {
      name: actionNewName,
      habitId,
      level: actionLevel,
    }).then(() => {
      onChangingHabitRelatedData(habitId);
      setShow(false);
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
            placeholder="Name of the action"
            value={actionNewName}
            onChange={event => setActionNewName(event.target.value)}
          />
          <Button label="save" onClick={onSaveHandler} />
          <Button label="close" onClick={() => setShow(false)} />
        </Layer>
      )}
    </Box>
  );
};

const HabitLevelDetailsList = ({
  habitId,
  actions,
  onChangingHabitRelatedData,
}) => {
  const ListOfActions = ({ actionLevel }) => (
    <div>
      <Box direction="row" justify="between">
        <Text weight="bold">{actionLevel} level actions</Text>
        <AddActionIcon
          habitId={habitId}
          onChangingHabitRelatedData={onChangingHabitRelatedData}
          actionLevel={actionLevel}
        />
      </Box>
      <List
        primaryKey={action => <Text key={action.id}>{action.name}</Text>}
        secondaryKey="edit"
        data={actions
          .filter(action => action.level === actionLevel)
          .map(({ name, id, habit }) => ({
            name,
            id,
            edit: (
              <EditActionIcon
                originalValue={name}
                onChangingHabitRelatedData={onChangingHabitRelatedData}
                id={id}
                habitId={habit}
              />
            ),
          }))}
      />
    </div>
  );
  return (
    <Box>
      <ListOfActions actionLevel="Gold" />
      <ListOfActions actionLevel="Silver" />
      <ListOfActions actionLevel="Bronze" />
    </Box>
  );
};
const Analytics = ({ habit, setHabitData }) => {
  const history = useHistory();
  const getTimeEntriesDates = habit => {
    if (habit) {
      return habit.actions
        .map(action => action.timeEntries)
        .flat()
        .map(timeEntry => timeEntry.date);
    }
    return [];
  };

  const calculateCurrentStreak = () => {
    const timeEntriesDates = getTimeEntriesDates(habit);
    const today = new Date();
    const yesterday = subDays(today, 1);
    let currentSteak = 0;
    let streakLastDate = yesterday;
    const sortedTimeEntriesDates = timeEntriesDates
      .sort(function(a, b) {
        return new Date(b) - new Date(a);
      })
      .map(date => new Date(date));
    const mostRecentDayHabitIsDone = sortedTimeEntriesDates[0];

    if (isSameDay(mostRecentDayHabitIsDone, today)) {
      streakLastDate = today;
      sortedTimeEntriesDates.splice(0, 1);
      currentSteak = 1;
    } else if (isSameDay(mostRecentDayHabitIsDone, yesterday)) {
      streakLastDate = yesterday;
      sortedTimeEntriesDates.splice(0, 1);
      currentSteak = 1;
    } else {
      return 0;
    }

    for (let i = 0; i < sortedTimeEntriesDates.length; i += 1) {
      if (
        isSameDay(sortedTimeEntriesDates[i], subDays(streakLastDate, i + 1))
      ) {
        currentSteak += 1;
      }
    }

    console.log('...', currentSteak);
    return currentSteak;
  };
  calculateCurrentStreak();

  const [selectedDate, setSelectedDate] = useState('');
  const [showActionList, setShowActionList] = useState(true);

  if (!habit) {
    return null;
  }

  const onSelectHandler = date => {
    setSelectedDate(date);
    setShowActionList(true);
  };

  const onCloseActionList = () => {
    get(`habits/${habit.id}`, token)
      .then(habit => {
        setHabitData(habit);
        setShowActionList(false);
      })
      .catch(() => {
        history.push('/login');
      });
  };

  return (
    <div>
      <Box align="start" justify="between" direction="row">
        <Text size="medium">
          Overview
          <Box>
            <Text margin={{ left: 'small' }} align="center" size="small">
              Current Streak: {calculateCurrentStreak()}
            </Text>
          </Box>
        </Text>
      </Box>
      <Calendar
        daysOfWeek
        firstDayOfWeek={1}
        fill
        style={{ height: '200px' }}
        size="small"
        dates={_.partition(getTimeEntriesDates(habit), timeEntry =>
          isSameMonth(new Date(timeEntry), new Date(selectedDate)),
        ).flat()}
        onSelect={onSelectHandler}
        bounds={['1900-01-01', new Date().toISOString()]}
      />
      <ActionList
        selectedHabitData={{
          habit,
          selectedDate,
        }}
        showActionList={showActionList}
        onCloseActionList={onCloseActionList}
      />
    </div>
  );
};

const SingleHabitView = props => {
  const [habitData, setHabitData] = useState();
  const history = useHistory();

  const onChangingHabitRelatedData = habitId => {
    get(`habits/${habitId}`, token)
      .then(habit => {
        setHabitData(habit);
      })
      .catch(() => {
        history.push('/login');
      });
  };

  useEffect(() => {
    const mounted = true;
    const { habitId } = props.match.params;
    if (!habitData) {
      get(`habits/${habitId}`, token)
        .then(habitData => {
          if (mounted) {
            setHabitData(habitData);
          }
        })
        .catch(() => {
          history.push('/login');
        });
    }
  }, [habitData]);

  if (!habitData) {
    return null;
  }

  return (
    <div>
      <Box align="stretch" justify="between" direction="row">
        <Text align="center">Habit: {habitData.name}</Text>
        <EditHabitIcon
          id={habitData.id}
          originalValue={habitData.name}
          onChangingHabitRelatedData={onChangingHabitRelatedData}
        />
      </Box>
      <Box>
        <Analytics habit={habitData} setHabitData={setHabitData} />
        <HabitLevelDetailsList
          habitId={habitData.id}
          actions={habitData.actions}
          onChangingHabitRelatedData={onChangingHabitRelatedData}
        />
      </Box>
    </div>
  );
};

export default SingleHabitView;
