import { getLanguage } from '../../service/lang';
import MenuHeader from '../Menu/MenuHeader.jsx';
import MenuOption from '../Menu/MenuOption.jsx';
import Icon from '../Icon.jsx';
import { saveFileEventHandler } from '../../util/io';

const LanguageEditMenu = {
    controller: function(data) {
    },
    view(ctrl, { langId }) {
        const { values } = getLanguage(langId);
        const options = [];
        options.push(
            <MenuHeader title={ 'language' } />
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
                    m.redraw.strategy('none');
                }}
                oncontextmenu={ ({ target }) => {
                    saveFileEventHandler(target, 'text/json', filename, JSON.stringify(values, null, 4));
                    m.redraw.strategy('none');
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

export default LanguageEditMenu;
