import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { eslint } from 'rollup-plugin-eslint';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify-es';

var pkg = require('./package.json');
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
      module: true,
      jsnext: true,
      main: true,
      browser: true,
      extensions: ['.js', '.jsx'],
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    commonjs(),
    eslint({
      exclude: [
        '**/*.css',
        '**/*.scss',
        'node_modules/**'
      ]
    }),
    babel({
      exclude: [
        'node_modules/**'
      ],
    }),
    replace({
      include: 'src/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'production')
    }),
    (process.env.NODE_ENV === 'production' && uglify())
  ],
}
