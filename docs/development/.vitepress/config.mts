import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "WalletCore Development",
  description: "A VitePress Site",
  themeConfig: {
    sidebar: {
      '/zh/': [
        {
          text: '介绍',
          items: [
            { text: '项目概述', link: '/zh/introduction/overview' },
            { text: '快速开始', link: '/zh/introduction/getting-started' }
          ]
        },
        {
          text: '核心模块',
          items: [
            { text: '钱包管理', link: '/zh/core/wallet' },
            { text: '密码学', link: '/zh/core/crypto' },
            { text: '网络通信', link: '/zh/core/network' }
          ]
        },
        {
          text: '链支持',
          items: [
            { text: '比特币', link: '/zh/chains/bitcoin' },
            { text: '以太坊', link: '/zh/chains/ethereum' }
          ]
        },
        {
          text: '数据管理',
          items: [
            { text: '数据模型', link: '/zh/data/models' },
            { text: '存储系统', link: '/zh/data/storage' }
          ]
        }
      ]
    }
  }
})