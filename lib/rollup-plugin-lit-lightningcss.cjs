const lightningcss = require("lightningcss");
const path = require("path");

/**
 * Lightning CSS Rollup Plugin with Lit support
 * @returns {import('rollup').Plugin}
 */
module.exports = ({ prefix = "lightning-lit:" } = {}) => ({
  load(id) {
    if (id.startsWith(prefix)) {
      const { code } = lightningcss.bundle({
        drafts: {
          customMedia: true,
          nesting: true,
        },
        filename: id.slice(prefix.length),
        minify: true,
      });
      return `
      import {css} from 'lit';
      export default css\`${code}\`
      `;
    }
    return null;
  },
  name: "rollup-plugin-lit-lightningcss",
  resolveId(id, importer) {
    if (id.startsWith(prefix)) {
      const fileName = path.resolve(
        path.dirname(importer),
        id.slice(prefix.length)
      );
      return `${prefix}${fileName}`;
    }
    return null;
  },
});
