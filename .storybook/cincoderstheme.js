import { create } from '@storybook/theming/create';
import CInCodersImg from '../src/assets/icons/cincodersh.svg';

export default create({
  base: 'light',
  // Typography
  brandTitle: 'CInCoders',
  brandUrl: 'https://github.com/CinCoders/',
  brandImage: CInCodersImg,
  brandTarget: '_self',

  //
  colorPrimary: '#3A10E5',
  colorSecondary: '#585C6D',

  // UI
  appBg: '#F6F9FC',
  appContentBg: '#ffffff',
  appBorderRadius: 4,

  // Text colors
  textColor: '#10162F',
  textInverseColor: '#ffffff',

  // Toolbar default and active colors
  barTextColor: '#9E9E9E',
  barSelectedColor: '#585C6D',
  barBg: '#ffffff',

  // Form colors
  inputBg: '#ffffff',
  inputBorderRadius: 2
});
