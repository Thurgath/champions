import FileLinesUpdater from '../../../../dev/script/champion-update/file-updater/file-lines-updater.mjs';
import EnglishLanguageFileUpdater from '../../../../dev/script/champion-update/file-updater/english-language-file-updater.mjs';
import ChampionName from '../../../../dev/script/champion-update/model/champion-name.mjs';
import { readFrom } from '../../../test-champion-update-setup.mjs';

describe('EnglishLanguageFileUpdater', () => {

    const languageFileUpdater = new EnglishLanguageFileUpdater(new FileLinesUpdater(readFrom('test/test-data/lang-en.json')));

    function onlyWith(arrayWithElementsToFilter) {
        //Ordered array elements anywhere in array is not implemented in chai https://github.com/chaijs/chai/issues/1056
        return (element) => arrayWithElementsToFilter.indexOf(element) !== -1;
    }

    function expectInsertedValues(championName, ...expectedOrderedLines) {
        const afterInsert = languageFileUpdater.insert(championName).filter(onlyWith(expectedOrderedLines));
        expect(afterInsert).to.have.deep.ordered.members(expectedOrderedLines);
    }

    function createConstantFrom(championName) {
        return `    "champion-${championName.lowerCase}-name": "${championName.fullName}",`;
    }

    const abominationImmortalName = new ChampionName('Abomination (Immortal)');
    const abominationImmortal = createConstantFrom(abominationImmortalName);
    const aegon = createConstantFrom(new ChampionName('Ægon', new ChampionName('Aegon')));
    const nimrodName = new ChampionName('Nimrod');
    const nimrod = createConstantFrom(nimrodName);
    const omegaRed = createConstantFrom(new ChampionName('Omega Red'));
    const x23 = createConstantFrom(new ChampionName('Wolverine (X-23)', new ChampionName('X-23')));
    const yonduName = new ChampionName('Yondu');
    const yondu = createConstantFrom(yonduName);

    describe('.insert', () => {
        it('should insert new line at start', () => {
            expectInsertedValues(abominationImmortalName, abominationImmortal, aegon);
        });

        it('should insert new line at middle', () => {
            expectInsertedValues(nimrodName, aegon, nimrod, omegaRed);
        });

        it('should insert new line at end', () => {
            expectInsertedValues(yonduName, omegaRed, x23, yondu);
        });
    });
});
