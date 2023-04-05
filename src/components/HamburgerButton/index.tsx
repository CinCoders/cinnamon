import { Hamburger, HambBottom, HambMiddle, HambTop } from './styles';

interface HamburgerButtonProps {
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
