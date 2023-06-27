class ChampionStarlevelUpdater {
    constructor(fileLinesUpdater) {
        this.fileLinesUpdater = fileLinesUpdater.withEndOfSection(']),');
    }

    insert(classType, championName, starLevels) {
        const lineToInsert = `        ...championStars({ uid: CHAMPION.${championName.upperCase} }, [ ${starLevels.join(', ')} ]),`;
        return this.fileLinesUpdater.insert(classType, lineToInsert);
    }
}

export default ChampionStarlevelUpdater;
