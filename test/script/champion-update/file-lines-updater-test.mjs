import FileLinesUpdater from '../../../dev/script/champion-update/file-lines-updater.mjs';
import { readFrom } from '../../test-champion-update-setup.mjs';

describe('FileLinesUpdater', () => {

    const endOfFile = '// END';

    const fileLinesUpdater = new FileLinesUpdater(readFrom('test/test-data/champion-ids.js')).withEndOfSection( '//');

    function createFileLinesUpdaterWithoutLastLine() {
        return new FileLinesUpdater(readFrom('test/test-data/champion-ids.js').replace(endOfFile, '')).withEndOfSection( '//');
    }

    //Rest of the test are done in the respective test for each type

    describe('.insert', () => it('should throw error when searchString is not found', () => {
        const searchString = 'TYPE.NOTFOUND';
        expect(() => fileLinesUpdater.insert(searchString, '')).to.throw(Error, searchString);
    }));

    describe('.insert', () => it('should throw error when end of file marker is not found', () => {
        const endOfSectionMarker = '//';
        const fileLinesUpdaterWithoutEndLine = createFileLinesUpdaterWithoutLastLine();
        expect(() => fileLinesUpdaterWithoutEndLine.insert('TYPE.MYSTIC', 'export const MA')).to.throw(Error, endOfSectionMarker);
    }));
});
