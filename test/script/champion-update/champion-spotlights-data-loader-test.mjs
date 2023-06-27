import ChampionSpotlightsDataLoader from '../../../dev/script/champion-update/champion-spotlights-data-loader.mjs';

describe('ChampionSpotlightsDataLoader', () => {

    function createTestUrlFor(spotlightPath) {
        return new URL('../../../test/test-data', import.meta.url).toString() + spotlightPath;
    }

    const testDataUrl = new URL('../../../test/test-data/news/category/champion-spotlights/page/1/index.html', import.meta.url);
    const lastSpotlightOnPageOne = '/news/champion-spotlight-spot/index.html';
    const firstSpotlightOnPageFour = '/news/champion-spotlight-kitty-pryde/index.html';
    const thorSpotlight = createTestUrlFor('/news/champion-spotlight-thor-ragnarok/index.html');

    describe('.getAllSpotlightUrls', () => {
        //Delay before file has been loaded
        const urlTimeout = 2000;
        const timeout = 20000;

        function createMockChampionUpdateStatus(lastSpotlightPath) {
            return {
                getLastUpdatedChampionSpotlightUrl() {
                    return createTestUrlFor(lastSpotlightPath);
                },
            };
        }

        function getUrlPromise(lastSpotlightUrl) {
            return new ChampionSpotlightsDataLoader(testDataUrl.toString(), urlTimeout, false, createMockChampionUpdateStatus(lastSpotlightUrl)).getAllSpotlightUrls();
        }

        it('should return all spotlights data', () => {
            const dataLoaderPromise = getUrlPromise(lastSpotlightOnPageOne);
            return dataLoaderPromise.then((allSpotlightsUrls) => {
                expect(allSpotlightsUrls).to.have.lengthOf(17);
            });
        }).timeout(timeout);

        it('should return all spotlights data with pagination', () => {
            const dataLoaderPromise = getUrlPromise(firstSpotlightOnPageFour);
            return dataLoaderPromise.then((allSpotlightsUrls) => {
                expect(allSpotlightsUrls).to.have.lengthOf(50);
                expect(allSpotlightsUrls[ 49 ]).to.equal(thorSpotlight);
            });
        }).timeout(timeout);
    });
});
