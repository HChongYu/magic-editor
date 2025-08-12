import { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import SimpleHeadingView from '@/components/SimpleHeadingView.vue'

export default Node.create({
  name: 'simpleHeading',
  
  group: 'block',
  
  content: 'text*',
  
  defining: true,
  selectable: true,
  // 添加可选项配置
  addOptions() {
    return {
      HTMLAttributes: {
        class: 'simple-heading',
      },
    }
  },
  
  addAttributes() {
    return {
      level: {
        default: 2,
        parseHTML: element => {
          const level = element.tagName.match(/^H([1-6])$/)
          return level ? parseInt(level[1]) : 2
        },
        renderHTML: attributes => ({
          // 确保level属性正确传递给HTML标签
        }),
      },
      text: {
        default: "",
        parseHTML: element => element.getAttribute('data-text'),
        renderHTML: attributes => ({
          'data-text': attributes.text,
        }),
      },
    }
  },
  
  parseHTML() {
    return [
      { tag: 'h1', attrs: { level: 1 } },
      { tag: 'h2', attrs: { level: 2 } },
      { tag: 'h3', attrs: { level: 3 } },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    const level = node.attrs.level || 2
    // 修改返回格式，确保与ProseMirror的序列化机制兼容
    // 使用数组格式：[标签名, 属性对象, 0]
    // 0是ProseMirror的占位符，表示内容应该插入的位置
    return [`h${level}`, { ...HTMLAttributes, class: 'simple-heading' }, 0]
  },
  
  // 添加节点视图渲染器
  addNodeView() {
    return VueNodeViewRenderer(SimpleHeadingView as any)
  },
})