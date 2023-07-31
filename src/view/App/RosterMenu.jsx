import TYPES, { typeIcon } from '../../data/types';
import { STAR_RANK_LEVEL } from '../../data/model/Champion';
import lang from '../../service/lang';
import roster from '../../service/roster';
import router from '../../service/router';
import MenuHeader from '../Menu/MenuHeader.jsx';
import MenuSection from '../Menu/MenuSection.jsx';
import MenuOption from '../Menu/MenuOption.jsx';
import MenuOptionGroup from '../Menu/MenuOptionGroup.jsx';
import Icon from '../Icon.jsx';
import ClassTypeIcon from '../ClassTypeIcon.jsx';
import { notify } from '../../util/notification';
import { clickElementById } from '../../util/element';
import { loadFileFromInput, saveFileEventHandler } from '../../util/io';

function RosterMenu() {
    return {
        oninit(vnode) {
        },
        view() {
            const options = [];
            if (window.FileReader) {
                const handleTextInput = (text, filename) => {
                    try {
                        roster.fromCSV(text, filename);
                        notify({
                            message: lang.string('notification-roster-import'),
                            tag: 'roster-import',
                            onclick: () => router.route('/roster'),
                        });
                    }
                    catch (error) {
                        /* eslint-disable no-console */
                        console.error(error.stack || error);
                        /* eslint-enable no-console */
                        notify({
                            message: lang.string('notification-roster-import-failed')
                                .replace(/%error%/g, error),
                            tag: 'roster-import',
                        });
                    }
                };
                options.push(
                    <MenuOption
                        icon={(
                            <Icon icon="clipboard" before />
                        )}
                        title="import-csv"
                        onclick={ (event) => {
                            clickElementById('roster-importer');
                            event.redraw = false;
                        }}
                    />
                );
                options.push(
                    <input
                        id="roster-importer"
                        style="display:none"
                        type="file"
                        accept=".csv"
                        onchange={ function() {
                            /* eslint-disable no-invalid-this */
                            loadFileFromInput(this, handleTextInput);
                            /* eslint-enable no-invalid-this */
                        }}
                    />
                );
            }
            options.push(
                <MenuOption
                    icon={(
                        <Icon icon="floppy-disk" before />
                    )}
                    title="export-csv"
                    download="champions.csv"
                    onclick={ ({ target }) => {
                        saveFileEventHandler(target, 'text/csv', 'champions.csv', roster.toCSV('\r\n'));
                        target.redraw = false;
                    }}
                    oncontextmenu={ ({ target }) => {
                        saveFileEventHandler(target, 'text/csv', 'champions.csv', roster.toCSV('\r\n'));
                        target.redraw = false;
                    }}
                />
            );
            options.push(
                <MenuOption
                    icon={(
                        <Icon icon="user-times" before />
                    )}
                    title="delete-all"
                    onclick={ () => {
                        roster.clear();
                    }}
                    red="true"
                />
            );
            options.push(
                <MenuSection title="show"/>
            );
            const showUpgrades = roster.getUpgrades();
            options.push(
                <MenuOption
                    icon={(
                        <Icon icon="arrow-circle-up" before />
                    )}
                    title="show-upgrades"
                    selected={ showUpgrades }
                    onclick={ () => {
                        roster.setUpgrades(!showUpgrades);
                    }}
                />
            );
            options.push(
                <MenuSection title="sort"/>
            );
            const sort = roster.getSort();
            options.push(
                <MenuOption
                    icon={(
                        <Icon
                            icon={ (sort.key === 'pi' && sort.direction === 'asc')? 'sort-numeric-asc': 'sort-numeric-desc' }
                            before
                        />
                    )}
                    title="pi"
                    selected={ sort.key === 'pi' }
                    onclick={ () => {
                        roster.setSort('pi', (sort.key === 'pi' && sort.direction === 'desc')? 'asc': 'desc');
                    }}
                />
            );
            options.push(
                <MenuOption
                    icon={(
                        <Icon
                            icon={ (sort.key === 'stars' && sort.direction === 'asc')? 'sort-amount-asc': 'sort-amount-desc' }
                            before
                        />
                    )}
                    title="stars"
                    selected={ sort.key === 'stars' }
                    onclick={ () => {
                        roster.setSort('stars', (sort.key === 'stars' && sort.direction === 'desc')? 'asc': 'desc');
                    }}
                />
            );
            options.push(
                <MenuOption
                    icon={(
                        <Icon
                            icon={ (sort.key === 'name' && sort.direction === 'desc')? 'sort-alpha-desc': 'sort-alpha-asc' }
                            before
                        />
                    )}
                    title="name"
                    selected={ sort.key === 'name' }
                    onclick={ () => {
                        roster.setSort('name', (sort.key === 'name' && sort.direction === 'asc')? 'desc': 'asc');
                    }}
                />
            );
            options.push(
                <MenuSection title="filter"/>
            );
            options.push(
                <MenuOptionGroup options={
                    Object.keys(STAR_RANK_LEVEL).map((star) => (
                        <MenuOption
                            raw={ `${ star }★` }
                            selected={ roster.getFilter(star) }
                            onclick={ () => {
                                roster.setFilter(star, !roster.getFilter(star));
                            }}
                        />
                    ))
                }/>
            );
            options.push(
                <MenuOptionGroup options={
                    TYPES.map((type) => (
                        <MenuOption
                            icon={(
                                <ClassTypeIcon icon={ typeIcon(type.attr.uid) } />
                            )}
                            info={ `type-${ type.attr.uid }-name` }
                            selected={ roster.getFilter(type.attr.uid) }
                            onclick={ () => {
                                roster.setFilter(type.attr.uid, !roster.getFilter(type.attr.uid));
                            }}
                        />
                    ))
                }/>
            );
            return (
                <div m="RosterMenu" key="roster-menu">
                    <MenuHeader title="roster"/>
                    { options }
                </div>
            );
        },
    };
}

export default RosterMenu;
