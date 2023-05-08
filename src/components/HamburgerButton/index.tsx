import { Hamburger, HambBottom, HambMiddle, HambTop } from './styles';
import { SideMenuLink } from '@/interfaces';

interface HamburgerButtonProps {
  links: SideMenuLink[];
  isOpen?: boolean;
  onClick?: () => void;
}

export const HamburgerButton = ({
  isOpen = false,
  onClick = () => {}
}: HamburgerButtonProps) => {

  return (
    <Hamburger type='button' onClick={onClick} isOpen={isOpen}>
      <HambTop />
      <HambMiddle />
      <HambBottom />
    </Hamburger>
  );
};
