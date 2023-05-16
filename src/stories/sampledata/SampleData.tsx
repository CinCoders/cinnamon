import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import School from '@mui/icons-material/School';
import FactCheck from '@mui/icons-material/FactCheck';
import HowToReg from '@mui/icons-material/HowToReg';
import Print from '@mui/icons-material/Print';
import AccountBalance from '@mui/icons-material/AccountBalance';
import { SideMenuLink, System, User } from '@/interfaces';

export const testLinks: SideMenuLink[] = [
  {
    title: 'Home',
    href: '#',
    IconComponent: () => <HomeIcon />
  },
  {
    title: 'Contact',
    href: '#',
    IconComponent: () => <DescriptionIcon />,
    children: [
      {
        title: 'Register/Edit',
        href: '#'
      },
      {
        title: 'List',
        href: '#'
      }
    ]
  }
];

export const testUser: User = {
  name: 'Test User',
  email: 'test@gmail.com',
  positions: [
    {
      id: 1,
      name: 'Position 1',
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
      name: 'Position 2',
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

export const testSystems: System[] = [
  {
    title: 'Dashboard',
    IconComponent: () => <DashboardIcon fontSize='large' htmlColor='#DB1E2F' />,
    description: 'Sistema de gerenciamento de processos do SIPAC',
    href: '#'
  },
  {
    title: 'Gestão de Usuários',
    IconComponent: () => (
      <ManageAccountsIcon fontSize='large' htmlColor='#DB1E2F' />
    ),
    description: 'Sistema de gerenciamento de usuários',
    href: '#'
  },
  {
    title: 'Gestão de Recursos Humanos',
    IconComponent: () => (
      <RecentActorsIcon fontSize='large' htmlColor='#DB1E2F' />
    ),
    description: 'Sistema para gestão de recursos humanos',
    href: '#'
  },
  {
    title: 'Allocation',
    IconComponent: () => <EventIcon fontSize='large' htmlColor='#DB1E2F' />,
    description: 'Sistema para alocação e planejamento de disciplinas',
    href: '#'
  },
  {
    title: 'Seleção Pós-Graduação',
    IconComponent: () => <HowToReg fontSize='large' htmlColor='#DB1E2F' />,
    description: 'Sistema de seleção para pós-graduação',
    href: '#'
  },
  {
    title: 'Análise de Entradas',
    IconComponent: () => (
      <PersonSearchIcon fontSize='large' htmlColor='#DB1E2F' />
    ),
    description: 'Sistema de análise de entradas com crachá',
    href: '#'
  },
  {
    title: 'FrequenCIn',
    IconComponent: () => <FactCheck fontSize='large' htmlColor='#DB1E2F' />,
    description: 'Sistema para realizar a frequência dos alunos',
    href: '#'
  },
  {
    title: 'Prints',
    IconComponent: () => <Print fontSize='large' htmlColor='#DB1E2F' />,
    description: 'Sistema para consulta de saldo e logs de impressão',
    href: '#'
  },
  {
    title: 'Sistema de Pesquisa',
    IconComponent: () => (
      <AccountBalance fontSize='large' htmlColor='#DB1E2F' />
    ),
    description:
      'Sistema para levantamento e análise de indicadores de pesquisa.',
    href: '#'
  },
  {
    title: 'SGA',
    IconComponent: () => <School fontSize='large' htmlColor='#DB1E2F' />,
    description:
      'Sistema para levantamento e análise de dados de demanda de seleção.',
    href: '#'
  }
];

export function searchFunction(searchString: string) {
  console.log(searchString);
}

export const testInputLabels = ['Nome', 'CPF', 'Login'];
