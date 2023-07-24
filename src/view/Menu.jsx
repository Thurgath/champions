import './Menu.scss';
import MenuOptions from './menu/MenuOptions.jsx';
import router from '../service/router';
import classNames from 'classnames';
import Icon from './Icon.jsx';
import appState from '../service/appState.js';

function Menu(initialVnode) {
    
    var menuOpen = false;
    
    function toggleMenu(event) {
        event.redraw = false;
        menuOpen = !menuOpen;
        m.redraw();
    }
    
    return {
        oninit(vnode) {
        },
        view(vnode) {
            const {menu, parameters} = vnode.attrs;
            const button = appState().getCurrentTab().getButton();
            return (
                <div m="Menu" class={ classNames('menu', { 'menu--open': menuOpen }) }>
                    <div class="menu-background" onclick={ (event) => {
                    toggleMenu(event);
                }}></div>
                    { button && (
                        <a
                            role="button"
                            class="menu-button menu-button-sub"
                            href={ `#${ button.href }` }
                            onclick={ (event) => {
                                event.preventDefault();
                                router.route(button.href);
                            }}
                        >
                            <Icon icon={ button.icon }/>
                        </a>
                    ) }
                    <MenuOptions menu={ menu } parameters={ parameters }/>
                    <div class="menu-button menu-button-main" onclick={ (event) => {
                        toggleMenu(event);
                    }}>
                        <div class="menu-button-bar"/>
                        <div class="menu-button-bar"/>
                        <div class="menu-button-bar"/>
                    </div>
                </div>
            );
        },
    };
};

export default Menu;
