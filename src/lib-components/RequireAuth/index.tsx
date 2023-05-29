import { Navigate, useLocation } from 'react-router-dom';
import Keycloak from 'keycloak-js';
import { CircularProgress, Box } from '@mui/material';
import wcBackground from '../../assets/predio.png';
import { useState } from 'react';

interface AuthProps {
  keycloak: Keycloak;
  initialized: boolean;
  permittedRoles: string[];
  children: JSX.Element;
}

export const RequireAuth = (props: AuthProps): React.ReactElement => {
  const location = useLocation();
  const { children, keycloak, permittedRoles, initialized } = props;
  const [waiting, setWaiting] = useState(true);
  let haveAccess = false;

  if (!initialized) {
    if (waiting) {
      setTimeout(() => {
        if (!initialized) {
          setWaiting(false);
        }
      }, 6000);

      return (
        <Box
          minHeight='100vh'
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <CircularProgress />
        </Box>
      );
    }
    return (
      <Box
        minHeight='100vh'
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <h3>
          Não foi possível estabelecer conexão com a página, tente novamente
          mais tarde.
        </h3>
        <img
          src={wcBackground}
          alt='Fundo conexão perdida'
          style={{
            position: 'absolute',
            top: 'calc(100% - 524px)',
            right: 0,
            zIndex: -1
          }}
        />
      </Box>
    );
  }

  if (permittedRoles.includes('*')) {
    haveAccess = true;
  } else {
    for (let i = 0; i < permittedRoles.length && !haveAccess; i += 1) {
      if (keycloak.realmAccess?.roles.includes(permittedRoles[i])) {
        haveAccess = true;
      }
    }
  }

  if (keycloak.authenticated && haveAccess) {
    return children;
  }
  if (keycloak.authenticated) {
    return (
      <Navigate
        to={`${process.env.PUBLIC_URL}/forbidden`}
        replace
        state={{ from: location }}
      />
    );
  }
  keycloak.login();
  return <CircularProgress />;
};
