import { writeFileSync } from 'fs';

class FileLinesUpdater {
    constructor(fileContent) {
        this._fileAsLines = fileContent.split('\n');
        this._emptyLineAsEndString = false;
    }

    #findIndex(predicate, searchString) {
        const foundIndex = this._fileAsLines.findIndex(predicate);
        if (foundIndex === -1) {
            throw new Error(`Could not find ${searchString} in file`);
        }
        return foundIndex + 1;
    }

    #findStartIndex(predicate, searchString) {
        const foundIndex = this.#findIndex(predicate, searchString);
        return !this._emptyLineAsEndString ? foundIndex : foundIndex - 1;
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
    
    withEmptyLineAsEndString() {
        this._emptyLineAsEndString = true;
        return this;
    }

    insert(searchString, lineToInsert) {
        const startIndexForSearch = this.#findStartIndex((line) => line.includes(searchString), searchString);
        const indexForNextLine = this.#findIndex(this.#predicateForUpdate(startIndexForSearch, lineToInsert, this._endOfSection), this._endOfSection);
        this._fileAsLines.splice(indexForNextLine - 1, 0, lineToInsert);
        return this._fileAsLines;
    }

    update(searchString, lineToUpdate, lineMergeFunction = (currentLine, lineToUpdate) => lineToUpdate) {
        const indexForLine = this.#findIndex((line) => line.includes(searchString), searchString);
        const mergedLineToUpdate = lineMergeFunction(this._fileAsLines[ indexForLine - 1 ], lineToUpdate);
        this._fileAsLines[ indexForLine - 1 ] = mergedLineToUpdate;
        return this._fileAsLines;
    }
    
    save(fileName) {
        writeFileSync(new URL(fileName), this._fileAsLines.join('\n'), 'utf-8');
    }
}

export default FileLinesUpdater;
