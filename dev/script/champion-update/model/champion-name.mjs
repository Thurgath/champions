class ChampionName {

    constructor(fullName, previousChampionName) {
        this._fullName = fullName;
        this._previousChampionName = previousChampionName;
    }

    replaceAllUnwantedCharacters() {
        const onlyLettersAndNumbers = /[^a-zA-Z\d]/g;
        return this._fullName.replaceAll(onlyLettersAndNumbers, '');
    }

    get fullName() {
        return this._fullName;
    }

    get upperCase() {
        if (this._previousChampionName) {
            return this._previousChampionName.upperCase;
        }
        return this.replaceAllUnwantedCharacters().toUpperCase();
    }

    get lowerCase() {
        if (this._previousChampionName) {
            return this._previousChampionName.lowerCase;
        }
        return this.replaceAllUnwantedCharacters().toLowerCase();
    }
    
    withPreviousFrom(previousChampionName) {
        this._previousChampionName = previousChampionName;
        return this;
    }
}

export default ChampionName;
