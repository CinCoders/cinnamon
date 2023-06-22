import { ForbiddenPage } from '../lib-components/ForbiddenPage';
import Keycloak from 'keycloak-js';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { BrowserRouter } from 'react-router-dom';
import { Meta, StoryFn } from '@storybook/react';

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

  const keycloak = new Keycloak({
    url: mockedKeycloakConfig['auth-server-url'],
    realm: mockedKeycloakConfig.realm,
    clientId: mockedKeycloakConfig.resource
  });

  return (
    <ReactKeycloakProvider authClient={keycloak}>
      <BrowserRouter>
        <ForbiddenPage keycloak={keycloak} />
      </BrowserRouter>
    </ReactKeycloakProvider>
  );
};
