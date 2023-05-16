import { useState } from 'react';
import { SideMenu } from '../components/SideMenu';
import { SideMenuLink } from '@/interfaces';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import { BrowserRouter } from 'react-router-dom';

export default {
  title: 'Components/SideMenu',
  component: SideMenu
};

export const Default = () => {
  const testLinks: SideMenuLink[] = [
    {
      title: 'Tela Inicial',
      href: '#',
      IconComponent: () => <HomeIcon />
    },
    {
      title: 'Processos',
      href: '#',
      IconComponent: () => <DescriptionIcon />,
      children: [
        {
          title: 'Cadastrar/Editar',
          href: '#'
        },
        {
          title: 'Listar',
          href: '#'
        }
      ]
    },
    {
      title: 'Tipos',
      href: '#',
      IconComponent: () => <DescriptionIcon />,
      children: [
        {
          title: 'Cadastrar/Editar',
          href: '#'
        },
        {
          title: 'Listar',
          href: '#'
        }
      ]
    }
  ];

  const [drawerVisibility, setDrawerVisibility] = useState(true);

  return (
    <div style={{ margin: '10px' }}>
      <BrowserRouter>
        <SideMenu
          visibility={drawerVisibility}
          setVisibility={setDrawerVisibility}
          links={testLinks}
        />
      </BrowserRouter>
    </div>
  );
};
