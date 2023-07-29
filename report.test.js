const { sortPages } = require("./report.js");
const { test, expect } = require("@jest/globals");

test("sort pages", () => {
  const input = {
    "https://wagslane.dev/": 3,
    "https://wagslane.dev/path/": 61,
  };
  const actual = sortPages(input);
  const expected = [
    ["https://wagslane.dev/path/", 61],
    ["https://wagslane.dev/", 3],
  ];
  expect(actual).toEqual(expected);
});
