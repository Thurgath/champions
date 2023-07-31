import GuideEditPage from '../../src/view/App/GuideEditPage.jsx';
import GuidePage from '../../src/view/App/GuidePage.jsx';
import LanguageEditPage from '../../src/view/App/LanguageEditPage.jsx';
import RosterAddPage from '../../src/view/App/RosterAddPage.jsx';
import RosterEditPage from '../../src/view/App/RosterEditPage.jsx';
import RosterPage from '../../src/view/App/RosterPage.jsx';
import SynergyPage from '../../src/view/App/SynergyPage.jsx';
import TeamsPage from '../../src/view/App/TeamsPage.jsx';
import TeamsEditPage from '../../src/view/App/TeamsEditPage.jsx';
import TeamsSettingsPage from '../../src/view/App/TeamsSettingsPage.jsx';
import roster from '../../src/service/roster';
import { createElement } from '../test-setup.js';

roster.clear();

describe('view/pages/', () => {

    before(() => {
        // See comments in test-setup.js
        createElement('add-svg-for-portrait');
    });

    describe('<GuideEditPage/>', () => it('should render without error', () => {
        expect(mq(GuideEditPage, {})).to.exist;
    }));
    describe('<GuidePage/>', () => it('should render without error', () => {
        expect(mq(GuidePage, {})).to.exist;
    }));
    describe('<LanguageEditPage/>', () => it('should render without error', () => {
        expect(mq(LanguageEditPage, { langId: 'en' })).to.exist;
    }));
    describe('<RosterAddPage/>', () => it('should render without error', () => {
        it('should render without error for 1 star', () => expect(mq(RosterAddPage, { stars: 1 })).to.exist);
        it('should render without error for 2 star', () => expect(mq(RosterAddPage, { stars: 2 })).to.exist);
        it('should render without error for 3 star', () => expect(mq(RosterAddPage, { stars: 3 })).to.exist);
        it('should render without error for 4 star', () => expect(mq(RosterAddPage, { stars: 4 })).to.exist);
        it('should render without error for 5 star', () => expect(mq(RosterAddPage, { stars: 5 })).to.exist);
        it('should render without error for 6 star', () => expect(mq(RosterAddPage, { stars: 6 })).to.exist);
    }));
    describe('<RosterEditPage/>', () => it('should render without error', () => {
        expect(mq(RosterEditPage, {})).to.exist;
    }));
    describe('<RosterPage/>', () => it('should render without error', () => {
        expect(mq(RosterPage, {})).to.exist;
    }));
    describe('<SynergyPage/>', () => it('should render without error', () => {
        expect(mq(SynergyPage, {})).to.exist;
    }));
    describe('<TeamsPage/>', () => it('should render without error', () => {
        expect(mq(TeamsPage, {})).to.exist;
    }));
    describe('<TeamsEditPage/>', () => it('should render without error', () => {
        expect(mq(TeamsEditPage, {})).to.exist;
    }));
    describe('<TeamsSettingsPage/>', () => it('should render without error', () => {
        expect(mq(TeamsSettingsPage, {})).to.exist;
    }));
});
