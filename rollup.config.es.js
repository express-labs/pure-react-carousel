import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
// import { eslint } from 'rollup-plugin-eslint';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

import pkg from './package.json' with { type: 'json' };
var cache;

export default {
  input: 'src/index.js',
  cache: cache,
  output: {
    file: 'dist/index.es.js',
    format: 'es',
    sourcemap: true,
    sourcemapFile: path.resolve('dist/main.es.js'),
  },
  // exclude peerDependencies from our bundle
  external: Object.keys(pkg.peerDependencies),
  plugins: [
    postcss({
      extensions: ['.css', '.scss'],
      extract: 'dist/react-carousel.es.css',
      minimize: true,
      modules: {
        // customize the name of the css classes that are created
        generateScopedName: '[local]___[hash:base64:5]',
      },
      sourceMap: true,
    }),
    resolve({
      browser: true,
      moduleDirectories: ['node_modules'],
      extensions: ['.js', '.jsx'],
      preferBuiltins: false
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production'), preventAssignment: true }),
    commonjs(),
    // eslint({
    //   exclude: [
    //     '**/*.css',
    //     '**/*.scss',
    //     'node_modules/**'
    //   ]
    // }),
    babel({
      exclude: [
        'node_modules/**'
      ],
      babelHelpers: 'bundled'
    }),
    replace({
      include: 'src/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
      preventAssignment: true
    }),
    (process.env.NODE_ENV === 'production' && terser())
  ],
}
