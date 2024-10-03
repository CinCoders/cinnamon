import {
  ToastContainer as ToastifyContainer,
  ToastContainerProps as ToastProps,
  toast
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastDiv } from './style';

interface ToastContainerProps {
  toastProps: ToastProps;
  topInitialPosition: number;
}

export const ToastContainer = ({
  topInitialPosition,
  toastProps
}: ToastContainerProps) => {
  topInitialPosition = topInitialPosition + 16;

  return (
    <ToastDiv topSpacing={topInitialPosition}>
      <ToastifyContainer {...toastProps} />
    </ToastDiv>
  );
};

export { toast };
