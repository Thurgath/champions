
function pageView() {
    /* eslint-disable no-undef */
    ga('send', 'pageview', {
        'page': window.location.pathname + window.location.hash,
    });
    /* eslint-disable no-undef */
}

export default {
    pageView,
};
