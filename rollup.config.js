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

export default [
  {
    input: './src/index.ts',
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
