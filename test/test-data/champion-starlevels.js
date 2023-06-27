import { TYPE } from '../../src/data/model/Type';
import { CHAMPION } from '../../src/data/model/Champion';

function typeId(typeId, champions) {
    return champions.map((champion) => ({
        ...champion,
        typeId,
    }));
}

function championStars(champion, stars) {
    return stars.map((stars) => ({
        ...champion,
        stars,
    }));
}

const champions = [
    ...typeId(TYPE.COSMIC, [
        ...championStars({ uid: CHAMPION.MEDUSA }, [ 2, 3, 4, 5, 6 ]),
    ]),
    ...typeId(TYPE.TECH, [
        ...championStars({ uid: CHAMPION.NEBULA }, [ 2, 3, 4, 5, 6 ]),
    ]),
    ...typeId(TYPE.MUTANT, [
        ...championStars({ uid: CHAMPION.STORM }, [ 2, 3, 4, 5, 6 ]),
    ]),
    ...typeId(TYPE.SKILL, [
        ...championStars({ uid: CHAMPION.KILLMONGER }, [ 2, 3, 4, 5, 6, 7 ]),
    ]),
    ...typeId(TYPE.SCIENCE, [
        ...championStars({ uid: CHAMPION.HUMANTORCH }, [ 2, 3, 4, 5, 6 ]),
    ]),
    ...typeId(TYPE.MYSTIC, [
        ...championStars({ uid: CHAMPION.HOOD }, [ 2, 3, 4, 5, 6 ]),
        ...championStars({ uid: CHAMPION.SYMBIOTESUPREME }, [ 2, 3, 4, 5, 6 ]),
    ]),
    ...typeId(TYPE.UNIVERSAL, [
        ...championStars({ uid: CHAMPION.MAESTRO }, [ 5 ]),
        ...championStars({ uid: CHAMPION.THECOLLECTOR }, [ 5 ]),
        ...championStars({ uid: CHAMPION.GRANDMASTER }, [ 5 ]),
    ]),
];

export default champions;
