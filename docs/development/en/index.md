---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "WalletCore"
  text: "A cross-all web3 wallet core lib."
  tagline: Build your own web3 wallet in a few days
  actions:
    - theme: brand
      text: Get Started
      link: /developer-guide/before-start/faq
    - theme: alt
      text: See Examples
      link: /api-examples

features:
  - title: 💾 Cross-Platform Storage Layer
    details: Storage layer uses [RxDB](https://rxdb.info/), with flexible storage layer options, supporting Extension | React Native | Node | Web Memory.
  - title: ⛓️ Multi-Chain Support
    details: Abstract decoupling of heterogeneous chains, enabling quick integration of new chains.
  - title: 🎨 Multiple Frontend Framework Support
    details: Data can be injected into any frontend framework, currently supporting **React** | **Vue3** | **Svelte**.
  - title: 🔐 Custom Wallet Validation Methods
    details: Provides built-in validation (memory write during login | notification-based signing | mobile fingerprint), and supports custom validation methods.
  - title: 💰 Multiple Asset Management Methods
    details: Supports both centralized account asset fetching and decentralized self-selected on-chain asset queries.
  - title: 🔑 Multiple Hardware Wallet Support
    details: Supports ledger / onekey / keystone.
---
