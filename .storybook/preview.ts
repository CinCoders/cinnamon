import '../src/styles/globals.css'

import type { Preview } from '@storybook/react-vite'

const preview: Preview = {
  tags: ["autodocs"],

  globalTypes: {
    theme: {
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const isDark = context.globals.theme === "dark";
      
      document.documentElement.classList.toggle("darl", isDark);
      document.body.classList.toggle("dark", isDark);
      
      // const root = document.documentElement;
      // root.classList.toggle("dark", isDark);

      return Story();
    },
  ],
};

export default preview;