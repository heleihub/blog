---
title: '现代 JavaScript 实用技巧'
date: '2026-04-13'
author: 'XiaoHe'
category: 'tech'
tags: ['javascript', 'es6', 'programming']
excerpt: '分享 10 个实用的现代 JavaScript 技巧，让你的代码更加优雅高效'
coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&h=675&fit=crop'
published: true
---

## 现代 JavaScript 技巧

JavaScript 是一门不断进化的语言，这里分享一些实用的现代技巧。

### 1. 可选链操作符

```javascript
const user = { profile: { name: 'XiaoHe' } }
const name = user?.profile?.name // 'XiaoHe'
const city = user?.address?.city // undefined (不会报错)
```

### 2. 空值合并运算符

```javascript
const config = { theme: 'dark', fontSize: null }
const size = config.fontSize ?? 16 // 16 (使用默认值)
```

### 3. Array.find 的妙用

```javascript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]
const user = users.find(u => u.id === 1)
```

### 4. 数组去重

```javascript
const arr = [1, 2, 2, 3, 3, 3]
const unique = [...new Set(arr)] // [1, 2, 3]
```

### 5. 异步数组处理

```javascript
const fetchUsers = async () => {
  const users = await Promise.all([
    fetch('/api/user/1'),
    fetch('/api/user/2')
  ])
}
```

### 6. 解构赋值

```javascript
const { name, age, city = 'Beijing' } = user
```

### 7. 展开运算符

```javascript
const merged = { ...obj1, ...obj2 }
const combined = [...arr1, ...arr2]
```

### 8. 默认参数

```javascript
function greet(name = 'Guest') {
  return `Hello, ${name}!`
}
```

### 9. 模板字符串

```javascript
const message = `Welcome to ${city}!`
```

### 10. 简洁的条件语句

```javascript
// 用 && 替代简单的 if
isLoggedIn && showDashboard()
```

掌握这些技巧，让你的 JavaScript 代码更加简洁优雅！