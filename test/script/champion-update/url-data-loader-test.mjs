import UrlDataLoader from '../../../dev/script/champion-update/url-data-loader.mjs';
import fs from 'fs';

describe('UrlDataLoader', () => {

    const testDataUrl = new URL('../../../test/test-data/news/category/champion-spotlights/page/1/index.html', import.meta.url);

    describe('.load', () => {
        //Delay before file has been loaded
        const urlTimeout = 2000;
        const timeout = 5000;

        it('should return html selector with loaded data', () => {
            const urlDataLoaderPromise = new UrlDataLoader(testDataUrl.toString(), urlTimeout).load(false);
            return urlDataLoaderPromise.then((loadedData) => {
                const firstLoadedUrl = loadedData('.champion-tile-link').attr('href');
                expect(firstLoadedUrl).to.equal('/news/lady-deathstrike/');
            });
        }).timeout(timeout);

        it('should save test-data when saveData is true', () => {
            const currentTime = new Date();
            const urlDataLoaderPromise = new UrlDataLoader(testDataUrl.toString(), urlTimeout).load(true);
            return urlDataLoaderPromise.then(() => {
                const statsForFile = fs.statSync(testDataUrl);
                expect(new Date(statsForFile.mtime)).to.be.above(currentTime);
            });
        }).timeout(timeout);

        it('should save test-data when saveData is true for real url', function() { // eslint-disable-line prefer-arrow-callback
            if (!process.env.INTEGRATION_TEST) {
                //Enclosed in function instead of arrow function to access this
                /* eslint-disable no-invalid-this */
                this._runnable.title += ' - Skipped test. Will only run in integration test mode';
                return this.skip();
                /* eslint-enable no-invalid-this */
            }
            const currentTime = new Date();
            const urlToLoad = 'https://playcontestofchampions.com/news/category/champion-spotlights/page/4/';
            const newFileLocation = new URL('../../../test/test-data/news/category/champion-spotlights/page/4/index.html', import.meta.url);
            const urlDataLoaderPromise = new UrlDataLoader(urlToLoad, urlTimeout).load(true);
            return urlDataLoaderPromise.then(() => {
                const statsForFile = fs.statSync(newFileLocation);
                expect(new Date(statsForFile.mtime)).to.be.above(currentTime);
            });
        }).timeout(timeout);
    });
});
