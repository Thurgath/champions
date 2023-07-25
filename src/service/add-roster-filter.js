import roster from './roster';
import { fromStorage, toStorage } from '../util/storage';

const STORAGE_KEY = 'roster-add-filter';

let rosterAddFilters = fromStorage(STORAGE_KEY, {
    filter: {
        cosmic: true,
        tech: true,
        mutant: true,
        skill: true,
        science: true,
        mystic: true,
    },
});

function getClassTypeFilter(typeId) {
    return rosterAddFilters.filter[ typeId ] === true;
}

function getAvailableWithFilter(stars) {
    return roster.available(stars)
        .filter((champion) => getClassTypeFilter(champion.attr.typeId));
}

function changeClassTypeFilter(classType) {
    rosterAddFilters = {
        ...rosterAddFilters,
        filter: {
            ...rosterAddFilters.filter,
            [ classType ]: !getClassTypeFilter(classType),
        },
    };
    toStorage(STORAGE_KEY, rosterAddFilters);
}

export default {
    getClassTypeFilter,
    getAvailableWithFilter,
    changeClassTypeFilter,
};
