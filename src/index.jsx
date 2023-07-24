import './index.css';
import appState from './service/appState.js';
//Initialize router
import router from './service/router.js';

const handleKeyPress = (event) => {
    const hotkeys = appState().getHotkeys();
    if(hotkeys) {
        const which = String.fromCharCode(event.which);
        const modifiers = {
            'ctrl': event.ctrlKey || event.metaKey,
            'alt': event.altKey,
            'shift': event.shiftKey,
        };
        hotkeys
            .filter((hotkey) => which === hotkey.which && (
                !hotkey.modifiers ||
                hotkey.modifiers.every((modifier) => modifiers[ modifier ])
            ))
            .forEach((hotkey) => hotkey.callback());
    }
};
window.addEventListener('keydown', handleKeyPress);
if(window[ '__champions_key_handler__' ]) {
    window.removeEventListener('keydown', window[ '__champions_key_handler__' ]);
}
window[ '__champions_key_handler__' ] = handleKeyPress;
