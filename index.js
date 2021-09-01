#!/usr/bin/env node
const entry = require('./entry');

const [,, method] = process.argv;

if (! entry.hasOwnProperty(method)) {
  console.error(`Not support ${method} method`);
  return;
}

entry[method]();
