import { useState } from 'react';
import { SideMenu } from '../components/SideMenu';
import { BrowserRouter } from 'react-router-dom';
import { Meta, StoryFn } from '@storybook/react';
import { testLinks } from './sampledata/SampleData';
import { SideMenuLink } from '../interfaces';
import { Button } from '@mui/material';

export default {
  title: 'Components/SideMenu',
  component: SideMenu,
  parameters: {
    docs: {
      page: null
    }
  },
  argTypes: {
    visibility: {
      name: 'visibility',
      control: { disable: true },
      description: 'Boolean which defines the visibility of sidemenu.',
      table: {
        category: 'SideMenu'
      }
    },
    setVisibility: {
      name: 'setVisibility',
      control: { disable: true },
      description:
        'useState set function passed to define the visibility of sidemenu in actions.',
      table: {
        category: 'SideMenu'
      }
    },
    links: {
      name: 'links',
      description: 'Array of links which defines the custom side menu',
      table: {
        category: 'SideMenu'
      }
    }
  }
} as Meta;

interface SideMenuStoryProps {
  links: SideMenuLink[];
}

const Template: StoryFn<SideMenuStoryProps> = (args) => {
  const [drawerVisibility, setDrawerVisibility] = useState<boolean>(false);

  return (
    <BrowserRouter>
      <div
        style={{
          width: '100%',
          height: '64px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Button
          type='button'
          variant='contained'
          onClick={() => setDrawerVisibility(!drawerVisibility)}
        >
          {drawerVisibility ? 'Close SideMenu' : 'Open SideMenu'}
        </Button>
      </div>

      <SideMenu
        visibility={drawerVisibility}
        setVisibility={setDrawerVisibility}
        links={args.links}
      />
    </BrowserRouter>
  );
};

export const SideMenu_ = Template.bind({});
SideMenu_.args = {
  links: testLinks
};
