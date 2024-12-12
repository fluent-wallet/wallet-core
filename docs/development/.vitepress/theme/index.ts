// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import FrontendFramework from '../../components/FrontendFramework.vue'
import PackageManager from '../../components/PackageManager.vue'
import Platform from '../../components/Platform.vue'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component('FrontendFramework', FrontendFramework)
    app.component('PackageManager', PackageManager)
    app.component('Platform', Platform)
    enhanceAppWithTabs(app)
  }
} satisfies Theme
