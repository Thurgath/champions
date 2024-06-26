import lang from '../../service/lang';

function MenuSection() {
    return {
        oninit(vnode) {
        },
        view(vnode) {
            const { title, icon } = vnode.attrs;
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
}

export default MenuSection;
