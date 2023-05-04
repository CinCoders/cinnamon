import { Hamburger, HambBottom, HambMiddle, HambTop } from './styles';
import { SideMenuLink } from '@/interfaces';

interface HamburgerButtonProps {
  links: SideMenuLink[];
  isOpen?: boolean;
  onClick?: () => void;
}

export const HamburgerButton = ({
  links = [],
  isOpen = false,
  onClick = () => {}
}: HamburgerButtonProps) => {
  if (links.length === 0){
    return(
      <>
      </>
    )
  }

  return (
    <Hamburger type='button' onClick={onClick} isOpen={isOpen}>
      <HambTop />
      <HambMiddle />
      <HambBottom />
    </Hamburger>
  );
};
