import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import fs from 'fs';

class UrlDataLoader {
    #pageLoadTimeout = 2000;
    constructor(urlString, timeout) {
        this.urlString = urlString;
        this.timeout = timeout;
    }

    async load(saveTestData) {
        /* eslint-disable no-console */
        console.log('Reading url: ', this.urlString);

        const browser = await puppeteer.launch( { headless: 'true' } );
        const page = await browser.newPage();
        page.setDefaultTimeout(this.timeout);
        await page.goto(this.urlString);
        await page.waitForTimeout(this.#pageLoadTimeout);
        const data = await page.mainFrame().content();
        await browser.close();

        if (saveTestData) {
            //Local file
            let directoryName = `${this.urlString.substr(0, this.urlString.lastIndexOf('/') + 1)}`;
            if (this.urlString.startsWith('http')) {
                const url = new URL(this.urlString);
                const testDataUrl = new URL('../../../test/test-data', import.meta.url).toString();
                directoryName = this.urlString.replace(url.origin, testDataUrl);
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
            const fileNameAsUrl = new URL(`${directoryName}index.html`);
            console.log('Writing file: ', fileNameAsUrl.toString());
            fs.writeFileSync(fileNameAsUrl, data, { flag : 'w' }, () => {});
        }
        /* eslint-enable no-console */
        return cheerio.load(data);
    }
}

export default UrlDataLoader;
