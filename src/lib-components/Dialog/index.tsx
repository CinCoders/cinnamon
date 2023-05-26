import {
  useTheme,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  ScopedCssBaseline
} from '@mui/material';

import { StyledDialog, Title, HeaderBar } from './styles';

export interface DialogProps {
  type: 'information' | 'alert' | 'decision' | 'confirmation' | 'error';
  title: string;
  children: JSX.Element | string;
  visibility?: boolean;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptFunction?: () => void;
  rejectFunction?: () => void;
}

export const Dialog = ({
  type,
  title,
  children,
  visibility = false,
  setVisibility,
  acceptLabel = 'Ok',
  rejectLabel = 'Cancelar',
  acceptFunction,
  rejectFunction
}: DialogProps) => {
  const theme = useTheme();
  const color = {
    information: theme.palette.secondary.main,
    alert: theme.palette.warning.main,
    decision: theme.palette.info.dark,
    confirmation: theme.palette.success.main,
    error: theme.palette.error.main
  };

  function onHide() {
    setVisibility(!visibility);
  }

  const header = (
    <div>
      <HeaderBar color={color[type]} />
      <Title>{title}</Title>
    </div>
  );

  const dialogFooter =
    type === 'information' || type === 'alert' ? (
      <Button
        onClick={onHide}
        style={{ backgroundColor: color[type], color: '#ffffff' }}
      >
        {acceptLabel}
      </Button>
    ) : (
      <div>
        <Button onClick={rejectFunction} style={{ color: color[type] }}>
          {rejectLabel}
        </Button>

        <Button
          onClick={acceptFunction}
          style={{
            marginLeft: 10,
            backgroundColor: color[type],
            color: '#ffffff'
          }}
        >
          {acceptLabel}
        </Button>
      </div>
    );

  return (
    <div>
      <StyledDialog
        onClose={onHide}
        aria-labelledby='customized-dialog-title'
        open={visibility}
        sx={{ maxWidth: '100vw' }}
      >
        <ScopedCssBaseline>
          <DialogTitle id='customized-dialog-title'>{header}</DialogTitle>

          <DialogContent>{children}</DialogContent>

          <DialogActions>{dialogFooter}</DialogActions>
        </ScopedCssBaseline>
      </StyledDialog>
    </div>
  );
};
