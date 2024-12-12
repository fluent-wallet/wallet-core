import {
  reactive,
  watch
} from "./chunk-GJVE5CKW.js";

// ../../node_modules/.pnpm/vitepress-plugin-tabs@0.5.0_vitepress@1.5.0_@algolia+client-search@5.15.0_@types+node@22.7.7__tfty6h4wp6e4pqxipb7sr6icwi/node_modules/vitepress-plugin-tabs/src/client/index.ts
import PluginTabs from "/Users/lww/Developer/sh-wallet-core/node_modules/.pnpm/vitepress-plugin-tabs@0.5.0_vitepress@1.5.0_@algolia+client-search@5.15.0_@types+node@22.7.7__tfty6h4wp6e4pqxipb7sr6icwi/node_modules/vitepress-plugin-tabs/src/client/PluginTabs.vue";
import PluginTabsTab from "/Users/lww/Developer/sh-wallet-core/node_modules/.pnpm/vitepress-plugin-tabs@0.5.0_vitepress@1.5.0_@algolia+client-search@5.15.0_@types+node@22.7.7__tfty6h4wp6e4pqxipb7sr6icwi/node_modules/vitepress-plugin-tabs/src/client/PluginTabsTab.vue";

// ../../node_modules/.pnpm/vitepress-plugin-tabs@0.5.0_vitepress@1.5.0_@algolia+client-search@5.15.0_@types+node@22.7.7__tfty6h4wp6e4pqxipb7sr6icwi/node_modules/vitepress-plugin-tabs/src/client/useTabsSelectedState.ts
var injectionKey = "vitepress:tabSharedState";
var ls = typeof localStorage !== "undefined" ? localStorage : null;
var localStorageKey = "vitepress:tabsSharedState";
var setLocalStorageValue = (v) => {
  if (!ls) return;
  ls.setItem(localStorageKey, JSON.stringify(v));
};
var provideTabsSharedState = (app) => {
  const state = reactive({});
  watch(
    () => state.content,
    (newStateContent, oldStateContent) => {
      if (newStateContent && oldStateContent) {
        setLocalStorageValue(newStateContent);
      }
    },
    { deep: true }
  );
  app.provide(injectionKey, state);
};

// ../../node_modules/.pnpm/vitepress-plugin-tabs@0.5.0_vitepress@1.5.0_@algolia+client-search@5.15.0_@types+node@22.7.7__tfty6h4wp6e4pqxipb7sr6icwi/node_modules/vitepress-plugin-tabs/src/client/index.ts
var enhanceAppWithTabs = (app) => {
  provideTabsSharedState(app);
  app.component("PluginTabs", PluginTabs);
  app.component("PluginTabsTab", PluginTabsTab);
};
export {
  enhanceAppWithTabs
};
//# sourceMappingURL=vitepress-plugin-tabs_client.js.map
