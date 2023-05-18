import { Story } from '@storybook/react';
import { Footer } from '../lib-components/Footer';
import './storiesGlobals.css';

export default {
  title: 'Components/Footer',
  parameters: {
    docs: {
      page: null
    }
  },
  argTypes: {
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
    }
    ,
    footerSignatureText: {
      name: 'signature text',
      type: { name: 'string', required: false },
      description: "String wich defines footer's signature text",
      control: { type: 'text' },
      table: {
        category: 'Footer'
      }
    }
    ,
    footerSignatureLink: {
      name: 'signature link',
      type: { name: 'string', required: false },
      description: "String wich defines footer's signature link",
      control: { type: 'text' },
      table: {
        category: 'Footer'
      }
    }
  }
};

export interface FooterStoryProps {
  footerTitle: string;
  footerTelephone: string;
  footerTelephoneComplement: string;
  footerEmail: string;
  footerLink: string;
  footerTextLink: string;
  footerDescription: string;
  footerCopyrightText: string;
  footerSignatureText: string;
  footerSignatureLink: string;
}

const Template: Story<FooterStoryProps> = (args) => {
  return (
    <Footer
      title={`${args.footerTitle}`}
      telephone={`${args.footerTelephone}`}
      telephoneComplement={`${args.footerTelephoneComplement}`}
      email={`${args.footerEmail}`}
      link={`${args.footerLink}`}
      textLink={`${args.footerLink}`}
      description={`${args.footerDescription}`}
      copyrightText={`${args.footerCopyrightText}`}
      signatureText={args.footerSignatureText}
      signatureLink={`${args.footerSignatureLink}`}
    />
  );
};

export const Footer_ = Template.bind({});
Footer_.args = {
  footerTitle: 'FOOTER TITLE',
  footerTelephone: '(xx) xxxx-xxxx',
  footerTelephoneComplement: 'Internal number: xxxx / xxxx',
  footerEmail: 'sample@email.com',
  footerLink: 'https://www.google.com',
  footerTextLink: 'Website',
  footerDescription: "Footer's description with \n line break",
  footerCopyrightText: 'CIn UFPE |  All rights reserved'
};
