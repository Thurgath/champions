import classNames from 'classnames';
import Icon from '../Icon.jsx';
import ImageIcon from '../ImageIcon.jsx';
import { effectIcon } from '../../data/effects';
import { getChampion } from '../../data/champions';
import lang from '../../service/lang';
import router from '../../service/router';

function GuideSynergy(initialVnode) {

    return {
        view(vnode) {
            const {championId, effectId, stars, spacing} = vnode.attrs;
            const onclickChampion = () => {
                router.route('/guide/:uid', { uid: championId });
            };
            const champion = getChampion(championId);
            const typeId = champion && champion.attr.typeId;
            const name = lang.string(`champion-${ championId }-shortname`, null) || lang.string(`champion-${ championId }-name`);

            return (
                <div m="GuideSynergy" class={ classNames('guide-synergy', {
                'guide-synergy--spacing': spacing,
            }) }>
                    <div class="guide-synergy-parts">
                        <div class="guide-synergy-part guide-synergy-part--champion">
                            <div
                                class={ classNames('champion-name', 'no-select') }
                                onclick={ onclickChampion }
                                title={ lang.string(`champion-${ championId }-name`) }
                            >
                                <ImageIcon
                                    src={ `images/champions/portrait_${ championId }.png` }
                                    type={ typeId }
                                    icon="user"
                                    before
                                />
                                { stars }★
                                { name }
                            </div>
                        </div>
                        <div class="guide-synergy-part guide-synergy-part--effect">
                            <div
                                class="effect-name"
                                title={ lang.string(`effect-${ effectId }-description`) }
                            >
                                <Icon icon={ effectIcon(effectId) } before/>
                                { lang.string(`effect-${ effectId }-name`, null) || lang.string(`effect-${ effectId }-type`) }
                            </div>
                        </div>
                        <div class="guide-synergy-clear"/>
                    </div>
                </div>
            );
        },
    }
};

export default GuideSynergy;
