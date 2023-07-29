const { crawlPage } = require("./crawl.js");
const { printReport } = require("./report.js");

const main = async () => {
  if (process.argv.length < 3) {
    console.log("No website Provided");
    process.exit(1);
  } else if (process.argv.length > 3) {
    console.log("Too Many Args");
    process.exit(1);
  }
  const baseURL = process.argv[2];
  console.log("Started Crawaing the website\n");
  const pages = await crawlPage(baseURL, baseURL, {});
  printReport(pages);
};

main();
