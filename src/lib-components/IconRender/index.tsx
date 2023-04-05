import { JSXElementConstructor } from 'react';

export interface IconRendererProps {
  iconUrl?: string;
  alt?: string;
  IconComponent?: JSXElementConstructor<any>;
}

export function IconRenderer({
  iconUrl,
  alt,
  IconComponent
}: IconRendererProps) {
  return (
    <div style={{ color: 'white', justifyContent: 'center' }}>
      {iconUrl && (
        <img
          style={{ width: '2.35rem', height: '2.35rem', marginLeft: '1.7rem' }}
          src={iconUrl}
          alt={`${alt} icon`}
        />
      )}
      {IconComponent && <IconComponent />}
    </div>
  );
}
