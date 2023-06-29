class EnglishLanguageFileParser {
    #championLineRegExp = /\s+"champion\-([\w\d]+)\-name": "(.*)",/;
    constructor(fileContents) {
        this._fileContents = fileContents;
    }

    #matchesLine(line) {
        return line.match(this.#championLineRegExp) !== null;
    }

    #asKeyValue(championLine) {
        const foundMatches = championLine.match(this.#championLineRegExp);
        return [ `${foundMatches[2]}`, `${foundMatches[1]}` ];
    }

    #getChampionNameKeyValues() {
        return this._fileContents.split('\n').filter((line) => {
            return this.#matchesLine(line)
        }, this).map((championLine) => {
            return this.#asKeyValue(championLine);
        }, this);
    }

    getAllChampions() {
        const championsAsKeyValue = this.#getChampionNameKeyValues();
        return new Map([...championsAsKeyValue]);
    }
}

export default EnglishLanguageFileParser;
