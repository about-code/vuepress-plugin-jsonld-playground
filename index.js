const path = require("path");

module.exports = {
    // vuepress 1.x compatibility
    enhanceAppFiles: [
        path.resolve(__dirname, './src/enhanceAppFile.js')
    ]
    // vuepress 2.x compatibility (see https://v2.vuepress.vuejs.org/guide/migration.html)
    ,clientAppEnhanceFiles: [
        path.resolve(__dirname, './src/clientAppEnhance.js')
    ]
};
