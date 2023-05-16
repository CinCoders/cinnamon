import { Story } from '@storybook/react';
import { Navbar } from '../lib-components/Navbar';
import './storiesGlobals.css';
import { SideMenuLink, System, User } from '@/interfaces';
import { testLinks, testSystems, testUser } from './sampledata/SampleData';
import { BrowserRouter } from 'react-router-dom';
import { JSXElementConstructor } from 'react';
import EngineeringIcon from '@mui/icons-material/Engineering';

export default {
  title: 'Components/Navbar',
  parameters: {
    docs: {
      page: null
    }
  },
  argTypes: {
    isLandingPage: {
      name: 'isLandingPage',
      type: { name: 'boolean', required: false },
      description: 'Boolean which defines if the navbar is for a landing page.',
      options: [true, false],
      control: { type: 'boolean' }
    },
    haveSearchBar: {
      name: 'haveSearchBar',
      type: { name: 'boolean', required: false },
      description: 'Boolean which defines if the navbar has a search bar.',
      options: [true, false],
      control: { type: 'boolean' }
    },
    hiddenUser: {
      name: 'hiddenUser',
      type: { name: 'boolean', required: false },
      description: 'Boolean which defines if the navbar hides the user.',
      options: [true, false],
      control: { type: 'boolean' }
    },
    user: {
      name: 'user',
      control: 'object',
      description:
        'Object wich defines all the informations about the current user',
      if: {
        arg: 'hiddenUser',
        eq: false,
        table: {
          disable: true
        }
      }
    },
    h1: {
      name: 'h1',
      type: { name: 'boolean', required: false },
      description: "Boolean wich defines the height of navbar's title",
      options: [true, false],
      control: { type: 'boolean' }
    },
    title: {
      name: 'title',
      type: { name: 'boolean', required: true },
      description: "String wich defines navbar's title",
      control: { type: 'text' }
    },
    sideMenuLinks: {
      name: 'sideMenuLinks',
      control: 'object',
      description: 'Array of Object which defines the custom side menu',
    },
    systemsList: {
      name: 'systemsList',
      control: 'object',
      description: 'Array which defines the systems contained in popup'
    },
    systemsListPopup: {
      name: 'systemsListPopup',
      type: { name: 'boolean', required: false },
      options: [true, false],
      control: { type: 'boolean' },
      description: 'Boolean which defines if the navbar has a menu popup',
      table: {
        category: 'Navbar'
      }
    }
  }
};

export interface NavbarStoryProps {
  isLandingPage: boolean;
  haveSearchBar: boolean;
  hiddenUser: boolean;
  user: User;
  h1: boolean;
  sideMenuLinks: SideMenuLink[];
  systemsListPopup: boolean;
  title: string;
  systemsList: System[];
  IconComponent: JSXElementConstructor<any>;
}

const Template: Story<NavbarStoryProps> = (args) => {
  return (
    <BrowserRouter>
      <Navbar
        isLandingPage={args.isLandingPage}
        haveSearchBar={args.haveSearchBar}
        hiddenUser={args.hiddenUser}
        user={args.hiddenUser ? undefined : args.user}
        h1={args.h1}
        title={args.title}
        sideMenuLinks={args.sideMenuLinks }
        systemsList={args.systemsListPopup ? args.systemsList : undefined}
        IconComponent={
          args.IconComponent ? () => <EngineeringIcon /> : () => <></>
        }
      />
    </BrowserRouter>
  );
};

export const Navbar_ = Template.bind({});
Navbar_.args = {
  h1: true,
  isLandingPage: false,
  haveSearchBar: false,
  hiddenUser: false,
  user: testUser,
  sideMenuLinks: testLinks,
  systemsListPopup: false,
  systemsList: testSystems,
  IconComponent: () => <></>
};
