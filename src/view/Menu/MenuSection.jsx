import lang from '../../service/lang';

const MenuSection = {
    controller: function(data) {
    },
    view(ctrl, { title, icon }) {
        return (
            <div
                m="MenuSection"
                role="heading"
                aria-label={ lang.string(title) }
                class="menu-section">
                <div>{ icon }{ lang.string(title) }</div>
            </div>
        );
    },
};

export default MenuSection;
