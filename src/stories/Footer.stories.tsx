import { StoryFn } from '@storybook/react';
import { Footer } from '../lib-components/Footer';
import './storiesGlobals.css';
import { footerArgTypes } from './utils/argTypes';

export default {
  title: 'Components/Footer',
  parameters: {
    docs: {
      page: null
    }
  },
  argTypes: { ...footerArgTypes }
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
  footerLargeFooter: boolean;
}

const Template: StoryFn<FooterStoryProps> = (args) => {
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
      largeFooter={args.footerLargeFooter}
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
  footerCopyrightText: 'CIn UFPE |  All rights reserved',
  footerLargeFooter: true
};
