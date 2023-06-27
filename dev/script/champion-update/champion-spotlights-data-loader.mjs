import UrlDataLoader from './url-data-loader.mjs';
import ChampionSpotlightsPageParser from './champion-spotlights-page-parser.mjs';

class ChampionSpotlightsDataLoader {
    // /page/1/
    #paginationRegEx = /\/page\/(\d+)/;
    constructor(url, timeout, saveTestData, championUpdateStatus) {
        this._url = url;
        this._timeout = timeout;
        this._saveTestData = saveTestData;
        this._championUpdateStatus = championUpdateStatus;
    }

    #getPaginatedUrl(url) {
        const nextPageNumber = Number(url.match(this.#paginationRegEx)[ 1 ]) + 1;
        return url.replace(this.#paginationRegEx, `/page/${nextPageNumber}`);
    }

    async #loadSpotlightUrlsFor(spotlightsPageUrl) {
        const urlDataLoader = new UrlDataLoader(spotlightsPageUrl, this._timeout);
        const htmlDataSelector = await urlDataLoader.load(this._saveTestData);
        const parser = new ChampionSpotlightsPageParser(htmlDataSelector, spotlightsPageUrl);
        return parser.getAllSpotlightUrls();
    }
    
    async getAllSpotlightUrls() {
        const loadedSpotlights = await this.#loadSpotlightUrlsFor(this._url);
        let paginatedUrl = this.#getPaginatedUrl(this._url);
        while (loadedSpotlights.indexOf(this._championUpdateStatus.getLastUpdatedChampionSpotlightUrl()) === -1) {
            const paginatedSpotlightUrls = await this.#loadSpotlightUrlsFor(paginatedUrl);
            loadedSpotlights.push(...paginatedSpotlightUrls);
            paginatedUrl = this.#getPaginatedUrl(paginatedUrl);
        }
        loadedSpotlights.splice(loadedSpotlights.indexOf(this._championUpdateStatus.getLastUpdatedChampionSpotlightUrl()));
        return loadedSpotlights;
    }
}

export default ChampionSpotlightsDataLoader;