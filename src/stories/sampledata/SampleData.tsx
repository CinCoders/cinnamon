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
  { id: 0, title: 'Home', href: '#', IconComponent: () => <HomeIcon /> },
  {
    id: 1,
    title: 'Contact',
    href: '#',
    IconComponent: () => <DescriptionIcon />,
    children: [
      { id: 2, title: 'Register/Edit', href: '#' },
      { id: 3, title: 'List', href: '#' }
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

export const testSystems: System[] = [
  {
    title: 'Dashboard',
    IconComponent: () => <DashboardIcon fontSize='large' htmlColor='#DB1E2F' />,
    description: 'SIPAC Process Management System',
    href: '#'
  },
  {
    title: 'User Management',
    IconComponent: () => (
      <ManageAccountsIcon fontSize='large' htmlColor='#DB1E2F' />
    ),
    description: 'User Management System',
    href: '#'
  },
  {
    title: 'Human Resources',
    IconComponent: () => (
      <RecentActorsIcon fontSize='large' htmlColor='#DB1E2F' />
    ),
    description: 'Human Resources Management System',
    href: '#'
  },
  {
    title: 'Allocation',
    IconComponent: () => <EventIcon fontSize='large' htmlColor='#DB1E2F' />,
    description: 'Course Scheduling and Planning System',
    href: '#'
  },
  {
    title: 'Graduate Selection',
    IconComponent: () => <HowToReg fontSize='large' htmlColor='#DB1E2F' />,
    description: 'Graduate Admissions System',
    href: '#'
  },
  {
    title: 'Input Analysis',
    IconComponent: () => (
      <PersonSearchIcon fontSize='large' htmlColor='#DB1E2F' />
    ),
    description: 'Badge-based Input Analysis System',
    href: '#'
  },
  {
    title: 'FrequenCIn',
    IconComponent: () => <FactCheck fontSize='large' htmlColor='#DB1E2F' />,
    description: 'Student Attendance System',
    href: '#'
  },
  {
    title: 'Prints',
    IconComponent: () => <Print fontSize='large' htmlColor='#DB1E2F' />,
    description: 'Balance and Print Log Inquiry System',
    href: '#'
  },
  {
    title: 'Research System',
    IconComponent: () => (
      <AccountBalance fontSize='large' htmlColor='#DB1E2F' />
    ),
    description: 'Research Indicators Survey and Analysis System',
    href: '#'
  },
  {
    title: 'SGA',
    IconComponent: () => <School fontSize='large' htmlColor='#DB1E2F' />,
    description: 'Selection Demand Data Survey and Analysis System.',
    href: '#'
  }
];

export function searchFunction(searchString: string) {
  console.log(searchString);
}

export const testInputLabels = ['Name', 'CPF (National ID)', 'Login'];
