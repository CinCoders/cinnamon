import { User } from '../../interfaces';
import {
  ScopedCssBaseline,
  AccordionSummary,
  Divider,
  Typography
} from '@mui/material/';

import {
  UserPopUp,
  UserPopUpContainer,
  UserName,
  EmailContainer,
  IconGreen,
  ManageAccount,
  PositionsContainer,
  StyledAccordion,
  StyledAccordionDetails,
  RolesContainer,
  StyledAvatar,
  LogoutButton
} from './styles';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AuthContextProps } from 'react-oidc-context';

export interface UserPopupProps {
  user?: User;
  logoutMethod?(): void;
  auth?: AuthContextProps;
  accountManagementUrl?: string;
}

export const UserPopup = (props: UserPopupProps) => {
  const {
    user = { name: 'User Display Name', email: 'user@example.com' },
    logoutMethod,
    auth,
    accountManagementUrl
  } = props;

  function logoutFunction() {
    logoutMethod ? logoutMethod() : auth?.signoutRedirect();
  }

  return (
    <ScopedCssBaseline>
      <UserPopUp>
    <UserPopUpContainer>
      <StyledAvatar alt={user.name[0] ?? user.username?.charAt(0)}>
        {(user.name[0] ?? user.username?.charAt(0)) ?? ''}
      </StyledAvatar>
      <UserName>{user.name ?? user.username ?? 'User Display Name'}</UserName>
      <EmailContainer>
        <IconGreen />
        <p>{user.email}</p>
      </EmailContainer>
          <ManageAccount href={`${accountManagementUrl}`}>
            Gerenciar sua conta
          </ManageAccount>

          {user.positions !== undefined && user.positions.length > 0 && (
            <PositionsContainer>
              {user.positions.map((position) => (
                <div key={`position_${position.id}`}>
                  {position.roles !== undefined && position.roles.length > 0 ? (
                    <>
                      <StyledAccordion key={`positions_${position.id}`}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls='panel1a-content'
                          id='panel1a-header'
                        >
                          <Typography>{position.name}</Typography>
                        </AccordionSummary>
                        <StyledAccordionDetails>
                          <RolesContainer>
                            <table>
                              <thead>
                                <tr>
                                  <th>Função</th>
                                  <th>Descrição</th>
                                </tr>
                              </thead>
                              <tbody>
                                {position.roles.map((role) => (
                                  <tr key={role.id}>
                                    <td>{role.name}</td>
                                    <td>{role.description}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </RolesContainer>
                        </StyledAccordionDetails>
                      </StyledAccordion>
                      <Divider />
                    </>
                  ) : (
                    <>
                      <StyledAccordion
                        disabled
                        key={`positions_${position.id}`}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls='panel3a-content'
                          id='panel3a-header'
                        >
                          <Typography>{position.name}</Typography>
                        </AccordionSummary>
                      </StyledAccordion>
                      <Divider />
                    </>
                  )}
                </div>
              ))}
            </PositionsContainer>
          )}
          <LogoutButton
            variant='text'
            type='button'
            onClick={() => {
              logoutFunction();
            }}
          >
            Sair
          </LogoutButton>
        </UserPopUpContainer>
      </UserPopUp>
    </ScopedCssBaseline>
  );
};
