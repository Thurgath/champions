import { writeFileSync } from 'fs';

class FileLinesUpdater {
    constructor(fileContent) {
        this._fileAsLines = fileContent.split('\n');
    }

    #findIndex(predicate, searchString) {
        const foundIndex = this._fileAsLines.findIndex(predicate);
        if (foundIndex === -1) {
            throw new Error(`Could not find ${searchString} in file`);
        }
        return foundIndex + 1;
    }

    #predicateForUpdate(startIndexForSearch, lineWithDataToUpdate, endOfSearchString) {
        return (line, currentIndex) => currentIndex >= startIndexForSearch
            && (this.#foundMatchOrHasPassed(line, lineWithDataToUpdate) || this.#hasReachedEnd(line, endOfSearchString));
    }

    #hasReachedEnd(line, endOfSearchString) {
        return line.trim().match(endOfSearchString) !== null;
    }

    #foundMatchOrHasPassed(line, lineWithDataToUpdate) {
        return line.localeCompare(lineWithDataToUpdate) >= 0;
    }

    withEndOfSection(endOfSection) {
        this._endOfSection = endOfSection;
        return this;
    }

    insert(searchString, lineToInsert) {
        const startIndexForSearch = this.#findIndex((line) => line.includes(searchString), searchString);
        const indexForNextLine = this.#findIndex(this.#predicateForUpdate(startIndexForSearch, lineToInsert, this._endOfSection), this._endOfSection);
        this._fileAsLines.splice(indexForNextLine - 1, 0, lineToInsert);
        return this._fileAsLines;
    }

    update(searchString, lineToUpdate) {
        const indexForLine = this.#findIndex((line) => line.includes(searchString), searchString);
        this._fileAsLines[ indexForLine - 1 ] = lineToUpdate;
        return this._fileAsLines;
    }
    
    save(fileName) {
        writeFileSync(fileName, this._fileAsLines.join('\n'));
    }
}

export default FileLinesUpdater;
