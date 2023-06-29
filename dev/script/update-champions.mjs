import ChampionUpdater from './champion-update/champion-updater.mjs';

const ALL_MCOC_SPOTLIGHTS_PAGE_1 = 'https://playcontestofchampions.com/news/category/champion-spotlights/page/1/';
const BASE_URL_FOR_TEST = new URL('../../test/test-data', import.meta.url).toString();
const ALL_MCOC_SPOTLIGHTS_PAGE_1_TEST = `${BASE_URL_FOR_TEST}/news/category/champion-spotlights/page/1/index.html`;

const TIMEOUT = 2000;

const testDataMap = new Map([
    ['championUpdateStatusPath', 'championUpdateStatusTestLocal.json'],
    ['championIdsPath', 'champion-ids.js'],
    ['championStarLevelsPath', 'champion-star-levels.js'],
    ['languageFilePath', 'lang-en.json']
]);

const updateMap = new Map([
    ['championUpdateStatusPath', '../../dev/script/champion-update/championUpdateStatus.json'],
    ['championIdsPath', 'ids/champions.js'],
    ['championStarLevelsPath', 'champions.js'],
    ['languageFilePath', 'lang/en.json']
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
        fileNameForTestData: 'index.html',
        writeChangesToFile: false,
        readTimeout: useTestData ? 1500 : TIMEOUT,
        pageLoadTimeout: useTestData ? 100 : TIMEOUT,
        championUpdateStatusPath: getWithPath('championUpdateStatusPath', useTestData),
        championIdsPath: getWithPath('championIdsPath', useTestData),
        championStarLevelsPath: getWithPath('championStarLevelsPath', useTestData),
        languageFilePath: getWithPath('languageFilePath', useTestData),
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
