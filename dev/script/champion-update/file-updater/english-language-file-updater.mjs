class EnglishLanguageFileUpdater {
    #shortNameRegExp = /champion\-.*\-shortname/;
    #effectRegExp = /effect\-/;
    constructor(fileLinesUpdater) {
        this._fileLinesUpdater = fileLinesUpdater.withEndOfSection(this.#shortNameRegExp);
    }

    #insertShortName(championName) {
        this._fileLinesUpdater = this._fileLinesUpdater.withEndOfSection(this.#effectRegExp);
        const lineToInsert = `    "champion-${championName.lowerCase}-shortname": "${championName.fullName}",`;
        let allFileLines = this._fileLinesUpdater.insert('-shortname": ', lineToInsert);
        //Restore to normal mode. We need the same instance as we're only modifying the lines internally.
        this._fileLinesUpdater = this._fileLinesUpdater.withEndOfSection(this.#shortNameRegExp);
        return allFileLines;
    }

    insert(championName) {
        const lineToInsert = `    "champion-${championName.lowerCase}-name": "${championName.fullName}",`;
        let allFileLines = this._fileLinesUpdater.insert('"lang": "English"', lineToInsert);
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