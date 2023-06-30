import FileLinesUpdater from '../../../../dev/script/champion-update/file-updater/file-lines-updater.mjs';
import EnglishLanguageFileUpdater from '../../../../dev/script/champion-update/file-updater/english-language-file-updater.mjs';
import ChampionName from '../../../../dev/script/champion-update/model/champion-name.mjs';
import { readFrom } from '../../../test-champion-update-setup.mjs';

describe('EnglishLanguageFileUpdater', () => {

    const languageFileUpdater = new EnglishLanguageFileUpdater(new FileLinesUpdater(readFrom('test/test-data/lang-en.json')));
    const expectedFirstEffect = `    "effect-itscomplicated-name": "It's Complicated",`;

    function onlyWith(arrayWithElementsToFilter) {
        //Ordered array elements anywhere in array is not implemented in chai https://github.com/chaijs/chai/issues/1056
        return (element) => arrayWithElementsToFilter.indexOf(element) !== -1;
    }

    function expectInsertedValues(championName, ...expectedOrderedLines) {
        const afterInsert = languageFileUpdater.insert(championName);
        expect(afterInsert.filter(onlyWith(expectedOrderedLines))).to.have.deep.ordered.members(expectedOrderedLines);
    }

    function createConstantFrom(championName) {
        return `    "champion-${championName.lowerCase}-name": "${championName.fullName}",`;
    }

    function createShortnameConstantFrom(championName) {
        return `    "champion-${championName.lowerCase}-shortname": "${championName.shortName}",`;
    }

    const abominationImmortalName = new ChampionName('Abomination (Immortal)').withShortName('Abomination');
    const abominationImmortal = createConstantFrom(abominationImmortalName);
    const abominationImmortalShort = createShortnameConstantFrom(abominationImmortalName);
    const aegon = createConstantFrom(new ChampionName('Ægon', new ChampionName('Aegon')));
    const nimrodName = new ChampionName('Nimrod');
    const nimrod = createConstantFrom(nimrodName);
    const omegaRed = createConstantFrom(new ChampionName('Omega Red'));
    const superiorIronManName = new ChampionName('Superior Iron Man').withShortName('Iron Man');
    const superiorIronMan = createShortnameConstantFrom(superiorIronManName);
    const unstoppableColossusName = new ChampionName('Unstoppable Colossus').withShortName('U.Colossus');
    const unstoppableColossus = createShortnameConstantFrom(unstoppableColossusName);
    const x23 = createConstantFrom(new ChampionName('Wolverine (X-23)', new ChampionName('X-23')));
    const yonduName = new ChampionName('Yondu');
    const yondu = createConstantFrom(yonduName);

    describe('.insert', () => {
        it('should insert new line at start', () => {
            expectInsertedValues(abominationImmortalName, abominationImmortal, aegon, abominationImmortalShort, superiorIronMan);
        });
        it('should insert new line at middle', () => {
            expectInsertedValues(nimrodName, aegon, nimrod, omegaRed);
        });
        it('should insert new line at end', () => {
            expectInsertedValues(yonduName, omegaRed, x23, yondu);
        });
        it('should insert new line at end of short names', () => {
            expectInsertedValues(unstoppableColossusName, superiorIronMan, unstoppableColossus, expectedFirstEffect);
        });
    });
});
