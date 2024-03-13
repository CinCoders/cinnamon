import { useEffect, useState } from 'react';
import forbidden_403 from '../../assets/icons/forbidden_403.svg';
import { Button, Avatar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate, To } from 'react-router-dom';
import { AuthContextProps } from 'react-oidc-context';
import {
  ErrorImg,
  MediumText,
  EmailText,
  EmailContainer,
  PageContent
} from './styles';

export interface ForbiddenPageProps {
  auth?: AuthContextProps;
  publicURL?: string;
}

interface Location {
  pathname: string;
  state: {
    from: {
      pathname: string;
    };
  };
}

export const ForbiddenPage = ({ auth, publicURL }: ForbiddenPageProps) => {
  const email = auth?.user?.profile.email;
  const baseURL = publicURL ?? process.env.PUBLIC_URL;
  const [from, setFrom] = useState<string>();
  const navigate = useNavigate();
  const location = useLocation() as Location;
  useEffect(() => {
    if (location.state?.from !== undefined) {
      setFrom(location.state.from.pathname);
    } else {
      navigate(baseURL as To);
    }
  }, []);

  const logout = async () => {
    await auth?.signoutRedirect({
      post_logout_redirect_uri: `${window.location.origin}/${from}`
    });
  };

  return (
    <PageContent>
      <ErrorImg
        src={forbidden_403}
        alt='Imagem indicando erro 403 - Acesso negado'
      />
      <MediumText>You are logged in as:</MediumText>
      <EmailContainer>
        <Avatar src='/broken-image.jpg' />
        <EmailText>{email ?? ''}</EmailText>
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
