import FileLinesUpdater from '../../../../dev/script/champion-update/file-updater/file-lines-updater.mjs';
import ChampionStarLevelUpdater from '../../../../dev/script/champion-update/file-updater/champion-star-level-updater.mjs';
import ChampionName from '../../../../dev/script/champion-update/model/champion-name.mjs';
import { readFrom } from '../../../test-champion-update-setup.mjs';

describe('ChampionStarLevelUpdater', () => {

    const championStarLevelUpdater = new ChampionStarLevelUpdater(new FileLinesUpdater(readFrom('test/test-data/champion-star-levels.js')));
    const endString = '    ]),';

    function onlyWith(arrayWithElementsToFilter) {
        //Ordered array elements anywhere in array is not implemented in chai https://github.com/chaijs/chai/issues/1056
        return (element) => arrayWithElementsToFilter.indexOf(element) !== -1;
    }

    function endStrings(expectedNumber) {
        return new Array(expectedNumber).fill(endString);
    }

    function expectInsertedValues(classType, championName, starLevels, ...expectedOrderedLines) {
        //Flatten array since it could contain arrays of endString. If we remove endString, all of them will be removed.
        const flattenedExpectedLines = expectedOrderedLines.flat();
        const afterInsert = championStarLevelUpdater.insert(classType, championName, starLevels).filter(onlyWith(flattenedExpectedLines));
        expect(afterInsert).to.have.deep.ordered.members(flattenedExpectedLines);
    }

    function expectUpdatedValues(championName, starLevels, ...expectedOrderedLines) {
        const afterUpdate = championStarLevelUpdater.update(championName, starLevels);
        expect(afterUpdate.filter(onlyWith(expectedOrderedLines))).to.have.deep.ordered.members(expectedOrderedLines);
    }

    function getConstantStringFrom(classType) {
        return `    ...typeId(${classType}, [`;
    }

    function starLevelsFrom(startStarlevel, stopStarLevel) {
        return new Array(stopStarLevel - startStarlevel + 1).fill().map((_, index) => index + startStarlevel);
    }

    function createConstant(name, startStarlevel, stopStarLevel) {
        const starLevels = starLevelsFrom(startStarlevel, stopStarLevel);
        return `        ...championStars({ uid: CHAMPION.${name.upperCase} }, [ ${starLevels.join(', ')} ]),`;
    }
    
    describe('.update', () => {
        const hoodName = new ChampionName('The Hood', new ChampionName('hood'));
        const hood = createConstant(hoodName, 2, 6);
        const symbioteSupremeName = new ChampionName('Symbiote Supreme');
        const symbioteSupreme = createConstant(symbioteSupremeName, 2, 7);
        const symbioteSupremeUpToSixStar = createConstant(symbioteSupremeName, 2, 6);

        it('should replace current line', () => {
            expectUpdatedValues(symbioteSupremeName, starLevelsFrom(2, 7), getConstantStringFrom('TYPE.MYSTIC'), hood, symbioteSupreme);
            //Restore. There's probably a better way to not affect other tests.
            // Don't want to create a new instance of ChampionStarLevelUpdater and FileUpdater for each test though.
            expectUpdatedValues(symbioteSupremeName, starLevelsFrom(2, 6), getConstantStringFrom('TYPE.MYSTIC'), hood, symbioteSupremeUpToSixStar);
        });
    });

    describe('.insert', () => {
        
        describe('Cosmic', () => {
            const gamoraName = new ChampionName('Angela');
            const gamora = createConstant(gamoraName, 2, 6);
            const medusa = createConstant(new ChampionName('Medusa'), 2, 6);
            const venompoolName = new ChampionName('Venompool');
            const venompool = createConstant(venompoolName, 2, 7);

            it('should insert new line at start of class type', () => {
                expectInsertedValues('TYPE.COSMIC', gamoraName, starLevelsFrom(2, 6), getConstantStringFrom('TYPE.COSMIC'), gamora, medusa);
            });
            it('should insert new Cosmic at end of class type', () => {
                expectInsertedValues('TYPE.COSMIC', venompoolName, starLevelsFrom(2, 7), medusa, venompool, endString, getConstantStringFrom('TYPE.TECH'), endStrings(6));
            });
        });

        describe('Tech', () => {
            const guardianName = new ChampionName('Guardian');
            const guardian = createConstant(guardianName, 3, 7);
            const nebula = createConstant(new ChampionName('Nebula'), 2, 6);
            const nimrodName = new ChampionName('Nimrod');
            const nimrod = createConstant(nimrodName, 2, 6);

            it('should insert new line at start of class type', () => {
                expectInsertedValues('TYPE.TECH', guardianName, starLevelsFrom(3, 7), getConstantStringFrom('TYPE.TECH'), guardian, nebula);
            });
            it('should insert new line at end of class type', () => {
                expectInsertedValues('TYPE.TECH', nimrodName, starLevelsFrom(2, 6), endString, nebula, nimrod, endString, getConstantStringFrom('TYPE.MUTANT'), endStrings(5));
            });
        });

        describe('Mutant', () => {
            const apocalypseName = new ChampionName('Apocalypse');
            const apocalypse = createConstant(apocalypseName, 3, 6);
            const storm = createConstant(new ChampionName('Storm'), 2, 6);
            const sunspotName = new ChampionName('Sunspot');
            const sunspot = createConstant(sunspotName, 2, 7);

            it('should insert new line at start of class type', () => {
                expectInsertedValues('TYPE.MUTANT', apocalypseName, starLevelsFrom(3, 6), getConstantStringFrom('TYPE.MUTANT'), apocalypse, storm);
            });
            it('should insert new line at end of class type', () => {
                expectInsertedValues('TYPE.MUTANT', sunspotName, starLevelsFrom(2, 7), endStrings(2), storm, sunspot, endString, getConstantStringFrom('TYPE.SKILL'), endStrings(4));
            });
        });

        describe('Skill', () => {
            const aegonName = new ChampionName('Aegon');
            const aegon = createConstant(aegonName, 3, 6);
            const killmonger = createConstant(new ChampionName('Killmonger'), 2, 7);
            const kingpinName = new ChampionName('Kingpin');
            const kingpin = createConstant(kingpinName, 2, 6);

            it('should insert new line at start of class type', () => {
                expectInsertedValues('TYPE.SKILL', aegonName, starLevelsFrom(3, 6), getConstantStringFrom('TYPE.MUTANT'), aegon, killmonger);
            });
            it('should insert new line at end of class type', () => {
                expectInsertedValues('TYPE.SKILL', kingpinName, starLevelsFrom(2, 6), endStrings(3), killmonger, kingpin, endString, getConstantStringFrom('TYPE.SCIENCE'), endStrings(3));
            });
        });

        describe('Science', () => {
            const immortalAbominationName = new ChampionName('Abomination (Immortal)');
            const immortalAbomination = createConstant(immortalAbominationName, 2, 6);
            const humanTorch = createConstant(new ChampionName('Human Torch'), 2, 6);
            const thingName = new ChampionName('The Thing');
            const thing = createConstant(thingName, 2, 6);

            it('should insert new line at start of class type', () => {
                expectInsertedValues('TYPE.SCIENCE', immortalAbominationName, starLevelsFrom(2, 6), getConstantStringFrom('TYPE.SCIENCE'), immortalAbomination, humanTorch);
            });
            it('should insert new line at end of class type', () => {
                expectInsertedValues('TYPE.SCIENCE', thingName, starLevelsFrom(2, 6), endStrings(4), immortalAbomination, thing, endString, getConstantStringFrom('TYPE.MYSTIC'), endStrings(2));
            });
        });

        describe('Mystic', () => {
            const claireName = new ChampionName('Black Widow (Claire Voyant)', new ChampionName('Black Widow Claire'));
            const claire = createConstant(claireName, 2, 6);
            const hood = createConstant(new ChampionName('The Hood', new ChampionName('Hood')), 2, 6);
            const magikName = new ChampionName('Magik');
            const magik = createConstant(magikName, 2, 5);
            const symbioteSupreme = createConstant(new ChampionName('Symbiote Supreme'), 2, 6);
            const tigraName = new ChampionName('Tigra');
            const tigra = createConstant(tigraName, 2, 6);

            it('should insert new line at start of class type', () => {
                expectInsertedValues('TYPE.MYSTIC', claireName, starLevelsFrom(2, 6), getConstantStringFrom('TYPE.MYSTIC'), claire, hood);
            });
            it('should insert new line at the middle of class type', () => {
                expectInsertedValues('TYPE.MYSTIC', magikName, starLevelsFrom(2, 5), hood, magik);
            });
            it('should insert new line at end of class type', () => {
                expectInsertedValues('TYPE.MYSTIC', tigraName, starLevelsFrom(2, 6), endStrings(5), symbioteSupreme, tigra, endStrings(2));
            });
        });
    });
});
