import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

// postcss plugins
import simplevars from 'postcss-simple-vars';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';
import postcssImport from 'postcss-import';
import postcssModules from 'postcss-modules';

var pkg = require('./package.json');
var cache;

const cssExportMap = {};

export default {
  input: 'src/index.js',
  cache: cache,
  output: {
    name: 'pureReactCarousel',
    format: 'cjs',
    sourcemap: true,
    sourcemapFile: path.resolve('dist/main.cjs.js'),
    file: 'dist/index.cjs.js',
  },
  // exclude peerDependencies from our bundle
  external: Object.keys(pkg.peerDependencies),
  plugins: [
    postcss({
      sourceMap: true,
      extract: 'dist/react-carousel.cjs.css',
      extensions: ['.css'],
      plugins: [
        postcssImport(),
        simplevars(),
        cssnext({
          warnForDuplicates: false,
        }),
        postcssModules({
          getJSON (id, exportTokens) {
            cssExportMap[id] = exportTokens;
          }
        }),
        cssnano(),
      ],
      getExport (id) {
        return cssExportMap[id];
      },
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
