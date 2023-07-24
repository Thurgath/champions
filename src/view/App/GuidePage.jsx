import './GuidePage.scss';
import { getChampion } from '../../data/champions';
import Champion from '../../data/model/Champion';
import { forChampion } from '../../data/synergies';
import guides from '../../data/guides';
import lang from '../../service/lang';
import ChampionHeader from '../Champion/ChampionHeader.jsx';
import ChampionSection from '../Champion/ChampionSection.jsx';
import GuideAuthor from './GuideAuthor.jsx';
import GuideSynergy from './GuideSynergy.jsx';

function GuidePage(initialVnode) {
    return {
        oninit(vnode) {
            const {uid} = vnode.attrs;
            vnode.state.uid = uid;
        },
        view(vnode) {
            const {uid} = vnode.state;
            const guide = guides.getGuideFor(uid, lang.current);
            const details = [];
            const champion = getChampion(uid);
            if (champion) {
                details.push(
                    <ChampionHeader
                        champion={ new Champion({
                        ...champion.attr,
                        stars: 0,
                    }) }
                    />
                );
            }

            if (guide && guide.description) {
                details.push(
                    <ChampionSection
                        title={ lang.string('description') }
                        grade={ guide.grades && guide.grades.normal }
                        gradeAwakened={ guide.grades && guide.grades.awakened }
                        description={ guide.description }
                        youtube={ guide.youtube }
                    />
                );
            }
            else {
                details.push(
                    <ChampionSection
                        title={ lang.string('description') }
                        help={ lang.string(`champion-${uid}-description`, null) }
                    />
                );
            }

            if (guide) {
                if (guide.gameplay) {
                    details.push(
                        <ChampionSection
                            title={ lang.string('gameplay') }
                            rating={ guide.gameplay.rating }
                            description={ guide.gameplay.description }
                            abilities={ guide.gameplay.abilities }
                            note={ guide.gameplay.note }
                        />
                    );
                }
                if (guide.attack) {
                    details.push(
                        <ChampionSection
                            title={ lang.string('attack') }
                            rating={ guide.attack.rating }
                            description={ guide.attack.description }
                            heavy={ guide.attack.heavy }
                            ranges={ guide.attack.ranges }
                            damagetypes={ guide.attack.damagetypes }
                            abilities={ guide.attack.abilities }
                            note={ guide.attack.note }
                        />
                    );
                }
            }

            [1, 2, 3].forEach((index) => {
                if (guide && guide.specials && guide.specials[index]) {
                    details.push(
                        <ChampionSection
                            title={ `${ lang.string('special') } ${ index }` }
                            icon={ `special-${ index }` }
                            rating={ guide.specials[ index ].rating }
                            name={ guide.specials[ index ].name }
                            description={ guide.specials[ index ].description }
                            ranges={ (index === 3)? null: guide.specials[ index ].ranges }
                            damagetypes={ guide.specials[ index ].damagetypes }
                            abilities={ guide.specials[ index ].abilities }
                            note={ guide.specials[ index ].note }
                        />
                    );
                }
            });

            if (guide && guide.signature) {
                details.push(
                    <ChampionSection
                        title={ lang.string('signature') }
                        name={ guide.signature.name }
                        rating={ guide.signature.rating }
                        description={ guide.signature.description }
                        abilities={ guide.signature.abilities }
                        note={ guide.signature.note }
                    />
                );
            }
            let lastGroup;
            details.push(
                <ChampionSection
                    title={ lang.string('synergies') }
                    icon="synergy"
                    raw={ forChampion(uid, true).map(({ attr }, index) => {
                    const isNewGroup = (index > 0) && (!attr.group || attr.group !== lastGroup);
                    lastGroup = attr.group;
                    return (
                        <GuideSynergy
                            championId={ attr.toId }
                            effectId={ attr.effectId }
                            stars={ attr.fromStars }
                            spacing={isNewGroup}
                        />
                    );
                }) }
                />
            );
            details.push(
                <ChampionSection
                    title={ lang.string('synergies-external') }
                    icon="synergy"
                    raw={ forChampion(uid, false).map(({ attr }) => (
                    <GuideSynergy
                        championId={ attr.fromId }
                        typeId={ attr.typeId }
                        effectId={ attr.effectId }
                        stars={ attr.fromStars }
                    />
                )) }
                />
            );
            if (guide && guide.author) {
                details.push(
                    <GuideAuthor
                        name={ guide.author.name }
                        type={ guide.author.type }
                        profile={ guide.author.profile }
                    />
                );
            }
            return (
                <div
                    m="GuidePage"
                    role="article"
                    class="guide"
                >
                    { details }
                    <div class="clear"/>
                </div>
            );
        },
    };
};

export default GuidePage;
