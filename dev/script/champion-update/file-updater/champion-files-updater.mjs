import UrlDataLoader from '../data-loader/url-data-loader.mjs';
import ChampionSpotlightParser from '../parser/champion-spotlight-parser.mjs';

class ChampionFilesUpdater {
    constructor(url, championIdsUpdater, championStarLevelUpdater, languageFileUpdater, championUpdateStatus, options) {
        this._url = url;
        this._championIdsUpdater = championIdsUpdater;
        this._championStarLevelUpdater = championStarLevelUpdater;
        this._languageFileUpdater = languageFileUpdater;
        this._championUpdateStatus = championUpdateStatus;
        this._options = options;
    }

    async update() {
        const urlDataLoader = new UrlDataLoader(this._url, this._options);
        const htmlDataSelector = await urlDataLoader.load();
        const parser = new ChampionSpotlightParser(htmlDataSelector);
        const previousChampionName = this._championUpdateStatus.getChampionNameFor(parser.getName());
        if (!previousChampionName) {
            this._championIdsUpdater.insert(parser.getClassTypeAsConstant(), parser.getName());
            this._championStarLevelUpdater.insert(parser.getClassTypeAsConstant(), parser.getName(), parser.getStarLevels());
            this._languageFileUpdater.insert(parser.getName());            
        } else {
            this._championStarLevelUpdater.update(parser.getName(), parser.getStarLevels());
        }
    }
}

export default ChampionFilesUpdater;