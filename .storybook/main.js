const path = require('path');
module.exports = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader'],
      include: path.resolve(__dirname, '../')
    });
    config.optimization = {
      splitChunks: {
        chunks: 'async',
        minSize: 10000,
        maxSize: 250000
      }
    };
    config.performance = {
      hints: false
    };
    return config;
  },
  docs: {
    inlineStories: true,
    autodocs: true
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  }
};
