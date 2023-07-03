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

    #toStarLevels(starLevelsString) {
        const starLevelRegExp = /}, \[ (.*) \]\),/;
        return starLevelsString.match(starLevelRegExp)[1].split(', ');
    }

    #getMergedStarLevels(championName, currentLine, updatedLine) {
        const currentStarLevels = this.#toStarLevels(currentLine);
        const newStarLevels = this.#toStarLevels(updatedLine);
        const uniqueStarLevels = new Set([ ...currentStarLevels, ...newStarLevels ]);
        return this.#getLineFrom(championName, uniqueStarLevels);
    }

    insert(classType, championName, starLevels) {
        const lineToInsert = this.#getLineFrom(championName, starLevels);
        return this._fileLinesUpdater.insert(classType, lineToInsert);
    }

    update(championName, starLevels) {
        const updatedLine = this.#getLineFrom(championName, starLevels);
        const championSearchString = `{ uid: CHAMPION.${championName.upperCase} }`;
        const boundMergeStarLevelsFunction = this.#getMergedStarLevels.bind(this, championName);
        return this._fileLinesUpdater.update(championSearchString, updatedLine, boundMergeStarLevelsFunction);
    }

    save(fileName) {
        this._fileLinesUpdater.save(fileName);
    }
}

export default ChampionStarLevelUpdater;
