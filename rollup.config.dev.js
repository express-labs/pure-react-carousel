import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
// import { eslint } from 'rollup-plugin-eslint';
import livereload from 'rollup-plugin-livereload';
import omit from 'object.omit';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';

// postcss plugins
import simplevars from 'postcss-simple-vars';
import postcssPresetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';
import postcssImport from 'postcss-import';
// import postcssModules from 'postcss-modules';

var pkg = require('./package.json');
var cache;

// const cssExportMap = {};

export default {
  input: 'src/app.js',
  cache: cache,
  output: {
    name: 'pureReactCarousel',
    file: 'dev/script/index.umd.js',
    format: 'umd',
    sourcemap: true,
    sourcemapFile: path.resolve('dev/main.umd.js'),
  },
  // exclude peerDependencies from our bundle, except for react, react-dom, prop-types when dev'ing
  external: Object.keys(omit(pkg.peerDependencies, [
    'react',
    'react-dom'
  ])),
  plugins: [
    postcss({
      modules: true,
      sourceMap: 'inline', // true, "inline" or false
      extract: 'dev/style.css',
      // plugins: [
      //   postcssImport(),
      //   simplevars(),
      //   postcssPresetEnv({ stage: 3 }),
      //   // cssnano(),
      // ],
      // getExport (id) {
      //   return cssExportMap[id];
      // },
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
    // eslint({
    //   exclude: [
    //     '**/*.css',
    //     'node_modules/**'
    //   ]
    // }),
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
