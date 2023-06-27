import app from '../../src/service/app';
import App from '../../src/view/App.jsx';
import Slides from '../../src/view/Slides.jsx';
import Menu from '../../src/view/Menu.jsx';
import MenuHeader from '../../src/view/Menu/MenuHeader.jsx';
import MenuOption from '../../src/view/Menu/MenuOption.jsx';
import MenuOptionGroup from '../../src/view/Menu/MenuOptionGroup.jsx';
import MenuSection from '../../src/view/Menu/MenuSection.jsx';
import Message from '../../src/view/Message.jsx';
/* eslint-disable no-unused-vars */
import m from 'mithril';
/* eslint-enable no-unused-vars */
import roster from '../../src/service/roster';
import mq from 'mithril-query';

roster.clear();

describe('view/', () => {

    describe('<App/>', () => it('should render without error', () => {
        app.edit = true;
        app.tab = 'champions';
        app.tabs = [
            {
                id: 'champions',
                title: 'champions',
                icon: 'user',
            },
        ];
        app.pages[ 'champions' ] = null;
        app.menu = {
            view() {
                return (
                    <div />
                );
            },
        };
        app.button = null;
        expect(mq(App, {})).to.exist;
    }));
    describe('<Slides/>', () => it('should render without error', () => {
        const slides = [];
        const current = 0;
        expect(mq(Slides, { ...{ slides, current } })).to.exist;
    }));
    describe('<Menu/>', () => it('should render without error', () => {
        const { tabs, tab, menu, button } = app;
        expect(mq(Menu, { ...{ tabs, tab, menu, button } })).to.exist;
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
