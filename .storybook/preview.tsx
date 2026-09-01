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

      document.documentElement.classList.toggle("dark", isDark);
      //document.body.classList.toggle("dark", isDark);

      // const root = document.documentElement;
      // root.classList.toggle("dark", isDark);

      return (
        <div className="min-h-screen bg-background text-foreground">
          <Story />
        </div>
      );
    },
  ],
};

export default preview;