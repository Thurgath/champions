import UrlDataLoader from './url-data-loader.mjs';
import ChampionSpotlightsPageParser from '../parser/champion-spotlights-page-parser.mjs';

class ChampionSpotlightsDataLoader {
    // /page/1/
    #paginationRegExp = /\/page\/(\d+)/;
    constructor(url, championUpdateStatus, options) {
        this._url = url;
        this._championUpdateStatus = championUpdateStatus;
        this._options = options;
    }

    #getPaginatedUrl(url) {
        const nextPageNumber = Number(url.match(this.#paginationRegExp)[ 1 ]) + 1;
        return url.replace(this.#paginationRegExp, `/page/${nextPageNumber}`);
    }

    async #loadSpotlightUrlsFor(spotlightsPageUrl) {
        const urlDataLoader = new UrlDataLoader(spotlightsPageUrl, this._options);
        const htmlDataSelector = await urlDataLoader.load();
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