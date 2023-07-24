import lang from '../../../service/lang';
import ImageIcon from '../../ImageIcon.jsx';
import { save } from '../../../service/teams';

function Checkbox(initialVnode) {
    var value;
    return {
        oninit(vnode) {
            const {object, field} = vnode.attrs;
            value = object[ field ];
        },
        view(vnode) {
            const {object, field} = vnode.attrs;
            const icon = `icons/${value ? 'square-check.svg': 'square.svg'}`;
            const iconText = lang.string(value ? 'enabled' : 'disabled');
            return (
                <div key={ field }
                    class="field-checkbox no-select"
                           onclick={ (event) => {
                                event.redraw = false;
                                value = object[ field ] = !object[ field ];
                                save();
                                m.redraw();
                         }}
                >
                    <ImageIcon src={ icon } before/>
                        { iconText }
                </div>
            );
        },
    };
};

export default Checkbox;
