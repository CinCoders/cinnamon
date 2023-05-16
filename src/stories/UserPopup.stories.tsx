import { UserPopup } from '../components/UserPopup';
import { User } from '@/interfaces';
import './storiesGlobals.css';

export default {
  title: 'Components/UserPopup',
  component: UserPopup
};

export const Default = () => {
  const testUser: User = {
    name: 'Usuário Teste',
    email: 'teste@gmail.com',
    positions: [
      {
        id: 1,
        name: 'Posição 1',
        roles: [
          {
            id: 1,
            name: 'Papel 1',
            description: 'Papel 1'
          },
          {
            id: 2,
            name: 'Papel 2',
            description: 'Papel 2'
          }
        ]
      },
      {
        id: 2,
        name: 'Posição 2',
        roles: [
          {
            id: 1,
            name: 'Papel 1',
            description: 'Papel 1'
          },
          {
            id: 2,
            name: 'Papel 2',
            description: 'Papel 2'
          }
        ]
      },
      {
        id: 3,
        name: 'Posição 3'
      }
    ]
  };
  return <UserPopup user={testUser} keycloak={undefined} />;
};
