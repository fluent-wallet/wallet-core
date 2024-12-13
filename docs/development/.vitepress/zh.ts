import { createRequire } from 'module'
import { defineConfig, type DefaultTheme } from 'vitepress'

const require = createRequire(import.meta.url)
const pkg = require('vitepress/package.json')

export const zh = defineConfig({
  lang: 'zh-Hans',
  description: '由 Vite 和 Vue 驱动的静态站点生成器',

  themeConfig: {
    nav: nav(),

    sidebar: {
      '/zh/developer-guide/': { base: '/zh/developer-guide/', items: sidebarDeveloperGuide() },
      '/zh/code-walkthrough/': { base: '/zh/code-walkthrough/', items: sidebarCodeWalkthrough() },
      '/zh/advanced-topics/': { base: '/zh/advanced-topics/', items: sidebarAdvancedTopics() }
    },

    editLink: {
      pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    footer: {
      message: '基于 MIT 许可发布',
      copyright: `版权所有 © 2019-${new Date().getFullYear()} 尤雨溪`
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '页面导航'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  }
})


function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: '开发指南',
      link: '/zh/developer-guide/before-start/faq',
      activeMatch: '/zh/developer-guide'
    },
    {
      text: '源码导读',
      link: '/zh/code-walkthrough',
      activeMatch: '/zh/code-walkthrough'
    },
    {
      text: '进阶话题',
      link: '/zh/advanced-topics',
      activeMatch: '/zh/advanced-topics'
    },
    {
      text: pkg.version,
      items: [
        {
          text: '更新日志',
          link: 'https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md'
        },
        {
          text: '贡献指南',
          link: 'https://github.com/vuejs/vitepress/blob/main/.github/contributing.md'
        }
      ]
    }
  ]
}

function sidebarDeveloperGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '开始前',
      collapsed: false,
      items: [
        { text: '开始前的常见问题', link: 'before-start/faq' },
        { text: '安装与快速上手示例', link: 'before-start/quick-start' },
      ]
    },
    {
      text: '模型、数据、方法',
      collapsed: false,
      items: [
        { text: '概述', link: 'model-and-data/overview' },
        { text: '数据库模型', link: 'model-and-data/database-model' },
        { text: '数据与使用', link: 'model-and-data/data-and-usage' },
        { text: '数据 API', link: 'model-and-data/data-api' },
        { text: '方法 API', link: 'model-and-data/methods-api' },
        { text: '链的抽象与 API', link: 'model-and-data/chain-abstract-api' },
        { text: 'Wallet 实例', link: 'model-and-data/wallet-class' },
        { text: 'Pipelines', link: 'model-and-data/pipelines' },
      ]
    },
    {
      text: '概念',
      collapsed: false,
      items: [
        { text: '各端存储层选择和差异点', link: 'advanced-concepts/storage-layer' },
        { text: '加密器和密码处理器', link: 'advanced-concepts/encryptor-and-password' },
        { text: '添加一类链的支持与初始化网络', link: 'advanced-concepts/add-and-initialize-chain' },
        { text: '增删 Vault 与 Account', link: 'advanced-concepts/add-vault-and-account' },
        { text: '设置资产管理方式', link: 'advanced-concepts/set-asset-manager' },
        { text: `设置 '当前(链与账户)'`, link: 'advanced-concepts/set-current' },
        { text: '交易发送与资产更新', link: 'advanced-concepts/send-transaction' },
        { text: '交易加速与取消', link: 'advanced-concepts/transaction-acceleration-and-cancellation' },
        { text: '插件钱包 权限 与 provider', link: 'advanced-concepts/extension-wallet-permission-provider' },
        { text: '移动钱包接入 wallet-connect', link: 'advanced-concepts/mobile-wallet-wallet-connect' },
        { text: '接入硬件钱包', link: 'advanced-concepts/hardware-wallet' },
        { text: 'dapp 如何接入钱包(通用)', link: 'advanced-concepts/dapp-integration' },
        { text: '添加未内置支持的新链', link: 'advanced-concepts/add-new-chain' },
        { text: '添加未内置支持的新方法', link: 'advanced-concepts/add-new-methods' },
      ]
    },
  ]
}

function sidebarCodeWalkthrough(): DefaultTheme.SidebarItem[] {
  return [

  ]
}

function sidebarAdvancedTopics(): DefaultTheme.SidebarItem[] {
  return [

  ]
}

export const search: DefaultTheme.AlgoliaSearchOptions['locales'] = {
  zh: {
    placeholder: '搜索文档',
    translations: {
      button: {
        buttonText: '搜索文档',
        buttonAriaLabel: '搜索文档'
      },
      modal: {
        searchBox: {
          resetButtonTitle: '清除查询条件',
          resetButtonAriaLabel: '清除查询条件',
          cancelButtonText: '取消',
          cancelButtonAriaLabel: '取消'
        },
        startScreen: {
          recentSearchesTitle: '搜索历史',
          noRecentSearchesText: '没有搜索历史',
          saveRecentSearchButtonTitle: '保存至搜索历史',
          removeRecentSearchButtonTitle: '从搜索历史中移除',
          favoriteSearchesTitle: '收藏',
          removeFavoriteSearchButtonTitle: '从收藏中移除'
        },
        errorScreen: {
          titleText: '无法获取结果',
          helpText: '你可能需要检查你的网络连接'
        },
        footer: {
          selectText: '选择',
          navigateText: '切换',
          closeText: '关闭',
          searchByText: '搜索提供者'
        },
        noResultsScreen: {
          noResultsText: '无法找到相关结果',
          suggestedQueryText: '你可以尝试查询',
          reportMissingResultsText: '你认为该查询应该有结果？',
          reportMissingResultsLinkText: '点击反馈'
        }
      }
    }
  }
}
