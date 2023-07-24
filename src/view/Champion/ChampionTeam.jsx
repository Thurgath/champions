import './ChampionTeam.scss';
import deepEqual from 'deep-equal';
import classNames from 'classnames';
import { EFFECT_VALUES } from '../../data/model/Effect';
import { effectIcon } from '../../data/effects';
import roster from '../../service/roster';
import lang from '../../service/lang';
import ChampionPortrait from './ChampionPortrait.jsx';
import Icon from '../Icon.jsx';

function ChampionTeam(initialVnode) {
    const CHAMPION_SELECTED = 1;
    const CHAMPION_NEIGHBOR = 2;
    const EFFECT_SELECTED = true;
    
    function selectChampion(vnode, synergies, champions, index) {
        let selected = vnode.state.champions[ index ];
        if(!selected) {
            selected = {
                active: true,
                champions: {
                    [ index ]: CHAMPION_SELECTED,
                },
                effects: {},
            };
            const champion = champions[ index ];
            synergies.forEach((synergy) => {
                let amount;
                if(champion.attr.uid === synergy.attr.toId) {
                    champions.forEach((champion, index) => {
                        if(champion.attr.uid === synergy.attr.fromId && champion.attr.stars === synergy.attr.fromStars)
                            selected.champions[ index ] = CHAMPION_NEIGHBOR;
                    });
                    amount = synergy.attr.effectAmount;
                }
                else if(champion.attr.uid === synergy.attr.fromId && champion.attr.stars === synergy.attr.fromStars) {
                    champions.forEach((champion, index) => {
                        if(champion.attr.uid === synergy.attr.toId)
                            selected.champions[ index ] = CHAMPION_NEIGHBOR;
                    });
                    amount = synergy.attr.effectAmount;
                }
                if(amount) {
                    selected.effects[ synergy.attr.effectId ] = (selected.effects[ synergy.attr.effectId ] || 0) + amount;
                }
            });
            vnode.state.champions[ index ] = selected;
        }
        if(deepEqual(vnode.state.selected, selected)) {
            vnode.state.selected = {
                effects: {},
                champions: {},
            };
        }
        else {
            vnode.state.selected = selected;
        }
    }

    function selectSynergy(vnode, synergies, champions, effectId) {
        let selected = vnode.state.effects[ effectId ];
        if(!selected) {
            selected = {
                active: true,
                champions: {},
                effects: {
                    [ effectId ]: EFFECT_SELECTED,
                },
            };
            const championIds = {};
            synergies
                .filter((synergy) => synergy.attr.effectId === effectId)
                .forEach((synergy) => {
                    championIds[ synergy.attr.toId ] = true;
                    championIds[ `${ synergy.attr.fromId }-${ synergy.attr.fromStars }` ] = true;
                });
            champions.forEach((champion, index) => {
                if(championIds[ champion.id ])
                    selected.champions[ index ] = CHAMPION_NEIGHBOR;
                if(championIds[ champion.attr.uid ])
                    selected.champions[ index ] = CHAMPION_SELECTED;
            });
            vnode.state.effects[ effectId ] = selected;
        }
        if(deepEqual(vnode.state.selected, selected)) {
            vnode.state.selected = {
                effects: {},
                champions: {},
            };
        }
        else {
            vnode.state.selected = selected;
        }
    }

    return {
        oninit(vnode) {
            vnode.state.selected = {
                effects: {},
                champions: {},
            };
            vnode.state.champions = {};
            vnode.state.effects = {};
        },
        view(vnode) {
            const {champions, synergies, showBadges} = vnode.attrs;
            const size = champions.length;
            const scalePi = roster.getScale();
            return (
                <div
                    m="ChampionTeam"
                    class={ classNames('champion-team', ` champion-team--size-${ size }`, { 'team--selected': vnode.state.selected.active }) }
                >
                    <div class="team-champions">
                        { champions.map((champion, index) => {
                            const selected = vnode.state.selected.champions[index] === CHAMPION_SELECTED;
                            const neighbor = vnode.state.selected.champions[index] === CHAMPION_NEIGHBOR;
                            return (
                                <ChampionPortrait
                                    key={ `champion-${ index }` }
                                    champion={ champion }
                                    selected={ selected }
                                    neighbor={ neighbor }
                                    showBadges={showBadges }
                                    scalePi={ scalePi }
                                    onclick={ () => selectChampion(vnode, synergies, champions, index) }
                                />
                            );
                        }) }
                    </div>
                    <div className="team-synergies">
                        { EFFECT_VALUES.map((effectId) => {
                            const synergy = synergies.filter((synergy) => synergy.attr.effectId === effectId);
                            if (synergy.length === 0)
                                return null;
                            const selected = vnode.state.selected.effects[effectId];
                            const amount = (!selected || selected === EFFECT_SELECTED) ?
                                synergy.reduce((value, synergy) => value + synergy.attr.effectAmount, 0) :
                                selected;
                            return (
                                <div
                                    class={ classNames('team-synergy', { 'team-synergy--selected': selected }, 'no-select') }
                                    onclick={ () => selectSynergy(vnode, synergies, champions, effectId) }
                                    title={ lang.string(`effect-${ effectId }-description`) }
                                >
                                    <Icon icon={ effectIcon(effectId) } before/>
                                <span class="effect-name">
                                    { lang.string(`effect-${ effectId }-type`) }
                                </span>
                                    <span> — </span>
                                <span class="effect-amount">
                                    { amount }%
                                </span>
                                </div>
                            );
                        }) }
                        <div class="team-pi">
                            { `${ lang.string('base-pi') } ` }
                        <span class="team-pi-number">
                            { lang.number(champions.reduce((amount, champion) => amount + (champion.attr.pi || champion.pi), 0)) }
                        </span>
                        </div>
                    </div>
                </div>
            );
        },
    };
};

export default ChampionTeam;
