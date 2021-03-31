import React from 'react';
import { Box, Header, Text } from 'grommet';
import { Add, MoreVertical } from 'grommet-icons';

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
      <Add />
      <MoreVertical />
    </Box>
  </Header>
);
