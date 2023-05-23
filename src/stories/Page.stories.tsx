import { Meta, Story } from '@storybook/react';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline/ScopedCssBaseline';
import './storiesGlobals.css';
import { Page } from '../lib-components/Page';
import { SideMenuLink, System, User } from '@/interfaces';
import { testLinks, testSystems, testUser } from './sampledata/SampleData';
import { BrowserRouter } from 'react-router-dom';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { JSXElementConstructor } from 'react';

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
    isLandingPage: {
      name: 'isLandingPage',
      type: { name: 'boolean', required: false },
      description: 'Boolean which defines if the navbar is for a landing page.',
      options: [true, false],
      control: { type: 'boolean' },
      table: {
        category: 'Navbar'
      }
    },
    haveSearchBar: {
      name: 'haveSearchBar',
      type: { name: 'boolean', required: false },
      description: 'Boolean which defines if the navbar has a search bar.',
      options: [true, false],
      control: { type: 'boolean' },
      table: {
        category: 'Navbar'
      }
    },
    hiddenUser: {
      name: 'hiddenUser',
      type: { name: 'boolean', required: false },
      description: 'Boolean which defines if the navbar hides the user.',
      options: [true, false],
      control: { type: 'boolean' },
      table: {
        category: 'Navbar'
      }
    },
    user: {
      name: 'user',
      control: 'object',
      description:
        'Object wich defines all the informations about the current user',
      table: {
        category: 'Navbar'
      },
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
      control: { type: 'boolean' },
      table: {
        category: 'Navbar'
      }
    },
    title: {
      name: 'title',
      type: { name: 'string', required: true },
      description: "String wich defines navbar's title",
      control: { type: 'text' },
      table: {
        category: 'Navbar'
      }
    },
    sideMenuLinks: {
      name: 'sideMenuLinks',
      control: 'object',
      description: 'Array of Object which defines the custom side menu',
      table: {
        category: 'Navbar'
      }
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
      description:
        'Boolean which defines if ttemplatehe navbar has a menu popup',
      table: {
        category: 'Navbar'
      }
    },
    footerTitle: {
      name: 'title',
      type: { name: 'string', required: false },
      description: "String wich defines footer's title",
      control: { type: 'text' },
      table: {
        category: 'Footer'
      }
    },
    footerTelephone: {
      name: 'telephone',
      type: { name: 'string', required: false },
      description: "String wich defines footer's telephone",
      control: { type: 'text' },
      table: {
        category: 'Footer'
      }
    },
    footerTelephoneComplement: {
      name: 'telephone complement',
      type: { name: 'string', required: false },
      description: "String wich defines footer's telephone complement",
      control: { type: 'text' },
      table: {
        category: 'Footer'
      }
    },
    footerEmail: {
      name: 'email',
      type: { name: 'string', required: false },
      description: "String wich defines footer's email",
      control: { type: 'text' },
      table: {
        category: 'Footer'
      }
    },
    footerLink: {
      name: 'link',
      type: { name: 'string', required: false },
      description: "String wich defines footer's link",
      control: { type: 'text' },
      table: {
        category: 'Footer'
      }
    },
    footerTextLink: {
      name: 'text link',
      type: { name: 'string', required: false },
      description: "String wich defines footer's text link",
      control: { type: 'text' },
      table: {
        category: 'Footer'
      }
    },
    footerDescription: {
      name: 'description',
      type: { name: 'string', required: false },
      description: "String wich defines footer's description",
      control: { type: 'text' },
      table: {
        category: 'Footer'
      }
    },
    footerCopyrightText: {
      name: 'copyright text',
      type: { name: 'string', required: false },
      description: "String wich defines footer's copyright text",
      control: { type: 'text' },
      table: {
        category: 'Footer'
      }
    },
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
            IconComponent
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
