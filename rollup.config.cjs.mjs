import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcss from 'postcss';
import postcssModules from 'postcss-modules';
import * as sass from 'sass';
import { minify } from 'terser';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

function createCssModulesPlugin(extractFileName) {
  const styles = new Map();

  return {
    name: 'scss-css-modules',
    async transform(_code, id) {
      if (!id.endsWith('.scss') && !id.endsWith('.css')) {
        return null;
      }

      const compiled = sass.compile(id);
      let tokens = {};

      const result = await postcss([
        postcssModules({
          generateScopedName: '[local]___[hash:base64:5]',
          getJSON(_cssFileName, json) {
            tokens = json;
          },
        }),
        autoprefixer(),
        cssnano(),
      ]).process(compiled.css, { from: id });

      styles.set(id, result.css);

      return {
        code: `export default ${JSON.stringify(tokens)};`,
        map: { mappings: '' },
      };
    },
    generateBundle() {
      const combinedCss = Array.from(styles.values()).join('');
      this.emitFile({
        type: 'asset',
        fileName: extractFileName,
        source: combinedCss,
      });
    },
  };
}

function createTerserPlugin() {
  return {
    name: 'terser-minify',
    async renderChunk(code, _chunk, outputOptions) {
      const result = await minify(code, {
        module: outputOptions.format === 'es',
        toplevel: outputOptions.format === 'cjs',
        compress: {
          directives: false,
        },
        sourceMap: true,
      });
      return {
        code: result.code ?? code,
        map: result.map ?? null,
      };
    },
  };
}

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.cjs.js',
    format: 'cjs',
    sourcemap: true,
    exports: 'named',
    banner: '"use client";',
  },
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  plugins: [
    createCssModulesPlugin('react-carousel.cjs.css'),
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
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    createTerserPlugin(),
  ],
};
