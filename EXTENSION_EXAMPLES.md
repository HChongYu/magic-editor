# Tiptap 扩展示例详解

这个项目演示了如何扩展现有的 Tiptap 扩展。以下是各种扩展方法的详细说明：

## 1. 修改键盘快捷键

```javascript
// 扩展项目符号列表 - 修改键盘快捷键
import BulletList from '@tiptap/extension-bullet-list'

const CustomBulletList = BulletList.extend({
  addKeyboardShortcuts() {
    return {
      'Mod-l': () => this.editor.commands.toggleBulletList(),
    }
  },
})
```

**功能说明：**
- 将项目符号列表的快捷键改为 `Ctrl+L`（在 Mac 上是 `Cmd+L`）
- 使用 `addKeyboardShortcuts()` 方法添加自定义快捷键

## 2. 修改默认设置

```javascript
// 扩展标题 - 修改默认设置
import Heading from '@tiptap/extension-heading'

const CustomHeading = Heading.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      levels: [1, 2, 3],
    }
  },
})
```

**功能说明：**
- 限制标题只支持 1、2、3 级标题
- 使用 `addOptions()` 方法修改默认配置
- `this.parent?.()` 保留父类的其他设置

## 3. 添加自定义属性

```javascript
// 扩展段落 - 添加颜色属性
import Paragraph from '@tiptap/extension-paragraph'

const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: element => element.getAttribute('data-color'),
        renderHTML: attributes => {
          if (!attributes.color) return {}
          return {
            'data-color': attributes.color,
            style: `color: ${attributes.color}`,
          }
        },
      },
    }
  },
})
```

**功能说明：**
- 为段落添加 `color` 属性
- `parseHTML`: 从 HTML 中解析颜色属性
- `renderHTML`: 将颜色属性渲染为 HTML 样式
- 支持红色、蓝色、绿色段落

## 4. 修改内容结构

```javascript
// 扩展引用块 - 限制内容只能包含段落
import Blockquote from '@tiptap/extension-blockquote'

const CustomBlockquote = Blockquote.extend({
  content: 'paragraph*',
})
```

**功能说明：**
- 限制引用块只能包含段落内容
- 使用 `content: 'paragraph*'` 定义内容结构
- 防止在引用块中插入标题等其他元素

## 5. 创建自定义扩展

```javascript
// 创建自定义扩展 - 添加存储功能
const CustomExtension = Extension.create({
  name: 'customExtension',

  addStorage() {
    return {
      awesomeness: 100,
    }
  },

  onUpdate() {
    this.storage.awesomeness += 1
  },
})
```

**功能说明：**
- 创建完全自定义的扩展
- 使用 `addStorage()` 添加存储功能
- 每次内容更新时，`awesomeness` 值增加 1
- 可以通过 `editor.storage.customExtension.awesomeness` 访问

## 6. 全局属性扩展

```javascript
// 创建全局文本对齐扩展
const TextAlign = Extension.create({
  name: 'textAlign',

  addGlobalAttributes() {
    return [
      {
        types: ['heading', 'paragraph'],
        attributes: {
          textAlign: {
            default: 'left',
            renderHTML: attributes => ({
              style: `text-align: ${attributes.textAlign}`,
            }),
            parseHTML: element => element.style.textAlign || 'left',
          },
        },
      },
    ]
  },
})
```

**功能说明：**
- 为多个扩展类型添加全局属性
- 为标题和段落添加文本对齐功能
- 使用 `addGlobalAttributes()` 方法

## 使用方法

1. **启动项目：**
   ```bash
   npm run serve
   ```

2. **测试功能：**
   - 使用工具栏按钮测试各种功能
   - 尝试 `Ctrl+L` 快捷键创建项目符号列表
   - 点击颜色按钮为段落设置颜色
   - 观察存储信息中的 `awesomeness` 值变化

## 扩展方法总结

| 方法 | 用途 | 示例 |
|------|------|------|
| `addKeyboardShortcuts()` | 添加键盘快捷键 | 修改项目符号列表快捷键 |
| `addOptions()` | 修改默认设置 | 限制标题级别 |
| `addAttributes()` | 添加自定义属性 | 为段落添加颜色 |
| `content` | 定义内容结构 | 限制引用块内容 |
| `addStorage()` | 添加存储功能 | 跟踪编辑器状态 |
| `addGlobalAttributes()` | 添加全局属性 | 文本对齐功能 |

## 注意事项

1. **扩展顺序：** 确保自定义扩展在默认扩展之后加载
2. **命名冲突：** 每个扩展必须有唯一的名称
3. **父类调用：** 使用 `this.parent?.()` 保留原有功能
4. **HTML 解析：** 正确实现 `parseHTML` 和 `renderHTML` 方法
5. **存储访问：** 通过 `editor.storage.extensionName` 访问存储数据

这个示例展示了 Tiptap 扩展系统的强大功能，您可以根据需要组合使用这些方法来创建完全自定义的编辑器体验。 