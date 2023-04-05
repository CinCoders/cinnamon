import { ForbiddenPage } from '../lib-components/ForbiddenPage';
import Keycloak from 'keycloak-js';
import { storiesOf } from '@storybook/react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { BrowserRouter } from 'react-router-dom';

const stories = storiesOf('ForbiddenPage', module);

const keycloakConfig = JSON.parse(
  '{"realm":"Intranet","auth-server-url":"http://localhost:8080/auth/","ssl-required":"external","resource":"Dashboard-Front","public-client":true,"confidential-port":0}'
);

export const keycloak = new Keycloak({
  url: keycloakConfig['auth-server-url'],
  realm: keycloakConfig.realm,
  clientId: keycloakConfig.resource
});

stories.add('ForbiddenPage', () => {
  return (
    <ReactKeycloakProvider authClient={keycloak}>
      <BrowserRouter>
        <ForbiddenPage keycloak={keycloak} />
      </BrowserRouter>
    </ReactKeycloakProvider>
  );
});
