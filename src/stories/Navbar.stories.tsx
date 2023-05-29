import { Story } from '@storybook/react';
import { Navbar } from '../lib-components/Navbar';
import './storiesGlobals.css';
import { SideMenuLink, System, User } from '@/interfaces';
import { testLinks, testSystems, testUser } from './sampledata/SampleData';
import { BrowserRouter } from 'react-router-dom';
import { JSXElementConstructor } from 'react';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { navbarArgTypes } from './utils/argTypes';

export default {
  title: 'Components/Navbar',
  parameters: {
    docs: {
      page: null
    }
  },
  argTypes: {
    ...navbarArgTypes
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
  iconComponent: JSXElementConstructor<any>;
}

interface IconComponentProps {
  haveIcon: JSXElementConstructor<any>;
}

const IconComponent = ({ haveIcon }: IconComponentProps) => {
  if (!haveIcon) {
    return <></>;
  } else {
    return <EngineeringIcon />;
  }
};


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
        sideMenuLinks={args.sideMenuLinks}
        systemsList={args.systemsListPopup ? args.systemsList : undefined}
        IconComponent={IconComponent}
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
  iconComponent: () => <></>
};
