import ChampionUpdateStatus from '../../../dev/script/champion-update/champion-update-status.mjs';
import ChampionName from '../../../dev/script/champion-update/model/champion-name.mjs';
import { copyFileSync, unlinkSync } from 'fs';

describe('ChampionUpdateStatus', () => {

    const testDataUrlToCopy = new URL('../../../test/test-data/championUpdateStatusTest.json', import.meta.url);
    const testDataUrl = new URL('../../../test/test-data/championUpdateStatusTestMocha.json', import.meta.url).toString();
    const expectedSpotlightUrl = 'https://playcontestofchampions.com/news/champion-spotlight-kitty-pryde/';
    const otherSpotlightUrl = 'https://playcontestofchampions.com/news/dani-moonstar/';
    let languageFileParserMock;

    beforeEach(async() => {
        languageFileParserMock = (await testdouble.replaceEsm('../../../dev/script/champion-update/parser/english-language-file-parser.mjs')).default.prototype;
    });

    before(() => {
        copyFileSync(testDataUrlToCopy, new URL(testDataUrl));
    });

    after(() => {
        unlinkSync(new URL(testDataUrl));
    });

    describe('.getLastUpdatedChampionSpotlightUrl', () => {
        it('should return correct champion spotlight url', () => {
            const updateStatus = new ChampionUpdateStatus(languageFileParserMock, testDataUrl);
            expect(updateStatus.getLastUpdatedChampionSpotlightUrl()).to.equal(expectedSpotlightUrl);
        });
    });

    describe('.getChampionNameFor', () => {
        const x23Name = new ChampionName('Wolverine (X-23)');
        it('for existing champion should return correct Champion name', () => {
            const x23OldName = 'x23';
            when(languageFileParserMock.getAllChampions()).thenReturn(new Map([ [ x23Name.fullName, x23OldName ] ]));
            const updateStatus = new ChampionUpdateStatus(languageFileParserMock, testDataUrl);
            expect(updateStatus.getChampionNameFor(x23Name).lowerCase).to.equal(x23OldName);
        });
        const daredevilHellsKitchen = new ChampionName('Daredevil (Hell\'s Kitchen)');
        it('for non-existing champion should return undefined', () => {
            when(languageFileParserMock.getAllChampions()).thenReturn(new Map([ ]));
            const updateStatus = new ChampionUpdateStatus(languageFileParserMock, testDataUrl);
            expect(updateStatus.getChampionNameFor(daredevilHellsKitchen)).to.be.undefined;
        });
    });

    describe('.update', () => {
        it('should update url and date', () => {
            const currentTime = new Date();
            const updateStatus = new ChampionUpdateStatus(languageFileParserMock, testDataUrl);
            const updatedStatus = updateStatus.update(otherSpotlightUrl);
            expect(updatedStatus.lastUpdatedChampionSpotlight).to.equal(otherSpotlightUrl);
            expect(updatedStatus.lastUpdatedDate).to.be.at.least(currentTime);

            //Load file again
            const updatedUpdateStatus = new ChampionUpdateStatus(languageFileParserMock, testDataUrl);
            expect(updatedUpdateStatus.getLastUpdatedChampionSpotlightUrl()).to.equal(updatedStatus.lastUpdatedChampionSpotlight);
            expect(updatedUpdateStatus.getLastUpdatedDate()).to.deep.equal(updatedStatus.lastUpdatedDate);

            //And change it back
            updatedUpdateStatus.update(expectedSpotlightUrl);
            const revertedUpdateStatus = new ChampionUpdateStatus(languageFileParserMock, testDataUrl);
            expect(revertedUpdateStatus.getLastUpdatedChampionSpotlightUrl()).to.equal(expectedSpotlightUrl);
        });
    });
});
