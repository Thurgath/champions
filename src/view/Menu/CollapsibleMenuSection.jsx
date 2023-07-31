import './CollapsibleMenuSection.scss';
import MenuSection from './MenuSection.jsx';

function CollapsibleMenuSection() {
    return {
        oninit(vnode) {
            vnode.state.onClick = function(radioButtonName, event) {
                event.redraw = false;
                //Problems to uncheck radio button as the events are bubbling.
                //See https://stackoverflow.com/questions/10876953/how-to-make-a-radio-button-unchecked-by-clicking-it
                const radioButton = document.getElementById(radioButtonName);
                if (radioButton.checked) {
                    radioButton.checked = false;
                    radioButton.onclick = function() {
                        radioButton.checked = false;
                    };
                    return;
                }
                radioButton.onclick = null;
                radioButton.checked = true;
                radioButton.scrollIntoView();
            };
        },
        view(vnode) {
            const { title, icon, subMenus, hasSelectedItem } = vnode.attrs;
            return (
                <div class="collapsible-tab" m="CollapsibleMenuSection">
                    <input type="radio" id={ title } name="collapsible-radio" checked={ hasSelectedItem }/>
                    <label class="collapsible-tab-label" for={ title }
                        onmouseup={ (event) => vnode.state.onClick(title, event) }>
                        <MenuSection
                            icon={ icon }
                            title={ title }
                        />
                    </label>
                    <div class="collapsible-tab-content">
                        {subMenus}
                    </div>
                </div>
            );
        },
    };
}

export default CollapsibleMenuSection;
