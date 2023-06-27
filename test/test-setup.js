const chai = require('chai');
const jsdom = require('jsdom');

const dom = new jsdom.JSDOM('', {
    // So we can get `requestAnimationFrame`
    pretendToBeVisual: true,
});

global.expect = chai.expect;

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

exports.mochaHooks = {
    beforeEach: () => {
        // global setup for all tests
    },
    afterAll: () => {
        dom.window.close();
    },
};
