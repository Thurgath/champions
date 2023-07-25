import MenuHeader from '../menu/MenuHeader.jsx';
import MenuOptionGroup from '../menu/MenuOptionGroup.jsx';
import MenuOption from '../menu/MenuOption.jsx';
import MenuSection from '../menu/MenuSection.jsx';
import ClassTypeIcon from '../ClassTypeIcon.jsx';
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
                </div>
            );
        },
    };
};

export default RosterAddMenu;
