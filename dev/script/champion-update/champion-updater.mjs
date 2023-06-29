import ChampionFileDataUpdater from './file-updater/champion-files-updater.mjs';
import ChampionSpotlightsDataLoader from './data-loader/champion-spotlights-data-loader.mjs';
import ChampionUpdateStatus from './champion-update-status.mjs';
import ChampionIdsUpdater from './file-updater/champion-ids-updater.mjs';
import ChampionStarLevelUpdater from './file-updater/champion-star-level-updater.mjs';
import EnglishLanguageFileUpdater from './file-updater/english-language-file-updater.mjs';
import EnglishLanguageFileParser from './parser/english-language-file-parser.mjs';
import FileLinesUpdater from './file-updater/file-lines-updater.mjs';
import { readFileSync } from 'fs';

class ChampionUpdater {
    constructor(championSpotlightsUrl, options) {
        this._championSpotlightsUrl = championSpotlightsUrl;
        this._options = options;
        this._championIdsUpdater = new ChampionIdsUpdater(new FileLinesUpdater(this.#readFile(options.championIdsPath)));
        this._championStarLevelUpdater = new ChampionStarLevelUpdater(new FileLinesUpdater(this.#readFile(options.championStarLevelsPath)));
        const languageFileContent = this.#readFile(options.languageFilePath)
        this._languageFileUpdater = new EnglishLanguageFileUpdater(new FileLinesUpdater(languageFileContent));
        this._championUpdateStatus = new ChampionUpdateStatus(new EnglishLanguageFileParser(languageFileContent), options.championUpdateStatusPath);
    }

    #readFile(fileName) {
        return readFileSync(new URL(fileName), 'utf-8');
    }

    async #updateChampion(championUrl) {
        const dataUpdater = new ChampionFileDataUpdater(championUrl, 
            this._championIdsUpdater, 
            this._championStarLevelUpdater, 
            this._languageFileUpdater, 
            this._championUpdateStatus,
            this._options);
        await dataUpdater.update()
    }

    async #updateChampions(championSpotlightUrls) {
        //Normal for loop with await to only update one champion at at time to avoid race conditions.
        for (let championUrl of championSpotlightUrls) {
            await this.#updateChampion(championUrl);
        }
    }

    async #getChampionSpotlightsForUpdate(championSpotlightsUrl) {
        const championSpotlightsDataLoader = new ChampionSpotlightsDataLoader(championSpotlightsUrl, 
            this._championUpdateStatus,
            this._options);
        return await championSpotlightsDataLoader.getAllSpotlightUrls();
    }
    
    async update() {
        const championSpotlightUrls = await this.#getChampionSpotlightsForUpdate(this._championSpotlightsUrl);
        //We want to add them in the order they were added
        const reversedSpotlightUrls = championSpotlightUrls.reverse();
        this.#updateChampions(reversedSpotlightUrls).then(() => {
            if (this._options.writeChangesToFile) {
                this._championIdsUpdater.save(this._options.championIdsPath);
                this._championStarLevelUpdater.save(this._options.championStarLevelsPath);
                this._languageFileUpdater.save(this._options.languageFilePath);
                this._championUpdateStatus.update(championSpotlightUrls[0]);
            }
            console.log('All done. ', `Changes have ${this._options.writeChangesToFile ? '' : 'NOT'} been written to file`);
        });
    }
}

export default ChampionUpdater;
