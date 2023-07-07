import { CHAMPION } from './model/Champion';

export const SPOTLIGHT = CHAMPION.KITTYPRYDE;
export const RATINGS = [ 1, 2, 3, 4, 5 ];
export const GRADES = [ 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'E', 'F' ];
export const RANGES = [
    'melee',
    'short',
    'medium',
    'long',
];
export const DAMAGE_TYPES = [
    'physical',
    'energy',
];
export const PROFILE_TYPES = [
    'email',
    'reddit',
    'kabam',
    'spotlight',
];

class Guides {
    constructor() {
        const requiredGuides = require.context('./guides', true, /\.json$/);
        this._championKeyToGuide = requiredGuides.keys().reduce((map, key) => {
            map[ this.#guideUrlToName(key) ] = requiredGuides(key);
            return map;
        }, {});
    }

    #guideUrlToName(key) {
        return key.replace(/\.\/(\w\w\/)?/, '').replace('.json', '');
    }

    hasGuide(championUid, language = 'en') {
        return this._championKeyToGuide[ `${ championUid }_${ language }` ] !== undefined
            || this._championKeyToGuide[ championUid ] !== undefined;
    }

    getGuideFor(championUid, language = 'en') {
        const foundGuide = this._championKeyToGuide[ `${ championUid }_${ language }` ] ||
            this._championKeyToGuide[ championUid ];
        return foundGuide;
    }

    getRandomGuideFor(language) {
        let searchRegExp = /^[^_]*$/;
        if (language && language !== 'en') {
            searchRegExp = new RegExp(`_${language}`);
        }
        const foundGuides = Object.keys(this._championKeyToGuide).filter((key) => searchRegExp.test(key));
        const foundGuide = foundGuides[ (Math.random() * foundGuides.length) | 0 ];
        if (foundGuide.includes('_')) {
            return foundGuide.replace(searchRegExp, '');
        }
        return foundGuide;
    }

    #getChampionUidWithLanguage(championUid, language) {
        const languageId = language === 'en' ? '' : `_${language}`;
        const championUidWithLanguage = `${championUid}${languageId}`;
        return championUidWithLanguage;
    }

    import(championUid, guideText, language) {
        this._championKeyToGuide[ this.#getChampionUidWithLanguage(championUid, language) ] = JSON.parse(guideText);
    }

    getFileNameFor(championUid, language) {
        return `${ this.#getChampionUidWithLanguage(championUid, language) }.json`;
    }
}

const guides = new Guides();

export default guides;
