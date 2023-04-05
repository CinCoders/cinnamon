import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import url from '@rollup/plugin-url';

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
      typescript({
        useTsconfigDeclarationDir: true
      }),
      postcss(),
      terser()
    ]
  }
];
