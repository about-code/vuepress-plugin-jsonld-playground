module.exports = function ({ Vue }) {
    // eslint-disable-next-line vue/match-component-file-name
    Vue.component('json-ld', () => import('./json-ld.vue'));
};
