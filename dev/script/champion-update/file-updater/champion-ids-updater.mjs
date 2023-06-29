class ChampionIdsUpdater {
    constructor(fileLinesUpdater) {
        this._fileLinesUpdater = fileLinesUpdater.withEndOfSection(/\/\//);
    }

    insert(classType, championName) {
        const lineToInsert = `export const ${championName.upperCase} = '${championName.lowerCase}';`;
        return this._fileLinesUpdater.insert(classType, lineToInsert);
    }
    
    save(fileName) {
        this._fileLinesUpdater.save(fileName);
    }
}

export default ChampionIdsUpdater;
