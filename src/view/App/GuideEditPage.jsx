import './GuidePage.scss';
import './GuideEditPage.scss';
import { getChampion } from '../../data/champions';
import Champion from '../../data/model/Champion';
import guides from '../../data/guides';
import lang from '../../service/lang';
import ChampionHeader from '../Champion/ChampionHeader.jsx';
import ChampionSection from '../Champion/ChampionSection.jsx';
import GuideEditAuthor from './GuideEditAuthor.jsx';

function GuideEditPage(initialVnode) {
    function editGuide(uid, initialSelectors, initialKey, value) {
        const guide = guides.getGuideFor(uid, lang.current) || guides.import(uid, '{}', lang.current);
        let object = guide;
    
        const keys = initialKey.split('.');
        const selectors = (keys.length > 1)?
            [
                ...initialSelectors,
                ...keys.filter((value, index) => index < keys.length - 1),
            ]:
            initialSelectors;
        const key = keys[ keys.length - 1 ];
    
        for(let i = 0; i < selectors.length; i++) {
            if(!object[ selectors[ i ] ])
                object[ selectors[ i ] ] = {};
            object = object[ selectors[ i ] ];
        }
        object[ key ] = value || undefined;
    }
    return {
        oninit(vnode) {
        },
        view(vnode) {
            const {uid} = vnode.attrs;
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
            const grades = guide && guide.grades;
            details.push(
                <ChampionSection
                    title={ lang.string('description') }
                    grade={ grades && guide.grades.normal || true }
                    gradeAwakened={ grades && guide.grades.awakened || true }
                    description={ guide && guide.description || true }
                    youtube={ guide && guide.youtube || true }
                    onEdit={ (key, value) => editGuide(uid, [ ], key, value, vnode) }
                />
            );
            const gameplay = guide && guide.gameplay;
            details.push(
                <ChampionSection
                    title={ lang.string('gameplay') }
                    rating={ gameplay && guide.gameplay.rating || true }
                    description={ gameplay && guide.gameplay.description || true }
                    abilities={ gameplay && guide.gameplay.abilities || true }
                    note={ gameplay && guide.gameplay.note || true }
                    onEdit={ (key, value) => editGuide(uid, [ 'gameplay' ], key, value, vnode) }
                />
            );
            const attack = guide && guide.attack;
            details.push(
                <ChampionSection
                    title={ lang.string('attack') }
                    rating={ attack && guide.attack.rating || true }
                    description={ attack && guide.attack.description || true }
                    heavy={ attack && guide.attack.heavy || true }
                    ranges={ attack && guide.attack.ranges || true }
                    damagetypes={ attack && guide.attack.damagetypes || true }
                    abilities={ attack && guide.attack.abilities || true }
                    note={ attack && guide.attack.note || true }
                    onEdit={ (key, value) => editGuide(uid, [ 'attack' ], key, value, vnode) }
                />
            );
            [1, 2, 3].forEach((index) => {
                const special = guide && guide.specials && guide.specials[index];
                details.push(
                    <ChampionSection
                        title={ `${ lang.string('special') } ${ index }` }
                        rating={ special && special.rating || true }
                        name={ special && special.name }
                        description={ special && special.description || true }
                        ranges={ special && special.ranges || (index !== 3) }
                        damagetypes={ special && special.damagetypes || true }
                        abilities={ special && special.abilities || true }
                        note={ special && special.note || true }
                        onEdit={ (key, value) => editGuide(uid, [ 'specials', index ], key, value, vnode) }
                        noEdit={ [ 'name' ] }
                    />
                );
            });
            const signature = guide && guide.signature;
            details.push(
                <ChampionSection
                    title={ lang.string('signature') }
                    rating={ signature && guide.signature.rating || true }
                    name={ signature && signature.name }
                    description={ signature && guide.signature.description || true }
                    abilities={ signature && guide.signature.abilities || true }
                    note={ signature && guide.signature.note || true }
                    onEdit={ (key, value) => editGuide(uid, [ 'signature' ], key, value, vnode) }
                    noEdit={ [ 'name' ] }
                />
            );
            const author = guide && guide.author;
            details.push(
                <GuideEditAuthor
                    name={ author && author.name || true }
                    type={ author && author.type || true }
                    profile={ author && author.profile || true }
                    onEdit={ (key, value) => editGuide(uid, [ 'author' ], key, value, vnode) }
                />
            );
            return (
                <div m="GuideEditPage" class="guide guide-edit" key={ `guide-${ uid }` }>
                    { details }
                    <div class="clear"/>
                </div>
            );
        },
    };
};

export default GuideEditPage;
