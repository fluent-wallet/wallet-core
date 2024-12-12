---
outline: deep
---

# Runtime API 示例

本页面展示了 VitePress 提供的一些运行时 API 的使用方法。

主要的 `useData()` API 可用于访问当前页面的站点、主题和页面数据。它在 `.md` 和 `.vue` 文件中都可以使用：

```md
<script setup>
import { useData } from 'vitepress'

const { theme, page, frontmatter } = useData()
</script>

## 结果

### 主题数据
<pre>{{ theme }}</pre>

### 页面数据
<pre>{{ page }}</pre>

### 页面前置数据
<pre>{{ frontmatter }}</pre>
```

<script setup>
import { useData } from 'vitepress'

const { site, theme, page, frontmatter } = useData()
</script>

## 结果

### 主题数据
<pre>{{ theme }}</pre>

### 页面数据
<pre>{{ page }}</pre>

### 页面前置数据
<pre>{{ frontmatter }}</pre>

## 更多

查看文档以获取[完整的运行时 API 列表](https://vitepress.dev/reference/runtime-api#usedata)。
