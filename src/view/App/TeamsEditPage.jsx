import './TeamsEditPage.scss';
import { synergiesFromChampions } from '../../data/synergies';
import { roleIcon } from '../../data/roles';
import { WILLPOWER_SAFE_CHAMPIONS } from '../../data/champions';
import teams, { saveTeam, lockTeams, lockedTeamMap, isTeamLocked } from '../../service/teams';
import roster from '../../service/roster';
import lang from '../../service/lang';
import deepEqual from 'deep-equal';
import ChampionTeamSelector from '../Champion/ChampionTeamSelector.jsx';
import ChampionPortrait from '../Champion/ChampionPortrait.jsx';
import Icon from '../Icon.jsx';
import Message from '../Message.jsx';

function TeamsEditPage(initialVnode) {
    function isSameSwapSource(a, b) {
        if(a === b) {
            return true;
        }
        if(!a || !b) {
            return false;
        }
        return a.index === b.index && a.create === b.create && a.teamIndex === b.teamIndex;
    }

    function toggleLockedTeam(tid, champions) {
        lockTeams({
            ...lockedTeamMap,
            [ tid ]: !lockedTeamMap[ tid ]? champions: null,
        });
    }

    function applyTeams(updatedTeams, doSave) {
        updatedTeams.forEach((team) => {
            team.value = team.champions.reduce((sum, champion) => sum + (champion.attr.pi || champion.pi), 0);
        });
        const result = teams.result[ `${ teams.type }-${ teams.size }` ] = {
            teams: updatedTeams,
            counts: {
                teams: 0,
                synergies: 0,
            },
            extras: [],
        };
        const inTeam = {};
        updatedTeams.forEach((team) => {
            result.counts.teams++;
            result.counts.synergies += team.synergies.length;
            team.champions.forEach((champion) => (inTeam[ champion.id ] = true));
        });
        if(teams.type === 'arena') {
            roster
                .filter((champion) => !champion.attr.role)
                .filter((champion) => teams.stars[ champion.attr.stars ] !== false)
                .filter((champion) => teams.types[ champion.attr.typeId ] !== false)
                .filter((champion) => !inTeam[ champion.id ])
                .forEach((champion) => result.extras.push(champion));
        }
        if(doSave) {
            saveTeam();
        }
        m.redraw();
    }

    function calculateSynergies(swap) {
        const { source, target } = swap;
        if(source && target) {
            [ source, target ].forEach((group, index) => {
                const other = (index === 0)? target: source;
                if(group.team && group.index !== undefined) {
                    const champions = [ ...group.team.champions ];
                    champions[ group.index ] = other.champion;
                    group.synergies = synergiesFromChampions(champions);
                }
                else {
                    group.synergies = [];
                }
            });
        }
        else {
            [ source, target ].forEach((group) => {
                if(group) {
                    if(group.champion && group.team) {
                        const champions = [ ...group.team.champions ];
                        champions[ group.index ] = null;
                        group.synergies = synergiesFromChampions(champions);
                    }
                    else if(group.champion) {
                        group.synergies = [];
                    }
                    else {
                        group.synergies = null;
                    }
                }
            });
        }
        m.redraw();
    }

    return {
        oninit() {
            this.swap = {
                source: null,
                target: null,
            };
            this.create = {};
            this.teams = [];
            this.size = 0;
            this.stars = {};
            this.types = {};
            this.last = -1;
            this.willpowersafe = 1;
            this.locked = [];
            this.type = null;
            this.reset = () => {
                const starsEqual = deepEqual(this.stars, teams.stars);
                const typesEqual = deepEqual(this.types, teams.types);
                const result = teams.result[`${ teams.type }-${ teams.size }`];
                const changed =
                    this.willpowersafe !== teams.willpowersafe ||
                    this.type !== teams.type ||
                    this.size !== teams.size || !starsEqual || !typesEqual;
                if (this.last !== teams.last || changed) {
                    this.teams = result && result.teams.map(({champions, synergies}) => ({
                            champions: [
                                ...champions,
                            ],
                            synergies: [
                                ...synergies,
                            ],
                        })) || [];
                    if ((!changed || this.last === -1) && !this.create.swapped) {
                        this.create.champions = [null];
                        this.create.synergies = [];
                    }
                    if (changed || this.last === -1) {
                        lockTeams();
                    }
                    this.create.swapped = false;
                    this.swap.source = null;
                    this.swap.target = null;
                    this.stars = {...teams.stars};
                    this.types = {...teams.types};
                    this.size = teams.size;
                    this.willpowersafe = teams.willpowersafe;
                    this.last = teams.last;
                    this.type = teams.type;
                    this.init = true;
                }
            };
            this.apply = () => {
                const {source, target} = this.swap;
                let doSave = (source && source.team && !source.create) || (target && target.team && !target.create);
                if (source && target) {
                    if (source.index !== undefined && source.team) {
                        source.team.champions[source.index] = target.champion;
                        source.team.synergies = synergiesFromChampions(source.team.champions);
                    }
                    if (target.index !== undefined && target.team) {
                        target.team.champions[target.index] = source.champion;
                        target.team.synergies = synergiesFromChampions(target.team.champions);
                    }
                    if (source.create && !source.team.champions.some((champion) => !champion)) {
                        this.teams.push(this.create);
                        this.create = {
                            champions: [null],
                            synergies: [],
                        };
                        doSave = true;
                    }
                    else if (source.create || target.create) {
                        this.create.swapped = true;
                    }
                }
                this.swap.source = null;
                this.swap.target = null;
                applyTeams(this.teams, doSave);
            };
        },

        view(vnode) {
            vnode.state.reset();
            const {swap, create, teams} = vnode.state;
            const {source, target} = swap;
            const targetId = target && target.champion && target.champion.id;
            const teamElements = [];
            const createElements = [];
            const extraElements = [];
            let extrasDiv;
            const inTeam = {};
            const synergiesCount = teams.reduce((amount, {synergies}) => amount + synergies.length, 0);
            const scalePi = roster.getScale();

            let message;
            if (vnode.state.type === 'arena') {
                message = (synergiesCount) ? `- ${ teams.length } ${ lang.string('teams') } ${ lang.string('with') } ${ synergiesCount } ${ lang.string('synergies') }` :
                    (teams.length > 0) ? `- ${ teams.length } ${ lang.string('teams') }` :
                        '';
            }
            else {
                message = (synergiesCount) ? `- ${ synergiesCount } ${ lang.string('synergies') }` : '';
            }

            const teamIds = teams.map(({champions}) => champions.map(({id}) => id).join('_'));
            teams.forEach(({champions, synergies}, teamIndex) => {
                const isLocked = isTeamLocked(teamIds[teamIndex]);
                teamElements.push(
                    <ChampionTeamSelector
                        team={{
                        champions,
                        synergies,
                    }}
                        showBadges={ 'upgrade' }
                        swap={ swap }
                        onup={ teamIndex > 0 && (() => {
                            const swap = teams[ teamIndex ];
                            teams[ teamIndex ] = teams[ teamIndex - 1 ];
                            teams[ teamIndex - 1 ] = swap;
                            applyTeams(teams);
                        }) }
                        ondown={ teamIndex < teams.length - 1 && (() => {
                            const swap = teams[ teamIndex ];
                            teams[ teamIndex ] = teams[ teamIndex + 1 ];
                            teams[ teamIndex + 1 ] = swap;
                            applyTeams(teams);
                        }) }
                        locked={ isLocked }
                        onlock={ () => {
                            if(champions.some(({ id }) =>
                                (swap.source && swap.source.champion && swap.source.champion.id === id) ||
                                (swap.target && swap.target.champion && swap.target.champion.id === id)
                            )) {
                                swap.dragging = false;
                                swap.source = null;
                                swap.target = null;
                            }
                            toggleLockedTeam(teamIds[ teamIndex ], champions);
                        } }
                        draggable={ !isLocked }
                        droppable={ !isLocked }
                        ondragstart={ (index) => {
                            swap.source = null;
                            swap.target = {
                                team: teams[ teamIndex ],
                                champion: champions[ index ],
                                index,
                            };
                            swap.dragging = true;
                            calculateSynergies(swap);
                        } }
                        ondragend={ () => {
                            if(source && target) {
                                vnode.state.apply();
                            }
                            swap.dragging = false;
                            swap.source = null;
                            swap.target = null;
                        } }
                        ondragover={ (index, event) => {
                            event.redraw = false;
                            event.preventDefault();
                            if(!isLocked && target && target.champion && !champions.some(({ id }) => id === target.champion.id)) {
                                const source = {
                                    team: teams[ teamIndex ],
                                    champion: champions[ index ],
                                    index,
                                    teamIndex,
                                };
                                if(!isSameSwapSource(source, swap.source)) {
                                    swap.source = source;
                                    calculateSynergies(swap);
                                }
                            }
                    } }
                        ondragleave={ (index, event) => {
                            event.redraw = false;
                            event.preventDefault();
                            if(source && source.index === index) {
                                const source = null;
                                if(!isSameSwapSource(source, swap.source)) {
                                    swap.source = source;
                                    calculateSynergies(swap);
                                }
                            }
                    } }
                        onclick={ isLocked? null: (index) => {
                            if(targetId === champions[ index ].id) {
                                swap.target = null;
                            }
                            else if (source && source.champion === champions[ index ]) {
                                swap.source = null;
                            }
                            else if(source && champions.some((champion) => source.champion === champion)) {
                                swap.source = {
                                    team: teams[ teamIndex ],
                                    champion: champions[ index ],
                                    index,
                                };
                            }
                            else if(!source) {
                                swap.source = {
                                    team: teams[ teamIndex ],
                                    champion: champions[ index ],
                                    index,
                                };
                                if(swap.target && swap.target.index) {
                                    swap.target = null;
                                }
                            }
                            else {
                                swap.target = {
                                    team: teams[ teamIndex ],
                                    champion: champions[ index ],
                                    index,
                                };
                                if(source && source.create && !source.champion) {
                                    swap.source = null;
                                }
                            }
                            calculateSynergies(swap);
                        } }
                        onsplit={ source && champions.some((champion) => champion === source.champion) && !target && (() => {
                            vnode.state.teams = teams.filter((element, index) => teamIndex !== index);
                            swap.source = null;
                            applyTeams(teams);
                        }) }
                        onapply={ source && target && (
                        champions.some((champion) => champion === source.champion || champion === target.champion)
                    ) && vnode.state.apply }
                    />
                );
                champions.forEach((champion) => (inTeam[champion.id] = true));
            });
            const extras = roster
                .filter((champion) => champion.attr.role !== vnode.state.type || vnode.state.type === 'arena')
                .filter((champion) => !vnode.state.willpowersafe || WILLPOWER_SAFE_CHAMPIONS[champion.attr.uid])
                .filter((champion) => vnode.state.stars[champion.attr.stars] !== false)
                .filter((champion) => vnode.state.types[champion.attr.typeId] !== false)
                .filter((champion) => !inTeam[champion.id]);
            if ((vnode.state.type === 'arena' || teams.length === 0) && extras.length >= vnode.state.size) {
                while (create.champions.length < vnode.state.size) {
                    create.champions.push(null);
                }
                while (create.champions.length > vnode.state.size) {
                    create.champions.pop();
                }
                createElements.push(
                    <ChampionTeamSelector
                        key={ 'team-create' }
                        team={{
                        champions: create.champions,
                        synergies: create.synergies,
                    }}
                        showBadges={ 'upgrade' }
                        swap={ swap }
                        draggable={ true }
                        droppable={ true }
                        ondragstart={(index) => {
                            const champion = create.champions[ index ];
                            if(champion) {
                                swap.source = null;
                                swap.target = {
                                    team: create,
                                    index,
                                    champion,
                                    create: true,
                                };
                                swap.dragging = true;
                                calculateSynergies(swap);
                            }
                    }}
                        ondragend={() => {
                            if(source && target) {
                                vnode.state.apply();
                            }
                            swap.dragging = false;
                            swap.source = null;
                            swap.target = null;
                    }}
                        ondragover={(index, event) => {
                            event.preventDefault();
                            event.redraw = false;
                            const champion = create.champions[ index ];
                            if(target && !target.create && (!target.team || champion)) {
                                const source = {
                                    team: create,
                                    index,
                                    champion,
                                    create: true,
                                };
                                if(!isSameSwapSource(source, swap.source)) {
                                    swap.source = source;
                                    calculateSynergies(swap);
                                }
                            }
                    }}
                        ondragleave={ (index, event) => {
                            event.redraw = false;
                            event.preventDefault();
                            if(source && source.index === index) {
                                const source = null;
                                if(!isSameSwapSource(source, swap.source)) {
                                    swap.source = source;
                                    calculateSynergies(swap);
                                }
                            }
                    } }
                        onclick={ (index) => {
                        if(source && source.create && source.index === index) {
                            swap.source = null;
                            if(swap.target && swap.target.team) {
                                swap.source = swap.target;
                                swap.target = null;
                            }
                        }
                        else {
                            if(!swap.target && swap.source && swap.source.id) {
                                swap.target = swap.source;
                            }
                            swap.source = {
                                team: create,
                                index,
                                champion: create.champions[ index ],
                                create: true,
                            };
                            if(target && target.champion && inTeam[ target.champion.id ]) {
                                swap.target = null;
                            }
                        }
                        calculateSynergies(swap);
                    } }
                        onapply={ source && target && (
                        (source.create && target.champion) ||
                        (target.create && source.champion)
                    ) && vnode.state.apply }
                        onremove={ source && source.create && source.champion && !target && (() => {
                        create.champions[ swap.source.index ] = null;
                        create.synergies = synergiesFromChampions(create.champions);
                        swap.source = null;
                        applyTeams(teams);
                    }) }
                        create
                    />
                );
                create.champions.forEach((champion) => champion && (inTeam[champion.id] = true));
            }
            const currentSynergyMap = {};
            (swap.source && swap.source.team && swap.source.team.synergies) &&
            swap.source.team.synergies.forEach(({attr: {toId, fromId, fromStars}}) => {
                currentSynergyMap[`${ toId }-${ fromId }-${ fromStars}`] = true;
            });
            extras.filter((champion) => champion && !inTeam[champion.id]).forEach((champion) => {
                let effects = null;
                if (!swap.target && swap.source) {
                    const foundEffects = {};
                    const {team: {champions}, index} = swap.source;
                    const swapped = [
                        ...champions,
                    ];
                    swapped[index] = champion;
                    effects = synergiesFromChampions(swapped)
                        .filter(({attr: {toId, fromId, fromStars}}) => {
                            return !currentSynergyMap[`${ toId }-${ fromId }-${ fromStars}`];
                        })
                        .map(({attr: {effectId, effectAmount}}) => ({effectId, effectAmount}))
                        .filter((effect) => {
                            const {effectId, effectAmount} = effect;
                            if (foundEffects[effectId]) {
                                foundEffects[effectId].effectAmount += effectAmount;
                                return false;
                            }
                            foundEffects[effectId] = effect;
                            return true;
                        });
                }
                extraElements.push(
                    <ChampionPortrait
                        key={ `champion-${ champion.id }` }
                        champion={ champion }
                        effects={effects}
                        editing={ target && target.champion && target.champion.id === champion.id }
                        draggable={ true }
                        scalePi={ scalePi }
                        events={{
                        ondragstart: () => {
                            swap.source = null;
                            swap.target = {
                                champion,
                            };
                            swap.dragging = true;
                            m.redraw();
                        },
                        ondragend: () => {
                            if(source && target) {
                                vnode.state.apply();
                            }
                            swap.dragging = false;
                            swap.source = null;
                            swap.target = null;
                        },
                    }}
                        onclick={() => {
                        if(target && target.champion && target.champion.id === champion.id) {
                            swap.target = null;
                        }
                        else {
                            swap.target = {
                                champion,
                            };
                        }
                        calculateSynergies(swap);
                    }}
                    />
                );
            });
            if (extraElements.length) {
                extrasDiv = (
                    <div class="teams-extras">
                        <div class="teams-header">{ lang.string('extras') }</div>
                        <div>{extraElements}</div>
                    </div>
                );
            }
            return (
                <div m="TeamsEditPage" class="teams">
                    <Message
                        icon={(
                        <Icon icon={ roleIcon(vnode.state.type) } before />
                    )}
                        value={ `${ lang.string(`role-${ vnode.state.type }`) }${ message }` }
                    />
                    <div>
                        { teamElements }
                    </div>
                    <div>
                        { createElements }
                    </div>
                    { extrasDiv }
                    <div class="clear"/>
                </div>
            );
        },
    };
};

export default TeamsEditPage;
