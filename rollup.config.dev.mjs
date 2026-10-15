import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import autoprefixer from 'autoprefixer';
import postcss from 'rollup-plugin-postcss';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  input: 'src/app.tsx',
  output: {
    file: 'dev/script/index.umd.js',
    format: 'umd',
    name: 'pureReactCarousel',
    sourcemap: true,
  },
  plugins: [
    postcss({
      extensions: ['.css', '.scss'],
      extract: 'dev/style/style.css',
      modules: {
        generateScopedName: 'carousel__[local]___[hash:base64:5]',
      },
      plugins: [autoprefixer()],
    }),
    image(),
    resolve({
      extensions,
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions,
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
};
