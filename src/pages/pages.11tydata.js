module.exports = () => ({
  eleventyComputed: {
    eleventyNavigation: (data) => {
      if (data.eleventyNavigation && data.page?.url) {
        return {
          url: data?.page?.url?.slice("/pages".length),
          ...data.eleventyNavigation,
        };
      }

      return data.eleventyNavigation;
    },
  },
  layout: "layouts/page.njk",
});
