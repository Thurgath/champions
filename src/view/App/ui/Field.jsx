import lang from '../../../service/lang';
import classNames from 'classnames';

function Field() {
    return {
        view(vnode) {
            const { title, icon, description, alt, input, inputComponent, inputParameters, value, hasLargeValue } = vnode.attrs;
            return (
                <div class="field">
                    <label class="field-name">
                        { icon }
                        { title }
                    </label>
                    <div class="field-content">
                        { (description !== undefined) ? (
                            <div class="field-description">{ description }</div>
                        ) : null }
                        { (input !== undefined || inputComponent !== undefined) ? (
                            <div class={ classNames('field-input',
                                { 'field-input-small': (value !== undefined) && !hasLargeValue },
                                { 'field-input-large': (value !== undefined) && hasLargeValue }
                            )}>
                                { input || m(inputComponent, inputParameters )}
                            </div>
                        ) : null }
                        { (value !== undefined) ? (
                            <span class="field-value">
                                { lang.number(value) }
                            </span>
                        ) : null }
                        { (alt !== undefined) ? (
                            <div class="field-description-alt">{ alt }</div>
                        ) : null }
                    </div>
                </div>
            );
        },
    };
}

export default Field;
