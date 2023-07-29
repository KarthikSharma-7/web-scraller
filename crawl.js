const { JSDOM } = require("jsdom");

const crawlPage = async (baseURL, currentURL, pages) => {
  const baseURLObj = new URL(baseURL);

  const currentURLObj = new URL(currentURL);

  if (baseURLObj.hostname != currentURLObj.hostname) {
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);

  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    return pages;
  }

  pages[normalizedCurrentURL] = 1;

  console.log(`Actively Crawling ${currentURL}\n`);

  try {
    const resp = await fetch(currentURL);
    if (resp.status > 399) {
      console.log(
        `Error in Fetch with status code : ${resp.status} on page: ${currentURL}\n`
      );
      return pages;
    }
    const contentType = resp.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(
        `Non HTML response, Content-Type: ${contentType} on page: ${currentURL}\n`
      );
      return pages;
    }
    const inputHTML = await resp.text();

    const nextURLs = getURLSfromHTML(inputHTML, baseURL);

    for (const nxtUrl of nextURLs) {
      pages = await crawlPage(baseURL, nxtUrl, pages);
    }
  } catch (error) {
    console.log(`Error in Fetch: ${error.message} on page: ${currentURL}\n`);
  }
  return pages;
};

const getURLSfromHTML = (inputHTML, baseURL) => {
  const urls = [];
  const dom = new JSDOM(inputHTML);
  const linkElements = dom.window.document.querySelectorAll("a");

  for (const ele of linkElements) {
    if (ele.href.slice(0, 1) === "/") {
      try {
        const urlObj = new URL(`${baseURL}${ele.href}`);
        urls.push(urlObj.href);
      } catch (error) {
        console.log(`Error with relative url: ${error.message}\n`);
      }
    } else {
      try {
        const urlObj = new URL(ele.href);
        urls.push(urlObj.href);
      } catch (error) {
        console.log(`Error absolute url: ${error.message}\n`);
      }
    }
  }
  return urls;
};

const normalizeURL = (urlString) => {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
};

module.exports = { normalizeURL, getURLSfromHTML, crawlPage };
