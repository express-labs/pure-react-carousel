// This script corrects the path for sourceMappingURL.  PostCSS spits out the wrong name.
// This script is run automatically when you do `npm run build`. To run this script manually,
// do `node postbuild.js`
import { replaceInFile } from 'replace-in-file';
import escapeStringRegexp from 'escape-string-regexp';
const baseDir = process.cwd();


replaceInFile({
  files: [
    'dist/dist/react-carousel.cjs.css',
    'dist/dist/react-carousel.es.css',
    'dist/dist/react-carousel.cjs.css.map',
    'dist/dist/react-carousel.es.css.map',
  ],
  from: [
    /sourceMappingURL=index\.cjs\.css\.map/g, 
    /sourceMappingURL=index\.es\.css\.map/g,
    new RegExp(escapeStringRegexp(baseDir),'g'),
    new RegExp(escapeStringRegexp(baseDir),'g'),
  ],
  to: [
    'sourceMappingURL=react-carousel.cjs.css.map',
    'sourceMappingURL=react-carousel.es.css.map',
    '..',
    '..',
  ],
});
