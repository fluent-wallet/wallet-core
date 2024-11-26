import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "WalletCore Documentation",
  description: "A VitePress Site",
  themeConfig: {
    sidebar: {
      en: [
        {
          text: 'Overview',
          items: [
            { text: 'FAQ before start', link: '/en/overview/faq' },
            { text: 'Quick Start', link: '/en/overview/quick-start' },
          ]
        }
      ],
      zh: [
        {
          text: '概述',
          items: [
            { text: '开始前的常见问题', link: '/zh/overview/faq' },
            { text: '快速开始', link: '/zh/overview/quick-start' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      link: '/en',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en' },
          { text: 'Examples', link: '/en/markdown-examples' }
        ],
      }
    },
    zh: {
      label: '中文',
      lang: 'zh',
      link: '/zh',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh' },
          { text: '样例', link: '/zh/markdown-examples' }
        ],
      }
    }
  }
})