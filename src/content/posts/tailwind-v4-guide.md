---
title: 'Tailwind CSS v4 完全指南'
date: '2026-04-14'
author: 'XiaoHe'
category: 'tech'
tags: ['tailwindcss', 'css', 'webdev']
excerpt: '深入了解 Tailwind CSS v4 的新特性和使用方法，让你的前端开发更加高效'
coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&h=675&fit=crop'
published: true
---

## Tailwind CSS v4 来了

Tailwind CSS 一直致力于让样式开发变得更快、更直观。v4 版本带来了许多令人兴奋的新特性。

### 性能提升

v4 版本采用了全新的引擎，性能大幅提升：

- 编译速度提升 **10 倍**
- 生成的文件体积更小
- 支持更好的 Tree-shaking

### 新增特性

1. **CSS-first 配置**：直接在 CSS 中配置主题
2. **改进的暗色模式**
3. **更好的表单样式**
4. **容器查询支持**

### 快速上手

```bash
npm install tailwindcss@latest @tailwindcss/vite
```

配置 Vite：

```javascript
import tailwindcss from '@tailwindcss/vite'

export default {
  plugins: [tailwindcss()],
}
```

### 总结

Tailwind CSS v4 是一个重大更新，值得深入学习！