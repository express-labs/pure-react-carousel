module.exports = {
  sourcemap: 'hidden',
  parser: 'postcss-scss',
  plugins: [
    require('postcss-preset-env')({
      browsers: [
        'last 2 version',
        '>1%',
        'not op_mini all',
        'not ie 6-11',
        'not ie_mob > 0',
        'not kaios>=2.5',
        'not op_mob>=1',
        'not bb > 0',
        'not baidu > 0',
        'not dead',
      ],
    }),
  ],
};
