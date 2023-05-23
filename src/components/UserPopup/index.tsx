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
import Keycloak from 'keycloak-js';

interface UserPopupProps {
  user?: User;
  logoutMethod?(): void;
  keycloak?: Keycloak;
  id?: string;
  accountManagementUrl?: string;
}

export const UserPopup = (props: UserPopupProps) => {
  const {
    user = { name: 'User Display Name', email: 'user@example.com' },
    logoutMethod,
    keycloak,
    id,
    accountManagementUrl
  } = props;


  }function logoutFunction() {
   keycloak && (logoutMethod ? logoutMethod() : keycloak.logout())

  return (
    <ScopedCssBaseline>
      <UserPopUp id={id}>
        <UserPopUpContainer>
          <StyledAvatar alt={user.name[0]}>
            {user.name[0].charAt(0)}
          </StyledAvatar>
          <UserName>{user.name}</UserName>
          <EmailContainer>
            <IconGreen />
            <p>{user.email}</p>
          </EmailContainer>
          <ManageAccount href={`${accountManagementUrl}`}>
            Gerenciar sua conta
          </ManageAccount>

          {user.positions !== undefined && user.positions.length > 0 && (
            <PositionsContainer>
              {user.positions.map((position, position_index) => (
                <div key={`position_${position_index}`}>
                  {position.roles !== undefined && position.roles.length > 0 ? (
                    <>
                      <StyledAccordion key={`position_${position_index}`}>
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
                      <StyledAccordion disabled key={`position_${position_index}`}>
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
