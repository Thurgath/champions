import ChampionUpdateStatus from '../../../dev/script/champion-update/champion-update-status.mjs';

describe('ChampionUpdateStatus', () => {

    const testDataUrl = new URL('../../../test/test-data/championUpdateStatusTest.json', import.meta.url).toString();
    const expectedSpotlightUrl = 'https://playcontestofchampions.com/news/champion-spotlight-kitty-pryde/';
    const otherSpotlightUrl = 'https://playcontestofchampions.com/news/dani-moonstar/';

    describe('.getLastUpdatedChampionSpotlightUrl', () => {

        it('should return correct champion spotlight url', () => {
            const updateStatus = new ChampionUpdateStatus(testDataUrl);
            expect(updateStatus.getLastUpdatedChampionSpotlightUrl()).to.equal(expectedSpotlightUrl);
        });
    });

    describe('.update', () => {

        it('should update url and date', () => {
            const currentTime = new Date();
            const updateStatus = new ChampionUpdateStatus(testDataUrl);
            const updatedStatus = updateStatus.update(otherSpotlightUrl);
            expect(updatedStatus.lastUpdatedChampionSpotlight).to.equal(otherSpotlightUrl);
            expect(updatedStatus.lastUpdatedDate).to.be.at.least(currentTime);

            //Load file again
            const updatedUpdateStatus = new ChampionUpdateStatus(testDataUrl);
            expect(updatedUpdateStatus.getLastUpdatedChampionSpotlightUrl()).to.equal(updatedStatus.lastUpdatedChampionSpotlight);
            expect(updatedUpdateStatus.getLastUpdatedDate()).to.deep.equal(updatedStatus.lastUpdatedDate);

            //And change it back
            updatedUpdateStatus.update(expectedSpotlightUrl);
            const revertedUpdateStatus = new ChampionUpdateStatus(testDataUrl);
            expect(revertedUpdateStatus.getLastUpdatedChampionSpotlightUrl()).to.equal(expectedSpotlightUrl);
        });
    });
});
