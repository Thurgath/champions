import fs from 'fs';
import ChampionName from './model/champion-name.mjs';

class ChampionUpdateStatus {
    constructor(currentChampionDataParser, statusFileUrlString) {
        this._currentChampionDataParser = currentChampionDataParser;
        this._statusFileUrl = new URL(statusFileUrlString);
        this._status = JSON.parse(fs.readFileSync(new URL(this._statusFileUrl)), this.#stringToDate);
    }

    #stringToDate(key, value) {
        //Is there a better way that doesn't involve datestring parsing?
        if (key != null && key === 'lastUpdatedDate') {
            return new Date(value)
        } else if (key != null && key === 'lastUpdatedChampionSpotlight' && value.startsWith('$')) {
            // Fix url so it can work for local test files as well :(
            const baseUrl = new URL('../../../test/test-data', import.meta.url).toString();
            return value.replace('${baseUrl}', baseUrl);
        }
        return value
    }
    
    getLastUpdatedDate() {
        return this._status.lastUpdatedDate;
    }
    
    getLastUpdatedChampionSpotlightUrl() {
        return this._status.lastUpdatedChampionSpotlight;
    }

    getChampionNameFor(championName) {
        if (!this._status.currentChampions) {
            this._status.currentChampions = this._currentChampionDataParser.getAllChampions();
        }
        const previousChampionName = this._status.currentChampions.get(championName.fullName);
        if (!previousChampionName) {
            return undefined;
        }
        return championName.withPreviousFrom(new ChampionName(previousChampionName));
    }
    
    update(latestSpotlightUrl) {
        this._status.lastUpdatedChampionSpotlight = latestSpotlightUrl;
        this._status.lastUpdatedDate = new Date();
        fs.writeFileSync(this._statusFileUrl, JSON.stringify(this._status, null, 2));
        return this._status;
    }
}

export default ChampionUpdateStatus;