// This script corrects the path for sourceMappingURL.  PostCSS spits out the wrong name.
// This script is run automatically when you do `npm run build`. To run this script manually,
// do `node postbuild.js`
var replace = require('replace-in-file');
var escape = require('escape-string-regexp');
const baseDir = process.cwd();


replace({
  files: [
    'dist/react-carousel.cjs.css',
    'dist/react-carousel.es.css',
    'dist/react-carousel.cjs.css.map',
    'dist/react-carousel.es.css.map',
  ],
  from: [
    /sourceMappingURL=index\.cjs\.css\.map/g, 
    /sourceMappingURL=index\.es\.css\.map/g,
    new RegExp(escape(baseDir),'g'),
    new RegExp(escape(baseDir),'g'),
  ],
  to: [
    'sourceMappingURL=react-carousel.cjs.css.map',
    'sourceMappingURL=react-carousel.es.css.map',
    '..',
    '..',
  ],
});
