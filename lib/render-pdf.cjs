const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs/promises");

module.exports = (eleventyConfig, routes = []) => {
  eleventyConfig.on("eleventy.after", async () => {
    console.log("Rendering PDFs...");
    const browser = await chromium.launch();
    for (const route of routes) {
      await renderRoute(browser, route.url, route.file);
    }
    await browser.close();
    console.log("Rendering PDFs done.");
  });
};

const renderRoute = async (browser, route, output) => {
  const page = await browser.newPage({
    baseURL: "http://localhost:8080",
  });
  await page.route("**", async (route) => {
    let url = route.request().url()
      .replace("http://localhost:8080/", "");
    if (url.endsWith("/")) url += "index.html";
    const filePath = path.join(__dirname, "..", "_site", url);
    route.fulfill({
      status: 200,
      body: await fs.readFile(filePath),
    });
  });
  await page.goto(route);
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: path.join(".", "_site", output),
    format: "A4",
    displayHeaderFooter: true,
  });
  await page.close();
};
