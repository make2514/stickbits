import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { isSameMonth } from 'date-fns';
import _ from 'lodash';
import {
  Grommet,
  Box,
  Text,
  Accordion,
  AccordionPanel,
  List,
  Calendar,
  Layer,
  Button,
  TextInput,
} from 'grommet';
import { Add, SubtractCircle, AddCircle, Edit } from 'grommet-icons';

import ActionList from '../../components/ActionList';
import { get } from '../../apis/generics';

const token = localStorage.getItem('token');

const customAccordionTheme = {
  global: {
    font: {
      family: `-apple-system,
       BlinkMacSystemFont, 
       "Segoe UI", 
       Roboto`,
    },
  },
  accordion: {
    heading: {
      level: 3,
      margin: { vertical: '6px', horizontal: '24px' },
    },
    hover: {
      heading: {
        color: 'accent-2',
      },
    },
    icons: {
      collapse: SubtractCircle,
      expand: AddCircle,
      color: 'hotpink',
    },
    border: undefined,
    panel: {
      // border: {
      //   side: 'horizontal',
      //   size: 'medium',
      //   color: '#DADADA',
      //   style: 'dotted',
      // }
    },
  },
};

const CustomAccordionPanel = ({ label, clickHandler }) => {
  const [show, setShow] = React.useState(true);
  const [newHabitLevel, setValue] = React.useState('');
  return (
    <Box direction="row" fill justify="between">
      <Text size="medium">{label}</Text>
      <Add
        onClick={() => {
          setShow(true);
          clickHandler();
        }}
      />
      {show && (
        <Layer
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
        >
          <TextInput
            placeholder="type here"
            value={newHabitLevel}
            onChange={event => setValue(event.target.value)}
          />
          <Button label="close" onClick={() => setShow(false)} />
        </Layer>
      )}
    </Box>
  );
};

const CustomAccordion = ({ animate, multiple, customPanel, ...rest }) => (
  <Grommet style={{ width: '100%' }} theme={customAccordionTheme}>
    <Box {...rest} justify="center">
      <Accordion animate={animate} multiple>
        <AccordionPanel
          label={
            customPanel ? (
              <CustomAccordionPanel {...rest} />
            ) : (
              <Text size="medium">{rest.label}</Text>
            )
          }
        >
          <Box background="light-2" height="small">
            {/* Render list of certain habit level's detail */}
            {rest.dropDownContent}
          </Box>
        </AccordionPanel>
      </Accordion>
    </Box>
  </Grommet>
);

const EditIcon = () => {
  const [show, setShow] = React.useState();
  const [habitLevelActivity, setValue] = React.useState('');
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
            placeholder="original habit level's activity"
            value={habitLevelActivity}
            onChange={event => setValue(event.target.value)}
          />
          <Button label="save" onClick={() => setShow(false)} />
          <Button label="delete" onClick={() => setShow(false)} />
          <Button label="close" onClick={() => setShow(false)} />
        </Layer>
      )}
    </Box>
  );
};

const HabitLevelDetailsList = ({ actions }) => {
  const ListOfActions = ({ actionLevel }) => (
    <div>
      <Text weight="bold">{actionLevel} level actions</Text>
      <List
        primaryKey={action => <Text key={action.id}>{action.name}</Text>}
        secondaryKey="edit"
        data={actions
          .filter(action => action.level === actionLevel)
          .map(({ name, id }) => ({
            name,
            id,
            edit: EditIcon(),
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
const Analytics = ({ habit }) => {
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

  const [timeEntries, setTimeEntries] = useState(getTimeEntriesDates(habit));
  const [selectedDate, setSelectedDate] = useState('');
  const [showActionList, setShowActionList] = useState(true);

  if (!habit) {
    return null;
  }

  const onSelectHandler = date => {
    setTimeEntries(timeEntries.slice());
    setSelectedDate(date);
    setShowActionList(true);
  };

  const onCloseActionList = () => {
    get(`habits/${habit.id}`, token)
      .then(habit => {
        // get currently viewed month
        // put timeEntries of the month to the beginning of the timeEntries array
        setTimeEntries(
          _.partition(getTimeEntriesDates(habit), timeEntry =>
            isSameMonth(new Date(timeEntry), new Date(selectedDate)),
          ).flat(),
        );
        setShowActionList(false);
      })
      .catch(() => {
        history.push('/login');
      });
  };

  return (
    <div>
      <Calendar
        daysOfWeek
        firstDayOfWeek={1}
        fill
        style={{ height: '200px' }}
        size="small"
        dates={timeEntries}
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
        <Text align="center">{habitData.name}</Text>
      </Box>
      <Box align="start" justify="between" direction="row">
        <Text size="medium">
          Overview
          <Box>
            <Text margin={{ left: 'small' }} align="center" size="small">
              Current Streak: 0
            </Text>
          </Box>
        </Text>
      </Box>
      <Box>
        <Analytics habit={habitData} />
        <HabitLevelDetailsList actions={habitData.actions} />
      </Box>
    </div>
  );
};

export default SingleHabitView;

CustomAccordionPanel.propTypes = {
  label: PropTypes.string,
  clickHandler: PropTypes.func,
};

CustomAccordion.propTypes = {
  animate: PropTypes.bool,
  multiple: PropTypes.bool,
  customPanel: PropTypes.bool,
};
