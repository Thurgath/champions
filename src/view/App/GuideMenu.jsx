import guides from '../../data/guides';
import { championTypeMap } from '../../data/champions';
import lang from '../../service/lang';
import { UNRELEASED_CHAMPIONS } from '../../data/champions/unreleased';
import MenuHeader from '../Menu/MenuHeader.jsx';
import CollapsibleMenuSection from '../Menu/CollapsibleMenuSection.jsx';
import MenuOption from '../Menu/MenuOption.jsx';
import ImageIcon from '../ImageIcon.jsx';
import Icon from '../Icon.jsx';

const GuideMenu = {
    controller: function(data) {
    },
    view(ctrl, { uid }) {
        const currentUid = uid;
        const options = [];
        options.push(
            <MenuHeader title="guides" />
        );
        championTypeMap.forEach(({ typeId, uids }) => {
            const subMenus = [];
            uids
                .map((uid) => ({ uid, name: lang.string(`champion-${ uid }-name`).toLowerCase() || '' }))
                .sort((a, b) => a.name.localeCompare(b.name))
                .filter((championUid) => guides.hasGuide(championUid.uid, lang.current))
                .map(({ uid }) =>
                    subMenus.push(<MenuOption
                        key={ `guide-champion-${ uid }` }
                        icon={(
                            <ImageIcon src={ `images/champions/portrait_${ uid }.png` } icon="user" before />
                        )}
                        invalid={ UNRELEASED_CHAMPIONS[ uid ] }
                        title={ `champion-${ uid }-name` }
                        selected={ currentUid === uid }
                        href={ `/guide/${ uid }` }
                    />)
                );
            options.push(
                <CollapsibleMenuSection
                    icon={
                        <Icon icon={ `type-${ typeId }` } before />
                    }
                    title={ `type-${ typeId }-name` }
                    subMenus={ subMenus }
                />
            );
        });
        return (
            <div m="GuideMenu" key={ 'guide-menu' } class="collapsible-tabs">
                { options }
            </div>
        );
    },
};

export default GuideMenu;
