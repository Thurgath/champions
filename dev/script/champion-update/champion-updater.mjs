import ChampionDataUpdater from './champion-data-updater.mjs';
import ChampionSpotlightsDataLoader from './champion-spotlights-data-loader.mjs';
import ChampionUpdateStatus from './champion-update-status.mjs';

class ChampionUpdater {
    constructor(championSpotlightsUrl, options) {
        this._championSpotlightsUrl = championSpotlightsUrl;
        this._options = options;
        this._championUpdateStatus = new ChampionUpdateStatus(options.championUpdateStatusPath);
    }

    async #updateChampion(championUrl, saveTestData) {
        const dataUpdater = new ChampionDataUpdater(championUrl, this._options.timeout, this._options.saveTestData);
        await dataUpdater.update()
    }

    async #updateChampions(championSpotlightUrls) {
        //Normal for loop with await to only update one champion at at time to avoid race conditions.
        for (let championUrl of championSpotlightUrls) {
            await this.#updateChampion(championUrl, this._options.saveTestData);
        }
    }

    async #getChampionSpotlightsForUpdate(championSpotlightsUrl) {
        const championSpotlightsDataLoader = new ChampionSpotlightsDataLoader(championSpotlightsUrl, 
            this._options.timeout, 
            this._options.saveTestData,
            this._championUpdateStatus);
        return await championSpotlightsDataLoader.getAllSpotlightUrls();
    }
    
    async update() {
        const championSpotlightUrls = await this.#getChampionSpotlightsForUpdate(this._championSpotlightsUrl);
        this.#updateChampions(championSpotlightUrls).then(() => {
            console.log('All champions updated');
        });
    }
}

export default ChampionUpdater;
