import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import url from '@rollup/plugin-url';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

const packageJson = require('./package.json');

const globals = {
  react: 'React',
  'react-dom': 'reactDom',
  'react-router-dom': 'reactRouterDom',
  jquery: '$'
};

// MUI ships 'use client' directives for React Server Components. Rollup drops
// them when bundling and warns once per file, which buries every other warning
// under roughly 360 lines of noise. Nothing here can act on them, so they are
// dropped and everything else is still reported.
const onwarn = (warning, warn) => {
  if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
    return;
  }
  warn(warning);
};

export default [
  {
    input: './src/index.ts',
    onwarn,
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        exports: 'auto',
        name: 'Cinnamon',
        globals
      },
      {
        file: packageJson.module,
        format: 'esm',
        exports: 'named'
      },
      {
        file: packageJson.unpkg,
        format: 'iife',
        exports: 'auto',
        name: 'Cinnamon',
        globals
      }
    ],
    plugins: [
      external(),
      resolve(),
      url({
        include: ['**/*.otf', '**/*.svg', '**/*.jpg', '**/*.png'],
        limit: Infinity
      }),
      commonjs(),
      typescript({ sourceMap: false }),
      postcss(),
      terser()
    ]
  }
];
