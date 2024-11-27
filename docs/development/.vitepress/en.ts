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
      link: '/developer-guide/overview/faq',
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
      text: 'Overview',
      collapsed: false,
      items: [
        { text: 'FAQ before start', link: 'overview/faq' },
        { text: 'Quick Start', link: 'overview/quick-start' },
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