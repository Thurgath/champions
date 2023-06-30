import ChampionName from '../../../../dev/script/champion-update/model/champion-name.mjs';

function createChampionName(name) {
    return new ChampionName(name);
}

describe('ChampionName', () => {

    const quakeName = 'Quake';
    const quake = createChampionName(quakeName);
    const gorrName = 'Gorr the God Butcher';
    const gorr = createChampionName(gorrName);
    const daredevilName = 'Daredevil (Hell’s Kitchen)';
    const daredevilHellsKitchen = createChampionName(daredevilName);
    const spidermanStarkName = 'Spider-man (Stark Enhanced)';
    const spidermanStark = createChampionName(spidermanStarkName);

    describe('.fullname', () => {
        it('should return Quake', () => {
            expect(quake.fullName).to.equal(quakeName);
        });
        it('should return Gorr', () => {
            expect(gorr.fullName).to.equal(gorrName);
        });
        it('should return Daredevil', () => {
            expect(daredevilHellsKitchen.fullName).to.equal(daredevilName);
        });
        it('should return Spiderman', () => {
            expect(spidermanStark.fullName).to.equal(spidermanStarkName);
        });
    });

    describe('.lowerCase', () => {
        it('should return quake', () => {
            expect(quake.lowerCase).to.equal('quake');
        });
        it('should return spidermanstarkenhanced', () => {
            expect(spidermanStark.lowerCase).to.equal('spidermanstarkenhanced');
        });
    });

    describe('.upperCase', () => {
        it('should return QUAKE', () => {
            expect(quake.upperCase).to.equal('QUAKE');
        });
        it('should return DAREDEVILHELLSKITCHEN', () => {
            expect(daredevilHellsKitchen.upperCase).to.equal('DAREDEVILHELLSKITCHEN');
        });
        it('should return SPIDERMANSTARKENHANCED', () => {
            expect(spidermanStark.upperCase).to.equal('SPIDERMANSTARKENHANCED');
        });
    });

    describe('with legacy name', () => {

        const claireName = 'Black Widow (Claire Voyant)';
        const claire = new ChampionName(claireName, new ChampionName('Black Widow Claire'));
        const daredevilHellsKitchenName = 'Daredevil (Hell\'s Kitchen)';
        const daredevilHellsKitchen = new ChampionName(daredevilHellsKitchenName, new ChampionName('Daredevil (Netflix)'));
        const magnetoHouseOfXName = 'Magneto (House of X)';
        const magnetoHouseOfX = new ChampionName(magnetoHouseOfXName).withPreviousFrom(new ChampionName('Magneto (Marvel Now)'));

        describe('.fullname', () => {
            it('should return new name', () => {
                expect(claire.fullName).to.equal(claireName);
            });
            it('should return new name', () => {
                expect(daredevilHellsKitchen.fullName).to.equal(daredevilHellsKitchenName);
            });
            it('should return new name', () => {
                expect(magnetoHouseOfX.fullName).to.equal(magnetoHouseOfXName);
            });
        });

        describe('.lowerCase', () => {
            it('should return old name', () => {
                expect(claire.lowerCase).to.equal('blackwidowclaire');
            });
            it('should return old name', () => {
                expect(daredevilHellsKitchen.lowerCase).to.equal('daredevilnetflix');
            });
            it('should return old name', () => {
                expect(magnetoHouseOfX.lowerCase).to.equal('magnetomarvelnow');
            });
        });

        describe('.upperCase', () => {
            it('should return old name', () => {
                expect(claire.upperCase).to.equal('BLACKWIDOWCLAIRE');
            });
            it('should return old name', () => {
                expect(daredevilHellsKitchen.upperCase).to.equal('DAREDEVILNETFLIX');
            });
            it('should return old name', () => {
                expect(magnetoHouseOfX.upperCase).to.equal('MAGNETOMARVELNOW');
            });
        });
    });

    const captainInfinityWar = new ChampionName('Captain America (Infinity War)').withShortName('Captain America');
    describe('.shortName', () => {
        it('should return undefined if not set', () => {
            expect(quake.shortName).to.be.undefined;
        });
        it('should return name if set', () => {
            expect(captainInfinityWar.shortName).to.equal('Captain America');
        });
    });
    describe('.hasShortName', () => {
        it('should return false if not set', () => {
            expect(quake.hasShortName()).to.be.false;
        });
        it('should return true if set', () => {
            expect(captainInfinityWar.hasShortName()).to.be.true;
        });
    });
});
