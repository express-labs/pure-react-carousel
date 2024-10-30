const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = (env) => {
  console.log(env);
  console.log('Production: ', !!env.PRODUCTION);

  return {
    entry: './src/index.ts',
    mode: env.PRODUCTION ? 'production' : 'development',
    devtool: env.PRODUCTION ? 'source-map': 'eval-source-map',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'pure-react-carousel.js',
      globalObject: 'this',
      library: {
        name: 'pure-react-carousel',
        type: 'umd',
      },
    },
    externals: {
      react: 'react', // Case matters here
      'react-dom': 'reactDOM', // Case matters here
    },
    resolve: {
      extensions: ['.ts', '.tsx'],
    },
    plugins: [new MiniCssExtractPlugin()],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: [/node_modules/gi, /stories/gi],
        },
        {
          test: /\.scss$/,
          // include: [path.resolve(__dirname, '../src')],
          use: [
            {
              loader: env.PRODUCTION
                ? MiniCssExtractPlugin.loader
                : 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                modules: {
                  localIdentName: env.PRODUCTION
                    ? '[hash:base64:5]'
                    : '[name]__[local]__[hash:base64:5]',
                },
                importLoaders: 2,
              },
            },
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                api: 'modern-compiler',
              },
            },
          ],
        },
      ],
    },
    optimization: {
      usedExports: true,
      minimizer: [
        // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
        `...`,
        new CssMinimizerPlugin(),
      ],
    },
  };
};
