import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import fs from 'fs';

class UrlDataLoader {
    constructor(urlString, options) {
        this._urlString = urlString;
        this._options = options;
    }

    async load() {
        /* eslint-disable no-console */
        console.log('Reading url: ', this._urlString);

        const browser = await puppeteer.launch( { headless: 'true' } );
        const page = await browser.newPage();
        page.setDefaultTimeout(this._options.readTimeout);
        await page.goto(this._urlString);
        await page.waitForTimeout(this._options.pageLoadTimeout);
        const data = await page.mainFrame().content();
        await browser.close();

        if (this._options.saveTestData) {
            //Local file
            let directoryName = `${this._urlString.substr(0, this._urlString.lastIndexOf('/') + 1)}`;
            if (this._urlString.startsWith('http')) {
                const url = new URL(this._urlString);
                const testDataUrl = new URL('../../../test/test-data', import.meta.url).toString();
                directoryName = this._urlString.replace(url.origin, testDataUrl);
            }
            try {
                console.log('Creating directory: ', new URL(directoryName).toString());
                fs.mkdirSync(new URL(directoryName), { recursive: true });
            }
            catch (err) {
                if (err.code !== 'EEXIST') {
                    throw err;
                }
            }
            const fileNameAsUrl = new URL(`${directoryName}${this._options.fileNameForTestData}`);
            console.log('Writing file: ', fileNameAsUrl.toString());
            fs.writeFileSync(fileNameAsUrl, data, { flag : 'w' }, () => {});
        }
        /* eslint-enable no-console */
        return cheerio.load(data);
    }
}

export default UrlDataLoader;
