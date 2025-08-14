import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import LeftImageText1View from '@/components/LeftImageText1View.vue'

// 左图右文节点属性类型定义
interface LeftImageText1Attributes {
  imageUrl: string
  title: string
  subtitle: string
}

// 声明命令类型
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    leftImageText1: {
      insertLeftImageText1: (attributes?: Partial<LeftImageText1Attributes>) => ReturnType
      updateLeftImageText1: (attributes: Partial<LeftImageText1Attributes>) => ReturnType
      setLeftImageText1Image: (imageUrl: string) => ReturnType
    }
  }
}

const LeftImageText1 = Node.create({
  name: 'leftImageText1',

  group: 'block',

  defining: true,

  draggable: false,

  selectable: true,

  content: 'simpleHeading simpleParagraph',

  addAttributes() {
    return {
      imageUrl: {
        default: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=400&fit=crop',
        parseHTML: element => element.getAttribute('data-image-url'),
        renderHTML: attributes => ({
          'data-image-url': attributes.imageUrl,
        }),
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="left-image-text1"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'left-image-text1' }), 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(LeftImageText1View as any)
  },

  addCommands() {
    return {
      insertLeftImageText1:
        (attributes = {}) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: {
                imageUrl: attributes.imageUrl || 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=400&fit=crop',
              },
              content: [
                {
                  type: 'simpleHeading',
                  attrs: {
                    text: attributes.title || '标题文本',
                    level: 2,
                  },
                  content: [{
                    type: 'text',
                    text: attributes.title || '标题文本',
                    marks: [
                      {
                        type: 'bold'
                      }
                    ]
                  }]
                },
                {
                  type: 'simpleParagraph',
                  attrs: {
                    text: attributes.subtitle || '描述文本内容',
                  },
                  content: [{
                    type: 'text',
                    text: attributes.subtitle || '描述文本内容'
                  }]
                }
              ],
            })
          },
      updateLeftImageText1:
        (attributes) =>
          ({ commands }) => {
            return commands.updateAttributes(this.name, attributes)
          },
      setLeftImageText1Image:
        (imageUrl) =>
          ({ commands }) => {
            return commands.updateAttributes(this.name, { imageUrl })
          },
    }
  },
})

export default LeftImageText1