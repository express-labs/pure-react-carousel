import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import livereload from 'rollup-plugin-livereload';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';

var pkg = require('./package.json');
var cache;

export default {
  entry: 'src/app.js',
  cache: cache,
  format: 'umd',
  moduleName: 'reactCarousel',
  dest: 'dev/script/index.umd.js',
  sourceMap: true,
  sourceMapFile: path.resolve('dev/main.umd.js'),
  external: Object.keys(pkg.peerDependencies), // exclude peerDependencies from our bundle
  plugins: [
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
      exclude: [
        'node_modules/**',
      ],
    }),
    serve({
      open: true,
      verbose: true,
      contentBase: ['dev'],
      historyApiFallback: false,
      host: 'localhost',
      port: 10001,
    }),
    livereload()
  ],
}
