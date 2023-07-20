import { ForbiddenPage } from '../lib-components/ForbiddenPage';
import Keycloak from 'keycloak-js';
import { BrowserRouter } from 'react-router-dom';
import { Meta, StoryFn } from '@storybook/react';
import { AuthProvider, AuthProviderProps, useAuth } from 'react-oidc-context';

export default {
  title: 'Components/ForbiddenPage',
  component: ForbiddenPage,
  argTypes: {
    keycloak: {
      name: 'keycloak',
      description: 'Keycloak instance passed to forbbiden component',
      control: { disable: true }
    }
  }
} as Meta;

interface ForbbidenPageStoryProps {
  keycloak: Keycloak;
}

export const ForbiddenPage_: StoryFn<ForbbidenPageStoryProps> = () => {
  const mockedKeycloakConfig = JSON.parse(
    '{"realm":"your-realm","auth-server-url":"http://your-keycloak-server:8080/","ssl-required":"external","resource":"your-client","public-client":true,"confidential-port":0}'
  );

  const authProps: AuthProviderProps = {
    authority: mockedKeycloakConfig['auth-server-url'],
    client_id: mockedKeycloakConfig.resource,
    redirect_uri: 'https://localhost:3001/'
  };
  const auth = useAuth();

  return (
    <AuthProvider {...authProps}>
      <BrowserRouter>
        <ForbiddenPage auth={auth} />
      </BrowserRouter>
    </AuthProvider>
  );
};
