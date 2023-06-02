import { UserPopup } from '../components/UserPopup';
import './storiesGlobals.css';
import { testUser } from './sampledata/SampleData';
import { Meta, StoryFn } from '@storybook/react';
import { User } from '../interfaces/index';
import { Dialog } from '../lib-components/Dialog';
import { useState } from 'react';

export default {
  title: 'Components/UserPopup',
  component: UserPopup,
  argTypes: {
    user: {
      name: 'user',
      control: 'object',
      description: 'Object which defines user info'
    },
    logoutMethod: {
      name: 'logoutMethod',
      type: 'function',
      description: 'Function which defines the lougout method for the page'
    },
    keycloak: {
      name: 'keycloak',
      description: 'Keycloak instance passed to UserPopup component',
      control: { disable: true }
    },
    accountManagementUrl: {
      name: 'accountManagementUrl',
      description:
        'Url that redirects to account management page of the system',
      control: { disable: true }
    }
  }
} as Meta;

interface UserPopupStory {
  user?: User;
}

const Template: StoryFn<UserPopupStory> = ({ user }) => {
  const [visibility, setVisibility] = useState<boolean>(false);

  return (
    <>
      <Dialog
        type='information'
        title='Logout Method '
        children='This is a mocked logout. The logout method prop is a method that apply your custom logout to the system.'
        acceptLabel='Understood'
        visibility={visibility}
        setVisibility={setVisibility}
      />
      <UserPopup
        logoutMethod={() => {
          setVisibility(true);
        }}
        user={user}
        keycloak={undefined}
        accountManagementUrl='#'
      />
    </>
  );
};

export const UserPopup_ = Template.bind({});
UserPopup_.args = {
  user: testUser
};
