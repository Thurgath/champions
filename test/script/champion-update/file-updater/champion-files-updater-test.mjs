import ChampionFilesUpdater from '../../../../dev/script/champion-update/file-updater/champion-files-updater.mjs';
import ChampionName from '../../../../dev/script/champion-update/model/champion-name.mjs';
import { getOptions } from '../../../test-champion-update-setup.mjs';

describe('ChampionFilesUpdater', () => {

    const timeout = 5000;
    let idUpdaterMock;
    let starLevelUpdaterMock;
    let languageFileUpdaterMock;
    let updateStatusMock;
    const daniMoonstarUrl = new URL('../../../../test/test-data/news/dani-moonstar/index.html', import.meta.url);
    let daniMoonstar;
    const daniMoonstarName = new ChampionName('Dani Moonstar');

    beforeEach(async() => {
        idUpdaterMock = (await testdouble.replaceEsm('../../../../dev/script/champion-update/file-updater/champion-ids-updater.mjs')).default.prototype;
        starLevelUpdaterMock = (await testdouble.replaceEsm('../../../../dev/script/champion-update/file-updater/champion-star-level-updater.mjs')).default.prototype;
        languageFileUpdaterMock = (await testdouble.replaceEsm('../../../../dev/script/champion-update/file-updater/english-language-file-updater.mjs')).default.prototype;
        updateStatusMock = (await testdouble.replaceEsm('../../../../dev/script/champion-update/champion-update-status.mjs')).default.prototype;
        daniMoonstar = new ChampionFilesUpdater(daniMoonstarUrl.toString(), idUpdaterMock, starLevelUpdaterMock, languageFileUpdaterMock, updateStatusMock, getOptions());
    });

    describe('.update', () => {
        it('should update champion id file, champion starlevels flie and language file for a new champion', () => {
            const expectedStarLevels = new Set([ 2, 3, 4, 5, 6 ]);
            when(idUpdaterMock.insert('TYPE.MUTANT', daniMoonstarName)).thenReturn([]);
            when(starLevelUpdaterMock.insert('TYPE.MUTANT', daniMoonstarName, expectedStarLevels)).thenReturn([]);
            when(languageFileUpdaterMock.insert(daniMoonstarName)).thenReturn([]);
            when(updateStatusMock.getChampionNameFor(daniMoonstarName)).thenReturn(undefined);
            return daniMoonstar.update().then(() => {
                expect(idUpdaterMock.insert).to.have.been.calledWith('TYPE.MUTANT', daniMoonstarName);
                expect(starLevelUpdaterMock.insert).to.have.been.calledWith('TYPE.MUTANT', daniMoonstarName, expectedStarLevels);
                expect(languageFileUpdaterMock.insert).to.have.been.calledWith(daniMoonstarName);

                expect(starLevelUpdaterMock.update).to.not.have.been.called;
            });
        }).timeout(timeout);

        it('should only update champion starlevels flie for an existing champion', () => {
            const expectedStarLevels = new Set([ 2, 3, 4, 5, 6 ]);
            when(updateStatusMock.getChampionNameFor(daniMoonstarName)).thenReturn(daniMoonstarName);
            return daniMoonstar.update().then(() => {
                expect(starLevelUpdaterMock.update).to.have.been.calledWith(daniMoonstarName, expectedStarLevels);

                expect(idUpdaterMock.insert).to.not.have.been.called;
                expect(starLevelUpdaterMock.insert).to.not.have.been.called;
                expect(languageFileUpdaterMock.insert).to.not.have.been.called;
            });
        }).timeout(timeout);
    });
});
