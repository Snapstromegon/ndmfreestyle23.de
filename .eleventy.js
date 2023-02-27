const yaml = require('js-yaml');
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const Image = require('@11ty/eleventy-img');
const typescript = require('@rollup/plugin-typescript');
const { default: resolve } = require('@rollup/plugin-node-resolve');
const markdownItEmoji = require('markdown-it-emoji');
const markdownItContainer = require('markdown-it-container');
const rollupPlugin = require('eleventy-plugin-rollup');

function generateImages(src) {
  return Image(src, {
    formats: [
      'avif',
      'webp',
      src.toLowerCase().endsWith('.png') ? 'png' : 'jpeg',
    ],
    outputDir: '_site/img/',
    widths: [256, 512, 1024, null],
  });
}

async function imageShortcode(src, alt, sizes = []) {
  const metadata = await generateImages(src);

  const imageAttributes = {
    alt,
    decoding: 'async',
    loading: 'lazy',
    sizes,
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

function generateFavicon(src) {
  return Image(src, {
    formats: ['svg', 'png', 'webp', 'avif'],
    outputDir: '_site/img/',
    widths: [64, 128, 180, 256, 512, 1024, 2048, null],
  });
}

async function generateFaviconHTML(src) {
  const metadata = await generateFavicon(src);
  return `
    <link rel="icon" href="${metadata.png[0].url}" type="image/png">
    <link rel="apple-touch-icon" href="${
      metadata.png.find((png) => png.width === 180).url
    }">
  `;
}

const registerPlugins = (eleventyConfig) => {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(rollupPlugin, {
    useAbsoluteScriptPaths: true,
    rollupOptions: {
      output: {
        dir: '_site/js',
        format: 'es',
        sourcemap: process.env.NETLIFY !== 'true',
      },
      plugins: [typescript(), resolve()],
    },
  });
};

const registerFileConfigs = (eleventyConfig) => {
  eleventyConfig.addWatchTarget('assets/ts/');
  eleventyConfig.addPassthroughCopy('assets/css');
  eleventyConfig.addPassthroughCopy('assets/img');
  eleventyConfig.addPassthroughCopy('assets/video');
  eleventyConfig.addPassthroughCopy('assets/fonts');
};

const addFilters = (eleventyConfig) => {
  eleventyConfig.addFilter('logging', (input, label, passthrough) => {
    console.log(`logging-${label}:`, input);
    if (passthrough) return input;
  });
  eleventyConfig.addFilter('encodeURIComponent', encodeURIComponent);
  eleventyConfig.addNunjucksAsyncFilter('faviconData', (src, callback) =>
    generateFavicon(src).then((data) => callback(null, data))
  );
  eleventyConfig.addNunjucksAsyncFilter('imageData', (src, callback) =>
    generateImages(src).then((data) => callback(null, data))
  );
  eleventyConfig.addFilter('niceDate', (date) => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Okt',
      'Nov',
      'Dec',
    ];
    return `${date.getDate()}. ${
      months[date.getMonth()]
    } ${date.getFullYear()}`;
  });
};

const addShortcodes = (eleventyConfig) => {
  eleventyConfig.addDataExtension('yaml', (contents) => yaml.load(contents));
  eleventyConfig.addDataExtension('yml', (contents) => yaml.load(contents));
  eleventyConfig.addShortcode('currentTime', () => Date.now().toString());
  eleventyConfig.addAsyncShortcode('image', imageShortcode);
  eleventyConfig.addAsyncShortcode('favicon', generateFaviconHTML);
};

module.exports = function (eleventyConfig) {
  eleventyConfig.amendLibrary('md', (mdLib) => {
    mdLib
      .set({
        breaks: true,
        html: true,
        linkify: true,
      })
      .use(markdownItEmoji);

    ['labeledImage', 'infoBox', 'warningBox'].forEach((name) =>
      mdLib.use(markdownItContainer, name)
    );
  });
  registerPlugins(eleventyConfig);

  addShortcodes(eleventyConfig);
  addFilters(eleventyConfig);

  registerFileConfigs(eleventyConfig);

  // Return your Object options:
  return {
    dir: { input: 'src' },
    markdownTemplateEngine: 'njk',
  };
};
