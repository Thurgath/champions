function NumberInput(initialVnode) {
    return {
        view(vnode) {
            const {value, placeholder, min, max, onchange} = vnode.attrs;
            return (
                <div class="champion-field-input">
                    <input
                        value={ value || '' }
                        placeholder={ placeholder }
                        type="number"
                        min={ min }
                        max={ max }
                        oninput={ onchange }
                    />
                </div>
            );
        },
    };
}

export default NumberInput;