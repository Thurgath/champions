import ChampionUpdater from './champion-update/champion-updater.mjs';

const ALL_MCOC_SPOTLIGHTS_PAGE_1 = 'https://playcontestofchampions.com/news/category/champion-spotlights/page/1/';
const BASE_URL_FOR_TEST = new URL('../../test/test-data', import.meta.url).toString();
const ALL_MCOC_SPOTLIGHTS_PAGE_1_TEST = `${BASE_URL_FOR_TEST}/news/category/champion-spotlights/page/1/index.html`;

const TIMEOUT = 2000;

const testDataMap = new Map([
    ['championUpdateStatus', 'championUpdateStatusTestLocal.json'],
    ['championIds', 'champion-ids.js'],
    ['championStarLevels', 'champion-starlevels.js'],
]);

const updateMap = new Map([
    ['championUpdateStatus', '../../dev/script/champion-update/championUpdateStatus.json'],
    ['championIds', 'ids/champions.js'],
    ['championStarLevels', 'model/Champions.js'],
]);

function getChampionSpotlightsUrl(useTestData) {
    if (useTestData) {
        return ALL_MCOC_SPOTLIGHTS_PAGE_1_TEST;
    }
    return ALL_MCOC_SPOTLIGHTS_PAGE_1;
}

function getWithPath(filenameKey, useTestData) {
    if (useTestData) {
        return `${BASE_URL_FOR_TEST}/${testDataMap.get(filenameKey)}`;
    }
    return new URL('../../src/data/').toString() + updateMap.get(filenameKey);
}

function getOptionsFor(useTestData) {
    return {
        saveTestData: false,
        writeChangesToFile: false,
        timeout: TIMEOUT,
        championUpdateStatusPath: getWithPath('championUpdateStatus', useTestData),
        championIds: getWithPath('championIds', useTestData),
        championStarLevels: getWithPath('championStarLevels', useTestData),
    };
}

(async() => {
    const useTestData = process.env.CHAMPION_UPDATE_TEST || true;
    const spotlightsUrl = getChampionSpotlightsUrl(useTestData);
    const options = getOptionsFor(useTestData);
    console.log('options: ', options);
    const championUpdater = new ChampionUpdater(spotlightsUrl, options);
    await championUpdater.update();
})();
