import { UserPopup } from '../components/UserPopup';
import { User } from '@/interfaces';
import './storiesGlobals.css';

export default {
  title: 'Components/UserPopup',
  component: UserPopup
};

export const Default = () => {
  const testUser: User = {
    name: 'User Test',
    email: 'test@gmail.com',
    positions: [
      {
        id: 1,
        name: 'Position 1',
        roles: [
          {
            id: 1,
            name: 'Role 1',
            description: 'Role 1'
          },
          {
            id: 2,
            name: 'Role 2',
            description: 'Role 2'
          }
        ]
      },
      {
        id: 2,
        name: 'Position 2',
        roles: [
          {
            id: 1,
            name: 'Role 1',
            description: 'Role 1'
          },
          {
            id: 2,
            name: 'Role 2',
            description: 'Role 2'
          }
        ]
      },
      {
        id: 3,
        name: 'Position 3'
      }
    ]
  };
  return <UserPopup user={testUser} keycloak={undefined} />;
};
