import MenuHeader from '../menu/MenuHeader.jsx';

function RosterAddMenu(initialVnode) {
    return {
        oninit(vnode) {
        },
        view() {
            return (
                <div m="RosterAddMenu" key="roster-add-menu">
                    <MenuHeader title="roster"/>
                </div>
            );
        },
    };
};

export default RosterAddMenu;
