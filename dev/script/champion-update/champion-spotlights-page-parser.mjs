class ChampionSpotlightsPageParser {
    constructor(htmlDataAsSelector, championSpotlightsUrl) {
        this.htmlDataAsSelector = htmlDataAsSelector;
        this.championSpotlightsUrl = championSpotlightsUrl;
    }

    #baseUrlForTest() {
        return new URL('../../../test/test-data', import.meta.url).toString();
    }

    #getUrlFor(spotLightUrl) {
        if (this.championSpotlightsUrl.startsWith('file')) {
            return `${this.#baseUrlForTest()}${spotLightUrl}index.html`;
        }
        return new URL(this.championSpotlightsUrl).origin + spotLightUrl;
    }

    getAllSpotlightUrls() {
        return this.htmlDataAsSelector('.champion-tile-link').map( (index, value) => {
            return this.#getUrlFor(this.htmlDataAsSelector(value).attr('href'));
        }, this).toArray();
    }
}

export default ChampionSpotlightsPageParser;
