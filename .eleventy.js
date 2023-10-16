const yaml = require("js-yaml");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const Image = require("@11ty/eleventy-img");
const typescript = require("@rollup/plugin-typescript");
const { default: resolve } = require("@rollup/plugin-node-resolve");
const markdownItAttrs = require("markdown-it-attrs");
const markdownItEmoji = require("markdown-it-emoji");
const markdownItContainer = require("markdown-it-container");
const rollupPlugin = require("eleventy-plugin-rollup");
const rollupPluginLitLightningcss = require("./lib/rollup-plugin-lit-lightningcss.cjs");
const subsetFont = require("subset-font");
const fs = require("fs/promises");
const lightningcss = require("./lib/eleventy-plugin-lightningcss.cjs");
const pngToIco = require("png-to-ico");
const renderPdf = require("./lib/render-pdf.cjs");
const browserslist = require("browserslist");

function generateImages(src) {
  return Image(src, {
    formats: [
      "avif",
      "webp",
      src.toLowerCase().endsWith(".png") ? "png" : "jpeg",
    ],
    outputDir: "_site/img/",
    widths: [256, 512, 1024, null],
  });
}

function generateImageFormats(src) {
  return Image(src, {
    formats: [
      "avif",
      "webp",
      src.toLowerCase().endsWith(".png") ? "png" : "jpeg",
    ],
    outputDir: "_site/img/",
    widths: [null],
  });
}

async function imageShortcode(src, alt, sizes = []) {
  const metadata = await generateImages(src);

  const imageAttributes = {
    alt,
    decoding: "async",
    loading: "lazy",
    sizes,
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

async function generateFavicon(src) {
  const images = await Image(src, {
    formats: ["svg", "png", "webp", "avif"],
    outputDir: "_site/img/",
    widths: [64, 128, 180, 256, 512, 1024, 2048, null],
  });

  const buf = await pngToIco(
    images.png.slice(0, 1).map((png) => png.outputPath)
  );
  await fs.writeFile("_site/favicon.ico", buf);

  return images;
}

async function generateFaviconHTML(src) {
  const metadata = await generateFavicon(src);
  return `
    <link rel="icon" href="${metadata.svg[0].url}" type="image/svg+xml">
    <link rel="apple-touch-icon" href="${
      metadata.png.find((png) => png.width === 180).url
    }">
  `;
}

const registerPlugins = (eleventyConfig) => {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(rollupPlugin, {
    rollupOptions: {
      output: {
        dir: "_site/js",
        format: "es",
        sourcemap: process.env.NETLIFY !== "true",
      },
      plugins: [rollupPluginLitLightningcss(), typescript(), resolve()],
    },
    useAbsoluteScriptPaths: true,
  });
  eleventyConfig.addPlugin(lightningcss, {
    lightningcssOptions: {
      drafts: {
        nesting: true,
      },
      minify: true,
      sourceMap: true,
    },
    support: browserslist("last 2 versions, not dead"),
    watch: "assets/css/",
  });
};

const registerFileConfigs = (eleventyConfig) => {
  eleventyConfig.addWatchTarget("src/css/");
  eleventyConfig.addWatchTarget("assets/ts/");
  eleventyConfig.addPassthroughCopy("assets/img");
  eleventyConfig.addPassthroughCopy("assets/video");
  eleventyConfig.addPassthroughCopy("assets/fonts");
  eleventyConfig.addPassthroughCopy("assets/documents");
};

const addFilters = (eleventyConfig) => {
  eleventyConfig.addFilter("logging", (input, label, passthrough) => {
    console.log(`logging-${label}:`, input);
    if (passthrough) return input;
  });
  eleventyConfig.addFilter("encodeURIComponent", encodeURIComponent);
  eleventyConfig.addNunjucksAsyncFilter("faviconData", (src, callback) =>
    generateFavicon(src).then((data) => callback(null, data))
  );
  eleventyConfig.addNunjucksAsyncFilter("imageData", (src, callback) =>
    generateImages(src).then((data) => callback(null, data))
  );
  eleventyConfig.addNunjucksAsyncFilter("imageFormats", (src, callback) =>
    generateImageFormats(src).then((data) => callback(null, data))
  );
  eleventyConfig.addFilter("niceDate", (date) =>
    new Intl.DateTimeFormat("de", { dateStyle: "medium" }).format(date)
  );
  eleventyConfig.addFilter("shortTime", (date) =>
    Intl.DateTimeFormat("de", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Berlin",
      weekday: "short",
    }).format(date)
  );
  eleventyConfig.addFilter("dayName", (date) =>
    Intl.DateTimeFormat("de", {
      weekday: "long",
    }).format(date)
  );
  eleventyConfig.addFilter("minutesToTime", (minutes) => {
    const hours = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0");
    const mins = (minutes % 60).toString().padStart(2, "0");
    return `${hours}:${mins}`;
  });
};

const addShortcodes = (eleventyConfig) => {
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
  eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));
  eleventyConfig.addShortcode("currentTime", () => Date.now().toString());
  eleventyConfig.addAsyncShortcode("image", imageShortcode);
  eleventyConfig.addAsyncShortcode("favicon", generateFaviconHTML);
};

const generateIconFont = (eleventyConfig) => {
  eleventyConfig.on("eleventy.before", async () => {
    const font = await fs.readFile(
      "assets/fonts/MaterialSymbolsOutlinedFilled.woff2"
    );
    const subset = await subsetFont(
      font,
      [
        "info",
        "warning",
        "stadium",
        "home",
        "description",
        "policy",
        "expand_more",
        "web_asset_off",
        "place",
        "supervisor_account",
        "social_leaderboard",
      ].join(" "),
      { targetFormat: "woff2" }
    );
    await fs.mkdir("_site/assets/fonts", { recursive: true });
    await fs.writeFile(
      "_site/assets/fonts/MaterialSymbolsSharp-subset.woff2",
      subset
    );
  });
};

module.exports = (eleventyConfig) => {
  generateIconFont(eleventyConfig);

  eleventyConfig.amendLibrary("md", (mdLib) => {
    mdLib
      .set({
        breaks: true,
        html: true,
        linkify: true,
      })
      .use(markdownItAttrs)
      .use(markdownItEmoji);

    [
      "labeledImage",
      "infoBox",
      "warningBox",
      "iconBox",
      "iconBoxIcon",
      "iconBoxContent",
    ].forEach((name) => mdLib.use(markdownItContainer, name));
  });
  registerPlugins(eleventyConfig);

  addShortcodes(eleventyConfig);
  addFilters(eleventyConfig);

  registerFileConfigs(eleventyConfig);

  eleventyConfig.addPlugin(renderPdf, [
    { file: "downloads/ausschreibung.pdf", url: "/ausschreibung/" },
    { file: "downloads/startliste.pdf", url: "/startlist/" },
  ]);

  // Return your Object options:
  return {
    dir: { input: "src" },
    markdownTemplateEngine: "njk",
  };
};
