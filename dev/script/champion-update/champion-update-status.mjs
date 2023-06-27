import fs from 'fs';

class ChampionUpdateStatus {
    constructor(statusFileUrlString) {
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
    
    update(latestSpotlightUrl) {
        this._status.lastUpdatedChampionSpotlight = latestSpotlightUrl;
        this._status.lastUpdatedDate = new Date();
        fs.writeFileSync(this._statusFileUrl, JSON.stringify(this._status, null, 2));
        return this._status;
    }
}

export default ChampionUpdateStatus;