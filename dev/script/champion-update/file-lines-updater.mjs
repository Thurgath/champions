class FileLinesUpdater {
    constructor(fileContent) {
        this.fileAsLines = fileContent.split('\n');
    }

    #findIndex(predicate, searchString) {
        const foundIndex = this.fileAsLines.findIndex(predicate);
        if (foundIndex === -1) {
            throw new Error(`Could not find ${searchString} in file`);
        }
        return foundIndex + 1;
    }

    #predicateForUpdate(startIndexForSearch, lineWithDataToUpdate, endOfSearchString) {
        return (line, currentIndex) => currentIndex >= startIndexForSearch
            && (line.localeCompare(lineWithDataToUpdate) >= 0 || line.trim().startsWith(endOfSearchString));
    }

    withEndOfSection(endOfSection) {
        this.endOfSection = endOfSection;
        return this;
    }

    insert(searchString, lineToInsert) {
        const startIndexForSearch = this.#findIndex((line) => line.includes(searchString), searchString);
        const indexForNextLine = this.#findIndex(this.#predicateForUpdate(startIndexForSearch, lineToInsert, this.endOfSection), this.endOfSection);
        this.fileAsLines.splice(indexForNextLine - 1, 0, lineToInsert);
        return this.fileAsLines;
    }
}

export default FileLinesUpdater;
