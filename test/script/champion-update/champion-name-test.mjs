import ChampionName from '../../../dev/script/champion-update/champion-name.mjs';

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

    describe('.fullname', () => it('should return Quake', () => {
        expect(quake.fullName).to.equal(quakeName);
    }));

    describe('.lowerCase', () => it('should return quake', () => {
        expect(quake.lowerCase).to.equal('quake');
    }));

    describe('.upperCase', () => it('should return QUAKE', () => {
        expect(quake.upperCase).to.equal('QUAKE');
    }));

    describe('.fullname', () => it('should return Gorr', () => {
        expect(gorr.fullName).to.equal(gorrName);
    }));

    describe('.fullname', () => it('should return Daredevil', () => {
        expect(daredevilHellsKitchen.fullName).to.equal(daredevilName);
    }));

    describe('.lowerCase', () => it('should return daredevilhellskitchen', () => {
        expect(daredevilHellsKitchen.lowerCase).to.equal('daredevilhellskitchen');
    }));

    describe('.upperCase', () => it('should return DAREDEVILHELLSKITCHEN', () => {
        expect(daredevilHellsKitchen.upperCase).to.equal('DAREDEVILHELLSKITCHEN');
    }));

    describe('.fullname', () => it('should return Spiderman', () => {
        expect(spidermanStark.fullName).to.equal(spidermanStarkName);
    }));

    describe('.lowerCase', () => it('should return spidermanstarkenhanced', () => {
        expect(spidermanStark.lowerCase).to.equal('spidermanstarkenhanced');
    }));

    describe('.upperCase', () => it('should return SPIDERMANSTARKENHANCED', () => {
        expect(spidermanStark.upperCase).to.equal('SPIDERMANSTARKENHANCED');
    }));
});
