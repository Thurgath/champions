import guides, { SPOTLIGHT } from '../data/guides';
import lang from './lang';
import appState from '../service/appState.js';
import roster from '../service/roster';
import { effectExists } from '../data/model/Effect';
import { starLevelExists } from '../data/champions/star-rank-level';
import analytics from '../service/analytics';
import App from '../view/App.jsx';
import Menu from '../view/Menu.jsx';

class Router {
    constructor() {
        window.removeEventListener('hashchange', this.reload, false);
        window.addEventListener('hashchange', this.reload, false);

        this.inializeRoutes();
    }

    inializeRoutes() {
        m.route.prefix = '#';
        m.route(document.body, '/roster', {
            '/': this.routeWithOnMatch(() => appState().getStartRoute(roster.all().length > 0)),
            '/roster': this.mountWithOnMatch(() => appState().rosterPage()),
            '/roster/add/:stars': this.mountWithOnMatch((parameters) => appState().rosterAddPage(parameters.stars)),
            '/roster/:uid/:stars': this.mountWithOnMatch((parameters) => appState().rosterEditChampion(parameters.uid, parameters.stars)),
            '/guide': this.routeWithOnMatch(() => appState().getGuideRoute(SPOTLIGHT, guides.getRandomGuideFor(lang.current))),
            '/guide/:uid': this.mountWithOnMatch((parameters) => appState().guidePage(parameters.uid)),
            '/guide/:uid/edit': this.mountWithOnMatch((parameters) => appState().editGuidePage(parameters.uid)),
            '/synergy': this.routeWithOnMatch(() => appState().getSynergyRoute()),
            '/synergy/all': this.mountWithOnMatch(() => appState().synergyAllPage()),
            '/synergy/:stars': this.routeWithOnMatch((parameters) => appState().getSynergyRoute(starLevelExists(parameters.stars) ? parameters.stars : null)),
            '/synergy/stars/:stars': this.mountWithOnMatch((parameters) => appState().synergyStarsPage(parameters.stars),
                (parameters) => starLevelExists(parameters.stars) ? false : '/synergy'),
            '/synergy/effect/:effect': this.mountWithOnMatch((parameters) => appState().synergyEffectsPage(parameters.effect),
                (parameters) => effectExists(parameters.effect) ? false : '/synergy'),
            '/teams': this.mountWithOnMatch(() => appState().teamsPage()),
            '/teams/edit': this.mountWithOnMatch(() => appState().teamsEditPage()),
            '/teams/settings': this.mountWithOnMatch(() => appState().teamsSettings()),
            '/glossary': this.mountWithOnMatch(() => appState().glossaryPage()),
            '/lang/:lang/#:newRoute': this.routeWithOnMatch((parameters, requestedPath) => {
                lang.change(parameters.lang);
                //Unable to get :newRoute as parameter since it contains the prefix(#)
                //We can't use /lang/:lang route either as this will match both
                if (requestedPath.includes('#')) {
                    return requestedPath.substring(requestedPath.indexOf('#') + 1);
                }
                return appState().getPreviousRoute();
            }),
            '/lang/:lang': this.routeWithOnMatch((parameters) => {
                //Unused. See '/lang/:lang/#:newRoute'
                lang.change(parameters.lang);
                return appState().getPreviousRoute();
            }),
            '/lang/:lang/edit': this.mountWithOnMatch((parameters) => appState().languageEditPage(parameters.lang)),
        });
    }

    reload(hashChangeEvent) {
        const newUrl = hashChangeEvent.newURL.substring(hashChangeEvent.newURL.indexOf('#') + 1);
        m.route.set(newUrl, {}, { replace: true });
    }

    logAnalytics() {
        analytics.pageView();
    }

    routeWithOnMatch(appStateFunction) {
        return {
            onmatch: (routingParameters, requestedPath, route) => {
                const newRoute = appStateFunction(routingParameters, requestedPath, route);
                m.route.set(newRoute);
            },
        };
    }

    mountWithOnMatch(appStateFunction, alternateRouteFunction) {
        return {
            onmatch: (routingParameters, requestedPath, route) => {
                const alternateRoute = alternateRouteFunction && alternateRouteFunction(routingParameters);
                if (alternateRoute) {
                    m.route.set(alternateRoute);
                    return;
                }
                this.logAnalytics();
                const appStateResult = appStateFunction(routingParameters, requestedPath, route);
                //Update history after currentTab has been updated
                appState().setHistory(requestedPath);
                this.mountAppOrNodes(appStateResult);
            },
        };
    }

    mountAppOrNodes(appStateResult) {
        const { pageMountElement, page, menu, parameters } = appStateResult;
        let element = document.getElementById(pageMountElement);
        if (!element) {
            //First mount
            m.mount(document.body, { view: () => m(App, { menu, parameters }) });
            element = document.getElementById(pageMountElement);
        }
        else if (appStateResult.shouldUpdateMenu()) {
            //We only have to change meny if we've switched tab or if we've changed slides
            m.mount(document.getElementById('menu'), { view: () => m(Menu, { menu, parameters }) });
        }
        // Small optimization. No full redraw needed when switching tabs unless parameters have changed
        if (appStateResult.shouldUpdatePage() || !element.hasChildNodes()) {
            m.mount(element, { view: () => m(page, parameters) });
        }
    }

    route(newRoute, parameters, options) {
        m.route.set(newRoute, parameters, options);
    }
}


export default new Router();
