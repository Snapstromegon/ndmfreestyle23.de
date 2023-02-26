module.exports = (...args) => {
  return {
    layout: 'layouts/page.njk',
    eleventyComputed: {
      eleventyNavigation: (data) => {
        if (data.eleventyNavigation && data.page?.url) {
          return { url: data?.page?.url?.slice('/pages'.length), ...data.eleventyNavigation };
        }

        return data.eleventyNavigation;
      },
    },
  };
};
