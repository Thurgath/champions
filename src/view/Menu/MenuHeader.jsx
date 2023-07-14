import lang from '../../service/lang';

const MenuHeader = {
    controller: function(data) {
    },
    view(ctrl, { title, icon }) {
        return (
            <div m="MenuHeader" class="menu-header">
                <div>{ icon }{ lang.string(title) }</div>
            </div>
        );
    },
};

export default MenuHeader;
