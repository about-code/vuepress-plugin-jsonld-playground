import { defineClientAppEnhance } from "@vuepress/client";
import { defineAsyncComponent } from "vue";

const comp = defineAsyncComponent(() => import('./json-ld.vue'));
export default defineClientAppEnhance(({ app, router, siteData }) => {
    app.component('json-ld', comp)
});
