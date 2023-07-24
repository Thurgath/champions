import './MenuOption.scss';
import classNames from 'classnames';
import lang from '../../service/lang';
import router from '../../service/router';

function MenuOption(initialVnode) {
    function isExternalLink(href) {
        return href.startsWith('http') || href.startsWith('//');
    }
    return {
        oninit(vnode) {
        },
        view(vnode) {
            const {
                info, raw, alternate, title, icon, href,
                download, selected, invalid, progress, red,
                onclick, oncontextmenu, options
            } = vnode.attrs;
            let link = {};
            if (href) {
                const isExternal = isExternalLink(href);
                link = {
                    ...link,
                    href: isExternal ? href : `#${ href }`,
                    target: '_blank',
                    onclick: (onclick) ? null : (event) => {
                        event.redraw = false;
                        if (!isExternal) {
                            event.preventDefault();
                            router.route(href);
                        }
                    },
                };
            }
            if (download) {
                link = {
                    ...link,
                    download,
                    href: 'javascript:', // eslint-disable-line no-script-url
                };
            }
            return (
                <a
                    m="MenuOption"
                    role="menuitem"
                    aria-label={ lang.string(title) || lang.string(info) }
                    class={ classNames('menu-option', {
                    'menu-option--options': options,
                    'menu-option--invalid': invalid,
                    'menu-option--selected': selected,
                    'menu-option--progress': progress,
                    'menu-option--red': red === true || red === 'true',
                }, 'no-select') }
                    title={ lang.string(info) || '' }
                    tabindex={0}
                    onclick={ onclick }
                    oncontextmenu={ oncontextmenu }
                    { ...link }
                    disabled={ !(onclick || link) }
                >
                    { (progress || progress === 0) && (
                        <div
                            aria-valuenow={ Math.max(0, Math.min(100, 100 * progress)) }
                            aria-valuemin="0"
                            aria-valuemax="100"
                            class="menu-option-progress-bar"
                            style={ `width: ${ Math.max(0, Math.min(100, 100 * progress)) }%; transition: ${ (progress <= 0)? 'none': 'width .3s linear' };` }
                        />
                    ) || null }
                    <div
                        class="menu-option--label">{ icon }{ raw || lang.string(alternate, null) || lang.string(title) }</div>
                    { options && (
                        <div class="menu-option-options">
                            { options}
                        </div>
                    ) }
                </a>
            );
        },
    };
};

export default MenuOption;
