class ChampionStarLevelUpdater {
    constructor(fileLinesUpdater) {
        this._fileLinesUpdater = fileLinesUpdater.withEndOfSection(/^]\),/);
    }

    #asCommaSeparatedString(uniqueStarLevels) {
        return Array.from(uniqueStarLevels).join(', ');
    }

    #getLineFrom(championName, starLevels) {
        return `        ...championStars({ uid: CHAMPION.${championName.upperCase} }, [ ${this.#asCommaSeparatedString(starLevels)} ]),`;
    }

    insert(classType, championName, starLevels) {
        const lineToInsert = this.#getLineFrom(championName, starLevels);
        return this._fileLinesUpdater.insert(classType, lineToInsert);
    }

    update(championName, starLevels) {
        const updatedLine = this.#getLineFrom(championName, starLevels);
        const championSearchString = `{ uid: CHAMPION.${championName.upperCase} }`;
        return this._fileLinesUpdater.update(championSearchString, updatedLine);
    }

    save(fileName) {
        this._fileLinesUpdater.save(fileName);
    }
}

export default ChampionStarLevelUpdater;
