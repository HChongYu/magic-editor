# 创建自定义 Tiptap 扩展指南

本指南将详细介绍如何创建自定义的 Tiptap 扩展，包括扩展、节点和标记。

## 📝 扩展类型

Tiptap 支持三种主要的扩展类型：

1. **Extension（扩展）** - 添加功能或改变编辑器行为
2. **Node（节点）** - 文档树中的内容类型
3. **Mark（标记）** - 应用于节点的内联格式化

## 🎯 创建扩展 (Extension)

扩展不能添加到模式中，但可以添加功能或改变编辑器行为。

### 基本语法

```javascript
import { Extension } from '@tiptap/core'

const CustomExtension = Extension.create({
  name: 'customExtension',
  
  // 你的代码在这里
})
```

### 使用回调函数

```javascript
import { Extension } from '@tiptap/core'

const CustomExtension = Extension.create(() => {
  // 定义变量或函数
  const customVariable = 'foo'
  
  function onCreate() {}
  function onUpdate() {}
  
  return {
    name: 'customExtension',
    onCreate,
    onUpdate,
    
    // 你的代码在这里
  }
})
```

## 🎯 创建节点 (Node)

节点是文档树中的内容类型，如段落、标题或代码块。

### 基本语法

```javascript
import { Node } from '@tiptap/core'

const CustomNode = Node.create({
  name: 'customNode',
  
  // 你的代码在这里
})
```

### 使用回调函数

```javascript
import { Node } from '@tiptap/core'

const CustomNode = Node.create(() => {
  // 定义变量或函数
  const customVariable = 'foo'
  
  function onCreate() {}
  function onUpdate() {}
  
  return {
    name: 'customNode',
    onCreate,
    onUpdate,
    
    // 你的代码在这里
  }
})
```

## 🎯 创建标记 (Mark)

标记可以应用于节点，用于添加内联格式化，如粗体、斜体等。

### 基本语法

```javascript
import { Mark } from '@tiptap/core'

const CustomMark = Mark.create({
  name: 'customMark',
  
  // 你的代码在这里
})
```

### 使用回调函数

```javascript
import { Mark } from '@tiptap/core'

const CustomMark = Mark.create(() => {
  // 定义变量或函数
  const customVariable = 'foo'
  
  function onCreate() {}
  function onUpdate() {}
  
  return {
    name: 'customMark',
    onCreate,
    onUpdate,
    
    // 你的代码在这里
  }
})
```

## 🎨 实际示例：表情符号节点

我们创建了一个自定义的表情符号节点，展示了如何：

### 1. 定义属性

```javascript
addAttributes() {
  return {
    emoji: {
      default: '😊',
      parseHTML: element => element.getAttribute('data-emoji'),
      renderHTML: attributes => ({
        'data-emoji': attributes.emoji,
      }),
    },
    label: {
      default: '表情',
      parseHTML: element => element.getAttribute('data-label'),
      renderHTML: attributes => ({
        'data-label': attributes.label,
      }),
    },
    type: {
      default: 'smile',
      parseHTML: element => element.getAttribute('data-type'),
      renderHTML: attributes => ({
        'data-type': attributes.type,
      }),
    },
  }
}
```

### 2. 定义内容结构

```javascript
// 表情符号节点是内联的，不包含其他内容
content: '',

// 定义组（用于工具栏按钮等）
group: 'inline',

// 内联渲染
inline: true,

// 可选择的
selectable: true,

// 可拖拽的
draggable: true,
```

### 3. 解析和渲染 HTML

```javascript
// 解析 HTML
parseHTML() {
  return [
    {
      tag: 'span[data-type="emoji"]',
    },
  ]
},

// 渲染 HTML
renderHTML({ HTMLAttributes }) {
  return ['span', mergeAttributes(HTMLAttributes, { class: 'emoji-node' })]
},
```

### 4. 添加命令

```javascript
addCommands() {
  return {
    insertEmoji: (attributes) => ({ commands }) => {
      return commands.insertContent({
        type: this.name,
        attrs: attributes,
      })
    },
    setEmoji: (attributes) => ({ commands }) => {
      return commands.updateAttributes(this.name, attributes)
    },
  }
}
```

### 5. 添加键盘快捷键

```javascript
addKeyboardShortcuts() {
  return {
    'Mod-e': () => this.editor.commands.insertEmoji({
      emoji: '😊',
      label: '微笑',
      type: 'smile',
    }),
  }
}
```

### 6. 自定义节点视图

```javascript
addNodeView() {
  return ({ node, editor, getPos, HTMLAttributes, decorations, extension }) => {
    const dom = document.createElement('span')
    dom.className = 'emoji-node'
    dom.setAttribute('data-type', 'emoji')
    
    const emojiSpan = document.createElement('span')
    emojiSpan.className = 'emoji'
    emojiSpan.textContent = node.attrs.emoji
    
    const labelSpan = document.createElement('span')
    labelSpan.className = 'label'
    labelSpan.textContent = node.attrs.label
    
    dom.appendChild(emojiSpan)
    dom.appendChild(labelSpan)
    
    return {
      dom,
      contentDOM: null,
      update: (updatedNode) => {
        if (updatedNode.type !== node.type) {
          return false
        }
        
        emojiSpan.textContent = updatedNode.attrs.emoji
        labelSpan.textContent = updatedNode.attrs.label
        return true
      },
    }
  }
}
```

## 🚀 使用方法

### 1. 在编辑器中使用

```javascript
import { EmojiNode } from './extensions/EmojiNode.js'

const editor = new Editor({
  extensions: [
    StarterKit,
    EmojiNode, // 添加自定义节点
  ],
})
```

### 2. 插入表情符号

```javascript
// 通过命令插入
editor.commands.insertEmoji({
  emoji: '😊',
  label: '微笑',
  type: 'smile',
})

// 通过快捷键插入
// 按 Ctrl+E (或 Cmd+E)
```

### 3. 通过按钮插入

```javascript
insertEmoji(type) {
  const emojiData = EMOJI_DATA[type]
  if (emojiData) {
    this.editor.chain().focus().insertEmoji({
      emoji: emojiData.emoji,
      label: emojiData.label,
      type: type,
    }).run()
  }
}
```

## 📋 扩展方法总结

| 方法 | 用途 | 示例 |
|------|------|------|
| `addAttributes()` | 添加属性 | 表情符号的 emoji、label、type |
| `addCommands()` | 添加命令 | insertEmoji、setEmoji |
| `addKeyboardShortcuts()` | 添加快捷键 | Ctrl+E 插入表情符号 |
| `addNodeView()` | 自定义节点视图 | 自定义表情符号渲染 |
| `parseHTML()` | 解析 HTML | 从 HTML 中读取表情符号 |
| `renderHTML()` | 渲染 HTML | 将表情符号渲染为 HTML |

## 🎯 最佳实践

1. **命名规范** - 使用描述性的名称，如 `emojiNode`
2. **属性设计** - 合理设计属性结构，支持序列化
3. **HTML 兼容** - 确保 `parseHTML` 和 `renderHTML` 一致
4. **用户体验** - 提供直观的命令和快捷键
5. **样式设计** - 使用 CSS 类名，避免内联样式
6. **文档化** - 为扩展提供详细的使用说明

## 🔧 发布扩展

如果要创建和发布自己的 Tiptap 扩展：

1. 使用 CLI 工具初始化项目：
   ```bash
   npm init tiptap-extension
   ```

2. 本地测试：
   ```bash
   npm link
   npm link YOUR_EXTENSION
   ```

3. 分享给社区：
   - 发布到 npm
   - 添加到 awesome-tiptap 仓库

这个表情符号节点示例展示了如何创建功能完整、用户友好的自定义 Tiptap 扩展！ 