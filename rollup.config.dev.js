import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { eslint } from 'rollup-plugin-eslint';
import livereload from 'rollup-plugin-livereload';
import image from 'rollup-plugin-img';
import omit from 'object.omit';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';

var pkg = require('./package.json');
var cache;

export default {
  input: 'src/app.js',
  cache: cache,
  output: {
    file: 'dev/script/index.umd.js',
    format: 'umd',
    name: 'pureReactCarousel',
    sourcemap: true,
    sourcemapFile: path.resolve('dev/main.umd.js'),
  },
  // exclude peerDependencies from our bundle, except for react, react-dom, prop-types when dev'ing
  external: Object.keys(omit(pkg.peerDependencies, [
    'react',
    'react-dom'
  ])),
  plugins: [
    image({
      limit: 10000
    }),
    postcss({
      extensions: ['.css', '.scss'],
      extract: 'dev/style.css',
      minimize: true,
      modules: {
        // customize the name of the css classes that are created
        generateScopedName: '[local]___[hash:base64:5]',
      },
      sourceMap: 'inline', // true, "inline" or false
    }),
    resolve({
      browser: true,
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      },
      extensions: ['.js', '.jsx'],
      jsnext: true,
      main: true,
      module: true
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
    commonjs({
      include: [
        'node_modules/**'
      ],
      exclude: [
        'node_modules/process-es6/**'
      ],
      namedExports: {
        'node_modules/react/index.js': [
          'Children',
          'Component',
          'Fragment',
          'PureComponent',
          'createElement',
        ],
        'node_modules/react-dom/index.js': ['render'],
        'node_modules/react-redux/node_modules/react-is/index.js': ['isValidElementType'],
      }
    }),
    eslint({
      exclude: [
        '**/*.scss',
        '**/*.css',
        'node_modules/**'
      ]
    }),
    babel({
      exclude: [
        'node_modules/**',
        '__tests__/**',
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
