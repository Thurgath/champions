import MenuHeader from '../menu/MenuHeader.jsx';
import MenuOptionGroup from '../menu/MenuOptionGroup.jsx';
import MenuOption from '../menu/MenuOption.jsx';
import MenuSection from '../menu/MenuSection.jsx';
import ClassTypeIcon from '../ClassTypeIcon.jsx';
import Icon from '../Icon.jsx';
import TYPES, { typeIcon } from '../../data/types';
import addRosterFilter from '../../service/add-roster-filter';

function RosterAddMenu(initialVnode) {
    return {
        oninit(vnode) {
        },
        view() {
            return (
                <div m="RosterAddMenu" key="roster-add-menu">
                    <MenuHeader title="roster"/>
                    <MenuSection title="filter"/>
                    <MenuOptionGroup options={
                        TYPES.map((type) => (
                            <MenuOption
                                icon={(
                                    <ClassTypeIcon icon={ typeIcon(type.attr.uid) } />
                                )}
                                info={ `type-${ type.attr.uid }-name` }
                                selected={ addRosterFilter.getClassTypeFilter(type.attr.uid) }
                                onclick={ () => {
                                    addRosterFilter.changeClassTypeFilter(type.attr.uid);
                                }}
                            />
                        ))
                    }/>
                    <MenuSection title="sort"/>
                    <MenuOption
                        icon={(
                            <Icon
                                icon={ (addRosterFilter.isSortByName() && addRosterFilter.isAscending())? 'sort-alpha-asc': 'sort-alpha-desc' }
                                before
                            />
                        )}
                        title="name"
                        selected={ addRosterFilter.isSortByName() }
                        onclick={ () => {
                            addRosterFilter.sortByName();
                        }}
                    />
                    <MenuOption
                        icon={(
                            <Icon
                                icon={ (addRosterFilter.isSortByClassType() && addRosterFilter.isAscending())? 'sort-alpha-asc': 'sort-alpha-desc' }
                                before
                            />
                        )}
                        title="type"
                        selected={ addRosterFilter.isSortByClassType() }
                        onclick={ () => {
                            addRosterFilter.sortByClassType();
                        }}
                    />
                </div>
            );
        },
    };
};

export default RosterAddMenu;
