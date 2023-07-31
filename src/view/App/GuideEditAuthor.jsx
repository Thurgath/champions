import lang from '../../service/lang';
import { PROFILE_TYPES } from '../../data/guides';

function GuideEditAuthor() {
    return {
        view(vnode) {
            const { name, type, profile, onEdit } = vnode.attrs;
            const editableText = (key) => ({
                'contenteditable': true,
                'class': 'champion-section-textarea',
                'oninput': (event) => onEdit(key, event.target.innerText.trim()),
                'onpaste': (event) => {
                    event.preventDefault();
                    const text = (event.originalEvent || event).clipboardData.getData('text/plain');
                    document.execCommand('insertHTML', false, text);
                },
            });
            const editableValue = (value) => value === true ? '' : value;
            const editableSelect = (list, key, initialValue) => (
                <select
                    class="champion-section-select"
                    onchange={ (event) => onEdit(key, event.target.selectedOptions[ 0 ].value) }
                >
                    <option value=""/>
                    {
                        list.map((value) => (
                            <option
                                value={ `${ value }` }
                                selected={ initialValue && value === initialValue }
                            >{
                                    lang.string(`profile-${ value }`)
                                }</option>
                        ))
                    }
                </select>
            );
            const elements = [];
            elements.push(
                <div class="champion-section-text">
                    <b>{ lang.string('author') }:</b>
                    <span {...editableText('name')}>{ m.trust(editableValue(name)) }</span>
                </div>
            );
            elements.push(
                <div class="champion-section-text">
                    <b>{ lang.string('type') }:</b>
                    { editableSelect(PROFILE_TYPES, 'type', type) }
                </div>
            );
            if (type && type !== true) {
                elements.push(
                    <div class="champion-section-text">
                        <b>{ lang.string(
                            (type === 'email') ?
                                'email' :
                                (type === 'spotlight') ?
                                    'thread' :
                                    'profile'
                        ) }:</b>
                        <span {...editableText('profile')}>{ m.trust(editableValue(profile)) }</span>
                    </div>
                );
            }
            return (
                <div class="champion-section">
                    { elements }
                </div>
            );
        },
    };
}

export default GuideEditAuthor;
