import App from '../../src/view/App.jsx';
import Slides from '../../src/view/Slides.jsx';
import Menu from '../../src/view/Menu.jsx';
import MenuHeader from '../../src/view/menu/MenuHeader.jsx';
import MenuOption from '../../src/view/menu/MenuOption.jsx';
import MenuOptionGroup from '../../src/view/menu/MenuOptionGroup.jsx';
import MenuSection from '../../src/view/menu/MenuSection.jsx';
import Message from '../../src/view/Message.jsx';
import roster from '../../src/service/roster';
import appState from '../../src/service/appState';

roster.clear();

describe('view/', () => {
    const rosterResult = appState().rosterPage();

    describe('<App />', () => it('should render without error', () => {
        //initialize appState
        expect(mq(App, rosterResult)).to.exist;
    }));
    describe('<Slides/>', () => it('should render without error', () => {
        const slides = [];
        const current = 0;
        expect(mq(Slides, { ...{ slides, current } })).to.exist;
    }));
    describe('<Menu/>', () => it('should render without error', () => {
        expect(mq(Menu, rosterResult)).to.exist;
    }));
    describe('<MenuHeader/>', () => it('should render without error', () => {
        expect(mq(MenuHeader, {})).to.exist;
    }));
    describe('<MenuOption/>', () => it('should render without error', () => {
        expect(mq(MenuOption, {})).to.exist;
    }));
    describe('<MenuOptionGroup/>', () => it('should render without error', () => {
        const options = [];
        expect(mq(MenuOptionGroup, { ...{ options } })).to.exist;
    }));
    describe('<MenuSection/>', () => it('should render without error', () => {
        expect(mq(MenuSection, {})).to.exist;
    }));
    describe('<Message/>', () => it('should render without error', () => {
        expect(mq(Message, {})).to.exist;
    }));
});
