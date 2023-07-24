import roster from '../../service/roster';
import MenuHeader from '../menu/MenuHeader.jsx';
import MenuOption from '../menu/MenuOption.jsx';
import Icon from '../Icon.jsx';

function RosterMenu(initialVnode) {
    return {
        oninit(vnode) {
        },
        view(vnode) {
            const {uid, stars} = vnode.attrs;
            return (
                <div m="RosterMenu" key={ `roster-edit-menu-${ uid }-${ stars }` }>
                    <MenuHeader title="roster"/>
                    <MenuOption
                        icon={(
                        <Icon icon="user" before />
                    )}
                        title="view-guide"
                        href={ `/guide/${ uid }` }
                    />
                    <MenuOption
                        icon={(
                        <Icon icon="refresh" before />
                    )}
                        title="reset"
                        onclick={() => {
                        roster.set(uid, stars, {
                            rank: 1,
                            level: 1,
                            awakened: 0,
                            pi: 0,
                        });
                    }}
                    />
                </div>
            );
        },
    };
};

export default RosterMenu;
