class ChampionSpotlightsPageParser {
    constructor(htmlDataAsSelector, championSpotlightsUrl) {
        this._htmlDataAsSelector = htmlDataAsSelector;
        this._championSpotlightsUrl = championSpotlightsUrl;
    }

    #baseUrlForTest() {
        return new URL('../../../../test/test-data', import.meta.url).toString();
    }

    #getUrlFor(spotLightUrl) {
        if (this._championSpotlightsUrl.startsWith('file')) {
            return `${this.#baseUrlForTest()}${spotLightUrl}index.html`;
        }
        return new URL(this._championSpotlightsUrl).origin + spotLightUrl;
    }

    getAllSpotlightUrls() {
        return this._htmlDataAsSelector('.champion-tile-link').map( (index, value) => {
            return this.#getUrlFor(this._htmlDataAsSelector(value).attr('href'));
        }, this).toArray();
    }
}

export default ChampionSpotlightsPageParser;
