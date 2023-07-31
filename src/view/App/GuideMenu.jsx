import guides from '../../data/guides';
import { championTypeMap } from '../../data/champions';
import lang from '../../service/lang';
import router from '../../service/router';
import { UNRELEASED_CHAMPIONS } from '../../data/champions/unreleased';
import MenuHeader from '../Menu/MenuHeader.jsx';
import CollapsibleMenuSection from '../Menu/CollapsibleMenuSection.jsx';
import MenuOption from '../Menu/MenuOption.jsx';
import ImageIcon from '../ImageIcon.jsx';
import Icon from '../Icon.jsx';

function GuideMenu() {
    let currentUid;
    return {
        oninit(vnode) {
            const { uid } = vnode.attrs;
            currentUid = uid;
        },
        view(vnode) {
            const options = [];
            options.push(
                <MenuHeader title="guides"/>
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
                            onclick={ () => {
                                currentUid = uid;
                                router.route('/guide/:uid', { uid });
                            }}
                        />)
                    );
                options.push(
                    <CollapsibleMenuSection
                        icon={
                            <Icon icon={ `type-${ typeId }` } before />
                        }
                        title={ `type-${ typeId }-name` }
                        subMenus={ subMenus }
                        hasSelectedItem={ uids.includes(currentUid) }
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
}

export default GuideMenu;
