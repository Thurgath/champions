import { readFileSync } from 'fs';
import cheerio from 'cheerio';
import chai from 'chai';

global.expect = chai.expect;

function readFrom(path) {
    return readFileSync(path, 'utf-8');
}

function readHtmlSelectorFrom(path) {
    return cheerio.load(readFrom(path));
}

export {
    readFrom,
    readHtmlSelectorFrom
}