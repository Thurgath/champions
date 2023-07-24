import teams, { PRESETS, PRESETS_DUPLICATES, PRESETS_RANGE, save } from '../../service/teams';
import MenuHeader from '../menu/MenuHeader.jsx';
import MenuSection from '../menu/MenuSection.jsx';
import MenuOption from '../menu/MenuOption.jsx';

function TeamsSettingsMenu(initialVnode) {
    function isActivePreset(preset, currentValues) {
        for(const id in preset)
            if(preset[ id ] !== currentValues[ id ])
                return false;
        return true;
    }
    
    return {
        oninit(vnode) {
        },
        view() {
            const options = [];
            options.push(
                <MenuHeader title="settings"/>
            );
            options.push(
                <MenuSection title="presets"/>
            );
            Object.keys(PRESETS).forEach((id) => {
                const handleClick = () => {
                    teams.weights = {
                        ...teams.weights,
                        ...PRESETS[id],
                    };
                    save();
                };
                options.push(
                    <MenuOption
                        title={ `preset-${ id }-name` }
                        selected={ isActivePreset(PRESETS[ id ], teams.weights) }
                        onclick={ handleClick }
                    />
                );
            });
            options.push(
                <MenuSection title="duplicate-weights"/>
            );
            Object.keys(PRESETS_DUPLICATES).forEach((id) => {
                const handleClick = () => {
                    teams.weights = {
                        ...teams.weights,
                        ...PRESETS_DUPLICATES[id],
                    };
                    save();
                };
                options.push(
                    <MenuOption
                        title={ `preset-duplicates-${ id }-name` }
                        selected={ isActivePreset(PRESETS_DUPLICATES[ id ], teams.weights) }
                        onclick={ handleClick }
                    />
                );
            });
            options.push(
                <MenuSection title="pi-range"/>
            );
            Object.keys(PRESETS_RANGE).forEach((id) => {
                const handleClick = () => {
                    teams.range = {
                        ...teams.range,
                        ...PRESETS_RANGE[id],
                    };
                    save();
                };
                options.push(
                    <MenuOption
                        title={ `preset-range-${ id }-name` }
                        selected={ isActivePreset(PRESETS_RANGE[ id ], teams.range) }
                        onclick={ handleClick }
                    />
                );
            });
            return (
                <div m="TeamsSettingsMenu" key={ 'teams-settings-menu' }>
                    { options }
                </div>
            );
        },
    };
};

export default TeamsSettingsMenu;
