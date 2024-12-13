import { createRequire } from 'module';
import { defineConfig, type DefaultTheme } from 'vitepress';

const require = createRequire(import.meta.url);
const pkg = require('vitepress/package.json');

export const en = defineConfig({
  lang: 'en-US',
  description: 'Vite & Vue powered static site generator.',

  themeConfig: {
    nav: nav(),

    sidebar: {
      '/developer-guide/': { base: '/developer-guide/', items: sidebarDeveloperGuide() },
      '/code-walkthrough/': { base: '/code-walkthrough/', items: sidebarCodeWalkthrough() },
      '/advanced-topics/': { base: '/advanced-topics/', items: sidebarAdvancedTopics() }
    },

    editLink: {
      pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present Evan You'
    }
  }
});

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'Developer Guide',
      link: '/developer-guide/before-start/faq',
      activeMatch: '/developer-guide'
    },
    {
      text: 'Code Walkthrough',
      link: '/code-walkthrough',
      activeMatch: '/code-walkthrough'
    },
    {
      text: 'Advanced Topics',
      link: '/advanced-topics',
      activeMatch: '/advanced-topics'
    },
    {
      text: pkg.version,
      items: [
        {
          text: 'Changelog',
          link: 'https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md'
        },
        {
          text: 'Contributing',
          link: 'https://github.com/vuejs/vitepress/blob/main/.github/contributing.md'
        }
      ]
    }
  ]
}

function sidebarDeveloperGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Before Start',
      collapsed: false,
      items: [
        { text: 'FAQ before start', link: 'before-start/faq' },
        { text: 'Install and Quick Start Example', link: 'before-start/quick-start' },
      ]
    },
    {
      text: 'Models, Data, Methods',
      collapsed: false,
      items: [
        { text: 'Overview', link: 'model-and-data/overview' },
        { text: 'Database Model', link: 'model-and-data/database-model' },
        { text: 'Data and Usage', link: 'model-and-data/data-and-usage' },
        { text: 'Data API', link: 'model-and-data/data-api' },
        { text: 'Methods API', link: 'model-and-data/methods-api' },
        { text: 'Chain Abstraction and API', link: 'model-and-data/chain-abstract-api' },
        { text: 'Wallet Class', link: 'model-and-data/wallet-class' },
        { text: 'Pipelines', link: 'model-and-data/pipelines' },
      ]
    },
    {
      text: 'Concepts',
      collapsed: false,
      items: [
        { text: 'Storage & Platform Differences', link: 'advanced-concepts/storage-layer' },
        { text: 'Encryptor & Password Handler', link: 'advanced-concepts/encryptor-and-password' },
        { text: 'Chain & Network', link: 'advanced-concepts/add-and-initialize-chain' },
        { text: 'Vaults & Accounts', link: 'advanced-concepts/add-vault-and-account' },
        { text: 'Asset Management', link: 'advanced-concepts/set-asset-manager' },
        { text: `Set 'Current Chain & Account'`, link: 'advanced-concepts/set-current' },
        { text: 'About Transactions', link: 'advanced-concepts/send-transaction' },
        { text: 'Transaction Acceleration & Cancellation', link: 'advanced-concepts/transaction-acceleration-and-cancellation' },
        { text: 'Provider & Dapp Permissions', link: 'advanced-concepts/extension-wallet-permission-provider' },
        { text: 'Wallet-Connect Integration', link: 'advanced-concepts/mobile-wallet-wallet-connect' },
        { text: 'Hardware Wallets', link: 'advanced-concepts/hardware-wallet' },
        { text: 'How do dApps connect Wallet', link: 'advanced-concepts/dapp-connect-wallet' },
        { text: 'Add Non-Built-in Chains', link: 'advanced-concepts/add-new-chain' },
        { text: 'Add Non-Built-in Methods', link: 'advanced-concepts/add-new-methods' },
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