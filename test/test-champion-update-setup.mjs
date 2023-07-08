import { readFileSync } from 'fs';
import cheerio from 'cheerio';
import chai from 'chai';
import * as testdouble from 'testdouble';
import testdoubleChai from 'testdouble-chai';

chai.use(testdoubleChai(testdouble));
global.expect = chai.expect;

global.testdouble = testdouble;
global.when = testdouble.when;
testdouble.config({
    //https://github.com/testdouble/testdouble.js/issues/138
    ignoreWarnings: true, // set to true to squelch generated console warnings
});

const mochaHooks = {
    afterEach() {
        testdouble.reset();
    }
};

function getOptions(urlTimeout = 3000, saveTestData = false, pageLoadTimeout = 0) {
    return {
        readTimeout: urlTimeout,
        pageLoadTimeout,
        saveTestData,
        fileNameForTestData: 'index-mocha.html',
    };
}

function readFrom(path) {
    return readFileSync(path, 'utf-8');
}

function readHtmlSelectorFrom(path) {
    return cheerio.load(readFrom(path));
}

export {
    getOptions,
    readFrom,
    readHtmlSelectorFrom,
    mochaHooks
}