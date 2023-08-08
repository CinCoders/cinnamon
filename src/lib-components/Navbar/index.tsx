import { JSXElementConstructor, useContext, useEffect, useState } from 'react';
import systemsMenuIcon from '../../assets/icons/menu_black.svg';
import { User, SideMenuLink, System } from '../../interfaces';
import IconButton from '@mui/material/IconButton';
import { SideMenu } from '../../components/SideMenu';
import { HamburgerButton } from '../../components/HamburgerButton';
import { UserPopup } from '../../components/UserPopup';
import { SystemsPopup } from '../../components/SystemsPopup';
import { IconRenderer } from '../IconRender';
import {
  StyledAppBar,
  StyledToolbar,
  LeftContainer,
  SearchBarContainer,
  Search,
  StyledInputBase,
  RightContainer,
  SystemsButton,
  Logo,
  StyledUserMenu,
  StyledSystemMenu,
  TitleContainer,
  ParentNav
} from './styles';
import { Avatar, GlobalStyles } from '@mui/material';
import { NavbarContextValue } from '../Page/useNavbar';
import { NavbarContext } from '../Page';
import { AuthContextProps } from 'react-oidc-context';
import { hasAccess } from '@/utils/authUtils';

export interface NavbarProps {
  auth?: AuthContextProps;
  logoRedirectUrl?: string;
  logoSrc?: string;
  haveSearchBar?: boolean;
  hiddenUser?: boolean;
  title?: string;
  h1?: boolean;
  searchFunction?: (searchString: string) => void;
  searchDropdownLabelsList?: string[];
  logoutFunction?: () => void;
  user?: User;
  sideMenuLinks?: SideMenuLink[];
  isLandingPage?: boolean;
  systemsList?: System[];
  currentSystemIconUrl?: string;
  IconComponent?: JSXElementConstructor<any>;
  children?: JSX.Element;
  accountManagementUrl?: string;
}

export const Navbar = ({
  auth,
  logoRedirectUrl = '/',
  logoSrc,
  haveSearchBar = false,
  searchFunction = () => {},
  hiddenUser = false,
  user = {
    name: '-',
    email: '-'
  },
  title = '',
  h1 = false,
  sideMenuLinks = [],
  isLandingPage = false,
  systemsList = [],
  currentSystemIconUrl,
  children,
  IconComponent,
  accountManagementUrl
}: NavbarProps) => {
  const [profile, setProfile] = useState<User>(user);
  const contextValue: NavbarContextValue | undefined =
    useContext(NavbarContext);
  if (contextValue) {
    title = contextValue.title ?? title;
    sideMenuLinks = contextValue.sideMenuLinks ?? sideMenuLinks;
    haveSearchBar = contextValue.haveSearchBar ?? haveSearchBar;
    searchFunction = contextValue.searchFunction ?? (() => {});
  }
  useEffect(() => {
    async function load() {
      if (auth) {
        setProfile({
          name: auth.user?.profile?.given_name ?? '',
          email: auth.user?.profile?.email ?? ''
        });
      }
    }
    load();
  }, [auth]);

  const [anchorUserEl, setAnchorUserEl] = useState<null | HTMLElement>(null);
  const [anchorSystemsEl, setAnchorSystemsEl] = useState<null | HTMLElement>(
    null
  );
  const [sideMenuIsOpen, setSideMenuIsOpen] = useState(false);
  const [searchString, setSearchString] = useState('');

  const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorUserEl(event.currentTarget);
  };

  const handleUserClose = () => {
    setAnchorUserEl(null);
  };

  const handleSystemsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorSystemsEl(event.currentTarget);
  };

  const handleSystemsClose = () => {
    setAnchorSystemsEl(null);
  };

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchString(e.target.value);
    searchFunction(e.target.value);
  }

  function handleToggleSideMenu() {
    setSideMenuIsOpen(!sideMenuIsOpen);
  }

  systemsList = auth
    ? systemsList.filter((system) => {
        if (system.visibleRole && hasAccess(auth, [system.visibleRole])) {
          return system;
        }
      })
    : systemsList;

  return (
    <>
      <GlobalStyles styles={{ body: { paddingRight: '0px !important' } }} />
      {isLandingPage ? (
        <ParentNav>
          <StyledAppBar>
            <StyledToolbar>
              {logoSrc && (
                <a href={logoRedirectUrl}>
                  <Logo src={logoSrc} alt='Logo da Instituição' />
                </a>
              )}
              <TitleContainer>
                {h1 ? (
                  <span style={{ fontSize: '2em' }}>{title}</span>
                ) : (
                  <span style={{ fontSize: '1.5em' }}>{title}</span>
                )}
              </TitleContainer>
              {hiddenUser ? (
                <span>
                  {haveSearchBar && (
                    <SearchBarContainer>
                      <Search>
                        <StyledInputBase
                          placeholder='Buscar…'
                          inputProps={{ 'aria-label': 'search' }}
                          type='text'
                          value={searchString}
                          onChange={handleSearch}
                        />
                      </Search>
                    </SearchBarContainer>
                  )}
                </span>
              ) : (
                <>
                  {haveSearchBar && (
                    <SearchBarContainer>
                      <Search>
                        <StyledInputBase
                          placeholder='Buscar…'
                          inputProps={{ 'aria-label': 'search' }}
                          type='text'
                          value={searchString}
                          onChange={handleSearch}
                        />
                      </Search>
                    </SearchBarContainer>
                  )}
                  <IconButton
                    size='small'
                    aria-label='account of current user'
                    aria-controls='menu-appbar'
                    aria-haspopup='true'
                    onClick={handleUserMenu}
                    color='inherit'
                  >
                    <Avatar sx={{ bgcolor: '#db1e2f' }} alt={profile.name[0]}>
                      {profile.name[0].charAt(0)}
                    </Avatar>
                  </IconButton>
                </>
              )}
              <StyledUserMenu
                id='menu-appbar'
                anchorEl={anchorUserEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={Boolean(anchorUserEl)}
                onClose={handleUserClose}
              >
                <UserPopup user={profile} auth={auth} />
              </StyledUserMenu>
            </StyledToolbar>
          </StyledAppBar>
        </ParentNav>
      ) : (
        <ParentNav>
          <StyledAppBar>
            <StyledToolbar>
              <LeftContainer>
                {sideMenuLinks.length !== 0 && (
                  <HamburgerButton
                    isOpen={sideMenuIsOpen}
                    onClick={handleToggleSideMenu}
                  />
                )}

                <IconRenderer
                  iconUrl={currentSystemIconUrl}
                  IconComponent={IconComponent}
                />
              </LeftContainer>

              <TitleContainer>
                {h1 ? (
                  <span style={{ fontSize: '2em' }}>{title}</span>
                ) : (
                  <span style={{ fontSize: '1.5em' }}>{title}</span>
                )}
              </TitleContainer>

              <SearchBarContainer>
                {haveSearchBar && (
                  <Search>
                    <StyledInputBase
                      placeholder='Buscar…'
                      inputProps={{ 'aria-label': 'search' }}
                      type='text'
                      value={searchString}
                      onChange={handleSearch}
                    />
                  </Search>
                )}
              </SearchBarContainer>

              <RightContainer>
                {systemsList.length > 0 && (
                  <>
                    <IconButton
                      size='small'
                      aria-label='account of current user'
                      aria-controls='menu-appbar'
                      aria-haspopup='true'
                      onClick={handleSystemsMenu}
                      color='inherit'
                    >
                      <SystemsButton>
                        <img src={systemsMenuIcon} alt='Systems Menu' />
                      </SystemsButton>
                    </IconButton>

                    <StyledSystemMenu
                      id='menu-appbar'
                      anchorEl={anchorSystemsEl}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                      }}
                      open={Boolean(anchorSystemsEl)}
                      onClose={handleSystemsClose}
                    >
                      <SystemsPopup systemsList={systemsList} />
                    </StyledSystemMenu>
                  </>
                )}
                {logoSrc && (
                  <a href={logoRedirectUrl}>
                    <Logo src={logoSrc} alt='Logo da Instituição' />
                  </a>
                )}
                {hiddenUser ? (
                  <span></span>
                ) : (
                  <IconButton
                    size='small'
                    aria-label='account of current user'
                    aria-controls='menu-appbar'
                    aria-haspopup='true'
                    onClick={handleUserMenu}
                    color='inherit'
                  >
                    <Avatar sx={{ bgcolor: '#db1e2f' }} alt={profile.name[0]}>
                      {profile.name[0].charAt(0)}
                    </Avatar>
                  </IconButton>
                )}

                <StyledUserMenu
                  id='menu-appbar'
                  anchorEl={anchorUserEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  open={Boolean(anchorUserEl)}
                  onClose={handleUserClose}
                >
                  <UserPopup
                    user={profile}
                    auth={auth}
                    accountManagementUrl={accountManagementUrl}
                  />
                </StyledUserMenu>
              </RightContainer>
            </StyledToolbar>
          </StyledAppBar>

          {children !== undefined ? (
            children
          ) : (
            <SideMenu
              visibility={sideMenuIsOpen}
              top={'64px'}
              setVisibility={handleToggleSideMenu}
              links={sideMenuLinks}
            />
          )}
        </ParentNav>
      )}
    </>
  );
};
