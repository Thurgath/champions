import './CollapsibleMenuSection.scss';
import MenuSection from './MenuSection.jsx';

const CollapsibleMenuSection = {
    controller: function(data) {
        this.onClick = function(radioButtonName) {
            //Problems to uncheck radio button as the events are bubbling.
            //See https://stackoverflow.com/questions/10876953/how-to-make-a-radio-button-unchecked-by-clicking-it
            const radioButton = document.getElementById(radioButtonName);
            if (radioButton.checked) {
                radioButton.checked = false;
                radioButton.onclick = function () {
                    radioButton.checked = false;
                };
                return;
            }
            radioButton.onclick = null;
            radioButton.checked = true;
            radioButton.scrollIntoView();
        }
    },
    view(ctrl, { title, icon, subMenus }) {
        return (
            <div class="collapsible-tab" m="CollapsibleMenuSection">
                <input type="radio" id={ title } name="collapsible-radio"/>
                <label class="collapsible-tab-label" for={ title } onmouseup={ ctrl.onClick.bind(ctrl, title) }>
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

export default CollapsibleMenuSection;
