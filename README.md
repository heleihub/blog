# XiaoHe Blog

一个基于 Astro 框架的静态博客系统，使用 Markdown 写作，无需数据库即可运行。

## 特性

- 🚀 **Astro 框架**：极速静态网站生成
- 📝 **Markdown 写作**：支持丰富的 Markdown 语法
- 🎨 **简洁设计**：专业、干净、响应式的 UI
- 💬 **评论系统**：可扩展的评论框架（推荐 Giscus/Disqus）
- 📊 **访问统计**：基于文件存储的统计方案
- 📱 **响应式**：完美适配手机和电脑
- 🎯 **文章目录**：自动生成 h1-h3 目录
- 🔗 **社交分享**：Facebook、Twitter/X、微博、微信

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:4321

### 构建项目

```bash
npm run build
```

输出目录：`dist`

### 预览构建结果

```bash
npm run preview
```

## 后台管理

访问 http://localhost:4321/admin

默认账号：
- 用户名：`admin`
- 密码：`admin123`

**重要：请在部署前修改 `content/config/site.json` 中的账号密码！**

## 目录结构

```
xiaohe-blog/
├── content/              # 内容文件
│   ├── posts/           # 文章 (Markdown)
│   ├── categories.json  # 分类
│   ├── tags.json        # 标签
│   └── config/          # 配置文件
│       ├── site.json    # 站点配置
│       ├── stats.json   # 统计数据
│       └── announcements.json # 公告
├── src/
│   ├── pages/           # 页面
│   │   ├── index.astro  # 首页
│   │   ├── posts/       # 文章详情
│   │   ├── categories/  # 分类页
│   │   ├── tags/        # 标签页
│   │   ├── admin/       # 后台管理
│   ├── components/      # 组件
│   ├── layouts/         # 布局
│   └── lib/             # 工具函数
├── public/              # 静态资源
└── dist/                # 构建输出
```

## 功能列表

### 前台功能
- ✅ 博客首页（带分页）
- ✅ 文章详情页
- ✅ 分类列表页
- ✅ 标签列表页
- ✅ 响应式设计
- ✅ 文章目录（自动生成 h1-h3）
- ✅ 文章分享（Facebook, Twitter/X, 微博, 微信）
- ✅ 公告显示
- ✅ 访问统计（总访问量、今日访问量）

### 后台功能
- ✅ 账号登录
- ✅ 文章管理指南
- ✅ 分类/标签管理
- ✅ 评论管理指南
- ✅ 公告管理

## 如何发布文章

在 `content/posts/` 目录下创建 Markdown 文件：

```markdown
---
title: '文章标题'
date: '2026-04-15'
author: 'XiaoHe'
category: 'tech'
tags: ['astro', 'webdev']
excerpt: '文章摘要'
published: true
---

这里是文章内容...

### 代码示例

```javascript
function hello() {
  console.log('Hello!');
}
```

### 表格示例

| 列1 | 列2 |
|------|------|
| 内容 | 内容 |
```

## 配置

### 修改站点信息

编辑 `content/config/site.json`：

```json
{
  "site": {
    "name": "XiaoHe",
    "title": "XiaoHe Blog",
    "description": "分享技术与生活的点滴",
    "author": "XiaoHe",
    "url": "https://xiaohe.blog"
  },
  "social": {
    "youtube": "https://youtube.com/@xiaohe",
    "telegram": "https://t.me/xiaohe",
    "twitter": "https://twitter.com/xiaohe",
    "github": "https://github.com/xiaohe"
  },
  "admin": {
    "username": "admin",
    "password": "admin123"
  }
}
```

### 修改默认账号密码

**重要：部署前必须修改！**

编辑 `content/config/site.json` 中的 `admin` 部分。

## 部署到 Cloudflare Pages

1. 将代码推送到 GitHub
2. 在 Cloudflare Pages 中连接 GitHub 仓库
3. 设置构建命令：`npm run build`
4. 设置输出目录：`dist`
5. 部署！

## 评论系统集成

推荐使用以下第三方评论服务：

### Giscus（基于 GitHub Discussions）
1. 访问 https://giscus.app
2. 配置你的仓库
3. 将生成的脚本添加到 `src/pages/posts/[slug].astro` 的评论区域

### Disqus
1. 注册 https://disqus.com
2. 获取你的 shortname
3. 将 Disqus 脚本添加到评论区域

## 技术栈

- [Astro](https://astro.build/) - 静态网站生成器
- [TailwindCSS](https://tailwindcss.com/) - CSS 框架
- [Gray Matter](https://github.com/jonschlinkert/gray-matter) - Markdown 解析
- [DiceBear](https://dicebear.com/) - 随机头像生成

## License

MIT
