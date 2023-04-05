import { JSXElementConstructor } from 'react';

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface Position {
  id: number;
  name: string;
  roles?: Role[];
}

export interface User {
  name: string;
  email: string;
  profilePictureUrl?: string;
  positions?: Position[];
}

export interface System {
  title: string;
  iconUrl?: string;
  IconComponent?: JSXElementConstructor<any>;
  description: string;
  href: string;
}

export interface link {
  iconUrl?: string;
  IconComponent?: JSXElementConstructor<any>;
  title: string;
  href?: string;
  external?: boolean;
}

export interface SideMenuLink extends link {
  children?: link[];
}

export interface Option {
  value: string;
  text: string;
}
