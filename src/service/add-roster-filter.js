import roster from './roster';
import { fromStorage, toStorage } from '../util/storage';

const STORAGE_KEY = 'roster-add-filter';
const SORT_KEY_NAME = 'name';
const SORT_KEY_CLASSTYPE = 'classType';

let rosterAddFilters = fromStorage(STORAGE_KEY, {
    filter: {
        cosmic: true,
        tech: true,
        mutant: true,
        skill: true,
        science: true,
        mystic: true,
    },
    sort: {
        key: SORT_KEY_NAME,
        isAscending: true,
    },
});

const SORT_BY_CLASSTYPE = (champion, otherChampion) => {
    return champion.typeIndex - otherChampion.typeIndex;
};

function getClassTypeFilter(typeId) {
    return rosterAddFilters.filter[ typeId ] === true;
}

function getDirection(sortFunction) {
    return isAscending() ? sortFunction : ((object, other) => -sortFunction(object, other));
}

function getAvailableWithFilter(stars) {
    let sort = getDirection(roster.SORT_NAME_ASC);
    if (isSortByClassType()) {
        sort = getDirection(SORT_BY_CLASSTYPE);
    }
    return roster.available(stars)
        .filter((champion) => getClassTypeFilter(champion.attr.typeId))
        .sort(sort);
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

function changeSort(key) {
    rosterAddFilters = {
        ...rosterAddFilters,
        sort: {
            key,
            isAscending: !isAscending(),
        },
    };
    toStorage(STORAGE_KEY, rosterAddFilters);
}

function isSortByName() {
    return rosterAddFilters.sort.key === SORT_KEY_NAME;
}

function isSortByClassType() {
    return rosterAddFilters.sort.key === SORT_KEY_CLASSTYPE;
}

function sortByName() {
    changeSort(SORT_KEY_NAME);
}

function sortByClassType() {
    changeSort(SORT_KEY_CLASSTYPE);
}

function isAscending() {
    return rosterAddFilters.sort.isAscending;
}

export default {
    getClassTypeFilter,
    getAvailableWithFilter,
    changeClassTypeFilter,
    isSortByName,
    isSortByClassType,
    sortByName,
    sortByClassType,
    isAscending,
};
