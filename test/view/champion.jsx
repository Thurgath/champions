import { championMap } from '../../src/data/champions';
import ChampionGrade from '../../src/view/Champion/ChampionGrade.jsx';
import ChampionHeader from '../../src/view/Champion/ChampionHeader.jsx';
import ChampionPortrait from '../../src/view/Champion/ChampionPortrait.jsx';
import ChampionRating from '../../src/view/Champion/ChampionRating.jsx';
import ChampionSection from '../../src/view/Champion/ChampionSection.jsx';
import ChampionTeam from '../../src/view/Champion/ChampionTeam.jsx';
import { ARENA } from '../../src/data/ids/roles.js';
/* eslint-disable no-unused-vars */
import m from 'mithril';
/* eslint-enable no-unused-vars */
import roster from '../../src/service/roster';
import mq from 'mithril-query';

roster.clear();

describe('view/champion/', () => {

    const champion = championMap[ 'thor-3' ];
    champion.attr.role = ARENA;
    describe('<ChampionGrade/>', () => it('should render without error', () => {
        const title = 'type';
        const grade = 'a';
        expect(mq(ChampionGrade, { ...{ title, grade } })).to.exist;
    }));
    describe('<ChampionHeader/>', () => it('should render without error', () => {
        expect(mq(ChampionHeader, { champion })).to.exist;
    }));
    describe('<ChampionPortrait/>', () => it('should render without error', () => {
        expect(mq(ChampionPortrait, { champion })).to.exist;
    }));
    describe('<ChampionRating/>', () => it('should render without error', () => {
        expect(mq(ChampionRating, {})).to.exist;
    }));
    describe('<ChampionSection/>', () => it('should render without error', () => {
        expect(mq(ChampionSection, {})).to.exist;
    }));
    describe('<ChampionTeam/>', () => it('should render without error', () => {
        expect(mq(ChampionTeam, { champions: [ champion ], synergies: [], index: 0 })).to.exist;
    }));
});
