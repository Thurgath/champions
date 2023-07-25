import './RosterEditPage.scss';
import { STAR_RANK_LEVEL } from '../../data/model/Champion';
import { ROLE } from '../../data/model/Role';
import { roleImage } from '../../data/roles';
import { IMAGE_BADGE_RANK_UP, IMAGE_BADGE_LEVEL_MAX, IMAGE_STAR_AWAKENED } from '../../images';
import roster from '../../service/roster';
import router from '../../service/router';
import lang from '../../service/lang';
import classnames from 'classnames';
import ImageIcon from '../ImageIcon.jsx';
import ChampionHeader from '../Champion/ChampionHeader.jsx';
import ChampionUpgrade from '../Champion/ChampionUpgrade.jsx';
import classNames from 'classnames';
import SelectInput from './ui/SelectInput.jsx';
import NumberInput from './ui/NumberInput.jsx';

function RosterEditPage(initialVnode) {
    function getParameters(champion) {
        if (!champion) {
            return {};
        }
        return { uid: champion.attr.uid, stars: champion.attr.stars };
    }
    function changeRank(uid, stars, newRank, newLevel) {
        roster.set(uid, stars, {
            rank: newRank,
            level: newLevel || 1,
        });
    }
    function changeSignature(uid, stars, newSignatureLevel) {
        roster.set(uid, stars, {
            awakened: newSignatureLevel,
        });
    }
    return {
        oninit(vnode) {
        },
        view(vnode) {
            const {uid, stars} = vnode.attrs;
            const champion = roster.get(uid, stars);
            const scalePi = roster.getScale();
            const elements = [];
            if (champion) {
                const {rank, level, typeId, awakened, pi, role} = champion.attr;
                const roleIconImage = roleImage(role) ? (
                    <ImageIcon src={ roleImage(role) }/>
                ) : null;
                const maxRank = STAR_RANK_LEVEL[stars]
                    && STAR_RANK_LEVEL[stars].ranks || 1;
                const maxLevel = STAR_RANK_LEVEL[stars]
                    && STAR_RANK_LEVEL[stars][rank]
                    && STAR_RANK_LEVEL[stars][rank].levels || 1;
                const maxSignatureLevel = STAR_RANK_LEVEL[stars]
                    && STAR_RANK_LEVEL[stars].awakened || 99;
                const levelUp = () => {
                    const newRank = Math.min(rank + 1, maxRank);
                    const maxLevelForNextLevel = STAR_RANK_LEVEL[stars] && STAR_RANK_LEVEL[stars][newRank].levels;
                    changeRank(uid, stars, newRank, maxLevelForNextLevel);  
                };
                const maxChampion = () => {
                    const maxLevelForMaxRank = STAR_RANK_LEVEL[stars] && STAR_RANK_LEVEL[stars][maxRank].levels;
                    changeRank(uid, stars, maxRank, maxLevelForMaxRank);
                };
                const maxSignature = () => {
                    changeSignature(uid, stars, maxSignatureLevel);
                }
                const isMaxRank = rank === maxRank;
                const isMaxed = isMaxRank && level === maxLevel;
                const isMaxSignature = maxSignatureLevel === awakened;
                elements.push(
                    <ChampionHeader champion={ champion }/>
                );
                elements.push(
                    <ChampionUpgrade stars={ stars } rank={ rank } level={ level } typeId={ typeId } />
                );
                if (!isMaxed || !isMaxSignature) {
                    elements.push(
                        <label class="champion-field champion-field--neighbor">
                            <div class="champion-field-upgrades">
                                <span class="champion-field-label">{ lang.string('quick-level') }</span>
                                { !isMaxed ?
                                <div class={ classnames('champion-upgrade-badge', 'champion-upgrade-badge--max') }
                                     onclick={ maxChampion } title={ lang.string('upgrade-max-rank') } >
                                    <ImageIcon src={ IMAGE_BADGE_LEVEL_MAX }/>
                                </div>
                                : null }
                                { !isMaxRank ?
                                <div class={ classnames('champion-upgrade-badge', 'champion-upgrade-badge--rank-up') }
                                     onclick={ levelUp } title={ lang.string('level') } >
                                    <ImageIcon src={ IMAGE_BADGE_RANK_UP }/>
                                </div>
                                : null }
                                { !isMaxSignature ?
                                <div class={ classnames('champion-upgrade-badge', 'champion-upgrade-badge--star') }
                                     onclick={ maxSignature } title={ lang.string('signature') } >
                                    <ImageIcon src={ IMAGE_STAR_AWAKENED }/>
                                </div>
                                : null }
                            </div>
                        </label>
                    );
                }
                elements.push(
                    <label class="champion-field champion-field--neighbor">
                        <span class="champion-field-label">{ lang.string('rank') }</span>
                        <SelectInput
                            value={ rank }
                            min={ 1 }
                            max={ maxRank }
                            onchange={(event) => {
                                const { value } = event.target;
                                const rank = Math.min(maxRank, Math.max(1, Number.parseInt(value, 10) || 1));
                                changeRank(uid, stars, rank);
                            }}
                        />
                    </label>
                );
                elements.push(
                    <label class="champion-field champion-field--neighbor">
                        <span class="champion-field-label">{ lang.string('level') }</span>
                        <SelectInput
                            value={ level }
                            min={ 1 }
                            max={ maxLevel }
                            onchange={(event) => {
                                const { value } = event.target;
                                const level = Math.min(maxLevel, Math.max(1, Number.parseInt(value, 10) || 1));
                                changeRank(uid, stars, rank, level);
                            }}
                        />
                    </label>
                );
                elements.push(
                    <label class="champion-field">
                        <span class="champion-field-label">{ lang.string('awakened') }</span>
                        <SelectInput
                            value={ awakened }
                            min={ 0 }
                            max={ maxSignatureLevel }
                            onchange={(event) => {
                                const { value } = event.target;
                                const signatureLevel = Math.min(maxSignatureLevel, Math.max(0, Number.parseInt(value, 10) || 0));
                                changeSignature(uid, stars, signatureLevel);
                            }}
                        />
                    </label>
                );
                elements.push(
                    <label class="champion-field">
                        <span class="champion-field-label">{ lang.string('pi') }</span>
                        <NumberInput
                            value={ pi || '' }
                            placeholder={ champion.pi * scalePi | 0 }
                            min={ 0 }
                            max={ 20000 }
                            onchange={(event) => {
                                const { value, min, max, valueAsNumber } = event.target;
                                const pi = Math.min(max, Math.max(min, Number.parseInt(value, 10) || min));
                                roster.set(uid, stars, {
                                    pi,
                                });
                                if(valueAsNumber !== undefined && isNaN(valueAsNumber)) {
                                    event.target.value = '';                                
                                }
                            }}
                        />
                    </label>
                );
                elements.push(
                    <label class="champion-field">
                        <span class="champion-field-label">{ lang.string('role') }</span>
                        <div class="champion-field-role">
                            { roleIconImage }
                        </div>
                        <SelectInput
                            value={ role }
                            values={[
                            {
                                title: lang.string('role-none'),
                                value: null,
                            },
                            {
                                title: lang.string('role-arena'),
                                value: ROLE.ARENA,
                            },
                            {
                                title: lang.string('role-alliance-quest'),
                                value: ROLE.ALLIANCE_QUEST,
                            },
                            {
                                title: lang.string('role-alliance-war-attack'),
                                value: ROLE.ALLIANCE_WAR_ATTACK,
                            },
                            {
                                title: lang.string('role-alliance-war-defense'),
                                value: ROLE.ALLIANCE_WAR_DEFENSE,
                            },
                            {
                                title: lang.string('role-quest'),
                                value: ROLE.QUEST,
                            },
                        ]}
                            onchange={(event) => {
                                const { value } = event.target;
                                const role = value === null? null: value;
                                roster.set(uid, stars, {
                                    role,
                                });
                            }}
                        />
                    </label>
                );
                elements.push(
                    <button
                        class={ classNames('champion-button', 'champion-button-delete') }
                        onclick={() => {
                            roster.remove(uid, stars);
                            router.route('/roster');
                        }}
                    >
                        { lang.string('delete') }
                    </button>
                );
            }
            const previousChampion = roster.getPrevious(uid, stars);
            const nextChampion = roster.getNext(uid, stars);
            return (
                <div m="RosterEditPage" class="roster-edit">
                    <div class="roster-edit-wrapper">
                        <div key="left-arrow" class="roster-edit-leftarrow">
                            <m.route.Link href="/roster/:uid/:stars" params={ getParameters(previousChampion) } disabled={ !previousChampion }>
                                <ImageIcon src="../images/badges/left-arrow.png"/>
                            </m.route.Link>
                        </div>
                        <div class="roster-edit-middle" key={ `roster-edit-${ uid }-${ stars }` }>
                            { elements }
                        </div>
                        <div key="right-arrow" class="roster-edit-rightarrow">
                            <m.route.Link href="/roster/:uid/:stars" params={ getParameters(nextChampion) } disabled={ !nextChampion }>
                                <ImageIcon src="../images/badges/left-arrow.png"/>
                            </m.route.Link>
                        </div>
                        <div key="clear" class="clear"/>
                    </div>
                </div>
            );
        },
    };
};

export default RosterEditPage;
