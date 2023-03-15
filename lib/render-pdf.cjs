const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs/promises");

const renderRoute = async (browser, url, output) => {
  const page = await browser.newPage({
    baseURL: "http://localhost:8080",
  });
  await page.route("**", async (route) => {
    let reqUrl = route.request().url()
      .replace("http://localhost:8080/", "");
    if (reqUrl.endsWith("/")) reqUrl += "index.html";
    const filePath = path.join(__dirname, "..", "_site", reqUrl);
    route.fulfill({
      body: await fs.readFile(filePath),
      status: 200,
    });
  });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    displayHeaderFooter: false,
    format: "A4",
    path: path.join(".", "_site", output),
  });
  await page.close();
};

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
