import './MenuOptionGroup.scss';
import classNames from 'classnames';

const MenuGroupOption = {
    controller: function(data) {
    },
    view(ctrl, { options, tabs }) {
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

export default MenuGroupOption;
