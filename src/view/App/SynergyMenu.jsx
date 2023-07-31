import { EFFECT_VALUES } from '../../data/model/Effect';
import { effectIcon } from '../../data/effects';
import { getLegend, setLegend, getRoster, setRoster } from '../../service/synergy';
import { STAR_RANK_LEVEL } from '../../data/model/Champion';
import MenuHeader from '../Menu/MenuHeader.jsx';
import MenuSection from '../Menu/MenuSection.jsx';
import MenuOption from '../Menu/MenuOption.jsx';
import MenuOptionGroup from '../Menu/MenuOptionGroup.jsx';
import Icon from '../Icon.jsx';

function SynergyMenu() {
    return {
        oninit(vnode) {
        },
        view(vnode) {
            const { stars, effect } = vnode.attrs;
            return (
                <div m="SynergyMenu" key={ `teams-menu-${ stars }` }>
                    <MenuHeader title="synergies"/>
                    <MenuOption
                        icon={(
                            <Icon icon="list" before />
                        )}
                        title="legend-show"
                        selected={ Boolean(getLegend()) }
                        onclick={ () => {
                            setLegend(!getLegend());
                        }}
                    />
                    <MenuOption
                        icon={(
                            <Icon icon="users" before />
                        )}
                        title="roster-use"
                        selected={ Boolean(getRoster()) }
                        onclick={ () => {
                            setRoster(!getRoster());
                        }}
                    />
                    <MenuSection title="show-by"/>
                    <MenuOptionGroup options={
                        Object.keys(STAR_RANK_LEVEL).map(Number).map((star) => (
                            <MenuOption
                                raw={ `${ star }★` }
                                selected={ stars && stars === star }
                                href={ `/synergy/stars/${ star }` }
                            />
                        ))
                    }/>
                    { EFFECT_VALUES.map((uid) => (
                        <MenuOption
                            icon={(
                                <Icon icon={ effectIcon(uid) } before />
                            )}
                            alternate={ `effect-${ uid }-name` }
                            title={ `effect-${ uid }-type` }
                            selected={ uid === effect }
                            href={ `/synergy/effect/${ uid }` }
                        />
                    )) }
                </div>
            );
        },
    };
}

export default SynergyMenu;
