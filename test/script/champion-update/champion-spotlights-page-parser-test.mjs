import { readHtmlSelectorFrom } from '../../test-champion-update-setup.mjs';
import ChampionSpotlightsPageParser from '../../../dev/script/champion-update/champion-spotlights-page-parser.mjs';

describe('ChampionSpotlightsPageParser', () => {

    const realSpotlightsUrl = 'https://playcontestofchampions.com/news/category/champion-spotlights/';
    const testSpotlightsUrl = new URL('../../../test-data/news/category/champion-spotlights/', import.meta.url).toString();

    function getExpectedUrlsFor(spotlightsUrl, expectedSpotlightUrls) {
        let baseUrl = new URL(spotlightsUrl).origin;
        let urlSuffix = '';
        if (spotlightsUrl.startsWith('file')) {
            baseUrl = new URL('../../../test/test-data', import.meta.url).toString();
            urlSuffix = 'index.html';
        }
        return expectedSpotlightUrls.map((url) => baseUrl + url + urlSuffix);
    }

    function expectedSpotlightUrlsFor(spotlightsUrl) {
        const parser = new ChampionSpotlightsPageParser(readHtmlSelectorFrom('test/test-data/news/category/champion-spotlights/page/1/index.html'),
            spotlightsUrl);

        expect(parser.getAllSpotlightUrls()).to.include.ordered.members(getExpectedUrlsFor(spotlightsUrl, pageOneSpotlightUrls));
    }

    describe('.getSpotlightUrls', () => it('should return the expected urls for real url', () => {
        expectedSpotlightUrlsFor(realSpotlightsUrl);
    }));

    describe('.getSpotlightUrls', () => it('should return the expected urls for test url', () => {
        expectedSpotlightUrlsFor(testSpotlightsUrl);
    }));

    const pageOneSpotlightUrls = [ '/news/lady-deathstrike/',
        '/news/dani-moonstar/',
        '/news/champion-spotlight-moondragon/',
        '/news/champion-spotlight-adam-warlock/',
        '/news/champion-spotlight-shocker/',
        '/news/champion-spotlight-sandman/',
        '/news/champion-spotlight-viv-vision/',
        '/news/champion-spotlight-kate-bishop/',
        '/news/champion-spotlight-cassie-lang/',
        '/news/champion-spotlight-ant-man-future/',
        '/news/champion-spotlight-absorbing-man/',
        '/news/champion-spotlight-baron-zemo/',
        '/news/champion-spotlight-jessica-jones/',
        '/news/champion-spotlight-mantis/',
        '/news/champion-spotlight-shuri/',
        '/news/champion-spotlight-attuma/',
        '/news/champion-spotlight-spider-man-supreme/',
        '/news/champion-spotlight-spot/' ];
});
