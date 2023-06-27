import UrlDataLoader from './url-data-loader.mjs';
import ChampionSpotlightParser from './champion-spotlight-parser.mjs';

class ChampionDataUpdater {
    constructor(url, timeout, saveTestData) {
        this.url = url;
        this.timeout = timeout;
        this.saveTestData = saveTestData;
    }

    async update() {
        const urlDataLoader = new UrlDataLoader(this.url, this.timeout);
        const htmlDataSelector = await urlDataLoader.load(this.saveTestData);
        const parser = new ChampionSpotlightParser(htmlDataSelector);
        parser.getClassType();
    }
}

export default ChampionDataUpdater;