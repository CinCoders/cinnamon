import styled from 'styled-components';

import AppBar from '@mui/material/AppBar';

import Toolbar from '@mui/material/Toolbar';

import Menu from '@mui/material/Menu';

import InputBase from '@mui/material/InputBase';

export const ParentNav = styled.div`
  display: inline;
`;

export const StyledAppBar = styled(AppBar)`
  min-width: max-content;
  width: 100%;
  top: 0;
  &.MuiAppBar-root {
    position: sticky;
    background-color: #ffffff;
  }
`;

export const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
`;

export const LeftContainer = styled.div`
  margin: 0px 0.75rem;
  margin-right: 0;
  display: flex;
  align-items: center;
`;

export const TitleContainer = styled.div`
  color: #2c2c2c;
  margin: 0 2rem;
  @media (min-width: 800px) {
    margin-right: auto;
  }
`;

export const SearchBarContainer = styled.div`
  justify-self: center;
  display: flex;

  margin: 0 2rem;
`;

export const Search = styled.div`
  position: 'relative';
  border-radius: 5px;
  margin-right: 2px;
  margin-left: 0;
  width: '100%';
`;

export const StyledInputBase = styled(InputBase)`
  border: none;
  height: 2.7rem;
  border-radius: 10px;
  padding-left: 2rem;
  padding-right: 12%;
  background-color: #f2f2f2;
  width: 25vw;
  max-width: 30rem;
`;

export const RightContainer = styled.div`
  margin: 0px 0.75rem;
  display: flex;
  align-items: center;
`;

export const SystemsButton = styled.div`
  border: none;
  background: transparent;

  width: 2.5rem;
  height: 2.5rem;

  cursor: pointer;

  filter: invert(18%) sepia(64%) saturate(3884%) hue-rotate(342deg)
    brightness(101%) contrast(98%);

  transition: all 0.5s;

  &.open {
    filter: invert(25%) sepia(69%) saturate(1960%) hue-rotate(342deg)
      brightness(92%) contrast(81%);
  }

  img {
    height: 100%;
    width: 100%;
  }
`;

export const Logo = styled.img`
  max-width: 120px;
  min-width: 60px;
  width: 100%;
  align-items: flex-start;

  margin: 0 0.75rem;
`;

export const StyledUserMenu = styled(Menu)`
  margin-top: 40px;

  .MuiPaper-rounded {
    border-radius: 10px;
  }

  .MuiMenu-paper {
    max-height: 100%;
  }

  .MuiList-padding {
    padding-top: 0px;
    padding-bottom: 0px;
  }
`;

export const StyledSystemMenu = styled(Menu)`
  margin-top: 40px;
  margin-right: 100px;

  .MuiPaper-rounded {
    border-radius: 10px;
  }

  .MuiMenu-paper {
    max-height: 100%;
  }

  .MuiList-padding {
    padding-top: 0px;
    padding-bottom: 0px;
  }
`;
