class ChampionIdsUpdater {
    constructor(fileLinesUpdater) {
        this.fileLinesUpdater = fileLinesUpdater.withEndOfSection('//');
    }

    insert(classType, championName) {
        const lineToInsert = `export const ${championName.upperCase} = '${championName.lowerCase}';`;
        return this.fileLinesUpdater.insert(classType, lineToInsert);
    }
}

export default ChampionIdsUpdater;
