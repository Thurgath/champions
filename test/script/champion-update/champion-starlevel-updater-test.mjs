import FileLinesUpdater from '../../../dev/script/champion-update/file-lines-updater.mjs';
import ChampionStarlevelUpdater from '../../../dev/script/champion-update/champion-starlevel-updater.mjs';
import ChampionName from '../../../dev/script/champion-update/champion-name.mjs';
import { readFrom } from '../../test-champion-update-setup.mjs';

describe('champion-starlevel-updater', () => {

    const championStarlevelUpdater = new ChampionStarlevelUpdater(new FileLinesUpdater(readFrom('test/test-data/champion-starlevels.js')));
    const endString = '    ]),';

    function only(arrayWithElementsToFilter) {
        //Ordered array elements anywhere in array is not implemented in chai https://github.com/chaijs/chai/issues/1056
        return (element) => arrayWithElementsToFilter.indexOf(element) !== -1;
    }

    function endStrings(expectedNumber) {
        return new Array(expectedNumber).fill(endString);
    }

    function expectInsertedValues(classType, championName, starLevels, ...expectedOrderedLines) {
        //Flatten array since it could contain arrays of endString. If we remove endString, all of them will be removed.
        const flattenedExpectedLines = expectedOrderedLines.flat();
        const afterInsert = championStarlevelUpdater.insert(classType, championName, starLevels).filter(only(flattenedExpectedLines));
        expect(afterInsert).to.have.deep.ordered.members(flattenedExpectedLines);
    }

    function getConstantStringFrom(classType) {
        return `    ...typeId(${classType}, [`;
    }

    function starLevelsFrom(startStarlevel, stopStarLevel) {
        return new Array(stopStarLevel - startStarlevel + 1).fill().map((_, index) => index + startStarlevel);
    }

    function createConstant(name, startStarlevel, stopStarLevel) {
        const starLevels = starLevelsFrom(startStarlevel, stopStarLevel);
        return `        ...championStars({ uid: CHAMPION.${name.toUpperCase()} }, [ ${starLevels.join(', ')} ]),`;
    }

    //Cosmic
    const gamoraName = new ChampionName('Angela');
    const gamora = createConstant(gamoraName.upperCase, 2, 6);
    const medusa = createConstant('MEDUSA', 2, 6);
    const venompoolName = new ChampionName('Venompool');
    const venompool = createConstant(venompoolName.upperCase, 2, 7);

    describe('.insert', () => it('should insert new line at start of class type', () => {
        expectInsertedValues('TYPE.COSMIC', gamoraName, starLevelsFrom(2, 6), getConstantStringFrom('TYPE.COSMIC'), gamora, medusa);
    }));

    describe('.insert', () => it('should insert new Cosmic at end of class type', () => {
        expectInsertedValues('TYPE.COSMIC', venompoolName, starLevelsFrom(2, 7), medusa, venompool, endString, getConstantStringFrom('TYPE.TECH'), endStrings(6));
    }));

    //Tech
    const guardianName = new ChampionName('Guardian');
    const guardian = createConstant(guardianName.upperCase, 3, 7);
    const nebula = createConstant('NEBULA', 2, 6);
    const nimrodName = new ChampionName('Nimrod');
    const nimrod = createConstant(nimrodName.upperCase, 2, 6);

    describe('.insert', () => it('should insert new line at start of class type', () => {
        expectInsertedValues('TYPE.TECH', guardianName, starLevelsFrom(3, 7), getConstantStringFrom('TYPE.TECH'), guardian, nebula);
    }));

    describe('.insert', () => it('should insert new line at end of class type', () => {
        expectInsertedValues('TYPE.TECH', nimrodName, starLevelsFrom(2, 6), endString, nebula, nimrod, endString, getConstantStringFrom('TYPE.MUTANT'), endStrings(5));
    }));

    //Mutant
    const apocalypseName = new ChampionName('Apocalypse');
    const apocalypse = createConstant(apocalypseName.upperCase, 3, 6);
    const storm = createConstant('STORM', 2, 6);
    const sunspotName = new ChampionName('Sunspot');
    const sunspot = createConstant(sunspotName.upperCase, 2, 7);

    describe('.insert', () => it('should insert new line at start of class type', () => {
        expectInsertedValues('TYPE.MUTANT', apocalypseName, starLevelsFrom(3, 6), getConstantStringFrom('TYPE.MUTANT'), apocalypse, storm);
    }));

    describe('.insert', () => it('should insert new line at end of class type', () => {
        expectInsertedValues('TYPE.MUTANT', sunspotName, starLevelsFrom(2, 7), endStrings(2), storm, sunspot, endString, getConstantStringFrom('TYPE.SKILL'), endStrings(4));
    }));

    //Skill
    const aegonName = new ChampionName('Aegon');
    const aegon = createConstant(aegonName.upperCase, 3, 6);
    const killmonger = createConstant('KILLMONGER', 2, 7);
    const kingpinName = new ChampionName('Kingpin');
    const kingpin = createConstant(kingpinName.upperCase, 2, 6);

    describe('.insert', () => it('should insert new line at start of class type', () => {
        expectInsertedValues('TYPE.SKILL', aegonName, starLevelsFrom(3, 6), getConstantStringFrom('TYPE.MUTANT'), aegon, killmonger);
    }));

    describe('.insert', () => it('should insert new line at end of class type', () => {
        expectInsertedValues('TYPE.SKILL', kingpinName, starLevelsFrom(2, 6), endStrings(3), killmonger, kingpin, endString, getConstantStringFrom('TYPE.SCIENCE'), endStrings(3));
    }));

    //Science
    const immortalAbominationName = new ChampionName('Abomination (Immortal)');
    const immortalAbomination = createConstant(immortalAbominationName.upperCase, 2, 6);
    const humanTorch = createConstant('HUMANTORCH', 2, 6);
    const thingName = new ChampionName('The Thing');
    const thing = createConstant(thingName.upperCase, 2, 6);

    describe('.insert', () => it('should insert new line at start of class type', () => {
        expectInsertedValues('TYPE.SCIENCE', immortalAbominationName, starLevelsFrom(2, 6), getConstantStringFrom('TYPE.SCIENCE'), immortalAbomination, humanTorch);
    }));

    describe('.insert', () => it('should insert new line at end of class type', () => {
        expectInsertedValues('TYPE.SCIENCE', thingName, starLevelsFrom(2, 6), endStrings(4), immortalAbomination, thing, endString, getConstantStringFrom('TYPE.MYSTIC'), endStrings(2));
    }));

    //Mystic
    const claireName = new ChampionName('Black Widow (Claire Voyant)');
    const claire = createConstant(claireName.upperCase, 2, 6);
    const hood = createConstant('HOOD', 2, 6);
    const magikName = new ChampionName('Magik');
    const magik = createConstant(magikName.upperCase, 2, 5);
    const symbioteSupreme = createConstant('SYMBIOTESUPREME', 2, 6);
    const tigraName = new ChampionName('Tigra');
    const tigra = createConstant(tigraName.upperCase, 2, 6);

    describe('.insert', () => it('should insert new line at start of class type', () => {
        expectInsertedValues('TYPE.MYSTIC', claireName, starLevelsFrom(2, 6), getConstantStringFrom('TYPE.MYSTIC'), claire, hood);
    }));

    describe('.insert', () => it('should insert new line at the middle of class type', () => {
        expectInsertedValues('TYPE.MYSTIC', magikName, starLevelsFrom(2, 5), hood, magik);
    }));

    describe('.insert', () => it('should insert new line at end of class type', () => {
        expectInsertedValues('TYPE.MYSTIC', tigraName, starLevelsFrom(2, 6), endStrings(5), symbioteSupreme, tigra, endStrings(2));
    }));
});
