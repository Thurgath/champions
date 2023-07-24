import deepEquals from 'deep-equal';

class Tab {
    constructor(options) {
        this._options = options;
    }

    getId() {
        return this._options.id;
    }

    getTitle() {
        return this._options.title;
    }

    getIcon() {
        return this._options.icon;
    }

    getResultAndSetValues(currentSlide, parameters, previousTab) {
        const previousSlide = this._currentSlide;
        const previousParameters = this._parameters;
        this._currentSlide = currentSlide;
        this._parameters = parameters || {};
        const objectWithData = this.getObjectWithData(currentSlide);
        return {
            pageMountElement: objectWithData.pageMountElement,
            page: objectWithData.page,
            menu: objectWithData.menu,
            parameters: this._parameters,
            //Update if same tab or if this tab has changed parameters
            shouldUpdatePage: () => this.getId() === previousTab.getId() || !deepEquals(previousParameters, parameters),
            //Update if tab has changed or slide has changed for this tab
            shouldUpdateMenu: () => this.getId() !== previousTab.getId() || previousSlide !== currentSlide,
        };
    }

    getObjectWithData(currentSlide) {
        return this._options.slides ? this._options.slides[ currentSlide ] : this._options;
    }

    getParameters() {
        return this._parameters;
    }

    getButton() {
        const objectWithData = this.getObjectWithData(this._currentSlide);
        return objectWithData.button && {
            icon: objectWithData.button.icon,
            href: objectWithData.button.href instanceof Function ?
                objectWithData.button.href(Object.values(this._parameters)[ 0 ])
                : objectWithData.button.href,
        };
    }

    getHotkeys() {
        return this._options.hotkeys || this.getObjectWithData(this._currentSlide).hotkeys;
    }

    getHistory() {
        return this._history;
    }

    setHistory(route) {
        const objectWithData = this.getObjectWithData(this._currentSlide);
        if (objectWithData && objectWithData.addToHistory) {
            this._history = route;
        }
    }

    isHidden() {
        return this._options.hidden;
    }

    getSlideKeys() {
        return Object.keys(this._options.slides || {});
    }

    getSlideIndex() {
        return Object.keys(this._options.slides || {}).indexOf(this._currentSlide);
    }
}

export default Tab;
