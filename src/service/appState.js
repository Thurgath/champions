import stream from 'mithril/stream';
import Tab from './state/tab.js';
import { fromStorage, toStorage } from '../util/storage.js';
import RosterMenu from '../view/App/RosterMenu.jsx';
import RosterPage from '../view/App/RosterPage.jsx';
import RosterAddMenu from '../view/App/RosterAddMenu.jsx';
import RosterAddPage from '../view/App/RosterAddPage.jsx';
import RosterEditMenu from '../view/App/RosterEditMenu.jsx';
import RosterEditPage from '../view/App/RosterEditPage.jsx';
import GuideMenu from '../view/App/GuideMenu.jsx';
import GuidePage from '../view/App/GuidePage.jsx';
import GuideEditMenu from '../view/App/GuideEditMenu.jsx';
import GuideEditPage from '../view/App/GuideEditPage.jsx';
import TeamsMenu from '../view/App/TeamsMenu.jsx';
import TeamsPage from '../view/App/TeamsPage.jsx';
import TeamsEditPage from '../view/App/TeamsEditPage.jsx';
import TeamsSettingsMenu from '../view/App/TeamsSettingsMenu.jsx';
import TeamsSettingsPage from '../view/App/TeamsSettingsPage.jsx';
import { buildTeam } from '../service/teams';
import SynergyMenu from '../view/App/SynergyMenu.jsx';
import SynergyPage from '../view/App/SynergyPage.jsx';
import GlossaryMenu from '../view/App/GlossaryMenu.jsx';
import GlossaryPage from '../view/App/GlossaryPage.jsx';
import LanguageEditMenu from '../view/App/LanguageEditMenu.jsx';
import LanguageEditPage from '../view/App/LanguageEditPage.jsx';

const PREVIOUS_ROUTE = 'previousRoute';
const GUIDE = 'guide';
const ROSTER = 'roster';
const TEAMS = 'teams';
const SYNERGY = 'synergy';
const GLOSSARY = 'glossary';
const LANGUAGE = 'language';

const appState = stream({
    tabs: [
        new Tab({
            id: GUIDE,
            title: GUIDE,
            icon: 'user',
            slides: {
                'guide-show': {
                    menu: GuideMenu,
                    page: GuidePage,
                    pageMountElement: 'guide-show',
                    button: {
                        icon: 'pencil',
                        href: (uid) => {
                            return `/guide/${ uid }/edit`;
                        },
                    },
                    addToHistory: true,
                },
                'guide-edit':  {
                    menu: GuideEditMenu,
                    page: GuideEditPage,
                    pageMountElement: 'guide-edit',
                    button: {
                        icon: 'reply',
                        href: (uid) => {
                            return `/guide/${ uid }`;
                        },
                    },
                },
            },
        }),
        new Tab({
            id: ROSTER,
            title: ROSTER,
            icon: 'users',
            slides: {
                'roster-add': {
                    menu: RosterAddMenu,
                    page: RosterAddPage,
                    pageMountElement: 'roster-add',
                    button: {
                        icon: 'share',
                        href: '/roster',
                    },
                    addToHistory: true,
                },
                'roster-show': {
                    menu: RosterMenu,
                    page: RosterPage,
                    pageMountElement: 'roster-show',
                    button: {
                        icon: 'user-plus',
                        href: (stars) => {
                            return `/roster/add/${ stars || 6 }`;
                        },
                    },
                },
                'roster-edit': {
                    menu: RosterEditMenu,
                    page: RosterEditPage,
                    pageMountElement: 'roster-edit',
                    button: {
                        icon: 'reply',
                        href: '/roster',
                    },
                },
            },
        }),
        new Tab({
            id: TEAMS,
            title: TEAMS,
            icon: 'cogs',
            hotkeys: [
                {
                    which: 'B',
                    modifiers: [ 'ctrl' ],
                    callback: buildTeam,
                },
            ],
            slides: {
                'teams-settings': {
                    menu: TeamsSettingsMenu,
                    page: TeamsSettingsPage,
                    pageMountElement: 'teams-settings',
                    button: {
                        icon: 'share',
                        href: '/teams',
                    },
                },
                'teams-show': {
                    menu: TeamsMenu,
                    page: TeamsPage,
                    pageMountElement: 'teams-show',
                    button: {
                        icon: 'sliders',
                        href: '/teams/settings',
                    },
                },
                'teams-edit': {
                    menu: TeamsMenu,
                    page: TeamsEditPage,
                    pageMountElement: 'teams-edit',
                    button: {
                        icon: 'reply',
                        href: '/teams',
                    },
                },
            },
        }),
        new Tab({
            id: SYNERGY,
            title: SYNERGY,
            icon: 'synergy',
            menu: SynergyMenu,
            page: SynergyPage,
            pageMountElement: SYNERGY,
            addToHistory: true,
        }),
        new Tab({
            id: GLOSSARY,
            title: GLOSSARY,
            icon: 'info-circle',
            menu: GlossaryMenu,
            page: GlossaryPage,
            pageMountElement: GLOSSARY,
        }),
        new Tab({
            id: LANGUAGE,
            title: LANGUAGE,
            icon: 'globe',
            menu: LanguageEditMenu,
            page: LanguageEditPage,
            pageMountElement: LANGUAGE,
            hidden: true,
        }),
    ],
    currentTab: null,
    getCurrentTab() {
        //Default to tab for default route
        return this.currentTab || this.findTabById(ROSTER);
    },
    getTabs() {
        return this.tabs;
    },
    getHotkeys() {
        return this.getCurrentTab().getHotkeys();
    },
    findTabById(tab) {
        return this.tabs.find((tabObject) => tabObject.getId() === tab);
    },
    defaultValuesWithoutSlides(tab, parameters) {
        return this.defaultValues(tab, null, parameters);
    },
    defaultValues(tab, currentSlide, parameters) {
        //Default to Roster if no currentTab
        const previousTab = this.currentTab || this.findTabById(ROSTER);
        this.currentTab = this.findTabById(tab);
        return this.currentTab.getResultAndSetValues(currentSlide, parameters, previousTab);
    },
    getStartRoute(hasRoster) {
        return hasRoster ? '/roster' : '/guide';
    },
    getPreviousRoute() {
        return fromStorage(PREVIOUS_ROUTE, this.getStartRoute(true));
    },
    setHistory(route) {
        this.getCurrentTab().setHistory(route);
        toStorage(PREVIOUS_ROUTE, route);
    },
    getRosterAddRoute() {
        const route = this.findTabById(ROSTER).getHistory() || '/roster/add/6';
        return route;
    },
    rosterPage() {
        const currentTab = this.findTabById(ROSTER);
        return this.defaultValues(ROSTER, 'roster-show', currentTab.getParameters());
    },
    rosterAddPage(stars) {
        return this.defaultValues(ROSTER, 'roster-add', { stars: Number.parseInt(stars, 10) });
    },
    rosterEditChampion(uid, stars) {
        return this.defaultValues(ROSTER, 'roster-edit', { uid, stars: Number.parseInt(stars, 10) });
    },
    getGuideRoute(spotlight, randomGuide) {
        let route = this.findTabById(GUIDE).getHistory();
        if(!route) {
            route = `/guide/${ spotlight }`;
        }
        else if(route === '/guide') {
            route = `/guide/${ randomGuide }`;
        }
        return route;
    },
    guidePage(uid) {
        return this.defaultValues(GUIDE, 'guide-show', { uid });
    },
    editGuidePage(uid) {
        return this.defaultValues(GUIDE, 'guide-edit', { uid });
    },
    getSynergyRoute(stars) {
        const starsRoute = `/synergy/stars/${ stars || 6 }`;
        if (stars) {
            return starsRoute;
        }
        return this.findTabById(SYNERGY).getHistory() || starsRoute;
    },
    synergyStarsPage(stars) {
        return this.defaultValuesWithoutSlides(SYNERGY, { stars:  Number.parseInt(stars, 10) });
    },
    synergyEffectsPage(effect) {
        return this.defaultValuesWithoutSlides(SYNERGY, { effect });
    },
    synergyAllPage() {
        return this.defaultValuesWithoutSlides(SYNERGY);
    },
    teamsSettings() {
        return this.defaultValues(TEAMS, 'teams-settings');
    },
    teamsPage() {
        return this.defaultValues(TEAMS, 'teams-show', { editing: false });
    },
    teamsEditPage() {
        return this.defaultValues(TEAMS, 'teams-edit', { editing: true });
    },
    glossaryPage() {
        return this.defaultValuesWithoutSlides(GLOSSARY, {});
    },
    languageEditPage(languageId) {
        return this.defaultValuesWithoutSlides(LANGUAGE, { langId: languageId });
    },
});

export default appState;
