import React from 'react';
import { Box, Header, Text, Layer, TextInput, Button } from 'grommet';
import { Add, MoreVertical } from 'grommet-icons';

const AddHabit = () => {
  const [show, setShow] = React.useState();
  const [habitName, setValue] = React.useState('');
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
            onChange={event => setValue(event.target.value)}
          />
          <Button label="create" onClick={() => setShow(false)} />
          <Button label="close" onClick={() => setShow(false)} />
        </Layer>
      )}
    </Box>
  );
};

export default () => (
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
      <AddHabit />
      <MoreVertical />
    </Box>
  </Header>
);
