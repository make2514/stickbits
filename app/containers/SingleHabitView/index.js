import React from 'react';
import PropTypes from 'prop-types';
import {
  Grommet,
  Box,
  Text,
  Accordion,
  AccordionPanel,
  List,
  Calendar,
} from 'grommet';
import {
  MoreVertical,
  Add,
  SubtractCircle,
  AddCircle,
  Edit,
} from 'grommet-icons';

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

const CustomAccordionPanel = ({ label, clickHanlder }) => (
  <Box direction="row" fill="horizontal" justify="between">
    <Text size="medium">{label}</Text>
    <Add onClick={clickHanlder} />
  </Box>
);

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

const EditIcon = () => <Edit />;

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

const analytics = () => (
  <Calendar size="small" date={new Date().toISOString()} />
);

export default () => (
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
      <Text align="center">Habit 1</Text>
      <MoreVertical />
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
    <CustomAccordion label="Analytics" dropDownContent={analytics()} />
    <CustomAccordion
      label="Bronze level"
      dropDownContent={habitLevelDetailsList()}
      customPanel
    />
    <CustomAccordion
      label="Silver level"
      dropDownContent={habitLevelDetailsList()}
      customPanel
    />
    <CustomAccordion
      label="Gold level"
      clickHanlder={() => {
        alert('Add Gold Level activity');
      }}
      dropDownContent={habitLevelDetailsList()}
      customPanel
    />
  </Box>
);

CustomAccordionPanel.propTypes = {
  label: PropTypes.string,
  clickHanlder: PropTypes.func,
};

CustomAccordion.propTypes = {
  animate: PropTypes.bool,
  multiple: PropTypes.bool,
  customPanel: PropTypes.bool,
};
