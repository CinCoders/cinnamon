import styled from 'styled-components';
import { Drawer } from '@mui/material';
import { Link } from 'react-router-dom';
import { SideMenuProps } from '.';

export const StyledDrawer = styled(Drawer).attrs(
  (props: SideMenuProps) => props.top
)`
  margin-top: ${(props) => props.top};
  .MuiDrawer-paper {
    margin-top: ${(props) => props.top};
    max-height: calc(100vh - ${(props) => props.top});
  }

  .MuiBackdrop-root {
    margin-top: ${(props) => props.top};
  }

  .MuiPaper-root {
    background-color: #272727;
    min-width: auto;
    overflow: clip;
  }
`;

export const ListWrapper = styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
  padding: 0px;
  padding-right: 2px;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 0.5em;
    align: center;
    margin: 3px;
    background: rgb(80, 80, 80);
  }
  &::-webkit-scrollbar-track {
    boxshadow: inset 0 0 6px rgba(0, 0, 0, 0.9);
    webkitboxshadow: inset 0 0 6px rgba(0, 0, 0, 0.9);
    scrollbar-color: white;
  }
  &::-webkit-scrollbar-thumb {
    outline: 1px solid #444;
    border-radius: 10px;
    border: 3px solid rgb(50, 50, 50);
    scrollbar-color: white;
    background: rgb(50, 50, 50);
    align: center;
    margin: 3px;
  }
  &::-webkit-scrollbar-button {
  }
`;

export const SameTabLink = styled(Link)`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: #ffffff;
  text-transform: none;
  text-decoration: none;
  min-width: 100%;
`;

export const NewTabLink = styled.a`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: #ffffff;
  text-transform: none;
  text-decoration: none;
  min-width: 100%;
`;
