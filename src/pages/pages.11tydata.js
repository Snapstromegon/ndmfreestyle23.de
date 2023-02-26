module.exports = (...args) => {
  return {
    layout: "layouts/page.njk",
    eleventyComputed: {
      eleventyNavigation: {
        url: (data) => data?.page?.url?.slice('/pages'.length),
      },
    },
  };
};
