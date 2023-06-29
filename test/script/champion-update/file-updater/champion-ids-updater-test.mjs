import FileLinesUpdater from '../../../../dev/script/champion-update/file-updater/file-lines-updater.mjs';
import ChampionIdsUpdater from '../../../../dev/script/champion-update/file-updater/champion-ids-updater.mjs';
import ChampionName from '../../../../dev/script/champion-update/model/champion-name.mjs';
import { readFrom } from '../../../test-champion-update-setup.mjs';

describe('ChampionIdsUpdater', () => {

    function onlyWith(arrayWithElementsToFilter) {
        //Ordered array elements anywhere in array is not implemented in chai https://github.com/chaijs/chai/issues/1056
        return (element) => arrayWithElementsToFilter.indexOf(element) !== -1;
    }

    function expectInsertedValues(classType, championName, ...expectedOrderedChampions) {
        const afterInsert = championIdsUpdater.insert(classType, championName).filter(onlyWith(expectedOrderedChampions));
        expect(afterInsert).to.have.deep.ordered.members(expectedOrderedChampions);
    }

    function createConstant(name) {
        return `export const ${name.toUpperCase()} = '${name.toLowerCase()}';`;
    }

    const championIdsUpdater = new ChampionIdsUpdater(new FileLinesUpdater(readFrom('test/test-data/champion-ids.js'), '//'));
    
    describe('.insert', () => {
        describe('Cosmic', () => {
            const angelaName = new ChampionName('Angela');
            const angela = createConstant('ANGELA');
            const captainMarvelMovie = createConstant('CAPTAINMARVELMOVIE');
            const corvusGlaiveName = new ChampionName('Corvus Glaive');
            const corvusGlaive = createConstant(corvusGlaiveName.upperCase);
            const cosmicGhostRider = createConstant('COSMICGHOSTRIDER');
            const herculesName = new ChampionName('Hercules');
            const hercules = createConstant(herculesName.upperCase);

            it('should insert new Cosmic at second line of file', () => {
                expectInsertedValues('TYPE.COSMIC', angelaName, '// TYPE.COSMIC', angela, captainMarvelMovie, cosmicGhostRider);
            });

            it('should insert at middle of class type', () => {
                expectInsertedValues('TYPE.COSMIC', corvusGlaiveName, captainMarvelMovie, corvusGlaive, cosmicGhostRider);
            });

            it('should insert at end of class type', () => {
                expectInsertedValues('TYPE.COSMIC', herculesName, cosmicGhostRider, hercules, '// TYPE.TECH');
            });
        });
        describe('Tech', () => {
            const guardianName = new ChampionName('Guardian');
            const guardian = createConstant(guardianName.upperCase);
            const nimrodName = new ChampionName('Nimrod');
            const nimrod = createConstant(nimrodName.upperCase);

            it('should insert new Tech with no previous champions', () => {
                expectInsertedValues('TYPE.TECH', nimrodName, '// TYPE.TECH', nimrod, '// TYPE.MUTANT');
                expectInsertedValues('TYPE.TECH', guardianName, '// TYPE.TECH', guardian, nimrod, '// TYPE.MUTANT');
            });
        });
        describe('Mutant', () => {
            const archangelName = new ChampionName('Archangel');
            const archangel = createConstant(archangelName.upperCase);
            const apocalypseName = new ChampionName('Apocalypse');
            const apocalypse = createConstant(apocalypseName.upperCase);
            const kittyPride = createConstant('KITTYPRYDE');
            const magnetoName = new ChampionName('Magneto');
            const magneto = createConstant(magnetoName.upperCase);

            it('should insert at start of class type', () => {
                expectInsertedValues('TYPE.MUTANT', apocalypseName, '// TYPE.MUTANT', apocalypse, kittyPride);
                expectInsertedValues('TYPE.MUTANT', archangelName, '// TYPE.MUTANT', apocalypse, archangel, kittyPride);
            });

            it('should insert at end of class type', () => {
                expectInsertedValues('TYPE.MUTANT', magnetoName, kittyPride, magneto, '// TYPE.SKILL');
            });
        });
        describe('Skill', () => {
            const aegonName = new ChampionName('Aegon');
            const aegon = createConstant(aegonName.upperCase);
            const hitmonkey = createConstant('HITMONKEY');
            const kingpinName = new ChampionName('Kingpin');
            const kingpin = createConstant(kingpinName.upperCase);
            const moleman = createConstant('MOLEMAN');
            const nickName = new ChampionName('Nick Fury');
            const nick = createConstant(nickName.upperCase);

            it('should insert at start of class type', () => {
                expectInsertedValues('TYPE.SKILL', aegonName, '// TYPE.SKILL', aegon, hitmonkey, moleman);
            });

            it('should insert at middle of class type', () => {
                expectInsertedValues('TYPE.SKILL', kingpinName, hitmonkey, kingpin);
            });

            it('should insert at end of class type', () => {
                expectInsertedValues('TYPE.SKILL', nickName, moleman, nick, '// TYPE.SCIENCE');
            });
        });
        describe('Science', () => {
            const immortalAbominationName = new ChampionName('Abomination (Immortal)');
            const immortalAbomination = createConstant(immortalAbominationName.upperCase);
            const joefixit = createConstant('JOEFIXIT');
            const captainAmericaInfinityWarName = new ChampionName('Captain America (Infinity War)');
            const captainAmericaInfinityWar = createConstant(captainAmericaInfinityWarName.upperCase);
            const spiderman2099 = createConstant('SPIDERMAN2099');
            const thingName = new ChampionName('The Thing');
            const thing = createConstant(thingName.upperCase);

            it('should insert at start of class type', () => {
                expectInsertedValues('TYPE.SCIENCE', immortalAbominationName, '// TYPE.SCIENCE', immortalAbomination, joefixit, spiderman2099);
            });

            it('should insert at middle of class type', () => {
                expectInsertedValues('TYPE.SKILL', captainAmericaInfinityWarName, captainAmericaInfinityWar, spiderman2099);
            });

            it('should insert at end of class type', () => {
                expectInsertedValues('TYPE.SKILL', thingName, thing, spiderman2099, '// TYPE.MYSTIC');
            });
        });
        describe('Mystic', () => {
            const claireName = new ChampionName('Black Widow (Claire Voyant)');
            const claire = createConstant(claireName.upperCase);
            const diablo = createConstant('DIABLO');
            const dragonman = createConstant('DRAGONMAN');
            const hoodName = new ChampionName('The Hood');
            const hood = createConstant(hoodName.upperCase);
            const longshot = createConstant('LONGSHOT');
            const magikName = new ChampionName('Magik');
            const magik = createConstant(magikName.upperCase);

            it('should insert at start of class type', () => {
                expectInsertedValues('TYPE.MYSTIC', claireName, '// TYPE.SKILL', claire, diablo, dragonman);
            });

            it('should insert at middle of class type', () => {
                expectInsertedValues('TYPE.MYSTIC', magikName, dragonman, longshot, magik);
            });

            it('should insert at end of file', () => {
                expectInsertedValues('TYPE.MYSTIC', hoodName, longshot, hood, '// END');
            });
        });
    });
});
