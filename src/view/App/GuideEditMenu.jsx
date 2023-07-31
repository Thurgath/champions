import guides from '../../data/guides';
import lang from '../../service/lang';
import MenuHeader from '../Menu/MenuHeader.jsx';
import MenuOption from '../Menu/MenuOption.jsx';
import Icon from '../Icon.jsx';
import { notify } from '../../util/notification';
import { clickElementById } from '../../util/element';
import { loadFileFromInput, saveFileEventHandler } from '../../util/io';

function GuideEditMenu() {
    return {
        oninit(vnode) {
        },
        view(vnode) {
            const { uid } = vnode.attrs;
            const options = [];
            options.push(
                <MenuHeader title={ `champion-${ uid }-name` }/>
            );
            if (window.FileReader) {
                const handleTextInput = (text) => {
                    guides.import(uid, text, lang.current);
                    notify({
                        message: lang.string('notification-guide-import'),
                        tag: 'guide-import',
                    });
                    m.redraw();
                };
                options.push(
                    <MenuOption
                        icon={(
                            <Icon icon="clipboard" before />
                        )}
                        title="import-json"
                        onclick={ (event) => {
                            clickElementById('guide-importer');
                            event.redraw = false;
                        } }
                    />
                );
                options.push(
                    <input
                        id="guide-importer"
                        style="display:none"
                        type="file"
                        accept=".json"
                        value=""
                        onchange={ function() {
                        /* eslint-disable no-invalid-this */
                            loadFileFromInput(this, handleTextInput);
                        /* eslint-enable no-invalid-this */
                        } }
                    />
                );
            }
            const filename = guides.getFileNameFor(uid, lang.current);
            options.push(
                <MenuOption
                    icon={(
                        <Icon icon="floppy-disk" before />
                    )}
                    title="export-json"
                    download={ filename }
                    onclick={ ({ target }) => {
                        saveFileEventHandler(target, 'text/json', filename, JSON.stringify(guides.getGuideFor(uid, lang.current) || {}, null, 4));
                    }}
                    oncontextmenu={ ({ target }) => {
                        saveFileEventHandler(target, 'text/json', filename, JSON.stringify(guides.getGuideFor(uid, lang.current) || {}, null, 4));
                        target.redraw = false;
                    }}
                />
            );
            return (
                <div m="GuideEditMenu" key={ 'guide-edit-menu' }>
                    { options }
                </div>
            );
        },
    };
}

export default GuideEditMenu;
