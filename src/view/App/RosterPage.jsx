import './RosterPage.scss';
import roster from '../../service/roster';
import router from '../../service/router';
import appState from '../../service/appState.js';
import lang from '../../service/lang';
import { notify } from '../../util/notification';
import Message from '../Message.jsx';
import Icon from '../Icon.jsx';
import ChampionPortrait from '../Champion/ChampionPortrait.jsx';
import ChampionUpgrades from '../Champion/ChampionUpgrades.jsx';

function RosterPage() {
    return {
        oninit(vnode) {
            if (roster.all().length === 0) {
                notify({
                    message: lang.string('notification-roster-empty'),
                    tag: 'roster-empty',
                    onclick: () => router.route(appState().getRosterAddRoute()),
                });
            }
        },
        view(vnode) {
            const total = roster.all().length;
            const champions = roster.filter((champion) => roster.getFilter(champion.attr.stars) && roster.getFilter(champion.attr.typeId));
            const prestige = champions
                .map(({ pi }) => pi)
                .sort((a, b) => b - a)
                .slice(0, 5)
                .reduce((value, pi, index, array) => value + pi / array.length, 0) | 0;
            const scalePi = roster.getScale();
            const handleSelect = ({ uid, stars }) => {
                router.route('/roster/:uid/:stars', { uid, stars });
            };
            const upgrades = roster.getUpgrades() && (
                <ChampionUpgrades champions={ champions }/>
            ) || null;
            return (
                <div m="RosterPage" class="roster">
                    <Message
                        icon={(
                            <Icon
                                icon={
                                    (champions.length > 1)? 'users':
                                        (champions.length)? 'user':
                                            'user-times'
                                }
                                before
                            />
                        )}
                        value={ `${ lang.number(champions.length) } ${ lang.string('of') } ${ lang.number(total) } ${ lang.string('champions') }` }
                        alt={ prestige && `${ lang.string('prestige') } ${ lang.number(prestige) }` }
                    />
                    { upgrades }
                    <div>
                        { champions.map((champion) => (
                            <ChampionPortrait
                                key={ `roster-${ champion.id }` }
                                champion={ champion }
                                scalePi={ scalePi }
                                onclick={ handleSelect.bind(this, champion.attr) }
                            />
                        )) }
                    </div>
                    <div class="clear"/>
                </div>
            );
        },
    };
}

export default RosterPage;
