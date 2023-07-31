import { getLanguage } from '../../service/lang';
import MenuHeader from '../Menu/MenuHeader.jsx';
import MenuOption from '../Menu/MenuOption.jsx';
import Icon from '../Icon.jsx';
import { saveFileEventHandler } from '../../util/io';

function LanguageEditMenu() {
    return {
        oninit(vnode) {
        },
        view(vnode) {
            const { langId } = vnode.attrs;
            const { values } = getLanguage(langId);
            const options = [];
            options.push(
                <MenuHeader title={ 'language' }/>
            );
            const filename = `${ langId }.json`;
            options.push(
                <MenuOption
                    icon={(
                        <Icon icon="floppy-disk" before />
                    )}
                    title="export-json"
                    download={ filename }
                    onclick={ ({ target }) => {
                        saveFileEventHandler(target, 'text/json', filename, JSON.stringify(values, null, 4));
                        target.redraw = false;
                    }}
                    oncontextmenu={ ({ target }) => {
                        saveFileEventHandler(target, 'text/json', filename, JSON.stringify(values, null, 4));
                        target.redraw = false;
                    }}
                />
            );
            return (
                <div m="LanguageEditMenu" key={ 'language-menu' }>
                    { options }
                </div>
            );
        },
    };
}

export default LanguageEditMenu;
