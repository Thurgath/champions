import { getPi } from '../../src/data/pi';
import { STAR_RANK_LEVEL } from '../../data/model/Champion';

describe('data/pi', () => {

    describe('getPi()', () => it('should return non-zero default values', () => {
        const values = Object.keys(STAR_RANK_LEVEL).map((stars) => getPi({ uid: 'fake', stars, rank: 1, level: 1 }));
        expect(0).to.not.be.oneOf(values);
    }));
});
