import MenuHeader from '../Menu/MenuHeader.jsx';

function GlossaryMenu() {
    return {
        onbeforeupdate() {
            //This is just to get rid of a warning message from Mithril saysing not to reuse attrs
            //The problem might be somewhere else in either Menu or MenuOptions, there seems to be a few too many redraws.
            //But I can't figure out what. See https://github.com/MithrilJS/mithril.js/issues/2826 for other example.
            return false;
        },
        view() {
            return (
                <div m="GlossaryMenu">
                    <MenuHeader title="glossary"/>
                </div>
            );
        },
    };
}

export default GlossaryMenu;
