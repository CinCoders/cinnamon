import { Meta, Story } from '@storybook/react';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline/ScopedCssBaseline';
import './storiesGlobals.css';
import { Page } from '../lib-components/Page';
import { SideMenuLink, System, User } from '@/interfaces';
import { testLinks, testSystems, testUser } from './sampledata/SampleData';
import { BrowserRouter } from 'react-router-dom';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { JSXElementConstructor } from 'react';
import { footerArgTypes, navbarArgTypes } from '../utils/argTypes';

export default {
  title: 'Components/Page',
  parameters: {
    docs: {
      page: null
    }
  },
  argTypes: {
    navbar: {
      table: {
        disable: true
      }
    },
    footer: {
      table: {
        disable: true
      }
    },
    centralized: {
      name: 'centralized',
      type: { name: 'boolean', required: false },
      description:
        'Boolean which defines if the content of page is centralized or not.',
      options: [true, false],
      control: { type: 'boolean' }
    },
    ...footerArgTypes,
    ...navbarArgTypes,
    width: {
      name: 'width',
      type: { name: 'string', required: false },
      description: "String wich defines children's width",
      control: { type: 'text' },
      table: {
        category: 'Children'
      }
    },
    height: {
      name: 'height',
      type: { name: 'string', required: false },
      description: "String wich defines children's height",
      control: { type: 'text' },
      table: {
        category: 'Children'
      }
    },
    color: {
      name: 'color',
      type: { name: 'string', required: false },
      description: "String wich defines children's color",
      control: { type: 'color' },
      table: {
        category: 'Children'
      }
    }
  }
} as Meta;

interface StoryPageProps {
  isLandingPage: boolean;
  haveSearchBar: boolean;
  hiddenUser: boolean;
  user: User;
  h1: boolean;
  sideMenuLinks: SideMenuLink[];
  systemsListPopup: boolean;
  systemsList: System[];
  IconComponent: JSXElementConstructor<any>;
  title: string;
  footerTitle: string;
  footerTelephone: string;
  footerTelephoneComplement: string;
  footerEmail: string;
  footerLink: string;
  footerTextLink: string;
  footerDescription: string;
  footerCopyrightText: string;
  width: string;
  height: string;
  color: string;
  centralized: boolean;
}

const Template: Story<StoryPageProps> = (args) => {
  return (
    <ScopedCssBaseline>
      <BrowserRouter>
        <Page
          navbar={{
            isLandingPage: args.isLandingPage,
            haveSearchBar: args.haveSearchBar ? true : false,
            hiddenUser: args.hiddenUser,
            user: args.hiddenUser ? undefined : args.user,
            h1: args.h1,
            children: undefined,
            title: args.title,
            sideMenuLinks: args.sideMenuLinks,
            systemsList: args.systemsList ? args.systemsList : undefined,
            IconComponent: args.IconComponent
              ? () => <EngineeringIcon />
              : () => <></>
          }}
          footer={{
            title: args.footerTitle,
            telephone: args.footerTelephone,
            telephoneComplement: args.footerTelephoneComplement,
            email: args.footerEmail,
            link: args.footerLink,
            textLink: args.footerTextLink,
            description: args.footerDescription,
            copyrightText: args.footerCopyrightText
          }}
          centralized={args.centralized}
          createNavbarContext={false}
        >
          <div
            style={{
              width: `${args.width}`,
              height: `${args.height}`,
              color: `${args.color}`,
              backgroundColor: `${args.color}`,
              padding: '20px 40px'
            }}
          ></div>
        </Page>
      </BrowserRouter>
    </ScopedCssBaseline>
  );
};

export const Page_ = Template.bind({});
Page_.args = {
  width: '150px',
  height: '150px',
  color: '#000000',
  title: 'Cinnamon',
  h1: true,
  isLandingPage: false,
  haveSearchBar: true,
  hiddenUser: false,
  user: testUser,
  sideMenuLinks: testLinks,
  systemsListPopup: false,
  systemsList: testSystems,
  footerTitle: 'FOOTER TITLE',
  footerTelephone: '(xx) xxxx-xxxx',
  footerTelephoneComplement: 'Internal number: xxxx / xxxx',
  footerEmail: 'sample@email.com',
  footerLink: 'https://www.google.com',
  footerTextLink: 'Site',
  footerDescription: "Footer's description with \n line break",
  footerCopyrightText: 'CIn UFPE | All rights reserved'
};
