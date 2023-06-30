import { readHtmlSelectorFrom } from '../../../test-champion-update-setup.mjs';
import ChampionSpotlightParser from '../../../../dev/script/champion-update/parser/champion-spotlight-parser.mjs';

describe('ChampionSpotlightParser', () => {

    const daniMoonstar = new ChampionSpotlightParser(readHtmlSelectorFrom('test/test-data/news/dani-moonstar/index.html'));
    const shocker = new ChampionSpotlightParser(readHtmlSelectorFrom('test/test-data/news/champion-spotlight-shocker/index.html'));
    const magik = new ChampionSpotlightParser(readHtmlSelectorFrom('test/test-data/news/champion-spotlight-magik/index.html'));
    const quake = new ChampionSpotlightParser(readHtmlSelectorFrom('test/test-data/news/champion-spotlight-quake/index.html'));
    const gorr = new ChampionSpotlightParser(readHtmlSelectorFrom('test/test-data/news/champion-spotlight-gorr-the-god-butcher/index.html'));
    const daredevilHellsKitchen = new ChampionSpotlightParser(readHtmlSelectorFrom('test/test-data/news/champion-spotlight-daredevil-hells-kitchen/index.html'));
    const spidermanSupreme = new ChampionSpotlightParser(readHtmlSelectorFrom('test/test-data/news/champion-spotlight-spider-man-supreme/index.html'));
    const mantis = new ChampionSpotlightParser(readHtmlSelectorFrom('test/test-data/news/champion-spotlight-mantis/index.html'));
    const antmanFuture = new ChampionSpotlightParser(readHtmlSelectorFrom('test/test-data/news/champion-spotlight-ant-man-future/index.html'));

    function getExpectedStarLevels(start, end) {
        const starLevels = [];
        for (let index = start; index <= end; index++) {
            starLevels.push(index);
        }
        return starLevels;
    }

    function expectStarLevels(championParser, start, end) {
        const starLevels = championParser.getStarLevels();
        const expectedStarLevels = getExpectedStarLevels(start, end);
        expect(starLevels).to.have.all.keys(expectedStarLevels);
        //Also check order since it's not implemented in chai yet. https://github.com/chaijs/chai/issues/1080
        expect(Array.from(starLevels)).to.have.ordered.members(expectedStarLevels);
    }

    describe('.getClassType', () => {
        it('should return the expected class type for mutant', () => {
            expect(daniMoonstar.getClassType()).to.equal('MUTANT');
        });
        it('should return the expected class type for tech', () => {
            expect(shocker.getClassType()).to.equal('TECH');
        });
        it('should return the expected class type for cosmic', () => {
            expect(gorr.getClassType()).to.equal('COSMIC');
        });
        it('should return the expected class type for older mystic', () => {
            expect(magik.getClassType()).to.equal('MYSTIC');
        });
        it('should return the expected class type for older science', () => {
            expect(quake.getClassType()).to.equal('SCIENCE');
        });
        it('should return the expected class type for older skill', () => {
            expect(daredevilHellsKitchen.getClassType()).to.equal('SKILL');
        });
    });

    describe('.getClassTypeAsConstant', () => {
        it('should return the expected class type for mutant', () => {
            expect(daniMoonstar.getClassTypeAsConstant()).to.equal('TYPE.MUTANT');
        });
        it('should return the expected class type for tech', () => {
            expect(shocker.getClassTypeAsConstant()).to.equal('TYPE.TECH');
        });
        it('should return the expected class type for cosmic', () => {
            expect(gorr.getClassTypeAsConstant()).to.equal('TYPE.COSMIC');
        });
        it('should return the expected class type for older mystic', () => {
            expect(magik.getClassTypeAsConstant()).to.equal('TYPE.MYSTIC');
        });
        it('should return the expected class type for older science', () => {
            expect(quake.getClassTypeAsConstant()).to.equal('TYPE.SCIENCE');
        });
    });

    describe('.getAbilities', () => {
        it('should return the expected abilities for Dani Moonstar', () => {
            const expectedAbilities = [ 'Falter', 'Prowess', 'Energy Vulnerability', 'Unblockable', 'Slow', 'Overload', 'Neuroshock' ];
            expect(daniMoonstar.getAbilities()).to.have.ordered.members(expectedAbilities);
        });
        it('should return the expected abilities for Shocker', () => {
            const expectedAbilities = [ 'Shock Immunity', 'Unblockable', 'Stun', 'Energize' ];
            expect(shocker.getAbilities()).to.have.ordered.members(expectedAbilities);
        });
        it('should return the expected abilities for Magik', () => {
            const expectedAbilities = [ 'Nullify', 'Power Lock', 'Power Steal' ];
            expect(magik.getAbilities()).to.have.ordered.members(expectedAbilities);
        });
    });

    describe('.getStarLevels', () => {
        it('should return the expected levels for Dani Moonstar', () => {
            expectStarLevels(daniMoonstar, 2, 6);
        });
        it('should return the expected levels for Shocker', () => {
            expectStarLevels(shocker, 2, 6);
        });
        it('should return only 2-star for Magik', () => {
            expect(magik.getStarLevels()).to.have.all.keys(2);
        });
        it('should return the expected levels for Quake', () => {
            expectStarLevels(quake, 2, 5);
        });
        it('should return the expected levels for Gorr', () => {
            expectStarLevels(gorr, 2, 7);
        });
    });

    describe('.getName', () => {
        it('should return Dani Moonstar', () => {
            expect(daniMoonstar.getName().fullName).to.equal('Dani Moonstar');
        });
        it('should return undefined shortName for Dani', () => {
            expect(daniMoonstar.getName().shortName).to.be.undefined;
        });
        it('should return Shocker', () => {
            expect(shocker.getName().fullName).to.equal('Shocker');
        });
        it('should return Magik', () => {
            expect(magik.getName().fullName).to.equal('Magik');
        });
        it('should return Quake', () => {
            expect(quake.getName().fullName).to.equal('Quake');
        });
        it('should return Gorr', () => {
            expect(gorr.getName().fullName).to.equal('Gorr the God Butcher');
        });
        it('should return Gorr as shortName', () => {
            expect(gorr.getName().shortName).to.equal('Gorr');
        });
        it('should return Daredevil', () => {
            expect(daredevilHellsKitchen.getName().fullName).to.equal('Daredevil (Hell’s Kitchen)');
        });
        it('should return Daredevil as shortName', () => {
            expect(daredevilHellsKitchen.getName().shortName).to.equal('Daredevil');
        });
        it('should return shortName for Spider-Man (Supreme)', () => {
            expect(spidermanSupreme.getName().shortName).to.equal('Spider-Man');
        });
        it('should return shortName for Ant-Man (Future)', () => {
            expect(antmanFuture.getName().shortName).to.equal('Ant-Man');
        });
        it('should return undefined shortName for Mantis', () => {
            expect(mantis.getName().shortName).to.be.undefined;
        });
    });

});
