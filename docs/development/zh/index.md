---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "WalletCore"
  text: "跨链跨端跨框架\nweb3钱包核心库"
  tagline: 三天速成你自己的web3钱包
  actions:
    - theme: brand
      text: 阅读文档
      link: /zh/developer-guide/before-start/faq
    - theme: alt
      text: 运行样例
      link: /zh/api-examples

features:
  - title: 💾 存储层跨端
    details: 存储层使用 [RxDB](https://rxdb.info/)，可以任选 storge layer，支持 Extension | React Native | Node | Web Memory。
  - title: ⛓️ 异构多链支持
    details: 异构链抽象解耦，可以快速接入新的链。
  - title: 🎨 支持多种前端框架
    details: 数据可以注入任意前端框架，当前支持 **React** | **Vue3** | **Svelte**。
  - title: 🔐 自定义钱包校验方式
    details: 提供内置的(登录时写入内存 | 签发时通知式 | 移动端指纹) 校验，也可以自定义校验方式。
  - title: 💰 多种资产管理方式
    details: 支持以中心化的方式拉取账户资产，也支持去中心化方式的自选资产链上查询。
  - title: 🔑 多种硬件钱包支持
    details: 支持 ledger / onekey / keystone。
---


