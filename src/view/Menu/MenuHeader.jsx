import lang from '../../service/lang';

function MenuHeader(initialVnode) {
    return {
        oninit(vnode) {
        },
        view(vnode) {
            const {title, icon} = vnode.attrs;
            return (
                <div m="MenuHeader" class="menu-header">
                    <div>{ icon }{ lang.string(title) }</div>
                </div>
            );
        },
    };
};

export default MenuHeader;
