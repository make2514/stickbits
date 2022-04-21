import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Layer, Button, CheckBox } from 'grommet';
import { isSameDay } from 'date-fns';
import { post, deleteAPI } from '../apis/generics';

const ActionList = ({
  onCloseActionList,
  selectedHabitData,
  showActionList,
}) => {
  if (
    !selectedHabitData ||
    !selectedHabitData.selectedDate ||
    !selectedHabitData.habit ||
    !showActionList
  ) {
    return null;
  }

  const actions = selectedHabitData ? selectedHabitData.habit.actions : {};

  const ActionCheckBox = ({ action }) => {
    const history = useHistory();
    const [checked, setChecked] = useState(
      action.timeEntries.filter(timeEntry =>
        isSameDay(
          new Date(timeEntry.date),
          new Date(selectedHabitData.selectedDate),
        ),
      ).length > 0,
    );
    const token = localStorage.getItem('token');

    const addTimeEntryOfAnAction = () => {
      post(`timeEntries`, token, {
        actionId: action.id,
        date: selectedHabitData.selectedDate,
      })
        .then(() => {
          setChecked(true);
        })
        .catch(() => {
          history.push('/login');
        });
    };

    const deleteTimeEntryOfAnAction = () => {
      deleteAPI(`timeEntries/`, token, {
        actionId: action.id,
        date: selectedHabitData.selectedDate,
      })
        .then(() => {
          setChecked(false);
        })
        .catch(() => {
          history.push('/login');
        });
    };

    return (
      <CheckBox
        checked={checked}
        onChange={() => {
          if (checked) {
            deleteTimeEntryOfAnAction();
          } else {
            addTimeEntryOfAnAction();
          }
        }}
      />
    );
  };

  return (
    <Box>
      {selectedHabitData && (
        <Layer>
          <Button
            label="close"
            onClick={() => {
              onCloseActionList();
            }}
          />
          {actions.length > 0 &&
            actions.map(action => (
              <Box key={action.id}>
                {action.name}
                <ActionCheckBox action={action} />
              </Box>
            ))}
        </Layer>
      )}
    </Box>
  );
};

export default ActionList;
