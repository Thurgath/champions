import ChampionName from '../model/champion-name.mjs';

class ChampionSpotlightParser {

    constructor(htmlDataAsSelector) {
        this._htmlDataAsSelector = htmlDataAsSelector;
    }

    static get #STAR_SEARCH_STRING() {
        return '-Star';
    }

    #evaluate(element) {
        return this._htmlDataAsSelector(element);
    }

    #asStarLevel(level) {
        return Number(level.substring(0, level.indexOf(ChampionSpotlightParser.#STAR_SEARCH_STRING)));
    }

    #parseClassTypeAndAbilities() {
        const parentContents = [ ...this.#evaluate('.view-article-body p strong').parent().contents() ];
        const classTypeAndAbilitiesFromParent = parentContents
            .filter((element) => {
                return element.type === 'text' && this.#evaluate(element).text().trim();
            }, this).map((element) => this.#evaluate(element).text().trim(), this);
        this.classType = classTypeAndAbilitiesFromParent[ 0 ];
        this.abilities = classTypeAndAbilitiesFromParent[ 1 ].split(', ');
    }

    getName() {
        return new ChampionName(this.#evaluate('.hero-content h1').text().trim());
    }

    getClassType() {
        if (!this.classType) {
            this.#parseClassTypeAndAbilities();
        }
        return this.classType.toUpperCase();
    }
    
    getClassTypeAsConstant() {
        return `TYPE.${this.getClassType()}`
    }

    getAbilities() {
        if (!this.abilities) {
            this.#parseClassTypeAndAbilities();
        }
        return this.abilities;
    }

    getStarLevels() {
        const foundStarLevels = this.#evaluate('.view-article-body figure table tbody tr td').filter((index, element) => {
            return this.#evaluate(element).text().trim().includes(ChampionSpotlightParser.#STAR_SEARCH_STRING);
        }, this).map((index, element) => {
            return this.#asStarLevel(this.#evaluate(element).text().trim());
        }, this).toArray();
        //2-stars(or 1-stars) are not being listed
        foundStarLevels.unshift(2);
        return new Set(foundStarLevels);
    }
}

export default ChampionSpotlightParser;
