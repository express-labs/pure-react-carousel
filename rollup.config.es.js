import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-js-harmony'; // ES6 minification is experimental as of 5/16/17

var pkg = require('./package.json');
var cache;

export default {
  entry: 'src/index.js',
  cache: cache,
  format: 'es',
  dest: 'dist/index.es.js',
  sourceMap: true,
  sourceMapFile: path.resolve('dist/main.es.js'),
  external: Object.keys(pkg.peerDependencies), // exclude peerDependencies from our bundle
  plugins: [
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    postcss({
      extensions: ['.css']
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
    commonjs(),
    eslint({
      exclude: [
        'src/styles/**'
      ]
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    replace({
      include: 'src/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    (process.env.NODE_ENV === 'production' && uglify({}, minify))
  ],
}
