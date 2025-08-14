import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ColumnImageText1View from '@/components/ColumnImageText1View.vue'

// 列式图文节点属性类型定义
interface ColumnImageText1Attributes {
  steps: Array<{
    imageUrl: string
    text: string
  }>
}

// 声明命令类型
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columnImageText1: {
      insertColumnImageText1: (attributes?: Partial<ColumnImageText1Attributes>) => ReturnType
      updateColumnImageText1: (attributes: Partial<ColumnImageText1Attributes>) => ReturnType
    }
  }
}

const ColumnImageText1 = Node.create({
  name: 'columnImageText1',

  group: 'block',

  defining: true,

  draggable: false,

  selectable: true,

  addAttributes() {
    return {
      steps: {
        default: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=400&fit=crop',
            text: '取适量茶叶'
          },
          {
            imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=400&fit=crop',
            text: '闷茶1～3分钟'
          },
          {
            imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=400&fit=crop',
            text: '倒入茶杯品茗'
          }
        ],
        parseHTML: element => {
          const stepsAttr = element.getAttribute('data-steps')
          return stepsAttr ? JSON.parse(stepsAttr) : []
        },
        renderHTML: attributes => ({
          'data-steps': JSON.stringify(attributes.steps),
        }),
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="column-image-text1"]',
      },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'column-image-text1' }), 0]
  },
  
  addNodeView() {
    return VueNodeViewRenderer(ColumnImageText1View as any)
  },

  addCommands() {
    return {
      insertColumnImageText1:
        (attributes = {}) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: {
                steps: attributes.steps || [
                  {
                    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=400&fit=crop',
                    text: '取适量茶叶'
                  },
                  {
                    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=400&fit=crop',
                    text: '闷茶1～3分钟'
                  },
                  {
                    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=400&fit=crop',
                    text: '倒入茶杯品茗'
                  }
                ],
              },
            })
          },
      updateColumnImageText1:
        (attributes) =>
          ({ commands }) => {
            return commands.updateAttributes(this.name, attributes)
          },
    }
  },
})

export default ColumnImageText1