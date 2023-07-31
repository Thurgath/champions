import './MenuOptionGroup.scss';
import classNames from 'classnames';

function MenuGroupOption() {
    return {
        oninit(vnode) {
        },
        view(vnode) {
            const { options, tabs } = vnode.attrs;
            return (
                <div
                    m="MenuGroupOption"
                    class={ classNames('menu-option--group', `menu-option--group-${ options.length }`, { 'menu-option--group-tabs': tabs }) }
                >
                    { options }
                </div>
            );
        },
    };
}

export default MenuGroupOption;
