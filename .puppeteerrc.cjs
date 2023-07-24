const {join} = require('path');

/**
 * @type {import("puppeteer").Configuration}
 *
 * https://stackoverflow.com/questions/74385208/puppeteer-error-on-heroku-could-not-find-chromium
 */
module.exports = {
    // Changes the cache location for Puppeteer.
    cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};