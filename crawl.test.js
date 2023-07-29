const { getURLSfromHTML } = require("./crawl.js");
const { test, expect } = require("@jest/globals");

test("test getURLSfromHTML", () => {
  const inputHTML = `
  <!DOCTYPE html>
  <html>
    <body>
      <a href="https://w3schools.com">
        Visit W3Schools.com!
      </a>
      <a href="uus">
        schools.com!
      </a>
    </body>
  </html>
  `;
  const baseURL = "https://google.com";
  const actual = getURLSfromHTML(inputHTML, baseURL);
  const expected = ["https://w3schools.com/"];
  expect(actual).toEqual(expected);
});
