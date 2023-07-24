import { save } from '../../../service/teams';

function Slider(initialVnode) {
    return {
        view(vnode) {
            const {object, field, toInputValue, fromInputValue} = vnode.attrs;
            return (
                <input
                    class="field-slider"
                    type="range"
                    min="0"
                    max="1000"
                    step="1"
                    value={ toInputValue(object[ field ]) }
                    oninput={ (event) => {
                        object[ field ] = fromInputValue(event.target.value);
                        save();
                    } }
                />
            );
        },
    };
};

export default Slider;
