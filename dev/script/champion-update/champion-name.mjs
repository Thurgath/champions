class ChampionName {

    constructor(fullName) {
        this._fullName = fullName;
    }

    replaceAllUnwantedCharacters() {
        const onlyLettersAndNumbers = /[^a-zA-Z\d]/g;
        return this._fullName.replaceAll(onlyLettersAndNumbers, '');
    }

    get fullName() {
        return this._fullName;
    }

    get upperCase() {
        return this.replaceAllUnwantedCharacters().toUpperCase();
    }

    get lowerCase() {
        return this.replaceAllUnwantedCharacters().toLowerCase();
    }
}

export default ChampionName;
