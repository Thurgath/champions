class EnglishLanguageFileUpdater {
    constructor(fileLinesUpdater) {
        this._fileLinesUpdater = fileLinesUpdater.withEndOfSection(/champion\-.*\-shortname/);
    }

    insert(championName) {
        const lineToInsert = `    "champion-${championName.lowerCase}-name": "${championName.fullName}",`;
        return this._fileLinesUpdater.insert('"lang": "English"', lineToInsert);
    }

    save(fileName) {
        this._fileLinesUpdater.save(fileName);
    }
}

export default EnglishLanguageFileUpdater;