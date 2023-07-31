const chai = require('chai');
const jsdom = require('jsdom');
const testdouble = require('testdouble');
const testdoubleChai = require('testdouble-chai');
const mq = require('mithril-query');

chai.use(testdoubleChai(testdouble));
global.expect = chai.expect;

global.testdouble = testdouble;
global.when = testdouble.when;

global.mq = mq;

const dom = new jsdom.JSDOM('<html><body></body></html>', {
    // So we can get `requestAnimationFrame`
    pretendToBeVisual: true,
});

// Fill in the globals Mithril.js needs to operate. Also, the first two are often
// useful to have just in tests.
global.window = dom.window;
global.document = dom.window.document;
global.Image = window.Image;
//Needed for Mithril
global.requestAnimationFrame = dom.window.requestAnimationFrame;
global.navigator = dom.window.navigator;
//Avoid error message by jsdom
global.window.HTMLCanvasElement.prototype.getContext = () => {};
//Needed for a few tests
global.Worker = function worker() {
    return {
        postMessage: (message) => {
            return message;
        },
    };
};
global.ga = () => {};
global.localStorage = storageMock();

function storageMock() {
    const storage = {};

    return {
        setItem: (key, value) => {
            storage[ key ] = value || '';
        },
        getItem: (key) => {
            return key in storage ? storage[ key ] : null;
        },
        removeItem: (key) => {
            delete storage[ key ];
        },
        get length() {
            return Object.keys(storage).length;
        },
        key: (i) => {
            const keys = Object.keys(storage);
            return keys[ i ] || null;
        },
    };
}

function createElement(elementId) {
    if (document.getElementById(elementId)) {
        return;
    }
    // Doing this so the element can be found when using document.getElementById.
    // This is because nothing is added to the document for these components.
    // And the jsdom document is not connected to what mithril is rendering either.
    const element = document.createElement('div');
    element.id = elementId;
    document.body.appendChild(element);
}
module.exports.createElement = createElement;

exports.mochaHooks = {
    before: () => {
        require('mithril-query').ensureGlobals();
    },
    beforeEach: () => {
        // global setup for all tests
    },
    afterAll: () => {
        dom.window.close();
    },
};
