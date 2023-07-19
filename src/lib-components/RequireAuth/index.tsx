import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import wcBackground from '../../assets/predio.png';
import { useEffect, useState } from 'react';
import { AuthContextProps } from 'react-oidc-context';
import { KeycloakPayload, jwtDecode } from '@/utils/authUtils';

interface AuthProps {
  auth: AuthContextProps;
  permittedRoles: string[];
  children: JSX.Element;
}

export const RequireAuth = (props: AuthProps): React.ReactElement => {
  const location = useLocation();
  const { children, auth, permittedRoles } = props;
  const [waiting, setWaiting] = useState(true);
  let haveAccess = false;

  useEffect(() => {
    if (auth.isLoading && !waiting) {
      setWaiting(true);
    }
  }, [auth.isLoading]);

  if (auth.isLoading) {
    if (waiting) {
      setTimeout(() => {
        setWaiting(false);
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

  let parsedToken: KeycloakPayload | null = null;
  if (auth.user) parsedToken = jwtDecode(auth.user.access_token);

  if (permittedRoles.includes('*')) {
    haveAccess = true;
  } else {
    for (let i = 0; i < permittedRoles.length && !haveAccess; i += 1) {
      if (parsedToken?.realm_access.roles?.includes(permittedRoles[i])) {
        haveAccess = true;
      }
    }
  }

  if (auth.isAuthenticated && haveAccess) {
    return children;
  }

  if (auth.isAuthenticated) {
    return (
      <Navigate
        to={`${process.env.PUBLIC_URL}/forbidden`}
        replace
        state={{ from: location }}
      />
    );
  }

  setTimeout(() => auth.signinRedirect(), 500);
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
};
