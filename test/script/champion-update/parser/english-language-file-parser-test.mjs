import EnglishLanguageFileParser from '../../../../dev/script/champion-update/parser/english-language-file-parser.mjs';
import ChampionName from '../../../../dev/script/champion-update/model/champion-name.mjs';
import { readFrom } from '../../../test-champion-update-setup.mjs';

describe('EnglishLanguageFileParser', () => {

    const languageFileParser = new EnglishLanguageFileParser(readFrom('test/test-data/lang-en.json'));
    const languageFileParserWithRealFile = new EnglishLanguageFileParser(readFrom('src/data/lang/en.json'));

    function createMapEntryFrom(championName) {
        return [ `${championName.fullName}`, `${championName.lowerCase}` ];
    }

    const aegon = createMapEntryFrom(new ChampionName('Ægon', new ChampionName('Aegon')));
    const omegaRed = createMapEntryFrom(new ChampionName('Omega Red'));
    const x23 = createMapEntryFrom(new ChampionName('Wolverine (X-23)', new ChampionName('X-23')));
    const expectedMap = new Map([ aegon, omegaRed, x23 ]);

    describe('.getAllChampions', () => {
        it('should return all champions', () => {
            const allChampions = languageFileParser.getAllChampions();
            expect(allChampions).to.be.an('map').that.has.all.deep.keys(Array.from(expectedMap.keys()));
            expect(Array.from(allChampions.values())).to.have.members(Array.from(expectedMap.values()));
        });
        it('should return all champions with real file', () => {
            const allChampions = languageFileParserWithRealFile.getAllChampions();
            expect(allChampions).to.be.an('map').that.has.lengthOf.above(200);
        });
    });
});