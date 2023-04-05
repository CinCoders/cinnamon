import styled from 'styled-components';
import { Accordion, AccordionDetails, Avatar } from '@mui/material';

import MuiButton from '@mui/material/Button';

export const UserPopUp = styled.div`
  background: #f8f8f8;
  border-radius: 12px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  width: 18rem;
  max-height: 80vh;

  overflow-x: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar-thumb {
    background: #dadce0;
    border: 0px none #ffffff;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #545454;
  }
  &::-webkit-scrollbar-thumb:active {
    background: #545454;
  }

  &::-webkit-scrollbar {
    width: 5px;
    height: 7px;
  }
  &::-webkit-scrollbar-button {
    width: 0px;
    height: 0px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border: 0px none #ffffff;
    border-radius: 50px;
  }
  &::-webkit-scrollbar-track:hover {
    background: transparent;
  }

  &::-webkit-scrollbar-track:active {
    background: transparent;
  }

  &::-webkit-scrollbar-corner {
    background: transparent;
  }
`;

export const UserPopUpContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export const UserName = styled.h2`
  font-size: 1rem;
  text-align: center;
  margin-bottom: 0.5rem;
  margin-bottom: 1px;
  margin-right: 5px;
  margin-left: 5px;
  overflow-wrap: break-word;
`;

export const EmailContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

export const IconGreen = styled.div`
  height: 0.625rem;
  width: 0.625rem;
  border-radius: 50%;
  margin-right: 0.75rem;
  background: #5cb85c;
`;

export const StyledAvatar = styled(Avatar)`
  margin: 1rem 0;
  &.MuiAvatar-circular{
    height: 7rem;
    width: 7rem;
  }
  font-size: 50px;
  background-size: cover;
  background-clip: border-box;
  background-position: center center;
  background-color: #db1e2f;
`;

export const ManageAccount = styled.a`
  color: #000000;

  background: transparent;
  border: 1px solid #e6e6e6;

  width: 10rem;
  height: 2rem;
  border-radius: 2rem;

  font-size: 0.8rem;

  margin-bottom: 1rem;
  text-decoration: none;

  transition: 0.3s;

  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    background: #e6e6e6;
  }
`;

export const PositionsContainer = styled.div`
  width: 100%;
  margin-bottom: 1rem;
`;

export const StyledAccordion = styled(Accordion)`
  &.MuiAccordion-root{
    background-color: #f8f8f8;
    box-shadow: none;
  }
`;

export const LogoutButton = styled(MuiButton)`
  color: #000000;
  text-transform: none;

  background: transparent;
  border: 1px solid #e6e6e6;

  width: 10rem;
  height: 2rem;
  border-radius: 2rem;

  font-size: 0.8rem;

  margin-bottom: 1rem;
  text-decoration: none;

  transition: 0.3s;

  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    background: #e6e6e6;
  }
`;

export const StyledAccordionDetails = styled(AccordionDetails)`
  &.MuiAccordionDetails-root{
    padding: 0px;
    display: block;
  }
`;

export const RolesContainer = styled.div`
  background: #f8f8f8;
  table {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-flow: row;

    thead,
    tbody,
    tr {
      display: contents;
    }

    th,
    td {
      font-size: 0.875rem;

      padding: 0 1rem;

      text-align: left;
    }

    th {
      margin: 1rem 0 0.3rem;
    }

    td {
      width: 100%;

      margin-bottom: 1rem;
    }
  }
`;
