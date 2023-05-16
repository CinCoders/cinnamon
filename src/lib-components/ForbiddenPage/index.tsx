import { useEffect, useState } from 'react';
import forbidden_403 from '../../assets/icons/forbidden_403.svg';
import { Button, Avatar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate, To } from 'react-router-dom';
import Keycloak from 'keycloak-js';
import {
  ErrorImg,
  MediumText,
  EmailText,
  EmailContainer,
  PageContent
} from './styles';

interface ForbiddenPageProps {
  keycloak: Keycloak;
}

interface Location {
  pathname: string;
  state: {
    from: {
      pathname: string;
    };
  };
}

export const ForbiddenPage = ({ keycloak }: ForbiddenPageProps) => {
  const [email, setEmail] = useState<string>();
  const [from, setFrom] = useState<string>();
  const navigate = useNavigate();
  const location = useLocation() as Location;

  useEffect(() => {
    async function getEmail() {
      setEmail(keycloak.tokenParsed?.email);
    }
    getEmail();
    if (location.state?.from !== undefined) {
      setFrom(location.state.from.pathname);
    } else {
      navigate(process.env.PUBLIC_URL as To);
    }
  }, []);

  const logout = async () => {
    await keycloak.logout({
      redirectUri: `${window.location.origin}/${from}`
    });
  };

  return (
    <PageContent>
      <ErrorImg
        src={forbidden_403}
        alt='Imagem indicando erro 403 - Acesso negado'
      />
      <MediumText>Você está logado como:</MediumText>
      <EmailContainer>
        <Avatar src='/broken-image.jpg' />
        <EmailText>{email}</EmailText>
      </EmailContainer>
      <Button
        sx={{
          marginTop: '1.5vh',
          color: '#000000',
          backgroundColor: '#FFFFFF',
          borderRadius: '100vh',
          borderColor: '#DADADA',
          '&:hover': {
            backgroundColor: '#DADADA',
            borderColor: '#DADADA'
          }
        }}
        onClick={logout}
        variant='outlined'
        startIcon={<LogoutIcon />}
      >
        Log out
      </Button>
    </PageContent>
  );
};
