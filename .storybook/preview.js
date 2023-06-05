export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  previewTabs: {
    'storybook/docs/panel': {
      hidden: true
    }
  },
  options: {
    method: 'configure',
    includeNames: true,
    order: ['Cinnamon', ['*']]
  }
};
