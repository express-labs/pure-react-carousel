// This script corrects the path for sourceMappingURL.  PostCSS spits out the wrong name.
// This script is run automatically when you do `npm run build`. To run this script manually,
// do `node postbuild.js`
var replace = require('replace-in-file');

replace({
  files: [
    'dist/react-carousel.cjs.css',
    'dist/react-carousel.es.css',
  ],
  from: [
    /sourceMappingURL=index\.cjs\.css\.map/g,
    /sourceMappingURL=index\.es\.css\.map/g,
  ],
  to: [
    'sourceMappingURL=react-carousel.cjs.css.map',
    'sourceMappingURL=react-carousel.es.css.map',
  ],
});
