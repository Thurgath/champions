import UrlDataLoader from '../../../../dev/script/champion-update/data-loader/url-data-loader.mjs';
import { copyFileSync, unlinkSync, statSync } from 'fs';
import { getOptions } from '../../../test-champion-update-setup.mjs';

describe('UrlDataLoader', () => {

    const testDataUrlToCopy = new URL('../../../../test/test-data/news/category/champion-spotlights/page/1/index.html', import.meta.url);
    const testDataUrl = new URL('../../../../test/test-data/news/category/champion-spotlights/page/1/index-mocha.html', import.meta.url);

    describe('.load', () => {
        const timeout = 5000;

        before(() => {
            copyFileSync(testDataUrlToCopy, testDataUrl);
        });

        after(() => {
            unlinkSync(testDataUrl);
        });

        it('should return html selector with loaded data', () => {
            const urlDataLoaderPromise = new UrlDataLoader(testDataUrl.toString(), getOptions()).load();
            return urlDataLoaderPromise.then((loadedData) => {
                const firstLoadedUrl = loadedData('.champion-tile-link').attr('href');
                expect(firstLoadedUrl).to.equal('/news/lady-deathstrike/');
            });
        }).timeout(timeout);

        it('should save test-data when saveData is true', () => {
            const currentTime = new Date();
            const urlDataLoaderPromise = new UrlDataLoader(testDataUrl.toString(), getOptions(null, true, 1000)).load();
            return urlDataLoaderPromise.then(() => {
                const statsForFile = statSync(testDataUrl);
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
            const urlDataLoaderPromise = new UrlDataLoader(urlToLoad, getOptions(null, true, timeout)).load();
            return urlDataLoaderPromise.then(() => {
                const statsForFile = statSync(newFileLocation);
                expect(new Date(statsForFile.mtime)).to.be.above(currentTime);
            });
        }).timeout(timeout);
    });
});
