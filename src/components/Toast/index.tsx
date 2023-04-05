import {
  ToastContainer as ToastifyContainer,
  ToastContainerProps as ToastProps,
  toast as toastify,
  ToastContent,
  ToastOptions,
  Id
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastDiv } from './style';

interface ToastContainerProps {
  toastProps: ToastProps;
  topInitialPosition: number;
}

export const toast: {
  loading: <TData = unknown>(
    content: ToastContent<TData>,
    options?: ToastOptions<{}> | undefined
  ) => Id;
  success: <TData = unknown>(
    content: ToastContent<TData>,
    options?: ToastOptions<{}> | undefined
  ) => Id;
  info: <TData = unknown>(
    content: ToastContent<TData>,
    options?: ToastOptions<{}> | undefined
  ) => Id;
  error: <TData = unknown>(
    content: ToastContent<TData>,
    options?: ToastOptions<{}> | undefined
  ) => Id;
} = toastify;

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
