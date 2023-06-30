class EnglishLanguageFileUpdater {
    #endOfSectionRegExp = /^$/;
    constructor(fileLinesUpdater) {
        this._fileLinesUpdater = fileLinesUpdater.withEndOfSection(this.#endOfSectionRegExp).withEmptyLineAsEndString();
    }

    #insertShortName(championName) {
        const lineToInsert = `    "champion-${championName.lowerCase}-shortname": "${championName.shortName}",`;
        return this._fileLinesUpdater.insert('-shortname": ', lineToInsert);
    }

    insert(championName) {
        const lineToInsert = `    "champion-${championName.lowerCase}-name": "${championName.fullName}",`;
        let allFileLines = this._fileLinesUpdater.insert('-name": ', lineToInsert);
        if (championName.hasShortName()) {
            allFileLines = this.#insertShortName(championName);
        }
        return allFileLines;
    }

    save(fileName) {
        this._fileLinesUpdater.save(fileName);
    }
}

export default EnglishLanguageFileUpdater;