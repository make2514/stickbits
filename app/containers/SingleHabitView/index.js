import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom';
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
import {
  MoreVertical,
  Add,
  SubtractCircle,
  AddCircle,
  Edit,
} from 'grommet-icons';

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
  const [show, setShow] = React.useState();
  const [newHabitLevel, setValue] = React.useState('');
  return (
    <Box direction="row" fill="horizontal" justify="between">
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

const SingleHabitMoreVerticalIcon = () => {
  const [show, setShow] = React.useState();
  const [habitName, setValue] = React.useState('');
  return (
    <Box>
      <MoreVertical
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
            placeholder="original habit name"
            value={habitName}
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

const habitLevelDetailsList = () => (
  <List
    primaryKey="name"
    secondaryKey="edit"
    data={[
      { name: "habit level's detail 1", edit: EditIcon() },
      { name: "habit level's detail 2", edit: EditIcon() },
      { name: "habit level's detail 3", edit: EditIcon() },
      { name: "habit level's detail 4", edit: EditIcon() },
    ]}
  />
);
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
        setTimeEntries(getTimeEntriesDates(habit).slice());
        setShowActionList(false);
      })
      .catch(() => {
        history.push('/login');
      });
  };

  return (
    <Box>
      <Calendar
        style={{ height: '200px' }}
        size="small"
        dates={timeEntries}
        onSelect={onSelectHandler}
        bounds={['1900-01-01', new Date().toISOString()]}
      />
      <ActionList
        // onCloseActionList={onCloseActionList}
        selectedHabitData={{
          habit,
          selectedDate,
        }}
        showActionList={showActionList}
        onCloseActionList={onCloseActionList}
      />
    </Box>
  );
};

const SingleHabitView = () => {
  const { habit } = useLocation();
  const [habitData, setHabitData] = useState();
  const history = useHistory();

  useEffect(() => {
    const mounted = true;

    if (!habitData) {
      get(`habits/${habit.id}`, token)
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

  return (
    <Box
      overflow="auto"
      align="baseline"
      flex
      direction="column"
      justify="between"
      pad={{ horizontal: 'xsmall', vertical: 'xsmall' }}
      background={{ color: 'graph-3' }}
    >
      <Box align="stretch" justify="between" direction="row" fill="horizontal">
        <Text align="center">{habit.name}</Text>
        {SingleHabitMoreVerticalIcon()}
      </Box>
      <Box align="start" justify="between" direction="row" fill="horizontal">
        <Text size="medium">
          Overview
          <Box>
            <Text margin={{ left: 'small' }} align="center" size="small">
              Current Streak: 0
            </Text>
          </Box>
        </Text>
      </Box>
      <CustomAccordion
        label="Analytics"
        dropDownContent={<Analytics habit={habitData} />}
      />
      <CustomAccordion
        label="Bronze level activities"
        dropDownContent={habitLevelDetailsList()}
        customPanel
      />
      <CustomAccordion
        label="Silver level activities"
        dropDownContent={habitLevelDetailsList()}
        customPanel
      />
      <CustomAccordion
        label="Gold level activities"
        dropDownContent={habitLevelDetailsList()}
        customPanel
      />
    </Box>
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
