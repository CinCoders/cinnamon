import { SystemsPopup } from '../components/SystemsPopup';
import './storiesGlobals.css';
import { testSystems } from './sampledata/SampleData';
import { Meta, StoryFn } from '@storybook/react';
import { System } from '..';

export default {
  title: 'Components/SystemsPopup',
  component: SystemsPopup,
  argTypes: {
    systemsList: {
      name: 'systemsList',
      control: 'object',
      description: 'Array which defines the systems contained in popup'
    }
  }
} as Meta;

interface SystemsPopupProps {
  systemsList: System[];
}

const Template: StoryFn<SystemsPopupProps> = ({ systemsList }) => {
  return <SystemsPopup systemsList={systemsList} />;
};

export const SystemsList = Template.bind({});
SystemsList.args = {
  systemsList: testSystems
};
