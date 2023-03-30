const lightningcss = require("lightningcss");
const path = require("path");
const fs = require("fs/promises");
const nodeCrypto = require("crypto");

const getPaths = (filename, code, hashLength) => {
  const hash = new nodeCrypto.Hash("sha256").update(code)
    .digest("hex");
  const cssFilename = `${path.parse(filename).name}-${hash.slice(
    0,
    hashLength
  )}.css`;
  const cssUrl = `/assets/css/${cssFilename}`;
  const cssPath = path.join("_site", cssUrl);
  const mapUrl = `/assets/css/${cssFilename}.map`;
  const mapPath = path.join("_site", mapUrl);
  const outputDir = path.dirname(cssPath);
  return {
    cssPath,
    cssUrl,
    mapPath,
    mapUrl,
    outputDir,
  };
};

const bundleCss = async ({
  filename,
  hashLength,
  lightningcssOptions,
  support,
}) => {
  const { code, map } = lightningcss.bundle({
    filename,
    targets: lightningcss.browserslistToTargets(support),
    ...lightningcssOptions,
  });
  const { cssUrl, cssPath, mapUrl, mapPath, outputDir } = getPaths(
    filename,
    code,
    hashLength
  );
  await fs.mkdir(outputDir, { recursive: true });
  if (map) {
    await fs.writeFile(mapPath, map);
  }
  await fs.writeFile(
    cssPath,
    map ? `${code.toString()}/*# sourceMappingURL=${mapUrl}*/` : code
  );
  return {
    cssUrl,
  };
};

module.exports = (
  eleventyConfig,
  { lightningcssOptions = {}, hashLength = 6, watch, support } = {}
) => {
  eleventyConfig.addWatchTarget(watch);
  eleventyConfig.addShortcode(
    "lightningcss",
    async (filename, media = "all") => {
      const { cssUrl } = await bundleCss({
        filename,
        hashLength,
        lightningcssOptions,
        support,
      });
      return `<link rel="stylesheet" href="${cssUrl}" media="${media}">`;
    }
  );
};
