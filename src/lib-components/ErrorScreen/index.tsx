import notFound_404 from '../../assets/icons/notFound_404.svg';
import comingSoon_501 from '../../assets/icons/comingSoon_501.svg';
import inactive_503 from '../../assets/icons/inactive_503.svg';
import maintenance_503 from '../../assets/icons/maintenance_503.svg';
import {
  NotFoundWrapper,
  ComingSoonWrapper,
  InactiveWrapper,
  MaintenanceWrapper,
  LargeText,
  ErrorImg
} from './style';

export enum httpErrors {
  NOTFOUND_404,
  COMINGSOON_501,
  INACTIVE_503,
  MAINTENANCE_503
}

export interface ErrorScreenProps {
  errorType: httpErrors;
}

function errorMapping(errorType: httpErrors) {
  switch (errorType) {
    case httpErrors.NOTFOUND_404:
      return <NotFound />;
    case httpErrors.COMINGSOON_501:
      return <ComingSoon />;
    case httpErrors.INACTIVE_503:
      return <Inactive />;
    case httpErrors.MAINTENANCE_503:
      return <Maintenance />;
  }
}

export const ErrorScreen = (props: ErrorScreenProps) => {
  const { errorType } = props;

  return <>{errorMapping(errorType)}</>;
};

const NotFound = () => {
  return (
    <NotFoundWrapper>
      <ErrorImg
        src={notFound_404}
        alt='Imagem indicando erro 404 - Página não encontrada'
      />
    </NotFoundWrapper>
  );
};

const ComingSoon = () => {
  return (
    <ComingSoonWrapper>
      <LargeText>
        Você tentou acessar uma página <br /> ainda em construção.
      </LargeText>
      <ErrorImg src={comingSoon_501} alt='Imagem indicando erro 501' />
    </ComingSoonWrapper>
  );
};

const Inactive = () => {
  return (
    <InactiveWrapper>
      <LargeText>
        A página que você tentou acessar <br /> está temporáriamente
        inacessível.
      </LargeText>
      <ErrorImg src={inactive_503} alt='Imagem indicando erro 503 - Inativo' />
    </InactiveWrapper>
  );
};

const Maintenance = () => {
  return (
    <MaintenanceWrapper>
      <LargeText>
        A página que você tentou acessar <br /> está em manutenção.
      </LargeText>
      <ErrorImg src={maintenance_503} alt='Imagem indicando erro 503 - Manutenção' />
    </MaintenanceWrapper>
  );
};
