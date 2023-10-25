import { ForbiddenPage } from '../lib-components/ForbiddenPage';
import { BrowserRouter } from 'react-router-dom';
import { Meta, StoryFn } from '@storybook/react';
import { AuthContextProps, AuthProvider } from 'react-oidc-context';
import { Dialog } from '../lib-components/Dialog';
import { useState } from 'react';

export default {
  title: 'Components/ForbiddenPage',
  component: ForbiddenPage,
  argTypes: {
    auth: {
      name: 'auth',
      description: 'Auth instance passed to forbbiden component',
      control: { disable: true }
    },
    title: {
      name: 'title',
      type: { name: 'string', required: true },
      description: 'String wich defines email of logged user',
      control: { type: 'text' }
    }
  }
} as Meta;

interface ForbbidenPageStoryProps {
  title?: string;
}

const Template: StoryFn<ForbbidenPageStoryProps> = (args) => {
  const [dialogLogout, setDialogLogout] = useState(false);
  const mockedAuth = {
    user: { profile: { email: args.title } },
    signoutRedirect() {
      console.log('teste redirect');
      setDialogLogout(true);
    }
  } as AuthContextProps;

  return (
    <BrowserRouter>
      <AuthProvider>
        <ForbiddenPage auth={mockedAuth} />
        <Dialog
          type={'alert'}
          title={'Mocked logout'}
          setVisibility={setDialogLogout}
          visibility={dialogLogout}
        >
          <h2>Successfully mocked logout!</h2>
        </Dialog>
      </AuthProvider>
    </BrowserRouter>
  );
};

export const ForbiddenPage_ = Template.bind({});
ForbiddenPage_.args = {
  title: 'sample@cin.ufpe.br'
};
