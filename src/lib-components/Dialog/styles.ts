import styled from 'styled-components';

import { Dialog as DialogMui } from '@mui/material';

export const StyledDialog = styled(DialogMui)`
  //Componente estilizado criado para tirar o padding do dialog e permitir que a barrinha cole nas margens
  .MuiDialogTitle-root {
    padding: 0;
  }
`;

export const HeaderBar = styled.div`
  //Componente estilizado correspondente à barrinha com a cor do dialog
  width: 100%;
  height: 2rem;
  background-color: ${(props) => props.color};
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  margin-bottom: 1.5rem;
`;

export const Title = styled.h3`
  padding: 0 24px; //padding usado para alinhar o título com a descrição
`;
