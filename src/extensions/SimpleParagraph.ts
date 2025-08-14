import { Node } from '@tiptap/core'
// import { VueNodeViewRenderer } from '@tiptap/vue-3'

export default Node.create({
  name: 'simpleParagraph',
  
  group: 'block',  // 改为 'block'，因为这是一个块级元素
  content: 'text*', // 添加这一行，表示可以包含任意数量的文本节点
  defining: true,
  selectable: true,
  draggable: false,
  // 添加可选项配置
  addOptions() {
    return {
      HTMLAttributes: {
        class: 'simple-paragraph',
      },
    }
  },
  
  addAttributes() {
    return {
      style: {
        default: 'font-size: 16px; line-height: normal; font-weight: 400;',
        parseHTML: element => element.getAttribute('data-style'),
        renderHTML: attributes => ({
          'style': attributes.style,
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
      { tag: 'p.simple-paragraph' },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    // 使用p标签作为底层渲染标签
    // 使用数组格式：[标签名, 属性对象, 0]
    // 0是ProseMirror的占位符，表示内容应该插入的位置
    return ['p', { ...HTMLAttributes, class: 'simple-paragraph' }, 0]
  }
})