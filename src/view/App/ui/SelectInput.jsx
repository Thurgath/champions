import Icon from '../../Icon.jsx';

function SelectInput(initialVnode) {
    return {
        view(vnode) {
            const {value, min, max, values, onchange} = vnode.attrs;
            const options = [];
            if (min !== undefined && max !== undefined) {
                for (let i = min; i <= max; i++)
                    options.push(
                        <option value={ i } selected={ value === i }>{ i }</option>
                    );
            }
            if (values !== undefined) {
                values.forEach((option) => options.push(
                    <option value={ option.value } selected={ option.value === value }>{ option.title }</option>
                ));
            }
            return (
                <div class="champion-field-select">
                    <select onchange={ onchange }>
                        { options }
                    </select>
                    <Icon icon="caret-down"/>
                </div>
            );
        },
    };
};

export default SelectInput;
