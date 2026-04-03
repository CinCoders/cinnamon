import { create } from "storybook/theming";

import CInCodersImg from "../src/assets/icons/cincodersh.svg";

const cinCodersTheme = create({
  base: "light",
  brandTitle: "CInCoders",
  brandUrl: "https://github.com/CinCoders/",
  brandImage: CInCodersImg,
  brandTarget: "_self",
  colorPrimary: "#3a10e5",
  colorSecondary: "#585c6d",
  appBg: "#f6f9fc",
  appContentBg: "#ffffff",
  appBorderRadius: 4,
  textColor: "#10162f",
  textInverseColor: "#ffffff",
  barTextColor: "#9e9e9e",
  barSelectedColor: "#585c6d",
  barBg: "#ffffff",
  inputBg: "#ffffff",
  inputBorderRadius: 2,
});

export default cinCodersTheme;
