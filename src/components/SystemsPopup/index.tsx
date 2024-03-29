import { System } from '../../interfaces';

import { ScopedCssBaseline } from '@mui/material';

import Tooltip from '@mui/material/Tooltip';
import {
  SystemsPopupContainer,
  SystemsPopupContent,
  SystemItem,
  SystemTitle
} from './styles';

import { IconRenderer } from '../../lib-components/IconRender';

export interface SystemsPopupProps {
  systemsList?: System[];
}

export const SystemsPopup = ({ systemsList = [] }: SystemsPopupProps) => {
  return (
    <ScopedCssBaseline>
      <SystemsPopupContainer>
        <SystemsPopupContent>
          {systemsList.map((system) => {
            return (
              <SystemItem
                href={system.href}
                key={`system_${system.title}`}
                className='system-item'
              >
                <Tooltip title={system.description} arrow>
                  <>
                    <IconRenderer
                      iconUrl={system.iconUrl}
                      alt={system.title}
                      IconComponent={system.IconComponent}
                    />
                  </>
                </Tooltip>
                <SystemTitle>{system.title}</SystemTitle>
              </SystemItem>
            );
          })}
        </SystemsPopupContent>
      </SystemsPopupContainer>
    </ScopedCssBaseline>
  );
};
